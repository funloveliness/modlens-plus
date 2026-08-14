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

export const MODLENS_SETTINGS_NAMESPACE = 'modlens-funloveliness'

// Providers that accept apiKey/baseUrl/model here. CLI-only providers
// (antigravity-cli, claude-cli) have no fields in the settings namespace.
export const API_PROVIDERS = ['gemini-api', 'openai', 'anthropic']

// CLI environment bindings per provider. apiKey fields ride the process
// environment (never the config file); baseUrl fields are mirrored into the
// config file as well, but the env copy keeps a settings-only deployment
// working even when the CLI reads an untouched file.
export const PROVIDER_ENV = {
  'gemini-api': { apiKey: 'GEMINI_API_KEY' },
  'openai': { apiKey: 'OPENAI_API_KEY', baseUrl: 'OPENAI_BASE_URL' },
  'anthropic': { apiKey: 'ANTHROPIC_API_KEY', baseUrl: 'ANTHROPIC_BASE_URL' },
}

const PROVIDER_SCHEMA = z.object({
  apiKey: z.string().role('secret'),
  baseUrl: z.string(),
  model: z.string(),
})

const SETTINGS_SCHEMA = z.object({
  provider: z.string(),
  providers: z.object({
    'gemini-api': PROVIDER_SCHEMA,
    'openai': PROVIDER_SCHEMA,
    'anthropic': PROVIDER_SCHEMA,
  }),
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
  for (const name of API_PROVIDERS) {
    const section = value.providers?.[name]
    if (section === undefined) continue
    const target = { ...(next.providers[name] ?? {}) }
    if (section.baseUrl !== undefined) target.baseUrl = section.baseUrl
    if (section.model !== undefined) target.model = section.model
    // apiKey deliberately never written: the dsh settings store holds the
    // secret and injects it into the CLI environment at call time.
    next.providers[name] = target
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
 * Resolve the CLI environment bindings from the settings store. Unset fields
 * are omitted so a process-level value (or the config file) still applies.
 * @param ctx - the plugin context (settings service optional).
 * @returns a partial environment object for the CLI spawn.
 */
export function settingsEnv(ctx) {
  const settings = ctx.get('settings')
  if (settings === undefined) return {}
  const value = settings.get(MODLENS_SETTINGS_NAMESPACE)
  if (value === undefined) return {}
  const env = {}
  for (const name of API_PROVIDERS) {
    const bindings = PROVIDER_ENV[name]
    const section = value.providers?.[name]
    if (bindings === undefined || section === undefined) continue
    if (section.apiKey) env[bindings.apiKey] = section.apiKey
    if (bindings.baseUrl && section.baseUrl) env[bindings.baseUrl] = section.baseUrl
  }
  return env
}
