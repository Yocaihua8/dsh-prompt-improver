window.__ModuleLoader__.load({ id: "dsh-prompt-improver", factory: (require) => { var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react2 = require("react");
var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");

// lib/typert.remote-client.js
var import_zod = require("zod");

// node_modules/@deepseek-ai/dsh-typert-protocol/lib/types/remote-info.js
function createTypertRemoteInfo(spec, zod) {
  return new RemoteInfo(spec, zod);
}
var RemoteInfo = class {
  spec;
  zod;
  index;
  constructor(spec, zod) {
    this.spec = spec;
    this.zod = zod;
  }
  get package() {
    return this.spec.package;
  }
  get descriptors() {
    return this.resolve().descriptors;
  }
  get methods() {
    return this.resolve().methods;
  }
  resolve() {
    if (this.index !== void 0)
      return this.index;
    const zod = this.zod;
    const descriptors = [];
    const methods = /* @__PURE__ */ Object.create(null);
    for (const [endpoint, definition] of Object.entries(this.spec.methods)) {
      const separator = endpoint.indexOf("/");
      const namespace = endpoint.slice(0, separator);
      const method = endpoint.slice(separator + 1);
      const parameters = definition.parameters.map((parameter) => ({ ...parameter, wire: parameter.wire ?? parameter.name }));
      const descriptor = {
        ...definition,
        id: `${this.spec.package}#${endpoint}`,
        namespace,
        method,
        parameters,
        result: definition.result.description === void 0 ? definition.result : new ResultValue(definition.result)
      };
      if (definition.invocation.kind === "direct") {
        const inputs = [];
        const direct = Object.assign(descriptor, {
          input(options) {
            const strict = options?.strict === true;
            return inputs[strict ? 1 : 0] ??= new NamedInput(parameters, strict, zod);
          },
          invoke(remote, input, signal) {
            const named = input;
            const values = parameters.map((parameter) => named[parameter.wire]);
            if (definition.cancellation !== void 0)
              values.push(signal);
            const receiver = Reflect.get(remote, namespace);
            const call = Reflect.get(receiver, method);
            return call.apply(receiver, values);
          }
        });
        methods[endpoint] = direct;
      }
      descriptors.push(descriptor);
    }
    return this.index = { descriptors, methods };
  }
};
function optional(parameter) {
  return parameter.source === "json" && parameter.acceptsUndefined === true;
}
var NamedInput = class {
  parameters;
  strict;
  zod;
  schema;
  projection;
  constructor(parameters, strict, zod) {
    this.parameters = parameters;
    this.strict = strict;
    this.zod = zod;
  }
  codec(parameter) {
    return this.strict ? parameter.strictCodec : parameter.codec;
  }
  create = () => this.schema ??= this.zod.strictObject(Object.fromEntries(this.parameters.map((parameter) => {
    const value = this.codec(parameter).create();
    return [parameter.wire, optional(parameter) ? value.optional() : value.nonoptional()];
  })));
  get jsonSchema() {
    return this.project().jsonSchema;
  }
  get jsonSchemaError() {
    return this.project().jsonSchemaError;
  }
  project() {
    if (this.projection !== void 0)
      return this.projection;
    const unavailable = this.parameters.find((parameter) => this.codec(parameter).jsonSchema === void 0);
    if (unavailable !== void 0) {
      return this.projection = { jsonSchemaError: this.codec(unavailable).jsonSchemaError ?? `No JSON Schema for parameter ${unavailable.wire}` };
    }
    return this.projection = {
      jsonSchema: {
        type: "object",
        properties: Object.fromEntries(this.parameters.map((parameter) => [parameter.wire, {
          ...this.codec(parameter).jsonSchema,
          ...parameter.description === void 0 ? {} : { description: parameter.description }
        }])),
        required: this.parameters.filter((parameter) => !optional(parameter)).map((parameter) => parameter.wire),
        additionalProperties: false
      }
    };
  }
};
var ResultValue = class {
  spec;
  projection;
  constructor(spec) {
    this.spec = spec;
  }
  get mode() {
    return this.spec.mode;
  }
  get typeSymbol() {
    return this.spec.typeSymbol;
  }
  get create() {
    return this.spec.create;
  }
  get decode() {
    return this.spec.decode;
  }
  get encode() {
    return this.spec.encode;
  }
  get description() {
    return this.spec.description;
  }
  get jsonSchemaError() {
    return this.spec.jsonSchemaError;
  }
  get jsonSchema() {
    if (this.projection === void 0) {
      const schema = this.spec.jsonSchema;
      this.projection = { value: schema === void 0 ? void 0 : { ...schema, description: this.spec.description } };
    }
    return this.projection.value;
  }
};

// lib/typert.remote-client.js
var dsh_prompt_improver_promptEnhance_capabilities_result$schema$value;
var dsh_prompt_improver_promptEnhance_capabilities_result$schema = () => dsh_prompt_improver_promptEnhance_capabilities_result$schema$value ??= import_zod.z.object({
  "owner": import_zod.z.boolean(),
  "memory": import_zod.z.boolean(),
  "models": import_zod.z.array(import_zod.z.object({
    "label": import_zod.z.string(),
    "efforts": import_zod.z.array(import_zod.z.string()),
    "provider": import_zod.z.string(),
    "model": import_zod.z.string(),
    "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
  }))
});
var dsh_prompt_improver_promptEnhance_enhance_parameter_0$schema$value;
var dsh_prompt_improver_promptEnhance_enhance_parameter_0$schema = () => dsh_prompt_improver_promptEnhance_enhance_parameter_0$schema$value ??= import_zod.z.object({
  "sessionId": import_zod.z.string(),
  "draft": import_zod.z.string(),
  "mode": import_zod.z.union([import_zod.z.literal("moderate"), import_zod.z.literal("expanded")]),
  "selection": import_zod.z.object({
    "provider": import_zod.z.string(),
    "model": import_zod.z.string(),
    "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
  }),
  "protectedTokens": import_zod.z.array(import_zod.z.string()).describe("Tokens identifying references; identities stay in the browser."),
  "settings": import_zod.z.union([import_zod.z.undefined(), import_zod.z.object({
    "mode": import_zod.z.union([import_zod.z.literal("moderate"), import_zod.z.literal("expanded")]),
    "adoption": import_zod.z.union([import_zod.z.literal("direct"), import_zod.z.literal("preview")]),
    "context": import_zod.z.union([import_zod.z.literal("draft"), import_zod.z.literal("recent"), import_zod.z.literal("extended")]),
    "modelStrategy": import_zod.z.union([import_zod.z.literal("follow"), import_zod.z.literal("dedicated")]),
    "dedicated": import_zod.z.union([import_zod.z.literal(null), import_zod.z.object({
      "provider": import_zod.z.string(),
      "model": import_zod.z.string(),
      "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
    })])
  })]).optional().describe("Immutable settings captured by the client at click time.")
});
var dsh_prompt_improver_promptEnhance_enhance_result$schema$value;
var dsh_prompt_improver_promptEnhance_enhance_result$schema = () => dsh_prompt_improver_promptEnhance_enhance_result$schema$value ??= import_zod.z.object({
  "text": import_zod.z.string(),
  "context": import_zod.z.union([import_zod.z.undefined(), import_zod.z.object({
    "sources": import_zod.z.array(import_zod.z.object({
      "kind": import_zod.z.union([import_zod.z.literal("conversation"), import_zod.z.literal("memory"), import_zod.z.literal("project")]),
      "label": import_zod.z.string(),
      "text": import_zod.z.string()
    })),
    "warnings": import_zod.z.array(import_zod.z.string())
  })]).optional(),
  "selection": import_zod.z.union([import_zod.z.undefined(), import_zod.z.object({
    "provider": import_zod.z.string(),
    "model": import_zod.z.string(),
    "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
  })]).optional()
});
var dsh_prompt_improver_promptEnhance_getSettings_parameter_0$schema$value;
var dsh_prompt_improver_promptEnhance_getSettings_parameter_0$schema = () => dsh_prompt_improver_promptEnhance_getSettings_parameter_0$schema$value ??= import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]);
var dsh_prompt_improver_promptEnhance_getSettings_result$schema$value;
var dsh_prompt_improver_promptEnhance_getSettings_result$schema = () => dsh_prompt_improver_promptEnhance_getSettings_result$schema$value ??= import_zod.z.object({
  "mode": import_zod.z.union([import_zod.z.literal("moderate"), import_zod.z.literal("expanded")]),
  "adoption": import_zod.z.union([import_zod.z.literal("direct"), import_zod.z.literal("preview")]),
  "context": import_zod.z.union([import_zod.z.literal("draft"), import_zod.z.literal("recent"), import_zod.z.literal("extended")]),
  "modelStrategy": import_zod.z.union([import_zod.z.literal("follow"), import_zod.z.literal("dedicated")]),
  "dedicated": import_zod.z.union([import_zod.z.literal(null), import_zod.z.object({
    "provider": import_zod.z.string(),
    "model": import_zod.z.string(),
    "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
  })])
});
var dsh_prompt_improver_promptEnhance_saveSettings_parameter_0$schema$value;
var dsh_prompt_improver_promptEnhance_saveSettings_parameter_0$schema = () => dsh_prompt_improver_promptEnhance_saveSettings_parameter_0$schema$value ??= import_zod.z.object({
  "mode": import_zod.z.union([import_zod.z.literal("moderate"), import_zod.z.literal("expanded")]),
  "adoption": import_zod.z.union([import_zod.z.literal("direct"), import_zod.z.literal("preview")]),
  "context": import_zod.z.union([import_zod.z.literal("draft"), import_zod.z.literal("recent"), import_zod.z.literal("extended")]),
  "modelStrategy": import_zod.z.union([import_zod.z.literal("follow"), import_zod.z.literal("dedicated")]),
  "dedicated": import_zod.z.union([import_zod.z.literal(null), import_zod.z.object({
    "provider": import_zod.z.string(),
    "model": import_zod.z.string(),
    "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
  })])
});
var dsh_prompt_improver_promptEnhance_saveSettings_result$schema$value;
var dsh_prompt_improver_promptEnhance_saveSettings_result$schema = () => dsh_prompt_improver_promptEnhance_saveSettings_result$schema$value ??= import_zod.z.object({
  "mode": import_zod.z.union([import_zod.z.literal("moderate"), import_zod.z.literal("expanded")]),
  "adoption": import_zod.z.union([import_zod.z.literal("direct"), import_zod.z.literal("preview")]),
  "context": import_zod.z.union([import_zod.z.literal("draft"), import_zod.z.literal("recent"), import_zod.z.literal("extended")]),
  "modelStrategy": import_zod.z.union([import_zod.z.literal("follow"), import_zod.z.literal("dedicated")]),
  "dedicated": import_zod.z.union([import_zod.z.literal(null), import_zod.z.object({
    "provider": import_zod.z.string(),
    "model": import_zod.z.string(),
    "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
  })])
});
var dsh_prompt_improver_promptEnhance_enhance_parameter_0_strict$schema$value;
var dsh_prompt_improver_promptEnhance_enhance_parameter_0_strict$schema = () => dsh_prompt_improver_promptEnhance_enhance_parameter_0_strict$schema$value ??= import_zod.z.strictObject({
  "sessionId": import_zod.z.string(),
  "draft": import_zod.z.string(),
  "mode": import_zod.z.union([import_zod.z.literal("moderate"), import_zod.z.literal("expanded")]),
  "selection": import_zod.z.strictObject({
    "provider": import_zod.z.string(),
    "model": import_zod.z.string(),
    "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
  }),
  "protectedTokens": import_zod.z.array(import_zod.z.string()).describe("Tokens identifying references; identities stay in the browser."),
  "settings": import_zod.z.union([import_zod.z.undefined(), import_zod.z.strictObject({
    "mode": import_zod.z.union([import_zod.z.literal("moderate"), import_zod.z.literal("expanded")]),
    "adoption": import_zod.z.union([import_zod.z.literal("direct"), import_zod.z.literal("preview")]),
    "context": import_zod.z.union([import_zod.z.literal("draft"), import_zod.z.literal("recent"), import_zod.z.literal("extended")]),
    "modelStrategy": import_zod.z.union([import_zod.z.literal("follow"), import_zod.z.literal("dedicated")]),
    "dedicated": import_zod.z.union([import_zod.z.literal(null), import_zod.z.strictObject({
      "provider": import_zod.z.string(),
      "model": import_zod.z.string(),
      "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
    })])
  })]).optional().describe("Immutable settings captured by the client at click time.")
});
var dsh_prompt_improver_promptEnhance_getSettings_parameter_0_strict$schema$value;
var dsh_prompt_improver_promptEnhance_getSettings_parameter_0_strict$schema = () => dsh_prompt_improver_promptEnhance_getSettings_parameter_0_strict$schema$value ??= import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]);
var dsh_prompt_improver_promptEnhance_saveSettings_parameter_0_strict$schema$value;
var dsh_prompt_improver_promptEnhance_saveSettings_parameter_0_strict$schema = () => dsh_prompt_improver_promptEnhance_saveSettings_parameter_0_strict$schema$value ??= import_zod.z.strictObject({
  "mode": import_zod.z.union([import_zod.z.literal("moderate"), import_zod.z.literal("expanded")]),
  "adoption": import_zod.z.union([import_zod.z.literal("direct"), import_zod.z.literal("preview")]),
  "context": import_zod.z.union([import_zod.z.literal("draft"), import_zod.z.literal("recent"), import_zod.z.literal("extended")]),
  "modelStrategy": import_zod.z.union([import_zod.z.literal("follow"), import_zod.z.literal("dedicated")]),
  "dedicated": import_zod.z.union([import_zod.z.literal(null), import_zod.z.strictObject({
    "provider": import_zod.z.string(),
    "model": import_zod.z.string(),
    "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
  })])
});
var TYPERT_REMOTE = createTypertRemoteInfo({
  package: "dsh-prompt-improver",
  methods: {
    "promptEnhance/capabilities": {
      service: "promptEnhance",
      invocation: { kind: "direct" },
      parameters: [],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "dsh-prompt-improver/types#Capabilities",
        create: dsh_prompt_improver_promptEnhance_capabilities_result$schema,
        jsonSchema: { "type": "object", "properties": { "owner": { "type": "boolean" }, "memory": { "type": "boolean" }, "models": { "type": "array", "items": { "type": "object", "properties": { "label": { "type": "string" }, "efforts": { "type": "array", "items": { "type": "string" } }, "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["label", "efforts", "provider", "model"], "additionalProperties": true } } }, "required": ["owner", "memory", "models"], "additionalProperties": true }
      },
      sourceLocation: { "file": "packages/plugin/src/index.ts", "line": 74, "column": 9 }
    },
    "promptEnhance/enhance": {
      service: "promptEnhance",
      description: "Enhance a draft using the selected model and completed recent conversation.",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "dsh-prompt-improver/types#EnhanceRequest",
            create: dsh_prompt_improver_promptEnhance_enhance_parameter_0$schema,
            jsonSchema: { "type": "object", "properties": { "sessionId": { "type": "string" }, "draft": { "type": "string" }, "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "selection": { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": true }, "protectedTokens": { "type": "array", "items": { "type": "string" }, "description": "Tokens identifying references; identities stay in the browser." }, "settings": { "type": "object", "properties": { "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "adoption": { "type": "string", "enum": ["direct", "preview"] }, "context": { "type": "string", "enum": ["draft", "recent", "extended"] }, "modelStrategy": { "type": "string", "enum": ["follow", "dedicated"] }, "dedicated": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": true }] } }, "required": ["mode", "adoption", "context", "modelStrategy", "dedicated"], "additionalProperties": true, "description": "Immutable settings captured by the client at click time." } }, "required": ["sessionId", "draft", "mode", "selection", "protectedTokens"], "additionalProperties": true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "dsh-prompt-improver/types#EnhanceRequest",
            create: dsh_prompt_improver_promptEnhance_enhance_parameter_0_strict$schema,
            jsonSchema: { "type": "object", "properties": { "sessionId": { "type": "string" }, "draft": { "type": "string" }, "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "selection": { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": false }, "protectedTokens": { "type": "array", "items": { "type": "string" }, "description": "Tokens identifying references; identities stay in the browser." }, "settings": { "type": "object", "properties": { "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "adoption": { "type": "string", "enum": ["direct", "preview"] }, "context": { "type": "string", "enum": ["draft", "recent", "extended"] }, "modelStrategy": { "type": "string", "enum": ["follow", "dedicated"] }, "dedicated": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": false }] } }, "required": ["mode", "adoption", "context", "modelStrategy", "dedicated"], "additionalProperties": false, "description": "Immutable settings captured by the client at click time." } }, "required": ["sessionId", "draft", "mode", "selection", "protectedTokens"], "additionalProperties": false }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "dsh-prompt-improver/types#EnhanceResponse",
        create: dsh_prompt_improver_promptEnhance_enhance_result$schema,
        jsonSchema: { "type": "object", "properties": { "text": { "type": "string" }, "context": { "type": "object", "properties": { "sources": { "type": "array", "items": { "type": "object", "properties": { "kind": { "type": "string", "enum": ["conversation", "memory", "project"] }, "label": { "type": "string" }, "text": { "type": "string" } }, "required": ["kind", "label", "text"], "additionalProperties": true } }, "warnings": { "type": "array", "items": { "type": "string" } } }, "required": ["sources", "warnings"], "additionalProperties": true }, "selection": { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": true } }, "required": ["text"], "additionalProperties": true }
      },
      sourceLocation: { "file": "packages/plugin/src/index.ts", "line": 46, "column": 9 }
    },
    "promptEnhance/getSettings": {
      service: "promptEnhance",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "legacyMode",
          source: "json",
          acceptsUndefined: true,
          codec: {
            mode: "strict",
            typeSymbol: "dsh-prompt-improver#promptEnhance/getSettings:legacyMode",
            create: dsh_prompt_improver_promptEnhance_getSettings_parameter_0$schema,
            jsonSchema: { "type": "string" }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "dsh-prompt-improver#promptEnhance/getSettings:legacyMode",
            create: dsh_prompt_improver_promptEnhance_getSettings_parameter_0_strict$schema,
            jsonSchema: { "type": "string" }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "dsh-prompt-improver/types#EnhanceSettings",
        create: dsh_prompt_improver_promptEnhance_getSettings_result$schema,
        jsonSchema: { "type": "object", "properties": { "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "adoption": { "type": "string", "enum": ["direct", "preview"] }, "context": { "type": "string", "enum": ["draft", "recent", "extended"] }, "modelStrategy": { "type": "string", "enum": ["follow", "dedicated"] }, "dedicated": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": true }] } }, "required": ["mode", "adoption", "context", "modelStrategy", "dedicated"], "additionalProperties": true }
      },
      sourceLocation: { "file": "packages/plugin/src/index.ts", "line": 60, "column": 9 }
    },
    "promptEnhance/saveSettings": {
      service: "promptEnhance",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "settings",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "dsh-prompt-improver/types#EnhanceSettings",
            create: dsh_prompt_improver_promptEnhance_saveSettings_parameter_0$schema,
            jsonSchema: { "type": "object", "properties": { "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "adoption": { "type": "string", "enum": ["direct", "preview"] }, "context": { "type": "string", "enum": ["draft", "recent", "extended"] }, "modelStrategy": { "type": "string", "enum": ["follow", "dedicated"] }, "dedicated": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": true }] } }, "required": ["mode", "adoption", "context", "modelStrategy", "dedicated"], "additionalProperties": true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "dsh-prompt-improver/types#EnhanceSettings",
            create: dsh_prompt_improver_promptEnhance_saveSettings_parameter_0_strict$schema,
            jsonSchema: { "type": "object", "properties": { "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "adoption": { "type": "string", "enum": ["direct", "preview"] }, "context": { "type": "string", "enum": ["draft", "recent", "extended"] }, "modelStrategy": { "type": "string", "enum": ["follow", "dedicated"] }, "dedicated": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": false }] } }, "required": ["mode", "adoption", "context", "modelStrategy", "dedicated"], "additionalProperties": false }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "dsh-prompt-improver/types#EnhanceSettings",
        create: dsh_prompt_improver_promptEnhance_saveSettings_result$schema,
        jsonSchema: { "type": "object", "properties": { "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "adoption": { "type": "string", "enum": ["direct", "preview"] }, "context": { "type": "string", "enum": ["draft", "recent", "extended"] }, "modelStrategy": { "type": "string", "enum": ["follow", "dedicated"] }, "dedicated": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": true }] } }, "required": ["mode", "adoption", "context", "modelStrategy", "dedicated"], "additionalProperties": true }
      },
      sourceLocation: { "file": "packages/plugin/src/index.ts", "line": 67, "column": 9 }
    }
  }
}, import_zod.z);

