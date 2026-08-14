/**
 * ModLens Plus settings card, browser half — registers the `modlens-plus`
 * configuration card into the plugin configuration section
 * (`settings.plugin.item` slot declared by ui-settings-plugins). The card is
 * fully self-contained: it binds its own settings scope and writes the
 * engine key through the credentials domain.
 */

import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client'
// Type-only: pulls the settings shell's Context merge (ctx.settingsScope).
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the SlotMap declaration for the plugin configuration
// section (settings.plugin.item), owned by ui-settings-plugins.
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { ModlensCard } from './ModlensCard.tsx'
import { MODLENS_NS, ModlensCardController } from './modlens-card-controller.ts'

export { ModlensCard } from './ModlensCard.tsx'
export {
  DEFAULT_API_KEY_REF, MODLENS_NS, MODLENS_SECTION_FIELDS, ModlensCardController,
} from './modlens-card-controller.ts'
export type { ModlensCardFace, ModlensCardFieldState, ModlensCardState, ModlensSettings } from './modlens-card-controller.ts'

/** Required services (cordis fiber inject). */
export const inject = ['slots', 'connection', 'remote', 'settingsScope']

/**
 * Mount the modlens card into the plugin configuration section.
 * @param ctx - the browser plugin context.
 */
export function apply(ctx: ClientContext): void {
  const { api } = ctx.get('connection') as ConnectionHandle
  const modlens = new ModlensCardController(ctx.settingsScope.bind({ namespace: MODLENS_NS }), api)

  // The credential the card reports is not part of any settings section, so
  // its scope publishes nothing when one is written; the credentials/updated
  // event is the only signal that a key written on another surface reached
  // the Host.
  ctx.effect(
    () => ctx.remote.$on('credentials/updated', (ref) => { modlens.refreshCredential(ref) }),
    'modlens-plus: credential invalidations',
  )

  ctx.slots.inject('settings.plugin.item', function* () {
    yield ctx.slots.register({
      name: 'settings.plugin.item',
      id: 'modlens-plus',
      order: 30,
      inject: () => modlens.inject(),
    }, ModlensCard)
  })
}
