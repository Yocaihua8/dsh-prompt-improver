// src/shared/types.ts
var PREDICTION_CHAR_LIMIT = 200;
var PREDICTION_TIMEOUT_MS = 3e4;
var PREDICTION_DEBOUNCE_MS = 800;
var PREDICTION_INTERVAL_MS = 8e3;
var CUSTOM_INSTRUCTION_LIMIT = 500;
var DRAFT_PLACEHOLDER = "{draft}";
var TEMPLATE_NAME_LIMIT = 40;
var TEMPLATE_TEXT_LIMIT = 2e3;
var TEMPLATE_LIMIT = 20;
function applyTemplate(template, draft) {
  return template.text.replace(DRAFT_PLACEHOLDER, () => draft);
}
function normalizeTemplates(value) {
  if (!Array.isArray(value)) return void 0;
  const seen = /* @__PURE__ */ new Set();
  const templates = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry;
    const id = typeof record.id === "string" ? record.id.trim() : "";
    const name = typeof record.name === "string" ? record.name.trim() : "";
    const text = typeof record.text === "string" ? record.text.trim() : "";
    if (!id || seen.has(id) || !name || name.length > TEMPLATE_NAME_LIMIT || !text || text.length > TEMPLATE_TEXT_LIMIT) continue;
    if (text.split(DRAFT_PLACEHOLDER).length - 1 !== 1) continue;
    seen.add(id);
    templates.push({ id, name, text });
    if (templates.length >= TEMPLATE_LIMIT) break;
  }
  return templates.length ? templates : void 0;
}
function normalizeDefaultAction(value, templates) {
  if (!value || typeof value !== "object") return void 0;
  const kind = value.kind;
  if (kind === "enhance") return { kind: "enhance" };
  if (kind === "template-apply" || kind === "template-adapt") {
    const templateId = value.templateId;
    if (typeof templateId === "string" && templates.some((template) => template.id === templateId)) {
      return { kind, templateId };
    }
  }
  return void 0;
}
var DEFAULT_SETTINGS = {
  mode: "moderate",
  adoption: "direct",
  context: "recent",
  modelStrategy: "follow",
  dedicated: null,
  mystery: false,
  predictionEnabled: false
};
function validateSettings(value) {
  if (!value || !isEnhanceMode(value.mode) || !["direct", "preview"].includes(value.adoption) || !["draft", "recent", "extended"].includes(value.context) || !["follow", "dedicated"].includes(value.modelStrategy) || value.dedicated !== null && (!value.dedicated || !validSelection(value.dedicated)) || value.modelStrategy === "dedicated" && !value.dedicated) throw new Error("\u63D0\u793A\u8BCD\u589E\u5F3A\u8BBE\u7F6E\u65E0\u6548\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u3002");
  const custom = typeof value.customInstructions === "string" ? value.customInstructions.trim() : "";
  if (custom.length > CUSTOM_INSTRUCTION_LIMIT) throw new Error("\u63D0\u793A\u8BCD\u589E\u5F3A\u8BBE\u7F6E\u65E0\u6548\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u3002");
  const templates = normalizeTemplates(value.templates);
  const defaultAction = normalizeDefaultAction(value.defaultAction, templates ?? []);
  return {
    mode: value.mode,
    adoption: value.adoption,
    context: value.context,
    modelStrategy: value.modelStrategy,
    dedicated: value.dedicated ? {
      provider: value.dedicated.provider,
      model: value.dedicated.model,
      ...value.dedicated.reasoningEffort ? { reasoningEffort: value.dedicated.reasoningEffort } : {}
    } : null,
    mystery: value.mystery === true,
    predictionEnabled: value.predictionEnabled === true,
    ...custom ? { customInstructions: custom } : {},
    ...templates ? { templates } : {},
    ...defaultAction && defaultAction.kind !== "enhance" ? { defaultAction } : {}
  };
}
function validSelection(value) {
  return typeof value.provider === "string" && !!value.provider.trim() && value.provider.length <= 200 && typeof value.model === "string" && !!value.model.trim() && value.model.length <= 200 && (value.reasoningEffort === void 0 || typeof value.reasoningEffort === "string" && /^[\w-]{1,80}$/.test(value.reasoningEffort));
}
var TIMEOUT_MS = 12e4;
var HISTORY_CHAR_LIMIT = 12e3;
var HISTORY_TURN_LIMIT = 3;
var DRAFT_CHAR_LIMIT = 32e3;
function isEnhanceMode(value) {
  return value === "moderate" || value === "expanded";
}
function isDeepSeekModel(modelId) {
  return typeof modelId === "string" && /deepseek/i.test(modelId);
}
function sameSelection(a, b) {
  return a?.provider === b?.provider && a?.model === b?.model && a?.reasoningEffort === b?.reasoningEffort;
}
export {
  CUSTOM_INSTRUCTION_LIMIT,
  DEFAULT_SETTINGS,
  DRAFT_CHAR_LIMIT,
  DRAFT_PLACEHOLDER,
  HISTORY_CHAR_LIMIT,
  HISTORY_TURN_LIMIT,
  PREDICTION_CHAR_LIMIT,
  PREDICTION_DEBOUNCE_MS,
  PREDICTION_INTERVAL_MS,
  PREDICTION_TIMEOUT_MS,
  TEMPLATE_LIMIT,
  TEMPLATE_NAME_LIMIT,
  TEMPLATE_TEXT_LIMIT,
  TIMEOUT_MS,
  applyTemplate,
  isDeepSeekModel,
  isEnhanceMode,
  sameSelection,
  validSelection,
  validateSettings
};
