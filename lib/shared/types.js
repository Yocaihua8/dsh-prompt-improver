// src/shared/types.ts
var DEFAULT_SETTINGS = {
  mode: "moderate",
  adoption: "direct",
  context: "recent",
  modelStrategy: "follow",
  dedicated: null
};
function validateSettings(value) {
  if (!value || !isEnhanceMode(value.mode) || !["direct", "preview"].includes(value.adoption) || !["draft", "recent", "extended"].includes(value.context) || !["follow", "dedicated"].includes(value.modelStrategy) || value.dedicated !== null && (!value.dedicated || !validSelection(value.dedicated)) || value.modelStrategy === "dedicated" && !value.dedicated) throw new Error("\u63D0\u793A\u8BCD\u589E\u5F3A\u8BBE\u7F6E\u65E0\u6548\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u3002");
  return {
    mode: value.mode,
    adoption: value.adoption,
    context: value.context,
    modelStrategy: value.modelStrategy,
    dedicated: value.dedicated ? {
      provider: value.dedicated.provider,
      model: value.dedicated.model,
      ...value.dedicated.reasoningEffort ? { reasoningEffort: value.dedicated.reasoningEffort } : {}
    } : null
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
function sameSelection(a, b) {
  return a?.provider === b?.provider && a?.model === b?.model && a?.reasoningEffort === b?.reasoningEffort;
}
export {
  DEFAULT_SETTINGS,
  DRAFT_CHAR_LIMIT,
  HISTORY_CHAR_LIMIT,
  HISTORY_TURN_LIMIT,
  TIMEOUT_MS,
  isEnhanceMode,
  sameSelection,
  validSelection,
  validateSettings
};