// src/shared/references.ts
function protectReferences(draft, nonce) {
  if (!/^[a-zA-Z0-9-]+$/.test(nonce)) throw new Error("\u65E0\u6548\u7684\u5F15\u7528\u4FDD\u62A4\u6807\u8BC6\u3002");
  const prefix = `\u27E6DSH_REF_${nonce}_`;
  if (draft.text.includes(prefix)) throw new Error("\u5F15\u7528\u4FDD\u62A4\u6807\u8BC6\u4E0E\u539F\u6587\u51B2\u7A81\uFF0C\u8BF7\u91CD\u8BD5\u3002");
  let end = 0;
  const pieces = [];
  const tokens = [];
  for (const [index, reference] of draft.references.entries()) {
    if (!Number.isInteger(reference.offset) || reference.offset < end || reference.length !== reference.clipboardText.length || reference.length <= 0 || draft.text.slice(reference.offset, reference.offset + reference.length) !== reference.clipboardText) {
      throw new Error("\u8349\u7A3F\u5F15\u7528\u72B6\u6001\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u8BD5\u3002");
    }
    const token = `${prefix}${index}\u27E7`;
    pieces.push(draft.text.slice(end, reference.offset), token);
    tokens.push(token);
    end = reference.offset + reference.length;
  }
  pieces.push(draft.text.slice(end));
  return { text: pieces.join(""), tokens, references: draft.references.map((ref) => ({ ...ref })) };
}
function validateTokens(text, tokens) {
  const actual = text.match(/⟦DSH_REF_[^⟧\r\n]+⟧/gu) ?? [];
  if (actual.length !== tokens.length || new Set(tokens).size !== tokens.length || actual.some((token) => !tokens.includes(token)) || tokens.some((token) => text.split(token).length !== 2)) {
    throw new Error("\u589E\u5F3A\u7ED3\u679C\u672A\u5B8C\u6574\u4FDD\u7559\u5F15\u7528\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002");
  }
}
function restoreReferences(text, protectedDraft) {
  validateTokens(text, protectedDraft.tokens);
  const ordered = protectedDraft.tokens.map((token, index) => ({
    token,
    index,
    offset: text.indexOf(token)
  })).sort((a, b) => a.offset - b.offset);
  const references = [];
  let cursor = 0;
  let output = "";
  for (const item of ordered) {
    const reference = protectedDraft.references[item.index];
    output += text.slice(cursor, item.offset);
    references.push({ ...reference, offset: output.length });
    output += reference.clipboardText;
    cursor = item.offset + item.token.length;
  }
  output += text.slice(cursor);
  return { text: output, references };
}

