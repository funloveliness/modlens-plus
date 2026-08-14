/**
 * The modlens-plus card: the vision bridge's default engine, its endpoint and
 * model, and the key — which is written through the credentials domain, never
 * into the settings section, so the literal never rides a response. The
 * chrome and fields mirror the shipped ui-settings-plugins cards (same
 * --dsw-alias-* tokens, same disclosure/save structure), so the card is
 * visually identical to the terminal / agent-loop / web-search cards.
 */

import { useState } from 'react'
import { IconChevronDownOutline14 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { ModlensCardFace } from './modlens-card-controller.ts'
import cardCss from './modlens-card.module.css'
import fieldCss from './fields.module.css'

/** Props the renderer binds for the modlens card. */
export type ModlensCardProps =
  PropsRuntime<'settings.plugin.item'>
  & InjectFace<ModlensCardFace>

/** Card chrome copy (Simplified Chinese, matching the shipped cards' zh copy). */
const COPY = {
  expand: '展开设置',
  collapse: '收起设置',
  title: 'ModLens Plus 视觉',
  description: '本地 modlens-plus 视觉桥，为纯文本模型提供看图能力。',
  unsaved: '未保存',
  readOnly: '本部署的设置为只读。',
  save: '保存',
  saving: '保存中…',
  discard: '放弃修改',
  saveFailed: '本部署没有接受这些值，已保留供你修改。',
  overridden: '已覆盖',
  reset: '恢复默认',
  apiKeyLabel: 'API Key',
  apiKeyHint: '不写入设置文件。留空表示保持当前密钥。',
  apiKeySet: '已配置密钥。',
  apiKeyUnset: '未配置密钥；配置之前图片识别不可用。',
  providerLabel: '引擎',
  providerHint: '视觉引擎名称（openai、gemini-api、anthropic 等）。',
  baseUrlLabel: '接口地址',
  baseUrlHint: '留空则使用引擎默认地址。',
  modelLabel: '模型',
  modelHint: '该接口上的视觉模型 ID。',
}

/** One staged value field — mirrors the shipped ValueField control. */
function ValueField(props: {
  id: string
  label: string
  hint: string
  text: string
  overridden: boolean
  disabled: boolean
  placeholder?: string
  onEdit: (text: string) => void
  onReset: () => void
}) {
  return (
    <div className={fieldCss.field}>
      <div className={fieldCss.head}>
        <label className={fieldCss.label} htmlFor={props.id}>{props.label}</label>
        {props.overridden
          ? (
            <span className={fieldCss.badges}>
              <span className={fieldCss.badge}>{COPY.overridden}</span>
              <button
                type="button"
                className={fieldCss.reset}
                disabled={props.disabled}
                onClick={props.onReset}
              >
                {COPY.reset}
              </button>
            </span>
          )
          : null}
      </div>
      <input
        id={props.id}
        className={fieldCss.input}
        type="text"
        value={props.text}
        placeholder={props.placeholder ?? ''}
        disabled={props.disabled}
        onChange={(event) => { props.onEdit(event.target.value) }}
      />
      <p className={fieldCss.hint}>{props.hint}</p>
    </div>
  )
}

/** The write-only key control — mirrors the shipped SecretField control. */
function KeyField(props: {
  id: string
  label: string
  hint: string
  text: string
  configured: boolean
  disabled: boolean
  onEdit: (text: string) => void
}) {
  return (
    <div className={fieldCss.field}>
      <div className={fieldCss.head}>
        <label className={fieldCss.label} htmlFor={props.id}>{props.label}</label>
        <span className={fieldCss.badges}>
          <span className={props.configured ? fieldCss.badge : fieldCss.badgeMuted}>
            {props.configured ? COPY.apiKeySet : COPY.apiKeyUnset}
          </span>
        </span>
      </div>
      <input
        id={props.id}
        className={fieldCss.input}
        type="password"
        autoComplete="off"
        value={props.text}
        disabled={props.disabled}
        onChange={(event) => { props.onEdit(event.target.value) }}
      />
      <p className={fieldCss.hint}>{props.hint}</p>
    </div>
  )
}

/** The engine fields the card edits, in display order. */
const FIELDS: Array<{
  id: string
  key: 'provider' | 'baseUrl' | 'model'
  label: string
  hint: string
  placeholder?: string
}> = [
  { id: 'plugin-config-modlens-provider', key: 'provider', label: COPY.providerLabel, hint: COPY.providerHint, placeholder: 'openai' },
  { id: 'plugin-config-modlens-endpoint', key: 'baseUrl', label: COPY.baseUrlLabel, hint: COPY.baseUrlHint },
  { id: 'plugin-config-modlens-model', key: 'model', label: COPY.modelLabel, hint: COPY.modelHint, placeholder: 'qwen3-vl-flash' },
]

/**
 * Render the modlens card: a disclosing header over the engine fields and the
 * save that writes them.
 * @param props - the card snapshot and its form actions.
 * @returns the card, or nothing when the namespace is unavailable.
 */
export function ModlensCard(props: ModlensCardProps) {
  const [open, setOpen] = useState(false)
  const state = props.useModlensCard(snapshot => snapshot)
  if (!state.available) return null
  const disabled = !state.writable
  return (
    <li className={open ? `${cardCss.card} ${cardCss.cardOpen}` : cardCss.card}>
      <button
        type="button"
        className={cardCss.header}
        aria-expanded={open}
        aria-label={`${open ? COPY.collapse : COPY.expand}: ${COPY.title}`}
        onClick={() => { setOpen(!open) }}
      >
        <span className={cardCss.headText}>
          <span className={cardCss.name}>{COPY.title}</span>
          <span className={cardCss.description}>{COPY.description}</span>
        </span>
        {state.dirty ? <span className={cardCss.pending}>{COPY.unsaved}</span> : null}
        <IconChevronDownOutline14 className={open ? `${cardCss.chevron} ${cardCss.chevronOpen}` : cardCss.chevron} />
      </button>
      {open
        ? (
          <div className={cardCss.body}>
            {!state.writable ? <p className={cardCss.readOnly} role="status">{COPY.readOnly}</p> : null}
            <KeyField
              id="plugin-config-modlens-key"
              label={COPY.apiKeyLabel}
              hint={COPY.apiKeyHint}
              text={state.apiKey.text}
              configured={state.apiKeyConfigured}
              disabled={!state.apiKeyWritable}
              onEdit={(text) => { props.edit('apiKey', text) }}
            />
            {FIELDS.map(field => (
              <ValueField
                key={field.key}
                id={field.id}
                label={field.label}
                hint={field.hint}
                {...field.placeholder === undefined ? {} : { placeholder: field.placeholder }}
                text={state[field.key].text}
                overridden={state[field.key].overridden}
                disabled={disabled}
                onEdit={(text) => { props.edit(field.key, text) }}
                onReset={() => { props.resetField(field.key) }}
              />
            ))}
            <div className={cardCss.footer}>
              {state.failed ? <p className={cardCss.failed} role="status">{COPY.saveFailed}</p> : null}
              <button
                type="button"
                className={cardCss.discard}
                disabled={!state.dirty || state.saving}
                onClick={props.discard}
              >
                {COPY.discard}
              </button>
              <button
                type="button"
                className={cardCss.save}
                disabled={!state.dirty || state.saving}
                onClick={props.save}
              >
                {state.saving ? COPY.saving : COPY.save}
              </button>
            </div>
          </div>
        )
        : null}
    </li>
  )
}
