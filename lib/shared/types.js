// src/shared/types.ts
var PREDICTION_CHAR_LIMIT = 200;
var PREDICTION_TIMEOUT_MS = 3e4;
var PREDICTION_DEBOUNCE_MS = 800;
var PREDICTION_INTERVAL_MS = 3e3;
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
    predictionEnabled: value.predictionEnabled === true
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
  DEFAULT_SETTINGS,
  DRAFT_CHAR_LIMIT,
  HISTORY_CHAR_LIMIT,
  HISTORY_TURN_LIMIT,
  PREDICTION_CHAR_LIMIT,
  PREDICTION_DEBOUNCE_MS,
  PREDICTION_INTERVAL_MS,
  PREDICTION_TIMEOUT_MS,
  TIMEOUT_MS,
  isDeepSeekModel,
  isEnhanceMode,
  sameSelection,
  validSelection,
  validateSettings
};