// src/shared/types.ts
var DEFAULT_SETTINGS = {
  mode: "moderate",
  adoption: "direct",
  context: "recent",
  modelStrategy: "follow",
  dedicated: null
};
var DRAFT_CHAR_LIMIT = 32e3;
function sameSelection(a, b) {
  return a?.provider === b?.provider && a?.model === b?.model && a?.reasoningEffort === b?.reasoningEffort;
}

// src/client/controller.ts
function sameComposer(a, b) {
  return a.sessionId === b.sessionId && a.revision === b.revision && JSON.stringify(a.draft) === JSON.stringify(b.draft) && sameSelection(a.selection, b.selection) && a.available === b.available && a.attachmentIds.length === b.attachmentIds.length && a.attachmentIds.every((id, i) => id === b.attachmentIds[i]);
}
var EnhanceController = class {
  constructor(port) {
    this.port = port;
  }
  active;
  undo;
  disposed = false;
  preview;
  applying;
  message = "";
  get pending() {
    return this.active !== void 0;
  }
  get checkingPreview() {
    return this.applying !== void 0;
  }
  get canUndo() {
    return !this.pending && !!this.undo && sameComposer(this.port.read(), this.undo.applied);
  }
  reconcile() {
    if (this.disposed) return;
    const snapshot = this.port.read();
    if (this.active && !sameComposer(snapshot, this.active.snapshot)) {
      this.cancel("\u8349\u7A3F\u3001\u9644\u4EF6\u3001\u4F1A\u8BDD\u6216\u6A21\u578B\u5DF2\u53D8\u5316\uFF0C\u5DF2\u53D6\u6D88\u589E\u5F3A\u3002");
    }
    if (this.undo && !sameComposer(snapshot, this.undo.applied)) {
      this.undo = void 0;
      this.port.changed();
    }
    if (this.preview && !sameComposer(snapshot, this.preview.snapshot)) {
      this.closePreview();
      this.message = "\u8349\u7A3F\u3001\u9644\u4EF6\u3001\u4F1A\u8BDD\u6216\u6709\u6548\u6A21\u578B\u5DF2\u53D8\u5316\uFF0C\u9884\u89C8\u5DF2\u5931\u6548\u3002";
      this.port.changed();
    }
  }
  cancel(message = "\u5DF2\u53D6\u6D88\u589E\u5F3A\u3002") {
    const active = this.active;
    if (!active) return;
    this.active = void 0;
    active.abort.abort();
    this.message = message;
    if (!this.disposed) this.port.changed();
  }
  async start(mode, settings, previewOnce = false) {
    if (this.disposed || this.active) return;
    const snapshot = structuredClone(this.port.read());
    if (!snapshot.available || !snapshot.selection || !snapshot.draft.text.trim()) return;
    const active = { abort: new AbortController(), snapshot };
    this.active = active;
    this.closePreview();
    this.message = "";
    this.port.changed();
    try {
      const protectedDraft = protectReferences(snapshot.draft, this.port.nonce());
      const result = await this.port.enhance({
        sessionId: snapshot.sessionId,
        draft: protectedDraft.text,
        protectedTokens: protectedDraft.tokens,
        mode,
        selection: { ...snapshot.selection },
        ...settings ? { settings: structuredClone(settings) } : {}
      }, active.abort.signal);
      if (this.disposed || this.active !== active || active.abort.signal.aborted) return;
      if (!sameComposer(this.port.read(), snapshot)) {
        this.cancel("\u8349\u7A3F\u72B6\u6001\u5DF2\u53D8\u5316\uFF0C\u589E\u5F3A\u7ED3\u679C\u672A\u56DE\u586B\u3002");
        return;
      }
      if (!result.text.trim()) throw new Error("\u6A21\u578B\u8FD4\u56DE\u4E86\u7A7A\u7ED3\u679C\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002");
      const next = restoreReferences(result.text.trim(), protectedDraft);
      this.active = void 0;
      if (previewOnce || settings?.adoption === "preview") {
        this.preview = { snapshot, draft: next, response: result };
        this.message = "";
      } else this.apply(next, snapshot, result);
    } catch (error) {
      if (this.disposed || this.active !== active || active.abort.signal.aborted) return;
      this.message = error instanceof Error ? error.message : "\u589E\u5F3A\u5931\u8D25\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002";
    } finally {
      if (this.active === active) this.active = void 0;
      if (!this.disposed) this.port.changed();
    }
  }
  apply(draft, snapshot, response) {
    this.port.write(draft);
    this.undo = { original: snapshot.draft, applied: structuredClone(this.port.read()) };
    this.message = ["\u5DF2\u589E\u5F3A\uFF0C\u8BF7\u68C0\u67E5\u540E\u53D1\u9001\u3002", ...response.context?.warnings ?? []].join(" ");
  }
  async acceptPreview() {
    const preview = this.preview;
    if (!preview || this.applying || this.disposed) return;
    const abort = new AbortController();
    this.applying = abort;
    this.port.changed();
    try {
      if (this.port.validateSelection && !await this.port.validateSelection(preview.snapshot.selection, AbortSignal.any([abort.signal, AbortSignal.timeout(15e3)]))) {
        throw new Error("\u589E\u5F3A\u6A21\u578B\u5DF2\u4E0D\u53EF\u7528\uFF0C\u9884\u89C8\u672A\u91C7\u7528\u3002");
      }
      if (this.disposed || abort.signal.aborted || this.preview !== preview) return;
      if (!sameComposer(this.port.read(), preview.snapshot)) throw new Error("\u8349\u7A3F\u72B6\u6001\u5DF2\u53D8\u5316\uFF0C\u9884\u89C8\u672A\u91C7\u7528\u3002");
      this.preview = void 0;
      this.apply(preview.draft, preview.snapshot, preview.response);
    } catch (error) {
      if (!this.disposed && !abort.signal.aborted) {
        this.preview = void 0;
        this.message = error instanceof Error ? error.message : "\u9884\u89C8\u672A\u91C7\u7528\u3002";
      }
    } finally {
      if (this.applying === abort) this.applying = void 0;
      if (!this.disposed) this.port.changed();
    }
  }
  closePreview() {
    this.preview = void 0;
    this.applying?.abort();
    this.applying = void 0;
    if (!this.disposed) this.port.changed();
  }
  restore() {
    if (!this.canUndo) return;
    const original = this.undo.original;
    this.undo = void 0;
    this.port.write(structuredClone(original));
    this.message = "\u5DF2\u6062\u590D\u539F\u6587\u3002";
    this.port.changed();
  }
  dispose() {
    this.disposed = true;
    this.cancel();
    this.closePreview();
    this.undo = void 0;
  }
};

