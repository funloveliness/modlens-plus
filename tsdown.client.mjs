// Client-bundle build for the modlens-plus Web settings card. Mirrors the
// dsh clientBundle preset (packages/client/tsdown.client.ts): a closure
// factory artifact registered through window.__ModuleLoader__.load, CSS
// Modules compiled by lightningcss into a <style data-plugin> tag, and the
// platform module table kept external (the shell shares it at runtime).
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { transform } from 'lightningcss'

// The module specifiers the dsh shell shares into the frozen module table.
// Must match the current dsh release; checked against
// packages/client/web/src/platform.ts when syncing.
const PLATFORM_MODULES = [
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-web-react',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-attachment',
  '@deepseek-ai/dsh-client-schema-form',
]

// Documented dsh exemption: the snapshot-store engine lives in runtime
// pending its promotion-time rehoming.
const RUNTIME_STORE_EXEMPTION = '@deepseek-ai/dsh-client-runtime/client'

const CSS_VIRTUAL_PREFIX = '\0dsh-css:'
const CSS_VIRTUAL_SUFFIX = '.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))

export default {
  name: 'modlens-plus/client',
  entry: { client: 'client/index.ts' },
  outDir: 'lib',
  format: 'cjs',
  platform: 'browser',
  dts: false,
  sourcemap: true,
  clean: false,
  external: [...PLATFORM_MODULES, RUNTIME_STORE_EXEMPTION],
  noExternal: (id) => (PLATFORM_MODULES.includes(id) || id === RUNTIME_STORE_EXEMPTION ? undefined : true),
  plugins: [{
    name: 'modlens-plus-bundle-purity',
    resolveId(source) {
      if (!source.startsWith('@deepseek-ai/')) return null
      if (PLATFORM_MODULES.includes(source)) return null
      if (source === RUNTIME_STORE_EXEMPTION) return null
      // Type-only imports are erased and never reach this gate; a value
      // import of anything else would duplicate a runtime instance.
      throw new Error(
        `modlens-plus client bundle purity: "${source}" is not a platform module — `
        + 'cross-plugin value imports are forbidden; use type-only imports or cordis services',
      )
    },
  }, {
    name: 'modlens-plus-css-modules-inline',
    resolveId(source, importer) {
      if (!source.endsWith('.module.css')) return null
      const abs = importer !== undefined
        ? (existsSync(resolve(dirname(importer), source))
          ? resolve(dirname(importer), source)
          : resolve(HERE, 'client', source))
        : source
      return CSS_VIRTUAL_PREFIX + abs + CSS_VIRTUAL_SUFFIX
    },
    async load(virtualId) {
      if (!virtualId.startsWith(CSS_VIRTUAL_PREFIX)) return null
      const fileId = virtualId.slice(CSS_VIRTUAL_PREFIX.length, -CSS_VIRTUAL_SUFFIX.length)
      this.addWatchFile(fileId)
      const source = await readFile(fileId)
      const { code, exports: cssExports } = transform({
        filename: fileId,
        code: source,
        cssModules: { pattern: '[hash]_[local]' },
        minify: true,
      })
      const classMap = {}
      for (const [local, exp] of Object.entries(cssExports ?? {})) classMap[local] = exp.name
      const tagId = `modlens-plus/${fileId.split(/[\\/]/).pop()}`
      return [
        `const css = ${JSON.stringify(code.toString())};`,
        `const tagId = ${JSON.stringify(tagId)};`,
        'if (typeof document !== \'undefined\' && document.querySelector(\'style[data-plugin-css=\' + JSON.stringify(tagId) + \']\') === null) {',
        '  const tag = document.createElement(\'style\');',
        '  tag.dataset.plugin = \'modlens-plus\';',
        '  tag.dataset.pluginCss = tagId;',
        '  tag.textContent = css;',
        '  document.head.appendChild(tag);',
        '}',
        `export default ${JSON.stringify(classMap)};`,
      ].join('\n')
    },
  }],
  outputOptions: {
    entryFileNames: 'client.js',
    banner: 'window.__ModuleLoader__.load({ id: \'modlens-plus\', factory: (require) => {',
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}
