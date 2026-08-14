/**
 * The modlens-plus card's staged form over the `modlens-plus` settings
 * namespace (the modlens-plus vision bridge).
 *
 * The engine key is the one control that does not live in the section: its
 * literal never rides a response, so the card learns only whether one is
 * configured and writes it through the credentials domain, addressed by the
 * reference the section names. Drafts are staged and written only on save,
 * exactly like the Host's other configuration cards.
 */

import type { IApiClient } from '@deepseek-ai/dsh-client-connection/client'
import type { SettingsScope, SettingsScopeSnapshot, SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'

/**
 * Namespace of the modlens-plus vision bridge. Spelled here rather than
 * imported: a client package must not depend on a Host package.
 */
export const MODLENS_NS = 'modlens-plus'

/** Credential reference the engine resolves when the section names none. */
export const DEFAULT_API_KEY_REF = 'DASHSCOPE_API_KEY'

/** Form field the credential control stages under. */
const API_KEY_FIELD = 'apiKey'

/** The modlens engine fields this card edits. */
export interface ModlensSettings {
  /** Default engine name ('openai', 'gemini-api', 'anthropic', ...). */
  provider?: string
  /** Credential reference naming the engine's API key. */
  apiKeyEnv?: string
  /** Engine endpoint; blank inherits the engine default. */
  baseUrl?: string
  /** Vision model id on that endpoint. */
  model?: string
}

/** One staged or effective field value as the card renders it. */
export interface ModlensCardFieldState {
  /** Draft text the control renders. */
  text: string
  /** Whether saving would leave a user-layer entry for this field. */
  overridden: boolean
}

/** What the credentials domain last reported, and for which reference. */
interface CredentialState {
  /** Reference this answer describes; a stale response for another one is dropped. */
  ref: string
  /** Whether any layer supplies a value for it. */
  configured: boolean
  /** Whether `credentials.set` can affect it; false disables the control. */
  writable: boolean
}

/** What the modlens card renders. */
export interface ModlensCardState {
  /** False while the namespace is not served to this client; the card renders nothing. */
  available: boolean
  /** Whether the Host document accepts writes. */
  writable: boolean
  /** Whether the form holds edits that a save would write. */
  dirty: boolean
  /** Whether a save is crossing the wire. */
  saving: boolean
  /** Whether the last save did not land as staged; cleared by the next edit or save. */
  failed: boolean
  /** Default engine name. */
  provider: ModlensCardFieldState
  /** Engine endpoint. */
  baseUrl: ModlensCardFieldState
  /** Vision model id. */
  model: ModlensCardFieldState
  /** The staged credential, which starts blank on every load. */
  apiKey: ModlensCardFieldState
  /** Whether the Host reports a credential configured for the referenced key. */
  apiKeyConfigured: boolean
  /** Whether the credentials domain accepts a write for it; false disables the control. */
  apiKeyWritable: boolean
}

/** The registration-side face the modlens card's slot entry injects. */
export interface ModlensCardFace {
  hooks: {
    /** Card snapshot bound by the renderer as useModlensCard. */
    modlensCard: SnapshotStore<ModlensCardState>
  }
  /** Stage draft text for one field. */
  edit: (field: string, text: string) => void
  /** Stage a clear, so saving lets the field re-inherit the composition layer. */
  resetField: (field: string) => void
  /** Write every staged edit, then re-seed from what the Host accepted. */
  save: () => void
  /** Drop every staged edit. */
  discard: () => void
}

/** One staged edit. */
interface StagedEdit {
  /** Draft text the control renders. */
  text: string
  /** True when this edit clears the field whatever text it shows. */
  clear: boolean
}

/** Bridges the `modlens-plus` scope and the credentials domain onto the card. */
export class ModlensCardController {
  private readonly staged = new Map<string, StagedEdit>()
  private readonly store: SnapshotStore<ModlensCardState>
  private credential: CredentialState = { ref: '', configured: false, writable: true }
  private saving = false
  private failed = false

  /**
   * @param scope - the bound settings scope for the `modlens-plus` namespace.
   * @param api - wire face used for the credential the section references.
   */
  constructor(
    private readonly scope: SettingsScope<ModlensSettings>,
    private readonly api: Pick<IApiClient, 'credentials'>,
  ) {
    this.store = createSnapshotStore(this.projection())
    scope.subscribe(() => {
      this.publish()
      void this.readCredential()
    })
    void this.readCredential()
  }

  private projection(): ModlensCardState {
    const snapshot = this.scope.getSnapshot()
    return {
      available: snapshot.status === 'ready',
      writable: snapshot.writable,
      dirty: this.staged.size > 0,
      saving: this.saving,
      failed: this.failed,
      provider: this.field('provider'),
      baseUrl: this.field('baseUrl'),
      model: this.field('model'),
      apiKey: this.field(API_KEY_FIELD),
      apiKeyConfigured: this.credential.configured,
      apiKeyWritable: this.credential.writable,
    }
  }

  /** Render one control: its staged draft, or the effective section value. */
  private field(field: string): ModlensCardFieldState {
    const staged = this.staged.get(field)
    if (staged !== undefined) {
      return { text: staged.text, overridden: !staged.clear }
    }
    const snapshot = this.scope.getSnapshot()
    const section = snapshot.value as Record<string, unknown> | undefined
    const user = snapshot.user as Record<string, unknown> | undefined
    const value = section?.[field]
    return {
      text: typeof value === 'string' ? value : '',
      overridden: user !== undefined && Object.hasOwn(user, field),
    }
  }

  private publish(): void {
    this.store.set(this.projection())
  }

  /**
   * Build the face the card's slot registration injects.
   * @returns the card's snapshot and its form actions.
   */
  inject(): ModlensCardFace {
    return {
      hooks: { modlensCard: this.store },
      edit: (field, text) => {
        this.staged.set(field, { text, clear: false })
        this.failed = false
        this.publish()
      },
      resetField: (field) => {
        const base = (this.scope.getSnapshot().base as Record<string, unknown> | undefined)?.[field]
        this.staged.set(field, { text: typeof base === 'string' ? base : '', clear: true })
        this.failed = false
        this.publish()
      },
      save: () => { void this.save() },
      discard: () => {
        if (this.staged.size === 0 && !this.failed) return
        this.staged.clear()
        this.failed = false
        this.publish()
      },
    }
  }

  /**
   * Write every staged edit, then re-seed from what the Host accepted.
   *
   * The Host is the only authority on whether a value was accepted, so the
   * outcome is read back from the section rather than predicted here. A save
   * that did not land keeps its drafts, so the user can correct them instead
   * of retyping.
   */
  private async save(): Promise<void> {
    if (this.staged.size === 0 || this.saving) return
    this.saving = true
    this.failed = false
    this.publish()
    let landed = true
    for (const [field, edit] of this.staged) {
      if (field === API_KEY_FIELD) {
        landed = await this.writeKey(edit.text) && landed
        continue
      }
      landed = await this.writeSectionField(field, edit) && landed
    }
    if (landed) this.staged.clear()
    this.saving = false
    this.failed = !landed
    this.publish()
  }

  private async writeSectionField(field: string, edit: StagedEdit): Promise<boolean> {
    try {
      if (edit.clear || edit.text.trim() === '') {
        await this.scope.unset(field)
      } else {
        await this.scope.set(field, edit.text.trim())
      }
    } catch (_sectionWriteFailure) {
      return false
    }
    const user = this.scope.getSnapshot().user as Record<string, unknown> | undefined
    if (edit.clear) return user === undefined || !Object.hasOwn(user, field)
    return user?.[field] === edit.text.trim()
  }

  /**
   * Ask the credentials domain about the reference the section currently names.
   *
   * The answer is stored with the reference it describes: `apiKeyEnv` can
   * change between the request and its response, and two reads can settle out
   * of order, so a response is published only while it still answers for the
   * reference in force.
   */
  private async readCredential(): Promise<void> {
    const ref = refOf(this.scope.getSnapshot())
    if (ref !== this.credential.ref) {
      // A new reference knows nothing yet; keeping the old answer would claim
      // the key is configured under a name nobody has checked.
      this.credential = { ref, configured: false, writable: true }
      this.publish()
    }
    let response: Awaited<ReturnType<IApiClient['credentials']['describe']>>
    try {
      response = await this.api.credentials.describe({ refs: [ref] })
    } catch (_credentialReadFailure) {
      // The card stays usable without this: the key control simply reports the
      // last state it knew, and a write still reaches the Host.
      return
    }
    if (!response.result.ok || ref !== refOf(this.scope.getSnapshot())) return
    const view = response.result.value.credentials[ref]
    const next: CredentialState = {
      ref,
      configured: view?.configured ?? false,
      // An unknown reference is treated as writable: the control stays usable
      // and the Host is what refuses, rather than the card guessing a refusal.
      writable: view?.writable ?? true,
    }
    if (next.configured === this.credential.configured && next.writable === this.credential.writable) return
    this.credential = next
    this.publish()
  }

  /**
   * Re-read after the Host reports a change to the reference this card watches.
   * @param ref - the reference the Host reports as changed.
   */
  refreshCredential(ref: string): void {
    if (ref !== this.credential.ref) return
    void this.readCredential()
  }

  /**
   * Write the staged key, then re-read whether the Host now holds one.
   * @param value - the staged credential literal.
   * @returns whether the Host reports a configured credential afterwards.
   */
  private async writeKey(value: string): Promise<boolean> {
    if (value.trim() === '') return true
    try {
      await this.api.credentials.set({ ref: refOf(this.scope.getSnapshot()), value: value.trim() })
    } catch (_credentialWriteFailure) {
      // Refusals surface through the re-read below: the Host is the only
      // authority on whether the key now exists.
    }
    await this.readCredential()
    return this.credential.configured
  }
}

/**
 * The credential reference the section names, or the engine's default.
 * @param snapshot - the current scope snapshot.
 * @returns the reference to address.
 */
function refOf(snapshot: SettingsScopeSnapshot<ModlensSettings>): string {
  const declared = snapshot.value?.apiKeyEnv
  return declared !== undefined && declared.length > 0 ? declared : DEFAULT_API_KEY_REF
}

/** Every section field the card edits, used by tests to enumerate the form. */
export const MODLENS_SECTION_FIELDS: readonly string[] = ['provider', 'baseUrl', 'model']