// src/client/settings.tsx
var import_react = require("react");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime = require("react/jsx-runtime");
var SettingsClient = class {
  constructor(ctx) {
    this.ctx = ctx;
  }
  value = structuredClone(DEFAULT_SETTINGS);
  capabilities = { owner: false, memory: false, models: [] };
  ready = false;
  error = "";
  listeners = /* @__PURE__ */ new Set();
  loading;
  abort = new AbortController();
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  notify() {
    for (const listener of this.listeners) listener();
  }
  async load() {
    if (this.ready) return;
    return this.loading ??= this.refresh().finally(() => {
      this.loading = void 0;
    });
  }
  async refresh() {
    this.error = "";
    try {
      const signal = AbortSignal.any([this.abort.signal, AbortSignal.timeout(15e3)]);
      const capabilities = await this.ctx.remote.promptEnhance.capabilities(signal);
      if (!capabilities.ok) throw new Error(capabilities.error.message);
      this.capabilities = capabilities.value;
      if (capabilities.value.owner) {
        let legacy;
        try {
          legacy = localStorage.getItem("dsh-link-prompt-enhance.mode") ?? void 0;
        } catch {
        }
        const result = await this.ctx.remote.promptEnhance.getSettings(legacy, signal);
        if (!result.ok) throw new Error(result.error.message);
        this.value = result.value;
      }
      this.ready = true;
    } catch (error) {
      this.error = error instanceof Error ? error.message : "\u8BFB\u53D6\u8BBE\u7F6E\u5931\u8D25\u3002";
    }
    if (!this.abort.signal.aborted) this.notify();
  }
  async save(value) {
    const result = await this.ctx.remote.promptEnhance.saveSettings(value, AbortSignal.any([this.abort.signal, AbortSignal.timeout(15e3)]));
    if (!result.ok) throw new Error(result.error.message);
    this.value = result.value;
    this.error = "";
    this.notify();
  }
  dispose() {
    this.abort.abort();
    this.listeners.clear();
  }
};
function sameSettings(a, b) {
  return a.mode === b.mode && a.adoption === b.adoption && a.context === b.context && a.modelStrategy === b.modelStrategy && sameSelection(a.dedicated, b.dedicated);
}
function Select(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-prompt-enhance-select", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { ...props }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconChevronDownOutlineRegular, { size: 14, "aria-hidden": "true" })
  ] });
}
var contextHelp = {
  draft: "\u53EA\u53D1\u9001\u5F53\u524D\u8349\u7A3F\uFF0C\u4E0D\u8BFB\u53D6\u5BF9\u8BDD\u3001\u8BB0\u5FC6\u6216\u9879\u76EE\u6587\u4EF6\u3002",
  recent: "\u53C2\u8003\u6700\u8FD1 3 \u8F6E\u5DF2\u5B8C\u6210\u5BF9\u8BDD\uFF0C\u968F\u8349\u7A3F\u53D1\u9001\u7ED9\u589E\u5F3A\u6A21\u578B\u3002",
  extended: "\u53C2\u8003\u5BF9\u8BDD\u3001\u4E2A\u4EBA\u53CA\u540C\u9879\u76EE\u8BB0\u5FC6\u3001\u5F53\u524D\u9879\u76EE\u7247\u6BB5\uFF0C\u5E76\u53D1\u9001\u7ED9\u589E\u5F3A\u6A21\u578B\u3002\u4E0D\u4F1A\u5199\u5165\u8BB0\u5FC6\u3002"
};
function EnhanceSettingsPage({ settings }) {
  const id = (0, import_react.useId)();
  const [draft, setDraft] = (0, import_react.useState)(() => structuredClone(settings.value));
  const baseline = (0, import_react.useRef)(settings.value);
  const [message, setMessage] = (0, import_react.useState)("");
  const [busy, setBusy] = (0, import_react.useState)(null);
  const [, render] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    let mounted = true;
    const stop = settings.subscribe(() => {
      const previous = baseline.current, next = settings.value;
      setDraft((current) => sameSettings(current, previous) ? structuredClone(next) : current);
      baseline.current = next;
      render((n) => n + 1);
    });
    setBusy("refresh");
    void settings.refresh().finally(() => {
      if (mounted) setBusy(null);
    });
    return () => {
      mounted = false;
      stop();
    };
  }, [settings]);
  const update = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setMessage("");
  };
  const models = settings.capabilities.models;
  const selected = models.find((model) => model.provider === draft.dedicated?.provider && model.model === draft.dedicated.model);
  const selectedKey = draft.dedicated ? JSON.stringify([draft.dedicated.provider, draft.dedicated.model]) : "";
  const invalidModel = draft.modelStrategy === "dedicated" && !selected;
  const invalidEffort = draft.modelStrategy === "dedicated" && !!draft.dedicated?.reasoningEffort && !selected?.efforts.includes(draft.dedicated.reasoningEffort);
  const dirty = !sameSettings(draft, settings.value);
  const status = busy === "save" ? "\u6B63\u5728\u4FDD\u5B58\u2026" : busy === "refresh" ? "\u6B63\u5728\u5237\u65B0\u2026" : !settings.ready ? "\u5C1A\u672A\u8BFB\u53D6\u8BBE\u7F6E" : dirty ? "\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539" : "\u8BBE\u7F6E\u5DF2\u4FDD\u5B58";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-prompt-enhance-settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "\u63D0\u793A\u8BCD\u589E\u5F3A" }),
    settings.ready && !settings.capabilities.owner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u4EC5\u5BBF\u4E3B\u6240\u6709\u8005\u53EF\u4EE5\u7BA1\u7406\u8BBE\u7F6E\u548C\u4F7F\u7528\u6269\u5C55\u4E0A\u4E0B\u6587\u3002" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { disabled: busy !== null || !settings.ready, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dsh-prompt-enhance-group", "aria-labelledby": `${id}-preference`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { id: `${id}-preference`, children: "\u589E\u5F3A\u504F\u597D" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-prompt-enhance-choices", role: "group", "aria-label": "\u589E\u5F3A\u65B9\u5F0F", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dsh-prompt-enhance-choice", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "radio", name: `${id}-mode`, value: "moderate", checked: draft.mode === "moderate", onChange: () => update("mode", "moderate") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              "\u9002\u5EA6\u589E\u5F3A",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u7406\u6E05\u8868\u8FBE\uFF0C\u4FDD\u7559\u539F\u610F" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dsh-prompt-enhance-choice", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "radio", name: `${id}-mode`, value: "expanded", checked: draft.mode === "expanded", onChange: () => update("mode", "expanded") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              "\u5145\u5206\u5C55\u5F00",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u8865\u5145\u7ED3\u6784\u4E0E\u5FC5\u8981\u7EC6\u8282" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dsh-prompt-enhance-setting-row", children: [
          "\u589E\u5F3A\u540E",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: draft.adoption, onChange: (event) => update("adoption", event.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "direct", children: "\u76F4\u63A5\u66FF\u6362\u8349\u7A3F" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "preview", children: "\u5148\u9884\u89C8\uFF0C\u518D\u51B3\u5B9A" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: draft.adoption === "direct" ? "\u66FF\u6362\u540E\u53EF\u6062\u590D\u539F\u6587\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u53D1\u9001\u3002" : "\u67E5\u770B\u589E\u5F3A\u7A3F\uFF0C\u786E\u8BA4\u540E\u518D\u66FF\u6362\u5F53\u524D\u8F93\u5165\u3002" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dsh-prompt-enhance-group", "aria-labelledby": `${id}-context`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { id: `${id}-context`, children: "\u53C2\u8003\u8303\u56F4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-prompt-enhance-choices dsh-prompt-enhance-context-choices", role: "group", "aria-label": "\u53C2\u8003\u8303\u56F4", children: [["draft", "\u4EC5\u8349\u7A3F"], ["recent", "\u6700\u8FD1\u5BF9\u8BDD"], ["extended", "\u6269\u5C55\u4E0A\u4E0B\u6587"]].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dsh-prompt-enhance-choice", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "radio", name: `${id}-context`, value, checked: draft.context === value, onChange: () => update("context", value) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })
        ] }, value)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: contextHelp[draft.context] }),
        draft.context === "extended" && !settings.capabilities.memory && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "status", children: "\u8BB0\u5FC6\u670D\u52A1\u5F53\u524D\u4E0D\u53EF\u7528\uFF1B\u589E\u5F3A\u65F6\u4F1A\u663E\u793A\u5B9E\u9645\u7F3A\u5C11\u7684\u6765\u6E90\u3002" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dsh-prompt-enhance-group", "aria-label": "\u589E\u5F3A\u6A21\u578B", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dsh-prompt-enhance-setting-row", children: [
          "\u589E\u5F3A\u6A21\u578B",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: draft.modelStrategy, onChange: (event) => update("modelStrategy", event.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "follow", children: "\u8DDF\u968F\u5F53\u524D\u6A21\u578B" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "dedicated", children: "\u6307\u5B9A\u4E13\u7528\u6A21\u578B" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: draft.modelStrategy === "follow" ? "\u4F7F\u7528\u4F1A\u8BDD\u4E2D\u5DF2\u9009\u62E9\u7684\u6A21\u578B\u4E0E\u63A8\u7406\u6863\u4F4D\u3002" : "\u4ECE\u5BBF\u4E3B\u53EF\u7528\u6A21\u578B\u4E2D\u9009\u62E9\uFF1B\u4E0D\u4F1A\u81EA\u52A8\u6362\u7528\u5176\u4ED6\u6A21\u578B\u3002" }),
        draft.modelStrategy === "dedicated" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-prompt-enhance-model-fields", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
            "\u4E13\u7528\u6A21\u578B",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: selectedKey, "aria-invalid": invalidModel, onChange: (event) => {
              const model = models.find((model2) => JSON.stringify([model2.provider, model2.model]) === event.target.value);
              update("dedicated", model ? { provider: model.provider, model: model.model } : null);
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "\u9009\u62E9\u53EF\u7528\u6A21\u578B" }),
              selectedKey && !selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: selectedKey, children: "\u5DF2\u4FDD\u5B58\u6A21\u578B\u4E0D\u53EF\u7528\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9" }),
              models.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: JSON.stringify([model.provider, model.model]), children: model.label }, JSON.stringify([model.provider, model.model])))
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
            "\u63A8\u7406\u6863\u4F4D",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: draft.dedicated?.reasoningEffort ?? "", disabled: !selected, "aria-invalid": invalidEffort, onChange: (event) => {
              if (draft.dedicated) update("dedicated", { provider: draft.dedicated.provider, model: draft.dedicated.model, ...event.target.value ? { reasoningEffort: event.target.value } : {} });
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "\u6A21\u578B\u9ED8\u8BA4" }),
              selected?.efforts.map((effort) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: effort, children: effort }, effort)),
              draft.dedicated?.reasoningEffort && !selected?.efforts.includes(draft.dedicated.reasoningEffort) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: draft.dedicated.reasoningEffort, children: "\u5DF2\u4FDD\u5B58\u6863\u4F4D\u4E0D\u53EF\u7528" })
            ] })
          ] })
        ] }),
        (invalidModel || invalidEffort) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "dsh-prompt-enhance-warning", role: "alert", children: [
          invalidModel ? "\u4E13\u7528\u6A21\u578B\u4E0D\u53EF\u7528\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u3002" : "\u63A8\u7406\u6863\u4F4D\u4E0D\u53EF\u7528\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u3002",
          "\u4E0D\u4F1A\u81EA\u52A8\u6362\u7528\u5176\u4ED6\u6A21\u578B\u3002"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-prompt-enhance-settings-footer", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { role: "status", className: "dsh-prompt-enhance-save-status", children: status }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "ghost", disabled: !dirty, onClick: () => {
          setDraft(structuredClone(settings.value));
          setMessage("");
        }, children: "\u53D6\u6D88" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "primary", disabled: !dirty || invalidModel || invalidEffort, onClick: () => {
          setBusy("save");
          setMessage("");
          void settings.save(structuredClone(draft)).then(() => setDraft(structuredClone(settings.value))).catch((error) => setMessage(error instanceof Error ? error.message : "\u4FDD\u5B58\u5931\u8D25\u3002")).finally(() => setBusy(null));
        }, children: "\u4FDD\u5B58\u8BBE\u7F6E" })
      ] })
    ] }),
    (message || settings.error) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh-prompt-enhance-warning", role: "alert", children: message || settings.error }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "ghost", disabled: busy !== null, onClick: () => {
      setMessage("");
      setBusy("refresh");
      void settings.refresh().finally(() => setBusy(null));
    }, children: "\u5237\u65B0\u6A21\u578B\u4E0E\u8BBE\u7F6E" })
  ] });
}

