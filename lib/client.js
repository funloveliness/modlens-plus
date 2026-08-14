window.__ModuleLoader__.load({
	id: "modlens-plus",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		//#region \0dsh-css:D:\develop\modlens\client\modlens-card.module.css.mjs
		const css$1 = ".g_AIbq_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:12px;list-style:none;transition:border-color .16s,background .16s}.g_AIbq_card:hover{border-color:var(--dsw-alias-label-dimmed)}.g_AIbq_cardOpen{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-label-dimmed)}.g_AIbq_header{appearance:none;width:100%;font:inherit;color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;border-radius:12px;align-items:center;gap:12px;padding:14px 16px;display:flex}.g_AIbq_header:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}.g_AIbq_headText{flex-direction:column;flex:1;gap:4px;min-width:0;display:flex}.g_AIbq_name{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:600;line-height:1.4}.g_AIbq_description{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}.g_AIbq_chevron{color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .16s}.g_AIbq_chevronOpen{transform:rotate(180deg)}.g_AIbq_body{border-top:1px solid var(--dsw-alias-border-l2);margin:0 16px;padding-bottom:8px}.g_AIbq_readOnly{color:var(--dsw-alias-label-tertiary);margin:12px 0 0;font-size:12px;line-height:1.5}.g_AIbq_pending{white-space:nowrap;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border-radius:999px;flex:none;padding:1px 8px;font-size:11px;font-weight:500;line-height:17px}.g_AIbq_footer{border-top:1px solid var(--dsw-alias-border-l2);justify-content:flex-end;align-items:center;gap:8px;padding:12px 0 4px;display:flex}.g_AIbq_failed{min-width:0;color:var(--dsw-alias-label-error);flex:1;margin:0;font-size:12px;line-height:1.5}.g_AIbq_discard,.g_AIbq_save{appearance:none;font:inherit;cursor:pointer;border:1px solid #0000;border-radius:8px;padding:5px 14px;font-size:13px;line-height:1.5}.g_AIbq_discard{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:0 0}.g_AIbq_discard:hover:not(:disabled){color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-label-dimmed)}.g_AIbq_save{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-3)}.g_AIbq_discard:disabled,.g_AIbq_save:disabled{opacity:.4;cursor:default}.g_AIbq_discard:focus-visible,.g_AIbq_save:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}";
		const tagId$1 = "modlens-plus/modlens-card.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "modlens-plus";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var modlens_card_module_css_default = {
			"description": "g_AIbq_description",
			"chevron": "g_AIbq_chevron",
			"cardOpen": "g_AIbq_cardOpen",
			"chevronOpen": "g_AIbq_chevronOpen",
			"name": "g_AIbq_name",
			"pending": "g_AIbq_pending",
			"discard": "g_AIbq_discard",
			"readOnly": "g_AIbq_readOnly",
			"failed": "g_AIbq_failed",
			"footer": "g_AIbq_footer",
			"headText": "g_AIbq_headText",
			"header": "g_AIbq_header",
			"card": "g_AIbq_card",
			"body": "g_AIbq_body",
			"save": "g_AIbq_save"
		};
		//#endregion
		//#region \0dsh-css:D:\develop\modlens\client\fields.module.css.mjs
		const css = ".cMiULG_field{flex-direction:column;gap:6px;padding:12px 0;display:flex}.cMiULG_field+.cMiULG_field{border-top:1px solid var(--dsw-alias-border-l2)}.cMiULG_head{align-items:center;gap:8px;display:flex}.cMiULG_label{min-width:0;color:var(--dsw-alias-label-primary);flex:1;font-size:13px;font-weight:500;line-height:1.5}.cMiULG_badges{align-items:center;gap:8px;display:inline-flex}.cMiULG_badge{white-space:nowrap;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border-radius:999px;padding:1px 8px;font-size:11px;font-weight:500;line-height:17px}.cMiULG_badgeMuted{white-space:nowrap;color:var(--dsw-alias-label-tertiary);border-radius:999px;padding:1px 8px;font-size:11px;line-height:17px}.cMiULG_reset{font:inherit;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;padding:0;font-size:12px;line-height:1.5}.cMiULG_reset:hover:not(:disabled){color:var(--dsw-alias-label-primary)}.cMiULG_reset:disabled{cursor:default}.cMiULG_input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);height:34px;font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 12px;font-size:13px;line-height:1.5}.cMiULG_input:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}.cMiULG_input:disabled{color:var(--dsw-alias-label-tertiary);cursor:default}.cMiULG_inputInvalid{border-color:var(--dsw-alias-label-error);}.cMiULG_invalid{color:var(--dsw-alias-label-error);margin:0;font-size:12px;line-height:1.5}.cMiULG_hint{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;line-height:1.5}";
		const tagId = "modlens-plus/fields.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "modlens-plus";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var fields_module_css_default = {
			"reset": "cMiULG_reset",
			"inputInvalid": "cMiULG_inputInvalid",
			"invalid": "cMiULG_invalid",
			"badge": "cMiULG_badge",
			"badgeMuted": "cMiULG_badgeMuted",
			"field": "cMiULG_field",
			"badges": "cMiULG_badges",
			"hint": "cMiULG_hint",
			"label": "cMiULG_label",
			"head": "cMiULG_head",
			"input": "cMiULG_input"
		};
		//#endregion
		//#region client/ModlensCard.tsx
		/**
		* The modlens-plus card: the vision bridge's default engine, its endpoint and
		* model, and the key — which is written through the credentials domain, never
		* into the settings section, so the literal never rides a response. The
		* chrome and fields mirror the shipped ui-settings-plugins cards (same
		* --dsw-alias-* tokens, same disclosure/save structure), so the card is
		* visually identical to the terminal / agent-loop / web-search cards.
		*/
		/** Card chrome copy (Simplified Chinese, matching the shipped cards' zh copy). */
		const COPY = {
			expand: "展开设置",
			collapse: "收起设置",
			title: "ModLens Plus 视觉",
			description: "本地 modlens-plus 视觉桥，为纯文本模型提供看图能力。",
			unsaved: "未保存",
			readOnly: "本部署的设置为只读。",
			save: "保存",
			saving: "保存中…",
			discard: "放弃修改",
			saveFailed: "本部署没有接受这些值，已保留供你修改。",
			overridden: "已覆盖",
			reset: "恢复默认",
			apiKeyLabel: "API Key",
			apiKeyHint: "不写入设置文件。留空表示保持当前密钥。",
			apiKeySet: "已配置密钥。",
			apiKeyUnset: "未配置密钥；配置之前图片识别不可用。",
			providerLabel: "引擎",
			providerHint: "视觉引擎名称（openai、gemini-api、anthropic 等）。",
			baseUrlLabel: "接口地址",
			baseUrlHint: "留空则使用引擎默认地址。",
			modelLabel: "模型",
			modelHint: "该接口上的视觉模型 ID。"
		};
		/** One staged value field — mirrors the shipped ValueField control. */
		function ValueField(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: fields_module_css_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: fields_module_css_default.head,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: fields_module_css_default.label,
							htmlFor: props.id,
							children: props.label
						}), props.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: fields_module_css_default.badges,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: fields_module_css_default.badge,
								children: COPY.overridden
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: fields_module_css_default.reset,
								disabled: props.disabled,
								onClick: props.onReset,
								children: COPY.reset
							})]
						}) : null]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						id: props.id,
						className: fields_module_css_default.input,
						type: "text",
						value: props.text,
						placeholder: props.placeholder ?? "",
						disabled: props.disabled,
						onChange: (event) => {
							props.onEdit(event.target.value);
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: fields_module_css_default.hint,
						children: props.hint
					})
				]
			});
		}
		/** The write-only key control — mirrors the shipped SecretField control. */
		function KeyField(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: fields_module_css_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: fields_module_css_default.head,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: fields_module_css_default.label,
							htmlFor: props.id,
							children: props.label
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: fields_module_css_default.badges,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: props.configured ? fields_module_css_default.badge : fields_module_css_default.badgeMuted,
								children: props.configured ? COPY.apiKeySet : COPY.apiKeyUnset
							})
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						id: props.id,
						className: fields_module_css_default.input,
						type: "password",
						autoComplete: "off",
						value: props.text,
						disabled: props.disabled,
						onChange: (event) => {
							props.onEdit(event.target.value);
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: fields_module_css_default.hint,
						children: props.hint
					})
				]
			});
		}
		/** The engine fields the card edits, in display order. */
		const FIELDS = [
			{
				id: "plugin-config-modlens-provider",
				key: "provider",
				label: COPY.providerLabel,
				hint: COPY.providerHint,
				placeholder: "openai"
			},
			{
				id: "plugin-config-modlens-endpoint",
				key: "baseUrl",
				label: COPY.baseUrlLabel,
				hint: COPY.baseUrlHint
			},
			{
				id: "plugin-config-modlens-model",
				key: "model",
				label: COPY.modelLabel,
				hint: COPY.modelHint,
				placeholder: "qwen3-vl-flash"
			}
		];
		/**
		* Render the modlens card: a disclosing header over the engine fields and the
		* save that writes them.
		* @param props - the card snapshot and its form actions.
		* @returns the card, or nothing when the namespace is unavailable.
		*/
		function ModlensCard(props) {
			const [open, setOpen] = (0, react.useState)(false);
			const state = props.useModlensCard((snapshot) => snapshot);
			if (!state.available) return null;
			const disabled = !state.writable;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: open ? `${modlens_card_module_css_default.card} ${modlens_card_module_css_default.cardOpen}` : modlens_card_module_css_default.card,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: modlens_card_module_css_default.header,
					"aria-expanded": open,
					"aria-label": `${open ? COPY.collapse : COPY.expand}: ${COPY.title}`,
					onClick: () => {
						setOpen(!open);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: modlens_card_module_css_default.headText,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: modlens_card_module_css_default.name,
								children: COPY.title
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: modlens_card_module_css_default.description,
								children: COPY.description
							})]
						}),
						state.dirty ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: modlens_card_module_css_default.pending,
							children: COPY.unsaved
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, { className: open ? `${modlens_card_module_css_default.chevron} ${modlens_card_module_css_default.chevronOpen}` : modlens_card_module_css_default.chevron })
					]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: modlens_card_module_css_default.body,
					children: [
						!state.writable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: modlens_card_module_css_default.readOnly,
							role: "status",
							children: COPY.readOnly
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(KeyField, {
							id: "plugin-config-modlens-key",
							label: COPY.apiKeyLabel,
							hint: COPY.apiKeyHint,
							text: state.apiKey.text,
							configured: state.apiKeyConfigured,
							disabled: !state.apiKeyWritable,
							onEdit: (text) => {
								props.edit("apiKey", text);
							}
						}),
						FIELDS.map((field) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
							id: field.id,
							label: field.label,
							hint: field.hint,
							...field.placeholder === void 0 ? {} : { placeholder: field.placeholder },
							text: state[field.key].text,
							overridden: state[field.key].overridden,
							disabled,
							onEdit: (text) => {
								props.edit(field.key, text);
							},
							onReset: () => {
								props.resetField(field.key);
							}
						}, field.key)),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: modlens_card_module_css_default.footer,
							children: [
								state.failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: modlens_card_module_css_default.failed,
									role: "status",
									children: COPY.saveFailed
								}) : null,
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: modlens_card_module_css_default.discard,
									disabled: !state.dirty || state.saving,
									onClick: props.discard,
									children: COPY.discard
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: modlens_card_module_css_default.save,
									disabled: !state.dirty || state.saving,
									onClick: props.save,
									children: state.saving ? COPY.saving : COPY.save
								})
							]
						})
					]
				}) : null]
			});
		}
		//#endregion
		//#region client/modlens-card-controller.ts
		/**
		* Namespace of the modlens-plus vision bridge. Spelled here rather than
		* imported: a client package must not depend on a Host package.
		*/
		const MODLENS_NS = "modlens-plus";
		/** Credential reference the engine resolves when the section names none. */
		const DEFAULT_API_KEY_REF = "DASHSCOPE_API_KEY";
		/** Form field the credential control stages under. */
		const API_KEY_FIELD = "apiKey";
		/** Bridges the `modlens-plus` scope and the credentials domain onto the card. */
		var ModlensCardController = class {
			scope;
			api;
			staged = /* @__PURE__ */ new Map();
			store;
			credential = {
				ref: "",
				configured: false,
				writable: true
			};
			saving = false;
			failed = false;
			/**
			* @param scope - the bound settings scope for the `modlens-plus` namespace.
			* @param api - wire face used for the credential the section references.
			*/
			constructor(scope, api) {
				this.scope = scope;
				this.api = api;
				this.store = (0, _deepseek_ai_dsh_client_runtime_client.createSnapshotStore)(this.projection());
				scope.subscribe(() => {
					this.publish();
					this.readCredential();
				});
				this.readCredential();
			}
			projection() {
				const snapshot = this.scope.getSnapshot();
				return {
					available: snapshot.status === "ready",
					writable: snapshot.writable,
					dirty: this.staged.size > 0,
					saving: this.saving,
					failed: this.failed,
					provider: this.field("provider"),
					baseUrl: this.field("baseUrl"),
					model: this.field("model"),
					apiKey: this.field(API_KEY_FIELD),
					apiKeyConfigured: this.credential.configured,
					apiKeyWritable: this.credential.writable
				};
			}
			/** Render one control: its staged draft, or the effective section value. */
			field(field) {
				const staged = this.staged.get(field);
				if (staged !== void 0) return {
					text: staged.text,
					overridden: !staged.clear
				};
				const snapshot = this.scope.getSnapshot();
				const section = snapshot.value;
				const user = snapshot.user;
				const value = section?.[field];
				return {
					text: typeof value === "string" ? value : "",
					overridden: user !== void 0 && Object.hasOwn(user, field)
				};
			}
			publish() {
				this.store.set(this.projection());
			}
			/**
			* Build the face the card's slot registration injects.
			* @returns the card's snapshot and its form actions.
			*/
			inject() {
				return {
					hooks: { modlensCard: this.store },
					edit: (field, text) => {
						this.staged.set(field, {
							text,
							clear: false
						});
						this.failed = false;
						this.publish();
					},
					resetField: (field) => {
						const base = this.scope.getSnapshot().base?.[field];
						this.staged.set(field, {
							text: typeof base === "string" ? base : "",
							clear: true
						});
						this.failed = false;
						this.publish();
					},
					save: () => {
						this.save();
					},
					discard: () => {
						if (this.staged.size === 0 && !this.failed) return;
						this.staged.clear();
						this.failed = false;
						this.publish();
					}
				};
			}
			/**
			* Write every staged edit, then re-seed from what the Host accepted.
			*
			* The Host is the only authority on whether a value was accepted, so the
			* outcome is read back from the section rather than predicted here. A save
			* that did not land keeps its drafts, so the user can correct them instead
			* of retyping.
			*/
			async save() {
				if (this.staged.size === 0 || this.saving) return;
				this.saving = true;
				this.failed = false;
				this.publish();
				let landed = true;
				for (const [field, edit] of this.staged) {
					if (field === API_KEY_FIELD) {
						landed = await this.writeKey(edit.text) && landed;
						continue;
					}
					landed = await this.writeSectionField(field, edit) && landed;
				}
				if (landed) this.staged.clear();
				this.saving = false;
				this.failed = !landed;
				this.publish();
			}
			async writeSectionField(field, edit) {
				try {
					if (edit.clear || edit.text.trim() === "") await this.scope.unset(field);
					else await this.scope.set(field, edit.text.trim());
				} catch (_sectionWriteFailure) {
					return false;
				}
				const user = this.scope.getSnapshot().user;
				if (edit.clear) return user === void 0 || !Object.hasOwn(user, field);
				return user?.[field] === edit.text.trim();
			}
			/**
			* Ask the credentials domain about the reference the section currently names.
			*
			* The answer is stored with the reference it describes: `apiKeyEnv` can
			* change between the request and its response, and two reads can settle out
			* of order, so a response is published only while it still answers for the
			* reference in force.
			*/
			async readCredential() {
				const ref = refOf(this.scope.getSnapshot());
				if (ref !== this.credential.ref) {
					this.credential = {
						ref,
						configured: false,
						writable: true
					};
					this.publish();
				}
				let response;
				try {
					response = await this.api.credentials.describe({ refs: [ref] });
				} catch (_credentialReadFailure) {
					return;
				}
				if (!response.result.ok || ref !== refOf(this.scope.getSnapshot())) return;
				const view = response.result.value.credentials[ref];
				const next = {
					ref,
					configured: view?.configured ?? false,
					writable: view?.writable ?? true
				};
				if (next.configured === this.credential.configured && next.writable === this.credential.writable) return;
				this.credential = next;
				this.publish();
			}
			/**
			* Re-read after the Host reports a change to the reference this card watches.
			* @param ref - the reference the Host reports as changed.
			*/
			refreshCredential(ref) {
				if (ref !== this.credential.ref) return;
				this.readCredential();
			}
			/**
			* Write the staged key, then re-read whether the Host now holds one.
			* @param value - the staged credential literal.
			* @returns whether the Host reports a configured credential afterwards.
			*/
			async writeKey(value) {
				if (value.trim() === "") return true;
				try {
					await this.api.credentials.set({
						ref: refOf(this.scope.getSnapshot()),
						value: value.trim()
					});
				} catch (_credentialWriteFailure) {}
				await this.readCredential();
				return this.credential.configured;
			}
		};
		/**
		* The credential reference the section names, or the engine's default.
		* @param snapshot - the current scope snapshot.
		* @returns the reference to address.
		*/
		function refOf(snapshot) {
			const declared = snapshot.value?.apiKeyEnv;
			return declared !== void 0 && declared.length > 0 ? declared : DEFAULT_API_KEY_REF;
		}
		/** Every section field the card edits, used by tests to enumerate the form. */
		const MODLENS_SECTION_FIELDS = [
			"provider",
			"baseUrl",
			"model"
		];
		//#endregion
		//#region client/index.ts
		/** Required services (cordis fiber inject). */
		const inject = [
			"slots",
			"connection",
			"remote",
			"settingsScope"
		];
		/**
		* Mount the modlens card into the plugin configuration section.
		* @param ctx - the browser plugin context.
		*/
		function apply(ctx) {
			const { api } = ctx.get("connection");
			const modlens = new ModlensCardController(ctx.settingsScope.bind({ namespace: MODLENS_NS }), api);
			ctx.effect(() => ctx.remote.$on("credentials/updated", (ref) => {
				modlens.refreshCredential(ref);
			}), "modlens-plus: credential invalidations");
			ctx.slots.inject("settings.plugin.item", function* () {
				yield ctx.slots.register({
					name: "settings.plugin.item",
					id: "modlens-plus",
					order: 30,
					inject: () => modlens.inject()
				}, ModlensCard);
			});
		}
		//#endregion
		exports.DEFAULT_API_KEY_REF = DEFAULT_API_KEY_REF;
		exports.MODLENS_NS = MODLENS_NS;
		exports.MODLENS_SECTION_FIELDS = MODLENS_SECTION_FIELDS;
		exports.ModlensCard = ModlensCard;
		exports.ModlensCardController = ModlensCardController;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map