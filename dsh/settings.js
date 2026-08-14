// Settings bridge for the modlens dsh plugin: registers a `modlens` settings
// namespace so the Web GUI configures the vision engines (default provider,
// per-provider endpoints and models) instead of hand-editing
// ~/.modlens/config.json. Non-secret fields mirror into the shared config
// file the CLI reads; secret fields stay in the dsh settings store (redacted
// on every wire surface) and are injected into the CLI process environment at
// call time, where the CLI's env-over-file precedence composes the two.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import z from '@deepseek-ai/schemastery'

export const MODLENS_SETTINGS_NAMESPACE = 'modlens-plus'

// Providers that accept apiKeyEnv/baseUrl/model here. CLI-only providers
// (antigravity-cli, claude-cli) have no fields in the settings namespace.
export const API_PROVIDERS = ['gemini-api', 'openai', 'anthropic']

// CLI environment bindings per provider. The key literal lives in the dsh
// credentials domain, named by the section's apiKeyEnv reference; the bridge
// resolves it into the CLI environment at call time (never the config file).
// baseUrl fields are mirrored into the config file as well, but the env copy
// keeps a settings-only deployment working even when the CLI reads an
// untouched file.
export const PROVIDER_ENV = {
  'gemini-api': { apiKey: 'GEMINI_API_KEY' },
  'openai': { apiKey: 'OPENAI_API_KEY', baseUrl: 'OPENAI_BASE_URL' },
  'anthropic': { apiKey: 'ANTHROPIC_API_KEY', baseUrl: 'ANTHROPIC_BASE_URL' },
}

// Flat section: the card edits one engine at a time (the default provider),
// which keeps the GUI form and the config mirror simple; other engines can
// still be configured by hand in ~/.modlens/config.json.
const SETTINGS_SCHEMA = z.object({
  provider: z.string(),
  apiKeyEnv: z.string(),
  baseUrl: z.string(),
  model: z.string(),
})

function configFile() {
  return join(homedir(), '.modlens', 'config.json')
}

/** Mirror the non-secret settings fields into ~/.modlens/config.json. */
function writeConfigFile(value) {
  const file = configFile()
  let existing = {}
  try {
    existing = JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    // Absent or malformed file: start from defaults.
  }
  const next = {
    ...existing,
    ...value.provider === undefined ? {} : { provider: value.provider },
    providers: { ...(existing.providers ?? {}) },
  }
  // Mirror the flat section into the CLI's per-provider structure. The
  // credential reference and the key literal are never written: the
  // credentials domain holds the secret and the bridge resolves it into the
  // CLI environment at call time.
  const provider = value.provider ?? existing.provider
  if (provider !== undefined && typeof provider === 'string') {
    const target = { ...(next.providers[provider] ?? {}) }
    if (value.baseUrl !== undefined) target.baseUrl = value.baseUrl
    if (value.model !== undefined) target.model = value.model
    next.providers[provider] = target
  }
  mkdirSync(join(homedir(), '.modlens'), { recursive: true, mode: 0o700 })
  writeFileSync(file, JSON.stringify(next, null, 2), { mode: 0o600 })
}

/**
 * Register the `modlens` settings namespace and keep the CLI config file in
 * sync. Settings-optional: a composition without the settings service skips
 * registration and the plugin keeps reading ~/.modlens/config.json directly.
 * @param ctx - the plugin context (settings service optional).
 * @returns the settings scope, or undefined when no settings service exists.
 */
export function registerSettings(ctx) {
  const settings = ctx.get('settings')
  if (settings === undefined) return undefined
  const scope = settings.register(MODLENS_SETTINGS_NAMESPACE, SETTINGS_SCHEMA)
  scope.watch((next) => {
    writeConfigFile(next)
  })
  writeConfigFile(scope.get())
  return scope
}

/**
 * Resolve the CLI environment bindings from the settings store and the
 * credentials domain. Unset fields are omitted so a process-level value (or
 * the config file) still applies; a credential reference that resolves to
 * nothing injects no key.
 * @param ctx - the plugin context (settings and credentials services optional).
 * @returns a partial environment object for the CLI spawn.
 */
export async function settingsEnv(ctx) {
  const settings = ctx.get('settings')
  if (settings === undefined) return {}
  const credentials = ctx.get('credentials')
  const value = settings.get(MODLENS_SETTINGS_NAMESPACE)
  if (value === undefined) return {}
  const bindings = PROVIDER_ENV[value.provider]
  if (bindings === undefined) return {}
  const env = {}
  if (bindings.baseUrl && value.baseUrl) env[bindings.baseUrl] = value.baseUrl
  if (bindings.apiKey && value.apiKeyEnv && credentials !== undefined) {
    try {
      const resolved = await credentials.resolve(value.apiKeyEnv)
      if (resolved !== undefined && resolved.value !== undefined) {
        env[bindings.apiKey] = resolved.value
      }
    } catch {
      // Unresolvable reference: no key injected, the CLI falls back to its
      // own environment or config file.
    }
  }
  return env
}