// src/client/style.css
var style_default = '.dsh-prompt-enhance {\n  display: inline-flex;\n  align-items: center;\n  gap: 2px;\n  flex: none;\n  white-space: nowrap;\n}\n.dsh-prompt-enhance .dsh-prompt-enhance-trigger {\n  width: 28px;\n  min-width: 28px;\n  padding: 0;\n}\n.dsh-prompt-enhance-trigger[aria-disabled="true"] { opacity: 0.45; }\n.dsh-prompt-enhance-icon { display: block; flex: none; }\n.dsh-prompt-enhance-progress {\n  transform-origin: 12px 12px;\n  animation: dsh-prompt-enhance-spin 1s linear infinite;\n}\n@keyframes dsh-prompt-enhance-spin { to { transform: rotate(360deg); } }\n.dsh-prompt-enhance-sr {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  overflow: hidden;\n  clip-path: inset(50%);\n  white-space: nowrap;\n}\n@media (prefers-reduced-motion: reduce) {\n  .dsh-prompt-enhance-progress { animation: none; }\n}\n.dsh-prompt-enhance-dialog {\n  width: min(720px, 100%);\n  max-height: 100%;\n  color: var(--dsw-alias-label-primary);\n  /* Host layer fills may be translucent: compose them over the opaque base. */\n  background: linear-gradient(var(--dsw-alias-bg-layer-2), var(--dsw-alias-bg-layer-2)), var(--dsw-alias-bg-base);\n}\n.dsh-prompt-enhance-dialog-body { min-height: 0; overflow: auto; white-space: normal; }\n.dsh-prompt-enhance-dialog > :last-child { flex-shrink: 0; }\n.dsh-prompt-enhance-preview-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 12px;\n  margin-bottom: 18px;\n}\n.dsh-prompt-enhance-meta {\n  margin: 0;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 13px;\n  overflow-wrap: anywhere;\n}\n.dsh-prompt-enhance-compare-toggle { display: flex; align-items: center; gap: 6px; white-space: nowrap; }\n.dsh-prompt-enhance-comparison { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 20px; }\n.dsh-prompt-enhance-comparison-solo { grid-template-columns: minmax(0, 1fr); }\n.dsh-prompt-enhance-comparison section { min-width: 0; }\n.dsh-prompt-enhance-comparison h3 { margin: 0 0 14px; font-size: 14px; font-weight: 500; }\n.dsh-prompt-enhance-original { padding-right: 20px; border-right: 1px solid var(--dsw-alias-border-l4); }\n.dsh-prompt-enhance-original .dsh-prompt-enhance-text { color: var(--dsw-alias-label-secondary); }\n.dsh-prompt-enhance-text {\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n  margin: 0;\n  font: inherit;\n  line-height: 1.65;\n  text-align: start;\n}\n.dsh-prompt-enhance-sources { margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--dsw-alias-border-l4); }\n.dsh-prompt-enhance-sources summary { cursor: pointer; color: var(--dsw-alias-label-secondary); font-size: 13px; }\n.dsh-prompt-enhance-source { margin-top: 12px; padding: 12px 14px; background: var(--dsw-alias-bg-layer-1); border-radius: var(--dsw-radius-md); }\n.dsh-prompt-enhance-source h4 { margin: 0 0 8px; font-size: 13px; font-weight: 500; }\n.dsh-prompt-enhance-settings { max-width: 680px; min-width: 0; width: 100%; white-space: normal; }\n.dsh-prompt-enhance-settings fieldset { border: 0; padding: 0; margin: 0; min-width: 0; }\n.dsh-prompt-enhance-settings h2 { margin: 0 0 6px; font-size: 18px; font-weight: 500; }\n.dsh-prompt-enhance-settings h3 { margin: 0 0 12px; font-size: 14px; font-weight: 500; }\n.dsh-prompt-enhance-group { padding: 20px 0; border-top: 1px solid var(--dsw-alias-border-l4); }\n.dsh-prompt-enhance-group:first-child { border-top: 0; }\n.dsh-prompt-enhance-choices { display: flex; gap: 4px; padding: 4px; background: var(--dsw-alias-bg-layer-1); border-radius: var(--dsw-radius-md); }\n.dsh-prompt-enhance-choice { flex: 1; display: flex; align-items: flex-start; min-width: 0; position: relative; cursor: pointer; }\n.dsh-prompt-enhance-choice input { position: absolute; top: 15px; left: 12px; margin: 0; }\n.dsh-prompt-enhance-choice span { box-sizing: border-box; width: 100%; padding: 10px 10px 10px 34px; border: 1px solid transparent; border-radius: var(--dsw-radius-sm); }\n.dsh-prompt-enhance-choice input:checked + span { border-color: var(--dsw-alias-border-l4); background: var(--dsw-alias-bg-layer-2); }\n.dsh-prompt-enhance-choice input:disabled + span { opacity: 0.5; cursor: not-allowed; }\n.dsh-prompt-enhance-choice small { display: block; color: var(--dsw-alias-label-secondary); font-size: 13px; line-height: 1.6; margin-top: 2px; }\n.dsh-prompt-enhance-setting-row { display: grid; grid-template-columns: minmax(80px, 1fr) minmax(0, 1.5fr); align-items: center; gap: 16px; margin-top: 16px; }\n.dsh-prompt-enhance-setting-row:first-child { margin-top: 0; }\n.dsh-prompt-enhance-select { display: block; position: relative; min-width: 0; width: 100%; }\n.dsh-prompt-enhance-settings select {\n  box-sizing: border-box;\n  appearance: none;\n  min-width: 0;\n  width: 100%;\n  border: 1px solid var(--dsw-alias-border-l4);\n  border-radius: var(--dsw-radius-md);\n  padding: 9px 36px 9px 12px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-bg-layer-1);\n  font: inherit;\n  line-height: 22px;\n}\n.dsh-prompt-enhance-select > svg { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; pointer-events: none; color: var(--dsw-alias-label-secondary); }\n.dsh-prompt-enhance-model-fields { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); gap: 12px; margin-top: 16px; }\n.dsh-prompt-enhance-model-fields label { display: grid; gap: 8px; min-width: 0; }\n.dsh-prompt-enhance-settings p { color: var(--dsw-alias-label-secondary); font-size: 13px; line-height: 1.6; margin: 10px 0 0; overflow-wrap: anywhere; }\n.dsh-prompt-enhance-warning { padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l4); border-radius: var(--dsw-radius-sm); overflow-wrap: anywhere; }\n.dsh-prompt-enhance-settings-footer { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 8px; border-top: 1px solid var(--dsw-alias-border-l4); padding: 16px 0; }\n.dsh-prompt-enhance-save-status { margin-right: auto; color: var(--dsw-alias-label-secondary); font-size: 13px; }\n@media (max-width: 650px) {\n  .dsh-prompt-enhance-comparison { grid-template-columns: minmax(0, 1fr); gap: 16px; }\n  .dsh-prompt-enhance-original { padding: 0 0 16px; border-right: 0; border-bottom: 1px solid var(--dsw-alias-border-l4); }\n}\n@media (max-width: 480px) {\n  .dsh-prompt-enhance-setting-row, .dsh-prompt-enhance-model-fields { grid-template-columns: minmax(0, 1fr); gap: 8px; }\n  .dsh-prompt-enhance-context-choices { flex-direction: column; }\n  .dsh-prompt-enhance-save-status { flex-basis: 100%; }\n}\n';

// src/client/index.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var labels = { moderate: "\u9002\u5EA6\u589E\u5F3A", expanded: "\u5145\u5206\u5C55\u5F00" };
var contextLabels = { draft: "\u4EC5\u8349\u7A3F", recent: "\u6700\u8FD1\u5BF9\u8BDD", extended: "\u6269\u5C55\u4E0A\u4E0B\u6587" };
function EnhanceIcon({ pending, restore }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "svg",
    {
      className: "dsh-prompt-enhance-icon",
      width: restore ? 16 : 18,
      height: restore ? 16 : 18,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: restore ? 2 : 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      focusable: "false",
      children: pending ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { className: "dsh-prompt-enhance-progress", cx: "12", cy: "12", r: "9", strokeDasharray: "42 15" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m9 9 6 6m0-6-6 6" })
      ] }) : restore ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M9 14 4 9l5-5" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M9.6 5.4 11.76 10.44 16.8 12.6 11.76 14.76 9.6 19.8 7.44 14.76 2.4 12.6 7.44 10.44Z" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M18 4.2 19.08 6.72 21.6 7.8 19.08 8.88 18 11.4 16.92 8.88 14.4 7.8 16.92 6.72Z" })
      ] })
    }
  );
}
function EnhanceButton({ binding, settings }) {
  const [, render] = (0, import_react2.useReducer)((n) => n + 1, 0);
  const [compareOriginal, setCompareOriginal] = (0, import_react2.useState)(true);
  const [previewSettings, setPreviewSettings] = (0, import_react2.useState)(settings.value);
  const [dismissed, setDismissed] = (0, import_react2.useState)("");
  const controller = (0, import_react2.useMemo)(() => new EnhanceController({ ...binding, changed: render, nonce: () => crypto.randomUUID() }), [binding]);
  (0, import_react2.useLayoutEffect)(() => {
    const unsubscribe = binding.subscribe(() => {
      controller.reconcile();
      render();
    });
    return () => {
      unsubscribe();
      controller.dispose();
    };
  }, [binding, controller]);
  (0, import_react2.useEffect)(() => {
    const stop = settings.subscribe(() => {
      controller.reconcile();
      render();
    });
    void settings.load();
    return stop;
  }, [settings, controller]);
  const reason = binding.reason();
  const mode = settings.value.mode;
  const pending = controller.pending;
  const canUndo = controller.canUndo;
  const selection = controller.preview?.response.selection ?? controller.preview?.snapshot.selection;
  const start = () => {
    if (reason) return;
    const captured = structuredClone(settings.value);
    setDismissed("");
    setCompareOriginal(true);
    setPreviewSettings(captured);
    void controller.start(mode, captured);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh-prompt-enhance", "data-prompt-enhance": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_dsh_client_ui_primitives2.Button,
      {
        variant: "ghost",
        size: "sm",
        type: "button",
        className: "dsh-prompt-enhance-trigger",
        "aria-label": pending ? "\u53D6\u6D88\u63D0\u793A\u8BCD\u589E\u5F3A" : canUndo ? "\u6062\u590D\u539F\u6587" : "\u589E\u5F3A\u63D0\u793A\u8BCD",
        "aria-busy": pending,
        "aria-disabled": !pending && !canUndo && !!reason,
        title: pending ? "\u589E\u5F3A\u4E2D\u2026 \u70B9\u51FB\u53D6\u6D88" : canUndo ? "\u6062\u590D\u539F\u6587" : reason || `\u589E\u5F3A\u63D0\u793A\u8BCD \xB7 ${labels[mode]}`,
        onClick: () => {
          setDismissed("");
          if (pending) controller.cancel();
          else if (canUndo) controller.restore();
          else start();
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(EnhanceIcon, { pending, restore: canUndo })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh-prompt-enhance-sr", role: "status", "aria-live": "polite", children: pending ? "\u589E\u5F3A\u4E2D\u2026" : controller.message }),
    controller.message && dismissed !== controller.message && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_dsh_client_ui_primitives2.Toast,
      {
        text: controller.message,
        holdMs: 4500,
        onDone: () => setDismissed(controller.message)
      },
      controller.message
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_dsh_client_ui_primitives2.Modal,
      {
        open: !!controller.preview,
        onClose: () => controller.closePreview(),
        title: "\u9884\u89C8\u589E\u5F3A",
        closeLabel: "\u4FDD\u7559\u539F\u7A3F\u5E76\u5173\u95ED",
        description: `${labels[previewSettings.mode]} \xB7 ${contextLabels[previewSettings.context]}`,
        className: "dsh-prompt-enhance-dialog",
        contentClassName: "dsh-prompt-enhance-dialog-body",
        footer: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_dsh_client_ui_primitives2.Button, { variant: "ghost", onClick: () => controller.closePreview(), children: "\u4FDD\u7559\u539F\u7A3F" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_dsh_client_ui_primitives2.Button, { variant: "primary", disabled: controller.checkingPreview, onClick: () => {
            setDismissed("");
            void controller.acceptPreview();
          }, children: controller.checkingPreview ? "\u6B63\u5728\u6838\u5BF9\u2026" : "\u66FF\u6362\u8349\u7A3F" })
        ] }),
        children: controller.preview && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh-prompt-enhance-preview-toolbar", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "dsh-prompt-enhance-meta", children: [
              selection?.model,
              selection?.reasoningEffort && ` \xB7 ${selection.reasoningEffort}`,
              " \xB7 ",
              previewSettings.modelStrategy === "follow" ? "\u8DDF\u968F\u5F53\u524D\u6A21\u578B" : "\u4E13\u7528\u6A21\u578B",
              controller.preview.snapshot.attachmentIds.length > 0 && ` \xB7 \u9644\u4EF6\u4FDD\u7559 ${controller.preview.snapshot.attachmentIds.length} \u4E2A`
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "dsh-prompt-enhance-compare-toggle", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { type: "checkbox", checked: compareOriginal, onChange: (event) => setCompareOriginal(event.target.checked) }),
              "\u5BF9\u7167\u539F\u6587"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: `dsh-prompt-enhance-comparison${compareOriginal ? "" : " dsh-prompt-enhance-comparison-solo"}`, children: [
            compareOriginal && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: "dsh-prompt-enhance-original", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h3", { children: "\u539F\u6587" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { className: "dsh-prompt-enhance-text", children: controller.preview.snapshot.draft.text })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h3", { children: "\u589E\u5F3A\u7A3F" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { className: "dsh-prompt-enhance-text", children: controller.preview.draft.text })
            ] })
          ] }),
          controller.preview.response.context?.warnings.map((warning) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh-prompt-enhance-warning", role: "status", children: warning }, warning)),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("details", { className: "dsh-prompt-enhance-sources", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("summary", { children: [
              "\u5B9E\u9645\u53C2\u8003\u6765\u6E90\uFF08",
              controller.preview.response.context?.sources.length ?? 0,
              "\uFF09 \xB7 \u67E5\u770B\u8BE6\u60C5"
            ] }),
            controller.preview.response.context?.sources.map((source, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: "dsh-prompt-enhance-source", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h4", { children: source.label }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { className: "dsh-prompt-enhance-text", children: source.text })
            ] }, index)),
            !controller.preview.response.context?.sources.length && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: "\u672C\u6B21\u672A\u91C7\u7528\u8865\u5145\u4E0A\u4E0B\u6587\u3002" })
          ] })
        ] })
      }
    )
  ] });
}
function createBinding(ctx, sessionId, settings) {
  const session = ctx.sessions.binding(sessionId);
  const input = ctx.conversation.input.for(session.ctx);
  const directory = ctx.modelDirectories.directoryFor(sessionId);
  const blocks = ctx.conversation.blocks.storeFor(sessionId);
  void directory.load().catch(() => {
  });
  const reason = () => {
    const state = input.state.getSnapshot();
    const models = directory.store.getSnapshot();
    const snapshot = session.session.getSnapshot();
    if (ctx.sessions.binding(sessionId) !== session || snapshot.removed || snapshot.openState !== "open") return "\u4F1A\u8BDD\u5C1A\u672A\u5C31\u7EEA";
    if (snapshot.subagent !== null) return "\u8BF7\u5728\u4E3B\u4F1A\u8BDD\u4E2D\u589E\u5F3A\u63D0\u793A\u8BCD";
    if (state.claim || state.phase === "claimed" || /^\s*\/\S/u.test(state.draft)) return "\u547D\u4EE4\u8349\u7A3F\u4E0D\u53C2\u4E0E\u63D0\u793A\u8BCD\u589E\u5F3A";
    if (state.phase !== "plain" || blocks.getSnapshot() || ctx.uiSession.sessionStatus.getSnapshot().get(sessionId)?.pendingInteraction) return "\u5F53\u524D\u8F93\u5165\u6846\u4E0D\u53EF\u7F16\u8F91";
    if (!state.draft.trim()) return "\u5148\u8F93\u5165\u9700\u8981\u589E\u5F3A\u7684\u63D0\u793A\u8BCD";
    if (state.draft.length > DRAFT_CHAR_LIMIT) return `\u8349\u7A3F\u4E0D\u80FD\u8D85\u8FC7 ${DRAFT_CHAR_LIMIT.toLocaleString()} \u5B57\u7B26`;
    if (!settings.ready) return settings.error || "\u6B63\u5728\u8BFB\u53D6\u63D0\u793A\u8BCD\u589E\u5F3A\u8BBE\u7F6E";
    if (settings.value.modelStrategy === "dedicated") {
      const selected = settings.value.dedicated;
      if (!selected || !settings.capabilities.models.some((model) => model.provider === selected.provider && model.model === selected.model && (!selected.reasoningEffort || model.efforts.includes(selected.reasoningEffort)))) return "\u4E13\u7528\u589E\u5F3A\u6A21\u578B\u6216\u63A8\u7406\u6863\u4F4D\u4E0D\u53EF\u7528\uFF0C\u8BF7\u524D\u5F80 DSH \u8BBE\u7F6E \u2192 \u63D0\u793A\u8BCD\u589E\u5F3A";
    } else if (models.status !== "ready" || !models.routable || !models.current) return "\u8BF7\u5148\u9009\u62E9\u53EF\u7528\u6A21\u578B";
    return "";
  };
  return {
    reason,
    read: () => {
      const state = input.state.getSnapshot();
      return {
        sessionId,
        revision: state.draftRev,
        draft: { text: state.draft, references: state.occurrences.map(({ occurrenceId: _id, ...reference }) => ({ ...reference })) },
        attachmentIds: [...state.attachmentIds],
        selection: settings.value.modelStrategy === "dedicated" ? settings.value.dedicated : directory.store.getSnapshot().current,
        available: reason() === ""
      };
    },
    write: (draft) => {
      const writeSemantic = input.setDraft.bind(input);
      writeSemantic(draft);
    },
    enhance: async (request, signal) => {
      const result = await ctx.remote.promptEnhance.enhance(request, signal);
      if (!result.ok) throw new Error(result.error.message);
      return result.value;
    },
    validateSelection: async (selection, signal) => {
      const capabilities = await ctx.remote.promptEnhance.capabilities(signal);
      if (!capabilities.ok) throw new Error(capabilities.error.message);
      if (!capabilities.value.owner) {
        await directory.load();
        return directory.store.getSnapshot().routable === true;
      }
      return capabilities.value.models.some((model) => model.provider === selection.provider && model.model === selection.model && (!selection.reasoningEffort || model.efforts.includes(selection.reasoningEffort)));
    },
    subscribe: (listener) => {
      const dispose = [
        input.state.subscribe(listener),
        directory.store.subscribe(listener),
        session.session.subscribe(listener),
        blocks.subscribe(listener),
        ctx.uiSession.sessionStatus.subscribe(listener)
      ];
      return () => {
        for (const stop of dispose) stop();
      };
    }
  };
}
var inject = ["remote", "slots", "sessions", "conversation", "modelDirectories", "uiSession"];
async function apply(ctx) {
  const unmountRemote = await ctx.remote.$mount(TYPERT_REMOTE);
  const ui = ctx.inject(["remote.promptEnhance", "remote.session", "slots", "sessions", "conversation", "modelDirectories", "uiSession"], (scope) => {
    const settings = new SettingsClient(scope);
    scope.effect(() => () => settings.dispose());
    const style = document.createElement("style");
    style.dataset.dshPlugin = "dsh-prompt-improver";
    style.textContent = style_default;
    document.head.append(style);
    scope.effect(() => () => style.remove());
    scope.slots.inject("conversation.input.right", () => scope.slots.register({
      name: "conversation.input.right",
      id: "dsh-prompt-improver",
      order: 100,
      inject: (sessionId) => ({ binding: createBinding(scope, sessionId, settings), settings })
    }, EnhanceButton));
    scope.slots.inject("settings.section", () => scope.slots.register({
      name: "settings.section",
      id: "dsh-prompt-improver",
      order: 45,
      label: () => "\u63D0\u793A\u8BCD\u589E\u5F3A",
      inject: () => ({ settings })
    }, EnhanceSettingsPage));
  });
  try {
    await ui;
  } catch (error) {
    await ui.dispose();
    await unmountRemote();
    throw error;
  }
  return async () => {
    await ui.dispose();
    await unmountRemote();
  };
}
return module.exports; }});
