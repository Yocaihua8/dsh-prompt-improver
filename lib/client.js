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

// src/client/i18n.ts
var import_react = require("react");

// src/shared/messages.ts
var zh = {
  "m000": "\u8349\u7A3F\u3001\u9644\u4EF6\u3001\u4F1A\u8BDD\u6216\u6A21\u578B\u5DF2\u53D8\u5316\uFF0C\u5DF2\u53D6\u6D88\u589E\u5F3A\u3002",
  "m001": "\u8349\u7A3F\u3001\u9644\u4EF6\u3001\u4F1A\u8BDD\u6216\u6709\u6548\u6A21\u578B\u5DF2\u53D8\u5316\uFF0C\u9884\u89C8\u5DF2\u5931\u6548\u3002",
  "m002": "\u5DF2\u53D6\u6D88\u589E\u5F3A\u3002",
  "m003": "\u8349\u7A3F\u72B6\u6001\u5DF2\u53D8\u5316\uFF0C\u589E\u5F3A\u7ED3\u679C\u672A\u56DE\u586B\u3002",
  "m004": "\u6A21\u578B\u8FD4\u56DE\u4E86\u7A7A\u7ED3\u679C\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002",
  "m005": "\u589E\u5F3A\u5931\u8D25\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002",
  "m006": "\u5DF2\u589E\u5F3A\uFF0C\u8BF7\u68C0\u67E5\u540E\u53D1\u9001\u3002",
  "m007": "\u589E\u5F3A\u6A21\u578B\u5DF2\u4E0D\u53EF\u7528\uFF0C\u9884\u89C8\u672A\u91C7\u7528\u3002",
  "m008": "\u8349\u7A3F\u72B6\u6001\u5DF2\u53D8\u5316\uFF0C\u9884\u89C8\u672A\u91C7\u7528\u3002",
  "m009": "\u9884\u89C8\u672A\u91C7\u7528\u3002",
  "m010": "\u5DF2\u6062\u590D\u539F\u6587\u3002",
  "m011": "\u9002\u5EA6\u589E\u5F3A",
  "m012": "\u5145\u5206\u5C55\u5F00",
  "m013": "\u4EC5\u8349\u7A3F",
  "m014": "\u6700\u8FD1\u5BF9\u8BDD",
  "m015": "\u6269\u5C55\u4E0A\u4E0B\u6587",
  "m016": "\u53D6\u6D88\u63D0\u793A\u8BCD\u589E\u5F3A",
  "m017": "\u6062\u590D\u539F\u6587",
  "m018": "\u589E\u5F3A\u63D0\u793A\u8BCD",
  "m019": "\u589E\u5F3A\u4E2D\u2026 \u70B9\u51FB\u53D6\u6D88",
  "m020": "\u589E\u5F3A\u63D0\u793A\u8BCD \xB7 {p0}",
  "m021": "\u589E\u5F3A\u4E2D\u2026",
  "m022": "\u9884\u89C8\u589E\u5F3A",
  "m023": "\u4FDD\u7559\u539F\u7A3F\u5E76\u5173\u95ED",
  "m024": "\u4FDD\u7559\u539F\u7A3F",
  "m025": "\u6B63\u5728\u6838\u5BF9\u2026",
  "m026": "\u66FF\u6362\u8349\u7A3F",
  "m027": "\u8DDF\u968F\u5F53\u524D\u6A21\u578B",
  "m028": "\u4E13\u7528\u6A21\u578B",
  "m029": " \xB7 \u9644\u4EF6\u4FDD\u7559 {p0} \u4E2A",
  "m030": "\u5BF9\u7167\u539F\u6587",
  "m031": "\u539F\u6587",
  "m032": "\u589E\u5F3A\u7A3F",
  "m033": "\u5B9E\u9645\u53C2\u8003\u6765\u6E90\uFF08",
  "m034": "\uFF09 \xB7 \u67E5\u770B\u8BE6\u60C5",
  "m035": "\u672C\u6B21\u672A\u91C7\u7528\u8865\u5145\u4E0A\u4E0B\u6587\u3002",
  "m036": "\u4F1A\u8BDD\u5C1A\u672A\u5C31\u7EEA",
  "m037": "\u8BF7\u5728\u4E3B\u4F1A\u8BDD\u4E2D\u589E\u5F3A\u63D0\u793A\u8BCD",
  "m038": "\u547D\u4EE4\u8349\u7A3F\u4E0D\u53C2\u4E0E\u63D0\u793A\u8BCD\u589E\u5F3A",
  "m039": "\u5F53\u524D\u8F93\u5165\u6846\u4E0D\u53EF\u7F16\u8F91",
  "m040": "\u5148\u8F93\u5165\u9700\u8981\u589E\u5F3A\u7684\u63D0\u793A\u8BCD",
  "m041": "\u8349\u7A3F\u4E0D\u80FD\u8D85\u8FC7 {p0} \u5B57\u7B26",
  "m042": "\u6B63\u5728\u8BFB\u53D6\u63D0\u793A\u8BCD\u589E\u5F3A\u8BBE\u7F6E",
  "m043": "\u4E13\u7528\u589E\u5F3A\u6A21\u578B\u6216\u63A8\u7406\u6863\u4F4D\u4E0D\u53EF\u7528\uFF0C\u8BF7\u524D\u5F80 DSH \u8BBE\u7F6E \u2192 \u63D0\u793A\u8BCD\u589E\u5F3A",
  "m044": "\u8BF7\u5148\u9009\u62E9\u53EF\u7528\u6A21\u578B",
  "m045": "\u63D0\u793A\u8BCD\u589E\u5F3A",
  "m046": "\u8F93\u5165\u9884\u6D4B\u8D85\u65F6\uFF0C\u672C\u6B21\u672A\u663E\u793A\u5EFA\u8BAE\u3002",
  "m047": "\u9884\u6D4B\u7ED3\u679C\u4E0D\u9002\u5408\u63D2\u5165\u3002",
  "m048": "\u8F93\u5165\u9884\u6D4B\u5931\u8D25\u3002",
  "m049": "Tab \u63A5\u53D7 \xB7 Esc \u9690\u85CF{p0}",
  "m050": "\u8BFB\u53D6\u8BBE\u7F6E\u5931\u8D25\u3002",
  "m051": "\u53EA\u53D1\u9001\u5F53\u524D\u8349\u7A3F\uFF0C\u4E0D\u8BFB\u53D6\u5BF9\u8BDD\u3001\u8BB0\u5FC6\u6216\u9879\u76EE\u6587\u4EF6\u3002",
  "m052": "\u53C2\u8003\u6700\u8FD1 3 \u8F6E\u5DF2\u5B8C\u6210\u5BF9\u8BDD\uFF0C\u968F\u8349\u7A3F\u53D1\u9001\u7ED9\u589E\u5F3A\u6A21\u578B\u3002",
  "m053": "\u53C2\u8003\u5BF9\u8BDD\u3001\u4E2A\u4EBA\u53CA\u540C\u9879\u76EE\u8BB0\u5FC6\u3001\u5F53\u524D\u9879\u76EE\u7247\u6BB5\uFF0C\u5E76\u53D1\u9001\u7ED9\u589E\u5F3A\u6A21\u578B\u3002\u4E0D\u4F1A\u5199\u5165\u8BB0\u5FC6\u3002",
  "m054": "\u6B63\u5728\u4FDD\u5B58\u2026",
  "m055": "\u6B63\u5728\u5237\u65B0\u2026",
  "m056": "\u5C1A\u672A\u8BFB\u53D6\u8BBE\u7F6E",
  "m057": "\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539",
  "m058": "\u8BBE\u7F6E\u5DF2\u4FDD\u5B58",
  "m059": "\u4EC5\u5BBF\u4E3B\u6240\u6709\u8005\u53EF\u4EE5\u7BA1\u7406\u8BBE\u7F6E\u548C\u4F7F\u7528\u6269\u5C55\u4E0A\u4E0B\u6587\u3002",
  "m060": "\u589E\u5F3A\u504F\u597D",
  "m061": "\u589E\u5F3A\u65B9\u5F0F",
  "m062": "\u7406\u6E05\u8868\u8FBE\uFF0C\u4FDD\u7559\u539F\u610F",
  "m063": "\u8865\u5145\u7ED3\u6784\u4E0E\u5FC5\u8981\u7EC6\u8282",
  "m064": "\u589E\u5F3A\u540E",
  "m065": "\u76F4\u63A5\u66FF\u6362\u8349\u7A3F",
  "m066": "\u5148\u9884\u89C8\uFF0C\u518D\u51B3\u5B9A",
  "m067": "\u66FF\u6362\u540E\u53EF\u6062\u590D\u539F\u6587\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u53D1\u9001\u3002",
  "m068": "\u67E5\u770B\u589E\u5F3A\u7A3F\uFF0C\u786E\u8BA4\u540E\u518D\u66FF\u6362\u5F53\u524D\u8F93\u5165\u3002",
  "m069": "\u795E\u79D8\u63D0\u793A\u8BCD\u6CE8\u5165",
  "m070": "\u5728\u589E\u5F3A\u7A3F\u5F00\u5934\u52A0\u5165\u9884\u8BBE\u58F0\u660E\u3002",
  "m071": "\u4EC5\u5728\u5F53\u524D\u4F1A\u8BDD\u9009\u62E9\u6B64\u6A21\u578B\u65F6\u751F\u6548",
  "m072": "\u8F93\u5165\u9884\u6D4B",
  "m073": "\u9884\u6D4B\u4E0B\u4E00\u53E5\u8BDD\uFF0C\u6216\u63A5\u7740\u5F53\u524D\u8349\u7A3F\u7EE7\u7EED\u5199\u3002",
  "m074": "\u9884\u6D4B\u64CD\u4F5C\u8BF4\u660E",
  "m075": "\u63A5\u53D7",
  "m076": "\u9690\u85CF",
  "m077": "\u4E0D\u4F1A\u81EA\u52A8\u53D1\u9001",
  "m078": "\u5F00\u542F\u540E\u5C06\u81EA\u52A8\u8C03\u7528\u589E\u5F3A\u6A21\u578B\uFF0C\u5E76\u4EA7\u751F\u7528\u91CF\u3002",
  "m079": "\u975E\u9879\u76EE\u4F1A\u8BDD\u7684\u4E2A\u4EBA\u8BB0\u5FC6\u5F53\u524D\u4E0D\u53EF\u7528\uFF0C\u8BF7\u66F4\u65B0\u5E76\u542F\u7528\u8BB0\u5FC6\u63D2\u4EF6\uFF1B\u9884\u6D4B\u4ECD\u53EF\u53C2\u8003\u5BF9\u8BDD\u3002",
  "m080": "\u53C2\u8003\u8303\u56F4",
  "m081": "\u8BB0\u5FC6\u670D\u52A1\u5F53\u524D\u4E0D\u53EF\u7528\uFF1B\u589E\u5F3A\u65F6\u4F1A\u663E\u793A\u5B9E\u9645\u7F3A\u5C11\u7684\u6765\u6E90\u3002",
  "m082": "\u589E\u5F3A\u6A21\u578B",
  "m083": "\u6307\u5B9A\u4E13\u7528\u6A21\u578B",
  "m084": "\u4F7F\u7528\u4F1A\u8BDD\u4E2D\u5DF2\u9009\u62E9\u7684\u6A21\u578B\u4E0E\u63A8\u7406\u6863\u4F4D\u3002",
  "m085": "\u4ECE\u5BBF\u4E3B\u53EF\u7528\u6A21\u578B\u4E2D\u9009\u62E9\uFF1B\u4E0D\u4F1A\u81EA\u52A8\u6362\u7528\u5176\u4ED6\u6A21\u578B\u3002",
  "m086": "\u9009\u62E9\u53EF\u7528\u6A21\u578B",
  "m087": "\u5DF2\u4FDD\u5B58\u6A21\u578B\u4E0D\u53EF\u7528\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9",
  "m088": "\u63A8\u7406\u6863\u4F4D",
  "m089": "\u6A21\u578B\u9ED8\u8BA4",
  "m090": "\u5DF2\u4FDD\u5B58\u6863\u4F4D\u4E0D\u53EF\u7528",
  "m091": "\u4E13\u7528\u6A21\u578B\u4E0D\u53EF\u7528\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u3002",
  "m092": "\u63A8\u7406\u6863\u4F4D\u4E0D\u53EF\u7528\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u3002",
  "m093": "\u4E0D\u4F1A\u81EA\u52A8\u6362\u7528\u5176\u4ED6\u6A21\u578B\u3002",
  "m094": "\u53D6\u6D88",
  "m095": "\u4FDD\u5B58\u5931\u8D25\u3002",
  "m096": "\u4FDD\u5B58\u8BBE\u7F6E",
  "m097": "\u5237\u65B0\u6A21\u578B\u4E0E\u8BBE\u7F6E",
  "m098": "\u9879\u76EE",
  "m099": "\u6700\u8FD1\u5BF9\u8BDD\u5DF2\u6309\u5B8C\u6574\u8F6E\u6B21\u53CA\u5B57\u7B26\u9884\u7B97\u88C1\u526A\u3002",
  "m100": "\u7528\u6237",
  "m101": "\u52A9\u624B",
  "m102": "\u4E2A\u4EBA",
  "m103": "\u8BFB\u53D6\u4F1A\u8BDD\u5386\u53F2\u5931\u8D25\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002",
  "m104": "\u6269\u5C55\u4E0A\u4E0B\u6587\u670D\u52A1\u4E0D\u53EF\u7528\u3002",
  "m105": "\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u53EF\u7528\u9879\u76EE\uFF0C\u672A\u8BFB\u53D6\u9879\u76EE\u8BB0\u5FC6\u6216\u9879\u76EE\u6587\u4EF6\u3002",
  "m106": "\u5F53\u524D\u9879\u76EE\u76EE\u5F55\u8BFB\u53D6\u5931\u8D25\uFF0C\u672A\u8BFB\u53D6\u8BB0\u5FC6\u6216\u9879\u76EE\u6587\u4EF6\u3002",
  "m107": "\u8BB0\u5FC6\u670D\u52A1\u4E0D\u53EF\u7528\uFF0C\u672A\u91C7\u7528\u8BB0\u5FC6\u3002",
  "m108": "\u8BB0\u5FC6\u5DF2\u5173\u95ED\uFF0C\u672A\u91C7\u7528\u8BB0\u5FC6\u3002",
  "m109": "\u8BB0\u5FC6\u53EC\u56DE\u8D85\u65F6\uFF0C\u672A\u91C7\u7528\u8BB0\u5FC6\u3002",
  "m110": "\u8BB0\u5FC6\u53EC\u56DE\u5931\u8D25\u6216\u63A5\u53E3\u4E0D\u517C\u5BB9\uFF0C\u672A\u91C7\u7528\u8BB0\u5FC6\u3002",
  "m111": "\u8BF7\u8F93\u5165\u6709\u6548\u8349\u7A3F\uFF08\u6700\u591A {p0} \u5B57\u7B26\uFF09\u5E76\u9009\u62E9\u53EF\u7528\u6A21\u578B\u3002",
  "m112": "\u8349\u7A3F\u5F15\u7528\u6821\u9A8C\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  "m113": "\u63D0\u793A\u8BCD\u589E\u5F3A\u8BBE\u7F6E\u65E0\u6548\u3002",
  "m114": "\u589E\u5F3A\u8D85\u65F6\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002",
  "m115": "\u5F53\u524D\u9009\u62E9\u7684\u6A21\u578B\u4E0D\u662F DeepSeek\uFF0C\u5DF2\u8DF3\u8FC7\u795E\u79D8\u63D0\u793A\u8BCD\u6CE8\u5165\u3002",
  "m116": "\u672A\u80FD\u8BC6\u522B\u5F53\u524D\u9009\u62E9\u7684\u6A21\u578B\uFF0C\u5DF2\u8DF3\u8FC7\u795E\u79D8\u63D0\u793A\u8BCD\u6CE8\u5165\u3002",
  "m117": "\u4E13\u7528\u589E\u5F3A\u6A21\u578B\u5DF2\u4E0D\u53EF\u7528\uFF0C\u8BF7\u5728\u63D0\u793A\u8BCD\u589E\u5F3A\u8BBE\u7F6E\u4E2D\u91CD\u65B0\u9009\u62E9\uFF1B\u672A\u5207\u6362\u6A21\u578B\u3002",
  "m118": "\u6A21\u578B\u54CD\u5E94\u672A\u5B8C\u6574\u7ED3\u675F\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002",
  "m119": "\u6A21\u578B\u8C03\u7528\u5931\u8D25\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002",
  "m120": "\u589E\u5F3A\u7ED3\u679C\u88AB\u622A\u65AD\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002",
  "m121": "\u6A21\u578B\u672A\u8FD4\u56DE\u5B8C\u6574\u63D0\u793A\u8BCD\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002",
  "m122": "\u6A21\u578B\u8FD4\u56DE\u4E86\u5DE5\u5177\u8C03\u7528\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002",
  "m123": "\u589E\u5F3A\u7ED3\u679C\u8FC7\u957F\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002",
  "m124": "\u795E\u79D8\u63D0\u793A\u8BCD\u6CE8\u5165\u672A\u751F\u6548\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\uFF1B\u8BF7\u91CD\u8BD5\u6216\u5173\u95ED\u8BE5\u8BBE\u7F6E\u3002",
  "m125": "\u589E\u5F3A\u7ED3\u679C\u672A\u5B8C\u6574\u4FDD\u7559\u5F15\u7528\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002",
  "m126": "\u589E\u5F3A\u7ED3\u679C\u6539\u53D8\u4E86\u8349\u7A3F\u8BED\u8A00\uFF0C\u5DF2\u4FDD\u7559\u539F\u6587\u3002\u8BF7\u91CD\u8BD5\u6216\u68C0\u67E5\u6A21\u578B\u3002",
  "m127": "\u589E\u5F3A\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6A21\u578B\u53EF\u7528\u6027\u548C\u4F1A\u8BDD\u72B6\u6001\uFF1B\u539F\u6587\u5DF2\u4FDD\u7559\u3002",
  "m128": "\u8F93\u5165\u9884\u6D4B\u8BF7\u6C42\u65E0\u6548\u3002",
  "m129": "\u8F93\u5165\u9884\u6D4B\u8349\u7A3F\u6216\u8BBE\u7F6E\u65E0\u6548\u3002",
  "m130": "\u8F93\u5165\u9884\u6D4B\u5DF2\u5173\u95ED\u3002",
  "m131": "\u8BB0\u5FC6\u670D\u52A1\u4E0D\u53EF\u7528\uFF0C\u672C\u6B21\u9884\u6D4B\u4EC5\u53C2\u8003\u5BF9\u8BDD\u548C\u8349\u7A3F\u3002",
  "m132": "\u9879\u76EE\u76EE\u5F55\u4E0D\u53EF\u7528\uFF0C\u4EC5\u5C1D\u8BD5\u4E2A\u4EBA\u8BB0\u5FC6\u3002",
  "m133": "\u8BB0\u5FC6\u5DF2\u5173\u95ED\uFF0C\u672C\u6B21\u9884\u6D4B\u4EC5\u53C2\u8003\u5BF9\u8BDD\u548C\u8349\u7A3F\u3002",
  "m134": "\u8BB0\u5FC6\u53EC\u56DE\u8D85\u65F6\uFF0C\u672C\u6B21\u9884\u6D4B\u4EC5\u53C2\u8003\u5BF9\u8BDD\u548C\u8349\u7A3F\u3002",
  "m135": "\u8BB0\u5FC6\u53EC\u56DE\u4E0D\u53EF\u7528\uFF0C\u672C\u6B21\u9884\u6D4B\u4EC5\u53C2\u8003\u5BF9\u8BDD\u548C\u8349\u7A3F\u3002",
  "m136": "\u8F93\u5165\u9884\u6D4B\u4EC5\u9002\u7528\u4E8E\u672C\u4EBA\u4E3B\u4F1A\u8BDD\u3002",
  "m137": "\u9884\u6D4B\u4F7F\u7528\u7684\u4E13\u7528\u589E\u5F3A\u6A21\u578B\u4E0D\u53EF\u7528\uFF0C\u8BF7\u68C0\u67E5\u8BBE\u7F6E\u3002",
  "m138": "\u9884\u6D4B\u672A\u5B8C\u6574\u7ED3\u675F\uFF0C\u672A\u91C7\u7528\u5EFA\u8BAE\u3002",
  "m139": "\u6A21\u578B\u672A\u8FD4\u56DE\u6709\u6548\u7EED\u5199\uFF0C\u672C\u6B21\u672A\u663E\u793A\u5EFA\u8BAE\u3002",
  "m140": "\u9884\u6D4B\u7ED3\u679C\u4E0D\u9002\u5408\u63D2\u5165\uFF0C\u672A\u91C7\u7528\u5EFA\u8BAE\u3002",
  "m141": "\u8F93\u5165\u9884\u6D4B\u5DF2\u53D6\u6D88\u3002",
  "m142": "\u8F93\u5165\u9884\u6D4B\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6A21\u578B\u548C\u4F1A\u8BDD\u72B6\u6001\u3002",
  "m143": "\u9879\u76EE\u6587\u4EF6\u5217\u8868\u8D85\u51FA\u68C0\u7D22\u4E0A\u9650\uFF0C\u672A\u91C7\u7528\u4E0D\u5B8C\u6574\u5217\u8868\u3002",
  "m144": "\u9879\u76EE\u68C0\u7D22\u9650\u5B9A\u4E3A\u6309\u8DEF\u5F84\u76F8\u5173\u6027\u6392\u5E8F\u7684\u524D 300 \u4E2A\u6587\u672C\u6587\u4EF6\uFF0C\u7ED3\u679C\u53EF\u80FD\u4E0D\u5B8C\u6574\u3002",
  "m145": "\u90E8\u5206\u9879\u76EE\u6587\u4EF6\u8D85\u8FC7 128 KB\uFF0C\u5DF2\u8DF3\u8FC7\u3002",
  "m146": "\u90E8\u5206\u9879\u76EE\u6587\u4EF6\u8BFB\u53D6\u5931\u8D25\uFF0C\u672A\u7EB3\u5165\u4E0A\u4E0B\u6587\u3002",
  "m147": "\u9879\u76EE\u7247\u6BB5\u5DF2\u6309\u9884\u7B97\u622A\u65AD\u3002",
  "m148": "\u9879\u76EE\u68C0\u7D22\u4EC5\u91C7\u7528\u76F8\u5173\u6027\u6700\u9AD8\u7684\u81F3\u591A 5 \u4E2A\u6587\u4EF6\u7247\u6BB5\u3002",
  "m149": "\u9879\u76EE\u68C0\u7D22\u8D85\u65F6\uFF0C\u672A\u91C7\u7528\u9879\u76EE\u7247\u6BB5\u3002",
  "m150": "\u9879\u76EE\u68C0\u7D22\u5931\u8D25\uFF0C\u672A\u91C7\u7528\u9879\u76EE\u7247\u6BB5\u3002",
  "m151": "\u8BFB\u53D6\u63D0\u793A\u8BCD\u589E\u5F3A\u8BBE\u7F6E\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u8BBE\u7F6E\u6587\u4EF6\uFF1B\u672A\u8986\u76D6\u539F\u6587\u4EF6\u3002",
  "m152": "\u8BBE\u7F6E\u7BA1\u7406\u548C\u6269\u5C55\u4E0A\u4E0B\u6587\u4EC5\u5141\u8BB8\u5BBF\u4E3B\u6240\u6709\u8005\u4F7F\u7528\u3002",
  "m153": "\u9884\u6D4B\u8BBE\u7F6E\u5DF2\u53D8\u5316\uFF0C\u8BF7\u5237\u65B0\u8BBE\u7F6E\u3002",
  "m154": "\u9884\u6D4B\u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41\uFF0C\u672C\u6B21\u5DF2\u8DF3\u8FC7\u3002",
  "m155": "\u8F93\u5165\u9884\u6D4B\u5931\u8D25\uFF0C\u672C\u6B21\u672A\u663E\u793A\u5EFA\u8BAE\u3002",
  "m156": "\u8BBE\u7F6E\u8BFB\u53D6\u5931\u8D25\uFF0C\u672A\u8986\u76D6\u539F\u8BBE\u7F6E\u3002",
  "m157": "\u8BBE\u7F6E\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u9009\u9879\u540E\u91CD\u8BD5\u3002",
  "m158": "\u65E0\u6548\u7684\u5F15\u7528\u4FDD\u62A4\u6807\u8BC6\u3002",
  "m159": "\u5F15\u7528\u4FDD\u62A4\u6807\u8BC6\u4E0E\u539F\u6587\u51B2\u7A81\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  "m160": "\u8349\u7A3F\u5F15\u7528\u72B6\u6001\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  "m161": "\u63D0\u793A\u8BCD\u589E\u5F3A\u8BBE\u7F6E\u65E0\u6548\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u3002",
  "m162": "\u5916\u90E8\u670D\u52A1\u8FD4\u56DE\u9519\u8BEF\u3002\u539F\u59CB\u8BE6\u60C5\uFF1A{p0}"
};
var en = {
  "m000": "The draft, attachments, conversation, or model changed. Enhancement cancelled.",
  "m001": "The draft, attachments, conversation, or effective model changed. This preview is no longer valid.",
  "m002": "Enhancement cancelled.",
  "m003": "The draft changed. The enhanced text was not inserted.",
  "m004": "The model returned no text. Your original draft is unchanged.",
  "m005": "Enhancement failed. Your original draft is unchanged.",
  "m006": "Draft enhanced. Review it before sending.",
  "m007": "The enhancement model is unavailable. The preview was not applied.",
  "m008": "The draft changed. The preview was not applied.",
  "m009": "Preview not applied.",
  "m010": "Original draft restored.",
  "m011": "Refine",
  "m012": "Expand",
  "m013": "Draft only",
  "m014": "Recent conversation",
  "m015": "Extended context",
  "m016": "Cancel prompt enhancement",
  "m017": "Restore original",
  "m018": "Enhance prompt",
  "m019": "Enhancing\u2026 Click to cancel",
  "m020": "Enhance prompt \xB7 {p0}",
  "m021": "Enhancing\u2026",
  "m022": "Enhancement preview",
  "m023": "Keep original draft and close",
  "m024": "Keep original",
  "m025": "Checking\u2026",
  "m026": "Replace draft",
  "m027": "Use current model",
  "m028": "Dedicated model",
  "m029": " \xB7 Attachments retained: {p0}",
  "m030": "Compare with original",
  "m031": "Original",
  "m032": "Enhanced draft",
  "m033": "Sources used (",
  "m034": ") \xB7 View details",
  "m035": "No additional context was used.",
  "m036": "Conversation is not ready",
  "m037": "Enhance prompts in the main conversation",
  "m038": "Command drafts cannot be enhanced",
  "m039": "The input is not editable right now",
  "m040": "Enter a prompt to enhance first",
  "m041": "Drafts cannot exceed {p0} characters",
  "m042": "Loading prompt enhancement settings",
  "m043": "The dedicated model or reasoning level is unavailable. Open DSH Settings \u2192 Prompt Enhance",
  "m044": "Select an available model first",
  "m045": "Prompt Enhance",
  "m046": "Prediction timed out. No suggestion was shown.",
  "m047": "This prediction cannot be inserted.",
  "m048": "Prediction failed.",
  "m049": "Tab to accept \xB7 Esc to dismiss{p0}",
  "m050": "Could not load settings.",
  "m051": "Sends only the current draft, without reading conversations, memory, or project files.",
  "m052": "Sends the last 3 completed conversation turns with your draft to the enhancement model.",
  "m053": "Sends conversation context, personal and current-project memory, and project excerpts to the enhancement model. Does not write to memory.",
  "m054": "Saving\u2026",
  "m055": "Refreshing\u2026",
  "m056": "Settings have not loaded",
  "m057": "Unsaved changes",
  "m058": "Settings saved",
  "m059": "Only the host owner can manage settings and use extended context.",
  "m060": "Enhancement preferences",
  "m061": "Enhancement style",
  "m062": "Clarify wording while preserving intent",
  "m063": "Add structure and necessary detail",
  "m064": "After enhancement",
  "m065": "Replace draft directly",
  "m066": "Preview first",
  "m067": "You can restore the original after replacing it. Nothing is sent automatically.",
  "m068": "Review the enhanced draft before replacing your input.",
  "m069": "Mystery prompt injection",
  "m070": "Add a preset statement at the start of the enhanced draft.",
  "m071": "Applies only when this model is selected in the current conversation",
  "m072": "Input prediction",
  "m073": "Suggest your next message or continue your current draft.",
  "m074": "Prediction keyboard shortcuts",
  "m075": "Accept",
  "m076": "Dismiss",
  "m077": "Never sends automatically",
  "m078": "When enabled, prediction calls the enhancement model automatically and incurs usage.",
  "m079": "Personal memory is unavailable outside projects. Update and enable the memory plugin; prediction can still use the conversation.",
  "m080": "Context scope",
  "m081": "Memory is currently unavailable. Enhancement will indicate which sources are missing.",
  "m082": "Enhancement model",
  "m083": "Use a dedicated model",
  "m084": "Use the model and reasoning level selected in this conversation.",
  "m085": "Choose from the host\u2019s available models. No automatic fallback to another model.",
  "m086": "Select an available model",
  "m087": "The saved model is unavailable. Select another",
  "m088": "Reasoning level",
  "m089": "Model default",
  "m090": "The saved reasoning level is unavailable",
  "m091": "The dedicated model is unavailable. Select another.",
  "m092": "The reasoning level is unavailable. Select another.",
  "m093": "No automatic fallback to another model.",
  "m094": "Cancel",
  "m095": "Could not save settings.",
  "m096": "Save settings",
  "m097": "Refresh models and settings",
  "m098": "Project",
  "m099": "Recent conversation was trimmed by complete turns and the character budget.",
  "m100": "User",
  "m101": "Assistant",
  "m102": "Personal",
  "m103": "Could not read conversation history. Your original draft is unchanged.",
  "m104": "Extended context is unavailable.",
  "m105": "This conversation has no available project. Project memory and files were not read.",
  "m106": "Could not read the project directory. Memory and project files were not read.",
  "m107": "Memory is unavailable and was not used.",
  "m108": "Memory is disabled and was not used.",
  "m109": "Memory recall timed out. Memory was not used.",
  "m110": "Memory recall failed or is incompatible. Memory was not used.",
  "m111": "Enter a valid draft (up to {p0} characters) and select an available model.",
  "m112": "Draft reference validation failed. Try again.",
  "m113": "Prompt enhancement settings are invalid.",
  "m114": "Enhancement timed out. Your original draft is unchanged.",
  "m115": "The selected model is not DeepSeek. Mystery prompt injection was skipped.",
  "m116": "The selected model could not be identified. Mystery prompt injection was skipped.",
  "m117": "The dedicated enhancement model is unavailable. Select it again in Prompt Enhance settings. The model was not changed.",
  "m118": "The model response did not finish. Your original draft is unchanged.",
  "m119": "The model call failed. Your original draft is unchanged.",
  "m120": "The enhanced result was truncated. Your original draft is unchanged.",
  "m121": "The model did not return a complete prompt. Your original draft is unchanged.",
  "m122": "The model returned a tool call. Your original draft is unchanged.",
  "m123": "The enhanced result is too long. Your original draft is unchanged.",
  "m124": "Mystery prompt injection did not take effect. Your original draft is unchanged. Try again or disable the setting.",
  "m125": "The enhanced result did not preserve all references. Your original draft is unchanged.",
  "m126": "The enhanced result changed the draft language. Your original draft is unchanged. Try again or check the model.",
  "m127": "Enhancement failed. Check the model and conversation status. Your original draft is unchanged.",
  "m128": "The prediction request is invalid.",
  "m129": "The prediction draft or settings are invalid.",
  "m130": "Input prediction is disabled.",
  "m131": "Memory is unavailable. This prediction uses only the conversation and draft.",
  "m132": "The project directory is unavailable. Only personal memory will be requested.",
  "m133": "Memory is disabled. This prediction uses only the conversation and draft.",
  "m134": "Memory recall timed out. This prediction uses only the conversation and draft.",
  "m135": "Memory recall is unavailable. This prediction uses only the conversation and draft.",
  "m136": "Input prediction is available only in your own main conversations.",
  "m137": "The dedicated model used for prediction is unavailable. Check the settings.",
  "m138": "Prediction did not finish. No suggestion was applied.",
  "m139": "The model returned no valid continuation. No suggestion was shown.",
  "m140": "The prediction cannot be inserted. No suggestion was applied.",
  "m141": "Prediction cancelled.",
  "m142": "Prediction failed. Check the model and conversation status.",
  "m143": "The project file list exceeds the search limit. The incomplete list was not used.",
  "m144": "Project search is limited to the first 300 text files ranked by path relevance. Results may be incomplete.",
  "m145": "Some project files exceed 128 KB and were skipped.",
  "m146": "Some project files could not be read and were excluded from context.",
  "m147": "Project excerpts were trimmed to fit the budget.",
  "m148": "Project search uses up to 5 of the most relevant file excerpts.",
  "m149": "Project search timed out. Project excerpts were not used.",
  "m150": "Project search failed. Project excerpts were not used.",
  "m151": "Could not read Prompt Enhance settings. Check the settings file; the original file was preserved.",
  "m152": "Only the host owner can manage settings and use extended context.",
  "m153": "Prediction settings changed. Refresh the settings.",
  "m154": "Prediction requests are too frequent. This request was skipped.",
  "m155": "Prediction failed. No suggestion was shown.",
  "m156": "Could not read settings. Existing settings were preserved.",
  "m157": "Could not save settings. Check the options and try again.",
  "m158": "Invalid protected reference identifier.",
  "m159": "A protected reference identifier conflicts with the original text. Try again.",
  "m160": "Draft references changed. Try again.",
  "m161": "Prompt Enhance settings are invalid. Select the options again.",
  "m162": "An external service returned an error. Original details: {p0}"
};
function interpolate(template, params = {}) {
  return template.replace(/\{(\w+)\}/g, (token, key) => String(params[key] ?? token));
}
function m(key, ...[params]) {
  return interpolate(zh[key], params);
}
var patterns = Object.entries(zh).flatMap(([key, original]) => [original, en[key]].map((template) => ({ key, template }))).filter(({ template }) => template.replace(/\{\w+\}/g, "").trim()).map(({ key, template }) => {
  const names = [...template.matchAll(/\{(\w+)\}/g)].map((match) => match[1]);
  const escaped = template.replace(/[.*+?^$()|[\]\\]/g, "\\$&").replace(/\{\w+\}/g, "([\\s\\S]*?)");
  return { key, names, pattern: new RegExp("^" + escaped + "$") };
}).sort((a, b) => a.names.length - b.names.length);
function describeMessage(message) {
  for (const { key, names, pattern } of patterns) {
    const match = pattern.exec(message);
    if (match) return { messageKey: key, ...names.length ? { messageParams: Object.fromEntries(names.map((name, i) => [name, match[i + 1]])) } : {} };
  }
  return void 0;
}

// src/client/i18n.ts
var runtime;
var translate;
var fallback = "zh";
var listeners = /* @__PURE__ */ new Set();
var notify = () => {
  for (const listener of listeners) listener();
};
var subscribeLocale = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
var localeId = () => runtime?.getSnapshot().active ?? fallback;
function useLocale() {
  return (0, import_react.useSyncExternalStore)(subscribeLocale, localeId, localeId);
}
function installLocale(ctx) {
  const dispose = ctx.locale.register("dsh-prompt-improver", { zh, en });
  runtime = ctx.locale;
  translate = ctx.locale.bind("dsh-prompt-improver");
  const stop = runtime.subscribe(notify);
  ctx.effect(() => () => {
    stop();
    dispose();
    if (runtime === ctx.locale) {
      runtime = void 0;
      translate = void 0;
    }
    ;
    notify();
  });
}
function t(key, ...[params]) {
  let value = translate ? translate(key, params) : interpolate(localeId().startsWith("zh") ? zh[key] : en[key], params);
  if (!localeId().startsWith("zh") && params && Number(String(params.p0).replaceAll(",", "")) === 1) value = value.replace(/\b(model calls|calls|tools|items|conversations|days)\b/, (word) => word.slice(0, -1));
  return value;
}
function localize(message, descriptor, depth = 0) {
  const info = descriptor ?? describeMessage(message) ?? describeMessage(message.trim());
  if (!info || !(info.messageKey in zh)) return message;
  const params = Object.fromEntries(Object.entries(info.messageParams ?? {}).map(([key, value]) => [key, depth < 3 && typeof value === "string" ? localize(value, void 0, depth + 1) : value]));
  const result = t(info.messageKey, params);
  return message !== message.trim() ? message.match(/^\s*/)?.[0] + result + (message.match(/\s*$/)?.[0] ?? "") : result;
}
function diagnostic(message, descriptor) {
  if (!message) return "";
  return descriptor || describeMessage(message) ? localize(message, descriptor) : t("m162", { p0: message });
}
function sourceLabel(source) {
  if (source.labelMessage) return localize(source.label, source.labelMessage);
  if (source.kind === "conversation") return source.label.replace(/ · (用户|助手)$/, (_, role) => " \xB7 " + localize(role));
  if (source.kind === "memory") return source.label.replace(/^(个人|项目) · /, (_, scope) => localize(scope) + " \xB7 ");
  return source.label;
}

// src/client/index.tsx
var import_react4 = require("react");
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
  "personalMemory": import_zod.z.union([import_zod.z.undefined(), import_zod.z.literal(false), import_zod.z.literal(true)]).optional(),
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
    })]),
    "mystery": import_zod.z.boolean().describe("Prepend the capability declaration when the composer model is DeepSeek."),
    "predictionEnabled": import_zod.z.union([import_zod.z.undefined(), import_zod.z.literal(false), import_zod.z.literal(true)]).optional().describe("Missing in older clients/settings; normalized to false.")
  })]).optional().describe("Immutable settings captured by the client at click time."),
  "currentSelection": import_zod.z.union([import_zod.z.undefined(), import_zod.z.literal(null), import_zod.z.object({
    "provider": import_zod.z.string(),
    "model": import_zod.z.string(),
    "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
  })]).optional().describe("Composer model at click time; gates the mystery injection independently of `selection`.")
});
var dsh_prompt_improver_promptEnhance_enhance_result$schema$value;
var dsh_prompt_improver_promptEnhance_enhance_result$schema = () => dsh_prompt_improver_promptEnhance_enhance_result$schema$value ??= import_zod.z.object({
  "text": import_zod.z.string(),
  "context": import_zod.z.union([import_zod.z.undefined(), import_zod.z.object({
    "sources": import_zod.z.array(import_zod.z.object({
      "kind": import_zod.z.union([import_zod.z.literal("conversation"), import_zod.z.literal("memory"), import_zod.z.literal("project")]),
      "label": import_zod.z.string(),
      "text": import_zod.z.string(),
      "labelMessage": import_zod.z.union([import_zod.z.undefined(), import_zod.z.object({
        "messageKey": import_zod.z.union([import_zod.z.literal("m000"), import_zod.z.literal("m001"), import_zod.z.literal("m002"), import_zod.z.literal("m003"), import_zod.z.literal("m004"), import_zod.z.literal("m005"), import_zod.z.literal("m006"), import_zod.z.literal("m007"), import_zod.z.literal("m008"), import_zod.z.literal("m009"), import_zod.z.literal("m010"), import_zod.z.literal("m011"), import_zod.z.literal("m012"), import_zod.z.literal("m013"), import_zod.z.literal("m014"), import_zod.z.literal("m015"), import_zod.z.literal("m016"), import_zod.z.literal("m017"), import_zod.z.literal("m018"), import_zod.z.literal("m019"), import_zod.z.literal("m020"), import_zod.z.literal("m021"), import_zod.z.literal("m022"), import_zod.z.literal("m023"), import_zod.z.literal("m024"), import_zod.z.literal("m025"), import_zod.z.literal("m026"), import_zod.z.literal("m027"), import_zod.z.literal("m028"), import_zod.z.literal("m029"), import_zod.z.literal("m030"), import_zod.z.literal("m031"), import_zod.z.literal("m032"), import_zod.z.literal("m033"), import_zod.z.literal("m034"), import_zod.z.literal("m035"), import_zod.z.literal("m036"), import_zod.z.literal("m037"), import_zod.z.literal("m038"), import_zod.z.literal("m039"), import_zod.z.literal("m040"), import_zod.z.literal("m041"), import_zod.z.literal("m042"), import_zod.z.literal("m043"), import_zod.z.literal("m044"), import_zod.z.literal("m045"), import_zod.z.literal("m046"), import_zod.z.literal("m047"), import_zod.z.literal("m048"), import_zod.z.literal("m049"), import_zod.z.literal("m050"), import_zod.z.literal("m051"), import_zod.z.literal("m052"), import_zod.z.literal("m053"), import_zod.z.literal("m054"), import_zod.z.literal("m055"), import_zod.z.literal("m056"), import_zod.z.literal("m057"), import_zod.z.literal("m058"), import_zod.z.literal("m059"), import_zod.z.literal("m060"), import_zod.z.literal("m061"), import_zod.z.literal("m062"), import_zod.z.literal("m063"), import_zod.z.literal("m064"), import_zod.z.literal("m065"), import_zod.z.literal("m066"), import_zod.z.literal("m067"), import_zod.z.literal("m068"), import_zod.z.literal("m069"), import_zod.z.literal("m070"), import_zod.z.literal("m071"), import_zod.z.literal("m072"), import_zod.z.literal("m073"), import_zod.z.literal("m074"), import_zod.z.literal("m075"), import_zod.z.literal("m076"), import_zod.z.literal("m077"), import_zod.z.literal("m078"), import_zod.z.literal("m079"), import_zod.z.literal("m080"), import_zod.z.literal("m081"), import_zod.z.literal("m082"), import_zod.z.literal("m083"), import_zod.z.literal("m084"), import_zod.z.literal("m085"), import_zod.z.literal("m086"), import_zod.z.literal("m087"), import_zod.z.literal("m088"), import_zod.z.literal("m089"), import_zod.z.literal("m090"), import_zod.z.literal("m091"), import_zod.z.literal("m092"), import_zod.z.literal("m093"), import_zod.z.literal("m094"), import_zod.z.literal("m095"), import_zod.z.literal("m096"), import_zod.z.literal("m097"), import_zod.z.literal("m098"), import_zod.z.literal("m099"), import_zod.z.literal("m100"), import_zod.z.literal("m101"), import_zod.z.literal("m102"), import_zod.z.literal("m103"), import_zod.z.literal("m104"), import_zod.z.literal("m105"), import_zod.z.literal("m106"), import_zod.z.literal("m107"), import_zod.z.literal("m108"), import_zod.z.literal("m109"), import_zod.z.literal("m110"), import_zod.z.literal("m111"), import_zod.z.literal("m112"), import_zod.z.literal("m113"), import_zod.z.literal("m114"), import_zod.z.literal("m115"), import_zod.z.literal("m116"), import_zod.z.literal("m117"), import_zod.z.literal("m118"), import_zod.z.literal("m119"), import_zod.z.literal("m120"), import_zod.z.literal("m121"), import_zod.z.literal("m122"), import_zod.z.literal("m123"), import_zod.z.literal("m124"), import_zod.z.literal("m125"), import_zod.z.literal("m126"), import_zod.z.literal("m127"), import_zod.z.literal("m128"), import_zod.z.literal("m129"), import_zod.z.literal("m130"), import_zod.z.literal("m131"), import_zod.z.literal("m132"), import_zod.z.literal("m133"), import_zod.z.literal("m134"), import_zod.z.literal("m135"), import_zod.z.literal("m136"), import_zod.z.literal("m137"), import_zod.z.literal("m138"), import_zod.z.literal("m139"), import_zod.z.literal("m140"), import_zod.z.literal("m141"), import_zod.z.literal("m142"), import_zod.z.literal("m143"), import_zod.z.literal("m144"), import_zod.z.literal("m145"), import_zod.z.literal("m146"), import_zod.z.literal("m147"), import_zod.z.literal("m148"), import_zod.z.literal("m149"), import_zod.z.literal("m150"), import_zod.z.literal("m151"), import_zod.z.literal("m152"), import_zod.z.literal("m153"), import_zod.z.literal("m154"), import_zod.z.literal("m155"), import_zod.z.literal("m156"), import_zod.z.literal("m157"), import_zod.z.literal("m158"), import_zod.z.literal("m159"), import_zod.z.literal("m160"), import_zod.z.literal("m161"), import_zod.z.literal("m162")]),
        "messageParams": import_zod.z.union([import_zod.z.undefined(), import_zod.z.record(import_zod.z.string(), import_zod.z.union([import_zod.z.string(), import_zod.z.number()]))]).optional()
      })]).optional()
    })),
    "warnings": import_zod.z.array(import_zod.z.string()),
    "warningMessages": import_zod.z.union([import_zod.z.undefined(), import_zod.z.array(import_zod.z.union([import_zod.z.literal(null), import_zod.z.object({
      "messageKey": import_zod.z.union([import_zod.z.literal("m000"), import_zod.z.literal("m001"), import_zod.z.literal("m002"), import_zod.z.literal("m003"), import_zod.z.literal("m004"), import_zod.z.literal("m005"), import_zod.z.literal("m006"), import_zod.z.literal("m007"), import_zod.z.literal("m008"), import_zod.z.literal("m009"), import_zod.z.literal("m010"), import_zod.z.literal("m011"), import_zod.z.literal("m012"), import_zod.z.literal("m013"), import_zod.z.literal("m014"), import_zod.z.literal("m015"), import_zod.z.literal("m016"), import_zod.z.literal("m017"), import_zod.z.literal("m018"), import_zod.z.literal("m019"), import_zod.z.literal("m020"), import_zod.z.literal("m021"), import_zod.z.literal("m022"), import_zod.z.literal("m023"), import_zod.z.literal("m024"), import_zod.z.literal("m025"), import_zod.z.literal("m026"), import_zod.z.literal("m027"), import_zod.z.literal("m028"), import_zod.z.literal("m029"), import_zod.z.literal("m030"), import_zod.z.literal("m031"), import_zod.z.literal("m032"), import_zod.z.literal("m033"), import_zod.z.literal("m034"), import_zod.z.literal("m035"), import_zod.z.literal("m036"), import_zod.z.literal("m037"), import_zod.z.literal("m038"), import_zod.z.literal("m039"), import_zod.z.literal("m040"), import_zod.z.literal("m041"), import_zod.z.literal("m042"), import_zod.z.literal("m043"), import_zod.z.literal("m044"), import_zod.z.literal("m045"), import_zod.z.literal("m046"), import_zod.z.literal("m047"), import_zod.z.literal("m048"), import_zod.z.literal("m049"), import_zod.z.literal("m050"), import_zod.z.literal("m051"), import_zod.z.literal("m052"), import_zod.z.literal("m053"), import_zod.z.literal("m054"), import_zod.z.literal("m055"), import_zod.z.literal("m056"), import_zod.z.literal("m057"), import_zod.z.literal("m058"), import_zod.z.literal("m059"), import_zod.z.literal("m060"), import_zod.z.literal("m061"), import_zod.z.literal("m062"), import_zod.z.literal("m063"), import_zod.z.literal("m064"), import_zod.z.literal("m065"), import_zod.z.literal("m066"), import_zod.z.literal("m067"), import_zod.z.literal("m068"), import_zod.z.literal("m069"), import_zod.z.literal("m070"), import_zod.z.literal("m071"), import_zod.z.literal("m072"), import_zod.z.literal("m073"), import_zod.z.literal("m074"), import_zod.z.literal("m075"), import_zod.z.literal("m076"), import_zod.z.literal("m077"), import_zod.z.literal("m078"), import_zod.z.literal("m079"), import_zod.z.literal("m080"), import_zod.z.literal("m081"), import_zod.z.literal("m082"), import_zod.z.literal("m083"), import_zod.z.literal("m084"), import_zod.z.literal("m085"), import_zod.z.literal("m086"), import_zod.z.literal("m087"), import_zod.z.literal("m088"), import_zod.z.literal("m089"), import_zod.z.literal("m090"), import_zod.z.literal("m091"), import_zod.z.literal("m092"), import_zod.z.literal("m093"), import_zod.z.literal("m094"), import_zod.z.literal("m095"), import_zod.z.literal("m096"), import_zod.z.literal("m097"), import_zod.z.literal("m098"), import_zod.z.literal("m099"), import_zod.z.literal("m100"), import_zod.z.literal("m101"), import_zod.z.literal("m102"), import_zod.z.literal("m103"), import_zod.z.literal("m104"), import_zod.z.literal("m105"), import_zod.z.literal("m106"), import_zod.z.literal("m107"), import_zod.z.literal("m108"), import_zod.z.literal("m109"), import_zod.z.literal("m110"), import_zod.z.literal("m111"), import_zod.z.literal("m112"), import_zod.z.literal("m113"), import_zod.z.literal("m114"), import_zod.z.literal("m115"), import_zod.z.literal("m116"), import_zod.z.literal("m117"), import_zod.z.literal("m118"), import_zod.z.literal("m119"), import_zod.z.literal("m120"), import_zod.z.literal("m121"), import_zod.z.literal("m122"), import_zod.z.literal("m123"), import_zod.z.literal("m124"), import_zod.z.literal("m125"), import_zod.z.literal("m126"), import_zod.z.literal("m127"), import_zod.z.literal("m128"), import_zod.z.literal("m129"), import_zod.z.literal("m130"), import_zod.z.literal("m131"), import_zod.z.literal("m132"), import_zod.z.literal("m133"), import_zod.z.literal("m134"), import_zod.z.literal("m135"), import_zod.z.literal("m136"), import_zod.z.literal("m137"), import_zod.z.literal("m138"), import_zod.z.literal("m139"), import_zod.z.literal("m140"), import_zod.z.literal("m141"), import_zod.z.literal("m142"), import_zod.z.literal("m143"), import_zod.z.literal("m144"), import_zod.z.literal("m145"), import_zod.z.literal("m146"), import_zod.z.literal("m147"), import_zod.z.literal("m148"), import_zod.z.literal("m149"), import_zod.z.literal("m150"), import_zod.z.literal("m151"), import_zod.z.literal("m152"), import_zod.z.literal("m153"), import_zod.z.literal("m154"), import_zod.z.literal("m155"), import_zod.z.literal("m156"), import_zod.z.literal("m157"), import_zod.z.literal("m158"), import_zod.z.literal("m159"), import_zod.z.literal("m160"), import_zod.z.literal("m161"), import_zod.z.literal("m162")]),
      "messageParams": import_zod.z.union([import_zod.z.undefined(), import_zod.z.record(import_zod.z.string(), import_zod.z.union([import_zod.z.string(), import_zod.z.number()]))]).optional()
    })]))]).optional()
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
  })]),
  "mystery": import_zod.z.boolean().describe("Prepend the capability declaration when the composer model is DeepSeek."),
  "predictionEnabled": import_zod.z.union([import_zod.z.undefined(), import_zod.z.literal(false), import_zod.z.literal(true)]).optional().describe("Missing in older clients/settings; normalized to false.")
});
var dsh_prompt_improver_promptEnhance_predict_parameter_0$schema$value;
var dsh_prompt_improver_promptEnhance_predict_parameter_0$schema = () => dsh_prompt_improver_promptEnhance_predict_parameter_0$schema$value ??= import_zod.z.object({
  "sessionId": import_zod.z.string(),
  "draft": import_zod.z.string(),
  "protectedTokens": import_zod.z.array(import_zod.z.string()),
  "selection": import_zod.z.object({
    "provider": import_zod.z.string(),
    "model": import_zod.z.string(),
    "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
  }),
  "settings": import_zod.z.object({
    "mode": import_zod.z.union([import_zod.z.literal("moderate"), import_zod.z.literal("expanded")]),
    "adoption": import_zod.z.union([import_zod.z.literal("direct"), import_zod.z.literal("preview")]),
    "context": import_zod.z.union([import_zod.z.literal("draft"), import_zod.z.literal("recent"), import_zod.z.literal("extended")]),
    "modelStrategy": import_zod.z.union([import_zod.z.literal("follow"), import_zod.z.literal("dedicated")]),
    "dedicated": import_zod.z.union([import_zod.z.literal(null), import_zod.z.object({
      "provider": import_zod.z.string(),
      "model": import_zod.z.string(),
      "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
    })]),
    "mystery": import_zod.z.boolean().describe("Prepend the capability declaration when the composer model is DeepSeek."),
    "predictionEnabled": import_zod.z.union([import_zod.z.undefined(), import_zod.z.literal(false), import_zod.z.literal(true)]).optional().describe("Missing in older clients/settings; normalized to false.")
  })
});
var dsh_prompt_improver_promptEnhance_predict_result$schema$value;
var dsh_prompt_improver_promptEnhance_predict_result$schema = () => dsh_prompt_improver_promptEnhance_predict_result$schema$value ??= import_zod.z.object({
  "text": import_zod.z.string(),
  "context": import_zod.z.union([import_zod.z.undefined(), import_zod.z.object({
    "sources": import_zod.z.array(import_zod.z.object({
      "kind": import_zod.z.union([import_zod.z.literal("conversation"), import_zod.z.literal("memory"), import_zod.z.literal("project")]),
      "label": import_zod.z.string(),
      "text": import_zod.z.string(),
      "labelMessage": import_zod.z.union([import_zod.z.undefined(), import_zod.z.object({
        "messageKey": import_zod.z.union([import_zod.z.literal("m000"), import_zod.z.literal("m001"), import_zod.z.literal("m002"), import_zod.z.literal("m003"), import_zod.z.literal("m004"), import_zod.z.literal("m005"), import_zod.z.literal("m006"), import_zod.z.literal("m007"), import_zod.z.literal("m008"), import_zod.z.literal("m009"), import_zod.z.literal("m010"), import_zod.z.literal("m011"), import_zod.z.literal("m012"), import_zod.z.literal("m013"), import_zod.z.literal("m014"), import_zod.z.literal("m015"), import_zod.z.literal("m016"), import_zod.z.literal("m017"), import_zod.z.literal("m018"), import_zod.z.literal("m019"), import_zod.z.literal("m020"), import_zod.z.literal("m021"), import_zod.z.literal("m022"), import_zod.z.literal("m023"), import_zod.z.literal("m024"), import_zod.z.literal("m025"), import_zod.z.literal("m026"), import_zod.z.literal("m027"), import_zod.z.literal("m028"), import_zod.z.literal("m029"), import_zod.z.literal("m030"), import_zod.z.literal("m031"), import_zod.z.literal("m032"), import_zod.z.literal("m033"), import_zod.z.literal("m034"), import_zod.z.literal("m035"), import_zod.z.literal("m036"), import_zod.z.literal("m037"), import_zod.z.literal("m038"), import_zod.z.literal("m039"), import_zod.z.literal("m040"), import_zod.z.literal("m041"), import_zod.z.literal("m042"), import_zod.z.literal("m043"), import_zod.z.literal("m044"), import_zod.z.literal("m045"), import_zod.z.literal("m046"), import_zod.z.literal("m047"), import_zod.z.literal("m048"), import_zod.z.literal("m049"), import_zod.z.literal("m050"), import_zod.z.literal("m051"), import_zod.z.literal("m052"), import_zod.z.literal("m053"), import_zod.z.literal("m054"), import_zod.z.literal("m055"), import_zod.z.literal("m056"), import_zod.z.literal("m057"), import_zod.z.literal("m058"), import_zod.z.literal("m059"), import_zod.z.literal("m060"), import_zod.z.literal("m061"), import_zod.z.literal("m062"), import_zod.z.literal("m063"), import_zod.z.literal("m064"), import_zod.z.literal("m065"), import_zod.z.literal("m066"), import_zod.z.literal("m067"), import_zod.z.literal("m068"), import_zod.z.literal("m069"), import_zod.z.literal("m070"), import_zod.z.literal("m071"), import_zod.z.literal("m072"), import_zod.z.literal("m073"), import_zod.z.literal("m074"), import_zod.z.literal("m075"), import_zod.z.literal("m076"), import_zod.z.literal("m077"), import_zod.z.literal("m078"), import_zod.z.literal("m079"), import_zod.z.literal("m080"), import_zod.z.literal("m081"), import_zod.z.literal("m082"), import_zod.z.literal("m083"), import_zod.z.literal("m084"), import_zod.z.literal("m085"), import_zod.z.literal("m086"), import_zod.z.literal("m087"), import_zod.z.literal("m088"), import_zod.z.literal("m089"), import_zod.z.literal("m090"), import_zod.z.literal("m091"), import_zod.z.literal("m092"), import_zod.z.literal("m093"), import_zod.z.literal("m094"), import_zod.z.literal("m095"), import_zod.z.literal("m096"), import_zod.z.literal("m097"), import_zod.z.literal("m098"), import_zod.z.literal("m099"), import_zod.z.literal("m100"), import_zod.z.literal("m101"), import_zod.z.literal("m102"), import_zod.z.literal("m103"), import_zod.z.literal("m104"), import_zod.z.literal("m105"), import_zod.z.literal("m106"), import_zod.z.literal("m107"), import_zod.z.literal("m108"), import_zod.z.literal("m109"), import_zod.z.literal("m110"), import_zod.z.literal("m111"), import_zod.z.literal("m112"), import_zod.z.literal("m113"), import_zod.z.literal("m114"), import_zod.z.literal("m115"), import_zod.z.literal("m116"), import_zod.z.literal("m117"), import_zod.z.literal("m118"), import_zod.z.literal("m119"), import_zod.z.literal("m120"), import_zod.z.literal("m121"), import_zod.z.literal("m122"), import_zod.z.literal("m123"), import_zod.z.literal("m124"), import_zod.z.literal("m125"), import_zod.z.literal("m126"), import_zod.z.literal("m127"), import_zod.z.literal("m128"), import_zod.z.literal("m129"), import_zod.z.literal("m130"), import_zod.z.literal("m131"), import_zod.z.literal("m132"), import_zod.z.literal("m133"), import_zod.z.literal("m134"), import_zod.z.literal("m135"), import_zod.z.literal("m136"), import_zod.z.literal("m137"), import_zod.z.literal("m138"), import_zod.z.literal("m139"), import_zod.z.literal("m140"), import_zod.z.literal("m141"), import_zod.z.literal("m142"), import_zod.z.literal("m143"), import_zod.z.literal("m144"), import_zod.z.literal("m145"), import_zod.z.literal("m146"), import_zod.z.literal("m147"), import_zod.z.literal("m148"), import_zod.z.literal("m149"), import_zod.z.literal("m150"), import_zod.z.literal("m151"), import_zod.z.literal("m152"), import_zod.z.literal("m153"), import_zod.z.literal("m154"), import_zod.z.literal("m155"), import_zod.z.literal("m156"), import_zod.z.literal("m157"), import_zod.z.literal("m158"), import_zod.z.literal("m159"), import_zod.z.literal("m160"), import_zod.z.literal("m161"), import_zod.z.literal("m162")]),
        "messageParams": import_zod.z.union([import_zod.z.undefined(), import_zod.z.record(import_zod.z.string(), import_zod.z.union([import_zod.z.string(), import_zod.z.number()]))]).optional()
      })]).optional()
    })),
    "warnings": import_zod.z.array(import_zod.z.string()),
    "warningMessages": import_zod.z.union([import_zod.z.undefined(), import_zod.z.array(import_zod.z.union([import_zod.z.literal(null), import_zod.z.object({
      "messageKey": import_zod.z.union([import_zod.z.literal("m000"), import_zod.z.literal("m001"), import_zod.z.literal("m002"), import_zod.z.literal("m003"), import_zod.z.literal("m004"), import_zod.z.literal("m005"), import_zod.z.literal("m006"), import_zod.z.literal("m007"), import_zod.z.literal("m008"), import_zod.z.literal("m009"), import_zod.z.literal("m010"), import_zod.z.literal("m011"), import_zod.z.literal("m012"), import_zod.z.literal("m013"), import_zod.z.literal("m014"), import_zod.z.literal("m015"), import_zod.z.literal("m016"), import_zod.z.literal("m017"), import_zod.z.literal("m018"), import_zod.z.literal("m019"), import_zod.z.literal("m020"), import_zod.z.literal("m021"), import_zod.z.literal("m022"), import_zod.z.literal("m023"), import_zod.z.literal("m024"), import_zod.z.literal("m025"), import_zod.z.literal("m026"), import_zod.z.literal("m027"), import_zod.z.literal("m028"), import_zod.z.literal("m029"), import_zod.z.literal("m030"), import_zod.z.literal("m031"), import_zod.z.literal("m032"), import_zod.z.literal("m033"), import_zod.z.literal("m034"), import_zod.z.literal("m035"), import_zod.z.literal("m036"), import_zod.z.literal("m037"), import_zod.z.literal("m038"), import_zod.z.literal("m039"), import_zod.z.literal("m040"), import_zod.z.literal("m041"), import_zod.z.literal("m042"), import_zod.z.literal("m043"), import_zod.z.literal("m044"), import_zod.z.literal("m045"), import_zod.z.literal("m046"), import_zod.z.literal("m047"), import_zod.z.literal("m048"), import_zod.z.literal("m049"), import_zod.z.literal("m050"), import_zod.z.literal("m051"), import_zod.z.literal("m052"), import_zod.z.literal("m053"), import_zod.z.literal("m054"), import_zod.z.literal("m055"), import_zod.z.literal("m056"), import_zod.z.literal("m057"), import_zod.z.literal("m058"), import_zod.z.literal("m059"), import_zod.z.literal("m060"), import_zod.z.literal("m061"), import_zod.z.literal("m062"), import_zod.z.literal("m063"), import_zod.z.literal("m064"), import_zod.z.literal("m065"), import_zod.z.literal("m066"), import_zod.z.literal("m067"), import_zod.z.literal("m068"), import_zod.z.literal("m069"), import_zod.z.literal("m070"), import_zod.z.literal("m071"), import_zod.z.literal("m072"), import_zod.z.literal("m073"), import_zod.z.literal("m074"), import_zod.z.literal("m075"), import_zod.z.literal("m076"), import_zod.z.literal("m077"), import_zod.z.literal("m078"), import_zod.z.literal("m079"), import_zod.z.literal("m080"), import_zod.z.literal("m081"), import_zod.z.literal("m082"), import_zod.z.literal("m083"), import_zod.z.literal("m084"), import_zod.z.literal("m085"), import_zod.z.literal("m086"), import_zod.z.literal("m087"), import_zod.z.literal("m088"), import_zod.z.literal("m089"), import_zod.z.literal("m090"), import_zod.z.literal("m091"), import_zod.z.literal("m092"), import_zod.z.literal("m093"), import_zod.z.literal("m094"), import_zod.z.literal("m095"), import_zod.z.literal("m096"), import_zod.z.literal("m097"), import_zod.z.literal("m098"), import_zod.z.literal("m099"), import_zod.z.literal("m100"), import_zod.z.literal("m101"), import_zod.z.literal("m102"), import_zod.z.literal("m103"), import_zod.z.literal("m104"), import_zod.z.literal("m105"), import_zod.z.literal("m106"), import_zod.z.literal("m107"), import_zod.z.literal("m108"), import_zod.z.literal("m109"), import_zod.z.literal("m110"), import_zod.z.literal("m111"), import_zod.z.literal("m112"), import_zod.z.literal("m113"), import_zod.z.literal("m114"), import_zod.z.literal("m115"), import_zod.z.literal("m116"), import_zod.z.literal("m117"), import_zod.z.literal("m118"), import_zod.z.literal("m119"), import_zod.z.literal("m120"), import_zod.z.literal("m121"), import_zod.z.literal("m122"), import_zod.z.literal("m123"), import_zod.z.literal("m124"), import_zod.z.literal("m125"), import_zod.z.literal("m126"), import_zod.z.literal("m127"), import_zod.z.literal("m128"), import_zod.z.literal("m129"), import_zod.z.literal("m130"), import_zod.z.literal("m131"), import_zod.z.literal("m132"), import_zod.z.literal("m133"), import_zod.z.literal("m134"), import_zod.z.literal("m135"), import_zod.z.literal("m136"), import_zod.z.literal("m137"), import_zod.z.literal("m138"), import_zod.z.literal("m139"), import_zod.z.literal("m140"), import_zod.z.literal("m141"), import_zod.z.literal("m142"), import_zod.z.literal("m143"), import_zod.z.literal("m144"), import_zod.z.literal("m145"), import_zod.z.literal("m146"), import_zod.z.literal("m147"), import_zod.z.literal("m148"), import_zod.z.literal("m149"), import_zod.z.literal("m150"), import_zod.z.literal("m151"), import_zod.z.literal("m152"), import_zod.z.literal("m153"), import_zod.z.literal("m154"), import_zod.z.literal("m155"), import_zod.z.literal("m156"), import_zod.z.literal("m157"), import_zod.z.literal("m158"), import_zod.z.literal("m159"), import_zod.z.literal("m160"), import_zod.z.literal("m161"), import_zod.z.literal("m162")]),
      "messageParams": import_zod.z.union([import_zod.z.undefined(), import_zod.z.record(import_zod.z.string(), import_zod.z.union([import_zod.z.string(), import_zod.z.number()]))]).optional()
    })]))]).optional()
  })]).optional(),
  "selection": import_zod.z.union([import_zod.z.undefined(), import_zod.z.object({
    "provider": import_zod.z.string(),
    "model": import_zod.z.string(),
    "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
  })]).optional()
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
  })]),
  "mystery": import_zod.z.boolean().describe("Prepend the capability declaration when the composer model is DeepSeek."),
  "predictionEnabled": import_zod.z.union([import_zod.z.undefined(), import_zod.z.literal(false), import_zod.z.literal(true)]).optional().describe("Missing in older clients/settings; normalized to false.")
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
  })]),
  "mystery": import_zod.z.boolean().describe("Prepend the capability declaration when the composer model is DeepSeek."),
  "predictionEnabled": import_zod.z.union([import_zod.z.undefined(), import_zod.z.literal(false), import_zod.z.literal(true)]).optional().describe("Missing in older clients/settings; normalized to false.")
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
    })]),
    "mystery": import_zod.z.boolean().describe("Prepend the capability declaration when the composer model is DeepSeek."),
    "predictionEnabled": import_zod.z.union([import_zod.z.undefined(), import_zod.z.literal(false), import_zod.z.literal(true)]).optional().describe("Missing in older clients/settings; normalized to false.")
  })]).optional().describe("Immutable settings captured by the client at click time."),
  "currentSelection": import_zod.z.union([import_zod.z.undefined(), import_zod.z.literal(null), import_zod.z.strictObject({
    "provider": import_zod.z.string(),
    "model": import_zod.z.string(),
    "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
  })]).optional().describe("Composer model at click time; gates the mystery injection independently of `selection`.")
});
var dsh_prompt_improver_promptEnhance_getSettings_parameter_0_strict$schema$value;
var dsh_prompt_improver_promptEnhance_getSettings_parameter_0_strict$schema = () => dsh_prompt_improver_promptEnhance_getSettings_parameter_0_strict$schema$value ??= import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]);
var dsh_prompt_improver_promptEnhance_predict_parameter_0_strict$schema$value;
var dsh_prompt_improver_promptEnhance_predict_parameter_0_strict$schema = () => dsh_prompt_improver_promptEnhance_predict_parameter_0_strict$schema$value ??= import_zod.z.strictObject({
  "sessionId": import_zod.z.string(),
  "draft": import_zod.z.string(),
  "protectedTokens": import_zod.z.array(import_zod.z.string()),
  "selection": import_zod.z.strictObject({
    "provider": import_zod.z.string(),
    "model": import_zod.z.string(),
    "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
  }),
  "settings": import_zod.z.strictObject({
    "mode": import_zod.z.union([import_zod.z.literal("moderate"), import_zod.z.literal("expanded")]),
    "adoption": import_zod.z.union([import_zod.z.literal("direct"), import_zod.z.literal("preview")]),
    "context": import_zod.z.union([import_zod.z.literal("draft"), import_zod.z.literal("recent"), import_zod.z.literal("extended")]),
    "modelStrategy": import_zod.z.union([import_zod.z.literal("follow"), import_zod.z.literal("dedicated")]),
    "dedicated": import_zod.z.union([import_zod.z.literal(null), import_zod.z.strictObject({
      "provider": import_zod.z.string(),
      "model": import_zod.z.string(),
      "reasoningEffort": import_zod.z.union([import_zod.z.undefined(), import_zod.z.string()]).optional()
    })]),
    "mystery": import_zod.z.boolean().describe("Prepend the capability declaration when the composer model is DeepSeek."),
    "predictionEnabled": import_zod.z.union([import_zod.z.undefined(), import_zod.z.literal(false), import_zod.z.literal(true)]).optional().describe("Missing in older clients/settings; normalized to false.")
  })
});
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
  })]),
  "mystery": import_zod.z.boolean().describe("Prepend the capability declaration when the composer model is DeepSeek."),
  "predictionEnabled": import_zod.z.union([import_zod.z.undefined(), import_zod.z.literal(false), import_zod.z.literal(true)]).optional().describe("Missing in older clients/settings; normalized to false.")
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
        jsonSchema: { "type": "object", "properties": { "owner": { "type": "boolean" }, "memory": { "type": "boolean" }, "personalMemory": { "type": "boolean", "enum": [false, true] }, "models": { "type": "array", "items": { "type": "object", "properties": { "label": { "type": "string" }, "efforts": { "type": "array", "items": { "type": "string" } }, "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["label", "efforts", "provider", "model"], "additionalProperties": true } } }, "required": ["owner", "memory", "models"], "additionalProperties": true }
      },
      sourceLocation: { "file": "packages/plugin/src/index.ts", "line": 113, "column": 9 }
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
            jsonSchema: { "type": "object", "properties": { "sessionId": { "type": "string" }, "draft": { "type": "string" }, "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "selection": { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": true }, "protectedTokens": { "type": "array", "items": { "type": "string" }, "description": "Tokens identifying references; identities stay in the browser." }, "settings": { "type": "object", "properties": { "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "adoption": { "type": "string", "enum": ["direct", "preview"] }, "context": { "type": "string", "enum": ["draft", "recent", "extended"] }, "modelStrategy": { "type": "string", "enum": ["follow", "dedicated"] }, "dedicated": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": true }] }, "mystery": { "type": "boolean", "description": "Prepend the capability declaration when the composer model is DeepSeek." }, "predictionEnabled": { "type": "boolean", "enum": [false, true], "description": "Missing in older clients/settings; normalized to false." } }, "required": ["mode", "adoption", "context", "modelStrategy", "dedicated", "mystery"], "additionalProperties": true, "description": "Immutable settings captured by the client at click time." }, "currentSelection": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": true }], "description": "Composer model at click time; gates the mystery injection independently of `selection`." } }, "required": ["sessionId", "draft", "mode", "selection", "protectedTokens"], "additionalProperties": true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "dsh-prompt-improver/types#EnhanceRequest",
            create: dsh_prompt_improver_promptEnhance_enhance_parameter_0_strict$schema,
            jsonSchema: { "type": "object", "properties": { "sessionId": { "type": "string" }, "draft": { "type": "string" }, "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "selection": { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": false }, "protectedTokens": { "type": "array", "items": { "type": "string" }, "description": "Tokens identifying references; identities stay in the browser." }, "settings": { "type": "object", "properties": { "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "adoption": { "type": "string", "enum": ["direct", "preview"] }, "context": { "type": "string", "enum": ["draft", "recent", "extended"] }, "modelStrategy": { "type": "string", "enum": ["follow", "dedicated"] }, "dedicated": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": false }] }, "mystery": { "type": "boolean", "description": "Prepend the capability declaration when the composer model is DeepSeek." }, "predictionEnabled": { "type": "boolean", "enum": [false, true], "description": "Missing in older clients/settings; normalized to false." } }, "required": ["mode", "adoption", "context", "modelStrategy", "dedicated", "mystery"], "additionalProperties": false, "description": "Immutable settings captured by the client at click time." }, "currentSelection": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": false }], "description": "Composer model at click time; gates the mystery injection independently of `selection`." } }, "required": ["sessionId", "draft", "mode", "selection", "protectedTokens"], "additionalProperties": false }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "dsh-prompt-improver/types#EnhanceResponse",
        create: dsh_prompt_improver_promptEnhance_enhance_result$schema,
        jsonSchemaError: "typert tool schema: selected dictionaries require string keys and unconstrained JSON values"
      },
      sourceLocation: { "file": "packages/plugin/src/index.ts", "line": 54, "column": 9 }
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
        jsonSchema: { "type": "object", "properties": { "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "adoption": { "type": "string", "enum": ["direct", "preview"] }, "context": { "type": "string", "enum": ["draft", "recent", "extended"] }, "modelStrategy": { "type": "string", "enum": ["follow", "dedicated"] }, "dedicated": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": true }] }, "mystery": { "type": "boolean", "description": "Prepend the capability declaration when the composer model is DeepSeek." }, "predictionEnabled": { "type": "boolean", "enum": [false, true], "description": "Missing in older clients/settings; normalized to false." } }, "required": ["mode", "adoption", "context", "modelStrategy", "dedicated", "mystery"], "additionalProperties": true }
      },
      sourceLocation: { "file": "packages/plugin/src/index.ts", "line": 94, "column": 9 }
    },
    "promptEnhance/predict": {
      service: "promptEnhance",
      invocation: { kind: "direct" },
      parameters: [
        {
          name: "request",
          source: "json",
          codec: {
            mode: "strict",
            typeSymbol: "dsh-prompt-improver/types#PredictionRequest",
            create: dsh_prompt_improver_promptEnhance_predict_parameter_0$schema,
            jsonSchema: { "type": "object", "properties": { "sessionId": { "type": "string" }, "draft": { "type": "string" }, "protectedTokens": { "type": "array", "items": { "type": "string" } }, "selection": { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": true }, "settings": { "type": "object", "properties": { "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "adoption": { "type": "string", "enum": ["direct", "preview"] }, "context": { "type": "string", "enum": ["draft", "recent", "extended"] }, "modelStrategy": { "type": "string", "enum": ["follow", "dedicated"] }, "dedicated": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": true }] }, "mystery": { "type": "boolean", "description": "Prepend the capability declaration when the composer model is DeepSeek." }, "predictionEnabled": { "type": "boolean", "enum": [false, true], "description": "Missing in older clients/settings; normalized to false." } }, "required": ["mode", "adoption", "context", "modelStrategy", "dedicated", "mystery"], "additionalProperties": true } }, "required": ["sessionId", "draft", "protectedTokens", "selection", "settings"], "additionalProperties": true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "dsh-prompt-improver/types#PredictionRequest",
            create: dsh_prompt_improver_promptEnhance_predict_parameter_0_strict$schema,
            jsonSchema: { "type": "object", "properties": { "sessionId": { "type": "string" }, "draft": { "type": "string" }, "protectedTokens": { "type": "array", "items": { "type": "string" } }, "selection": { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": false }, "settings": { "type": "object", "properties": { "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "adoption": { "type": "string", "enum": ["direct", "preview"] }, "context": { "type": "string", "enum": ["draft", "recent", "extended"] }, "modelStrategy": { "type": "string", "enum": ["follow", "dedicated"] }, "dedicated": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": false }] }, "mystery": { "type": "boolean", "description": "Prepend the capability declaration when the composer model is DeepSeek." }, "predictionEnabled": { "type": "boolean", "enum": [false, true], "description": "Missing in older clients/settings; normalized to false." } }, "required": ["mode", "adoption", "context", "modelStrategy", "dedicated", "mystery"], "additionalProperties": false } }, "required": ["sessionId", "draft", "protectedTokens", "selection", "settings"], "additionalProperties": false }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "dsh-prompt-improver/types#PredictionResponse",
        create: dsh_prompt_improver_promptEnhance_predict_result$schema,
        jsonSchemaError: "typert tool schema: selected dictionaries require string keys and unconstrained JSON values"
      },
      sourceLocation: { "file": "packages/plugin/src/index.ts", "line": 68, "column": 9 }
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
            jsonSchema: { "type": "object", "properties": { "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "adoption": { "type": "string", "enum": ["direct", "preview"] }, "context": { "type": "string", "enum": ["draft", "recent", "extended"] }, "modelStrategy": { "type": "string", "enum": ["follow", "dedicated"] }, "dedicated": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": true }] }, "mystery": { "type": "boolean", "description": "Prepend the capability declaration when the composer model is DeepSeek." }, "predictionEnabled": { "type": "boolean", "enum": [false, true], "description": "Missing in older clients/settings; normalized to false." } }, "required": ["mode", "adoption", "context", "modelStrategy", "dedicated", "mystery"], "additionalProperties": true }
          },
          strictCodec: {
            mode: "strict",
            typeSymbol: "dsh-prompt-improver/types#EnhanceSettings",
            create: dsh_prompt_improver_promptEnhance_saveSettings_parameter_0_strict$schema,
            jsonSchema: { "type": "object", "properties": { "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "adoption": { "type": "string", "enum": ["direct", "preview"] }, "context": { "type": "string", "enum": ["draft", "recent", "extended"] }, "modelStrategy": { "type": "string", "enum": ["follow", "dedicated"] }, "dedicated": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": false }] }, "mystery": { "type": "boolean", "description": "Prepend the capability declaration when the composer model is DeepSeek." }, "predictionEnabled": { "type": "boolean", "enum": [false, true], "description": "Missing in older clients/settings; normalized to false." } }, "required": ["mode", "adoption", "context", "modelStrategy", "dedicated", "mystery"], "additionalProperties": false }
          }
        }
      ],
      cancellation: { parameter: "signal" },
      result: {
        mode: "strict",
        typeSymbol: "dsh-prompt-improver/types#EnhanceSettings",
        create: dsh_prompt_improver_promptEnhance_saveSettings_result$schema,
        jsonSchema: { "type": "object", "properties": { "mode": { "type": "string", "enum": ["moderate", "expanded"] }, "adoption": { "type": "string", "enum": ["direct", "preview"] }, "context": { "type": "string", "enum": ["draft", "recent", "extended"] }, "modelStrategy": { "type": "string", "enum": ["follow", "dedicated"] }, "dedicated": { "oneOf": [{ "type": "null", "const": null }, { "type": "object", "properties": { "provider": { "type": "string" }, "model": { "type": "string" }, "reasoningEffort": { "type": "string" } }, "required": ["provider", "model"], "additionalProperties": true }] }, "mystery": { "type": "boolean", "description": "Prepend the capability declaration when the composer model is DeepSeek." }, "predictionEnabled": { "type": "boolean", "enum": [false, true], "description": "Missing in older clients/settings; normalized to false." } }, "required": ["mode", "adoption", "context", "modelStrategy", "dedicated", "mystery"], "additionalProperties": true }
      },
      sourceLocation: { "file": "packages/plugin/src/index.ts", "line": 101, "column": 9 }
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
var DRAFT_CHAR_LIMIT = 32e3;
function sameSelection(a, b) {
  return a?.provider === b?.provider && a?.model === b?.model && a?.reasoningEffort === b?.reasoningEffort;
}

// src/client/controller.ts
function sameComposer(a, b) {
  return a.sessionId === b.sessionId && a.revision === b.revision && JSON.stringify(a.draft) === JSON.stringify(b.draft) && sameSelection(a.selection, b.selection) && sameSelection(a.current, b.current) && a.available === b.available && a.attachmentIds.length === b.attachmentIds.length && a.attachmentIds.every((id, i) => id === b.attachmentIds[i]);
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
      this.cancel(m("m000"));
    }
    if (this.undo && !sameComposer(snapshot, this.undo.applied)) {
      this.undo = void 0;
      this.port.changed();
    }
    if (this.preview && !sameComposer(snapshot, this.preview.snapshot)) {
      this.closePreview();
      this.message = m("m001");
      this.port.changed();
    }
  }
  cancel(message = m("m002")) {
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
        currentSelection: snapshot.current ? { ...snapshot.current } : null,
        ...settings ? { settings: structuredClone(settings) } : {}
      }, active.abort.signal);
      if (this.disposed || this.active !== active || active.abort.signal.aborted) return;
      if (!sameComposer(this.port.read(), snapshot)) {
        this.cancel(m("m003"));
        return;
      }
      if (!result.text.trim()) throw new Error(m("m004"));
      const next = restoreReferences(result.text.trim(), protectedDraft);
      this.active = void 0;
      if (previewOnce || settings?.adoption === "preview") {
        this.preview = { snapshot, draft: next, response: result };
        this.message = "";
      } else this.apply(next, snapshot, result);
    } catch (error) {
      if (this.disposed || this.active !== active || active.abort.signal.aborted) return;
      this.message = error instanceof Error ? error.message : m("m005");
    } finally {
      if (this.active === active) this.active = void 0;
      if (!this.disposed) this.port.changed();
    }
  }
  apply(draft, snapshot, response) {
    this.port.write(draft);
    this.undo = { original: snapshot.draft, applied: structuredClone(this.port.read()) };
    this.message = [m("m006"), ...response.context?.warnings ?? []].join(" ");
  }
  async acceptPreview() {
    const preview = this.preview;
    if (!preview || this.applying || this.disposed) return;
    const abort = new AbortController();
    this.applying = abort;
    this.port.changed();
    try {
      if (this.port.validateSelection && !await this.port.validateSelection(preview.snapshot.selection, AbortSignal.any([abort.signal, AbortSignal.timeout(15e3)]))) {
        throw new Error(m("m007"));
      }
      if (this.disposed || abort.signal.aborted || this.preview !== preview) return;
      if (!sameComposer(this.port.read(), preview.snapshot)) throw new Error(m("m008"));
      this.preview = void 0;
      this.apply(preview.draft, preview.snapshot, preview.response);
    } catch (error) {
      if (!this.disposed && !abort.signal.aborted) {
        this.preview = void 0;
        this.message = error instanceof Error ? error.message : m("m009");
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
    this.message = m("m010");
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
var import_react2 = require("react");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime = require("react/jsx-runtime");
var SettingsClient = class {
  constructor(ctx) {
    this.ctx = ctx;
  }
  enhancing = /* @__PURE__ */ new Set();
  setEnhancing(sessionId, busy) {
    if (this.enhancing.has(sessionId) === busy) return;
    if (busy) this.enhancing.add(sessionId);
    else this.enhancing.delete(sessionId);
    this.notify();
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
      this.error = error instanceof Error ? error.message : m("m050");
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
  return a.mode === b.mode && a.adoption === b.adoption && a.context === b.context && a.modelStrategy === b.modelStrategy && a.mystery === b.mystery && a.predictionEnabled === b.predictionEnabled && sameSelection(a.dedicated, b.dedicated);
}
function Select(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-prompt-enhance-select", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { ...props }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconChevronDownOutlineRegular, { size: 14, "aria-hidden": "true" })
  ] });
}
var contextHelp = {
  get draft() {
    return t("m051");
  },
  get recent() {
    return t("m052");
  },
  get extended() {
    return t("m053");
  }
};
function EnhanceSettingsPage({ settings }) {
  useLocale();
  const id = (0, import_react2.useId)();
  const [draft, setDraft] = (0, import_react2.useState)(() => structuredClone(settings.value));
  const baseline = (0, import_react2.useRef)(settings.value);
  const [message, setMessage] = (0, import_react2.useState)("");
  const [busy, setBusy] = (0, import_react2.useState)(null);
  const [, render] = (0, import_react2.useState)(0);
  (0, import_react2.useEffect)(() => {
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
  const status = busy === "save" ? t("m054") : busy === "refresh" ? t("m055") : !settings.ready ? t("m056") : dirty ? t("m057") : t("m058");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-prompt-enhance-settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t("m045") }),
    settings.ready && !settings.capabilities.owner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("m059") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { disabled: busy !== null || !settings.ready, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dsh-prompt-enhance-group", "aria-labelledby": `${id}-preference`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { id: `${id}-preference`, children: t("m060") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-prompt-enhance-choices", role: "group", "aria-label": t("m061"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dsh-prompt-enhance-choice", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "radio", name: `${id}-mode`, value: "moderate", checked: draft.mode === "moderate", onChange: () => update("mode", "moderate") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              t("m011"),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t("m062") })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dsh-prompt-enhance-choice", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "radio", name: `${id}-mode`, value: "expanded", checked: draft.mode === "expanded", onChange: () => update("mode", "expanded") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              t("m012"),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t("m063") })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dsh-prompt-enhance-setting-row", children: [
          t("m064"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: draft.adoption, onChange: (event) => update("adoption", event.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "direct", children: t("m065") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "preview", children: t("m066") })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: draft.adoption === "direct" ? t("m067") : t("m068") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-prompt-enhance-feature dsh-prompt-enhance-feature-inset", role: "group", "aria-labelledby": `${id}-mystery`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-prompt-enhance-feature-heading", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-prompt-enhance-feature-copy", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { id: `${id}-mystery`, children: t("m069") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("m070") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Switch, { label: t("m069"), checked: draft.mystery, disabled: busy !== null || !settings.ready, onChange: (value) => update("mystery", value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "dsh-prompt-enhance-scope-note", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-prompt-enhance-model-tag", children: "DeepSeek" }),
            t("m071")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dsh-prompt-enhance-group dsh-prompt-enhance-feature", "aria-labelledby": `${id}-prediction`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-prompt-enhance-feature-heading", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-prompt-enhance-feature-copy", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { id: `${id}-prediction`, children: t("m072") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("m073") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Switch, { label: t("m072"), checked: draft.predictionEnabled === true, disabled: busy !== null || !settings.ready, onChange: (value) => update("predictionEnabled", value) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-prompt-enhance-keyboard-help", "aria-label": t("m074"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "Tab" }),
            " ",
            t("m075")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "Esc" }),
            " ",
            t("m076")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-prompt-enhance-send-note", children: t("m077") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh-prompt-enhance-usage-note", children: t("m078") }),
        draft.predictionEnabled && !settings.capabilities.personalMemory && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "status", children: t("m079") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dsh-prompt-enhance-group", "aria-labelledby": `${id}-context`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { id: `${id}-context`, children: t("m080") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-prompt-enhance-choices dsh-prompt-enhance-context-choices", role: "group", "aria-label": t("m080"), children: [["draft", t("m013")], ["recent", t("m014")], ["extended", t("m015")]].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dsh-prompt-enhance-choice", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "radio", name: `${id}-context`, value, checked: draft.context === value, onChange: () => update("context", value) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })
        ] }, value)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: contextHelp[draft.context] }),
        draft.context === "extended" && !settings.capabilities.memory && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "status", children: t("m081") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dsh-prompt-enhance-group", "aria-label": t("m082"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dsh-prompt-enhance-setting-row", children: [
          t("m082"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: draft.modelStrategy, onChange: (event) => update("modelStrategy", event.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "follow", children: t("m027") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "dedicated", children: t("m083") })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: draft.modelStrategy === "follow" ? t("m084") : t("m085") }),
        draft.modelStrategy === "dedicated" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-prompt-enhance-model-fields", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
            t("m028"),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: selectedKey, "aria-invalid": invalidModel, onChange: (event) => {
              const model = models.find((model2) => JSON.stringify([model2.provider, model2.model]) === event.target.value);
              update("dedicated", model ? { provider: model.provider, model: model.model } : null);
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: t("m086") }),
              selectedKey && !selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: selectedKey, children: t("m087") }),
              models.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: JSON.stringify([model.provider, model.model]), children: model.label }, JSON.stringify([model.provider, model.model])))
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
            t("m088"),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: draft.dedicated?.reasoningEffort ?? "", disabled: !selected, "aria-invalid": invalidEffort, onChange: (event) => {
              if (draft.dedicated) update("dedicated", { provider: draft.dedicated.provider, model: draft.dedicated.model, ...event.target.value ? { reasoningEffort: event.target.value } : {} });
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: t("m089") }),
              selected?.efforts.map((effort) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: effort, children: effort }, effort)),
              draft.dedicated?.reasoningEffort && !selected?.efforts.includes(draft.dedicated.reasoningEffort) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: draft.dedicated.reasoningEffort, children: t("m090") })
            ] })
          ] })
        ] }),
        (invalidModel || invalidEffort) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "dsh-prompt-enhance-warning", role: "alert", children: [
          invalidModel ? t("m091") : t("m092"),
          t("m093")
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-prompt-enhance-settings-footer", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { role: "status", className: "dsh-prompt-enhance-save-status", children: status }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "ghost", disabled: !dirty, onClick: () => {
          setDraft(structuredClone(settings.value));
          setMessage("");
        }, children: t("m094") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "primary", disabled: !dirty || invalidModel || invalidEffort, onClick: () => {
          setBusy("save");
          setMessage("");
          void settings.save(structuredClone(draft)).then(() => setDraft(structuredClone(settings.value))).catch((error) => setMessage(error instanceof Error ? error.message : m("m095"))).finally(() => setBusy(null));
        }, children: t("m096") })
      ] })
    ] }),
    (message || settings.error) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh-prompt-enhance-warning", role: "alert", children: diagnostic(message || settings.error) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "ghost", disabled: busy !== null, onClick: () => {
      setMessage("");
      setBusy("refresh");
      void settings.refresh().finally(() => setBusy(null));
    }, children: t("m097") })
  ] });
}

// src/client/style.css
var style_default = '.dsh-prompt-enhance {\n  display: inline-flex;\n  align-items: center;\n  gap: 2px;\n  flex: none;\n  white-space: nowrap;\n}\n.dsh-prompt-enhance .dsh-prompt-enhance-trigger {\n  width: 28px;\n  min-width: 28px;\n  padding: 0;\n}\n.dsh-prompt-enhance-trigger[aria-disabled="true"] { opacity: 0.45; }\n.dsh-prompt-enhance-icon { display: block; flex: none; }\n.dsh-prompt-enhance-progress {\n  transform-origin: 12px 12px;\n  animation: dsh-prompt-enhance-spin 1s linear infinite;\n}\n@keyframes dsh-prompt-enhance-spin { to { transform: rotate(360deg); } }\n.dsh-prompt-enhance-sr {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  overflow: hidden;\n  clip-path: inset(50%);\n  white-space: nowrap;\n}\n@media (prefers-reduced-motion: reduce) {\n  .dsh-prompt-enhance-progress { animation: none; }\n}\n.dsh-prompt-enhance-dialog {\n  width: min(720px, 100%);\n  max-height: 100%;\n  color: var(--dsw-alias-label-primary);\n  /* Host layer fills may be translucent: compose them over the opaque base. */\n  background: linear-gradient(var(--dsw-alias-bg-layer-2), var(--dsw-alias-bg-layer-2)), var(--dsw-alias-bg-base);\n}\n.dsh-prompt-enhance-dialog-body { min-height: 0; overflow: auto; white-space: normal; }\n.dsh-prompt-enhance-dialog > :last-child { flex-shrink: 0; }\n.dsh-prompt-enhance-preview-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 12px;\n  margin-bottom: 18px;\n}\n.dsh-prompt-enhance-meta {\n  margin: 0;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 13px;\n  overflow-wrap: anywhere;\n}\n.dsh-prompt-enhance-compare-toggle { display: flex; align-items: center; gap: 6px; white-space: nowrap; }\n.dsh-prompt-enhance-comparison { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 20px; }\n.dsh-prompt-enhance-comparison-solo { grid-template-columns: minmax(0, 1fr); }\n.dsh-prompt-enhance-comparison section { min-width: 0; }\n.dsh-prompt-enhance-comparison h3 { margin: 0 0 14px; font-size: 14px; font-weight: 500; }\n.dsh-prompt-enhance-original { padding-right: 20px; border-right: 1px solid var(--dsw-alias-border-l4); }\n.dsh-prompt-enhance-original .dsh-prompt-enhance-text { color: var(--dsw-alias-label-secondary); }\n.dsh-prompt-enhance-text {\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n  margin: 0;\n  font: inherit;\n  line-height: 1.65;\n  text-align: start;\n}\n.dsh-prompt-enhance-sources { margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--dsw-alias-border-l4); }\n.dsh-prompt-enhance-sources summary { cursor: pointer; color: var(--dsw-alias-label-secondary); font-size: 13px; }\n.dsh-prompt-enhance-source { margin-top: 12px; padding: 12px 14px; background: var(--dsw-alias-bg-layer-1); border-radius: var(--dsw-radius-md); }\n.dsh-prompt-enhance-source h4 { margin: 0 0 8px; font-size: 13px; font-weight: 500; }\n.dsh-prompt-enhance-settings { max-width: 680px; min-width: 0; width: 100%; white-space: normal; }\n.dsh-prompt-enhance-settings fieldset { border: 0; padding: 0; margin: 0; min-width: 0; }\n.dsh-prompt-enhance-settings h2 { margin: 0 0 6px; font-size: 18px; font-weight: 500; }\n.dsh-prompt-enhance-settings h3 { margin: 0 0 12px; font-size: 14px; font-weight: 500; }\n.dsh-prompt-enhance-group { padding: 20px 0; border-top: 1px solid var(--dsw-alias-border-l4); }\n.dsh-prompt-enhance-group:first-child { border-top: 0; }\n.dsh-prompt-enhance-choices { display: flex; gap: 4px; padding: 4px; background: var(--dsw-alias-bg-layer-1); border-radius: var(--dsw-radius-md); }\n.dsh-prompt-enhance-choice { flex: 1; display: flex; align-items: flex-start; min-width: 0; position: relative; cursor: pointer; }\n.dsh-prompt-enhance-choice input { position: absolute; top: 15px; left: 12px; margin: 0; }\n.dsh-prompt-enhance-choice span { box-sizing: border-box; width: 100%; padding: 10px 10px 10px 34px; border: 1px solid transparent; border-radius: var(--dsw-radius-sm); }\n.dsh-prompt-enhance-choice input:checked + span { border-color: var(--dsw-alias-border-l4); background: var(--dsw-alias-bg-layer-2); }\n.dsh-prompt-enhance-choice input:disabled + span { opacity: 0.5; cursor: not-allowed; }\n.dsh-prompt-enhance-choice small { display: block; color: var(--dsw-alias-label-secondary); font-size: 13px; line-height: 1.6; margin-top: 2px; }\n.dsh-prompt-enhance-setting-row { display: grid; grid-template-columns: minmax(80px, 1fr) minmax(0, 1.5fr); align-items: center; gap: 16px; margin-top: 16px; }\n.dsh-prompt-enhance-setting-row:first-child { margin-top: 0; }\n.dsh-prompt-enhance-select { display: block; position: relative; min-width: 0; width: 100%; }\n.dsh-prompt-enhance-settings select {\n  box-sizing: border-box;\n  appearance: none;\n  min-width: 0;\n  width: 100%;\n  border: 1px solid var(--dsw-alias-border-l4);\n  border-radius: var(--dsw-radius-md);\n  padding: 9px 36px 9px 12px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-bg-layer-1);\n  font: inherit;\n  line-height: 22px;\n}\n.dsh-prompt-enhance-select > svg { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; pointer-events: none; color: var(--dsw-alias-label-secondary); }\n.dsh-prompt-enhance-model-fields { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); gap: 12px; margin-top: 16px; }\n.dsh-prompt-enhance-model-fields label { display: grid; gap: 8px; min-width: 0; }\n.dsh-prompt-enhance-settings p { color: var(--dsw-alias-label-secondary); font-size: 13px; line-height: 1.6; margin: 10px 0 0; overflow-wrap: anywhere; }\n.dsh-prompt-enhance-feature-inset { margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--dsw-alias-border-l3); }\n.dsh-prompt-enhance-feature-heading { display: grid; grid-template-columns: minmax(0, 1fr) 36px; align-items: start; column-gap: 24px; }\n.dsh-prompt-enhance-feature-copy h3 { font-size: 15px; line-height: 24px; font-weight: 500; margin: 0; }\n.dsh-prompt-enhance-feature-copy p { font-size: 13px; line-height: 22px; margin-top: 5px; }\n.dsh-prompt-enhance-feature-heading > [role="switch"] { margin-top: 3px; }\n.dsh-prompt-enhance-feature-heading > [role="switch"]::before { content: ""; position: absolute; inset: -10px 0 -10px -8px; }\n.dsh-prompt-enhance-feature .dsh-prompt-enhance-scope-note { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; margin-top: 13px; font-size: 12px; line-height: 20px; }\n.dsh-prompt-enhance-model-tag { display: inline-flex; border: 1px solid var(--dsw-alias-border-l3); border-radius: 5px; padding: 0 6px; font-size: 11px; line-height: 19px; }\n.dsh-prompt-enhance-keyboard-help { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 19px; margin-top: 17px; color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 24px; }\n.dsh-prompt-enhance-keyboard-help > span { display: inline-flex; align-items: center; gap: 6px; }\n.dsh-prompt-enhance-keyboard-help kbd { display: inline-flex; justify-content: center; align-items: center; min-width: 31px; height: 23px; padding: 0 5px; border: 1px solid var(--dsw-alias-border-l3); border-bottom-width: 2px; border-radius: 5px; font: 11px/18px var(--dsw-font-family); color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-1); }\n.dsh-prompt-enhance-send-note { border-left: 1px solid var(--dsw-alias-border-l3); padding-left: 18px; }\n.dsh-prompt-enhance-feature .dsh-prompt-enhance-usage-note { margin-top: 18px; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l3); border-radius: 7px; background: var(--dsw-alias-interactive-bg-hover); font-size: 12px; line-height: 20px; }\n.dsh-prompt-enhance-warning { padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l4); border-radius: var(--dsw-radius-sm); overflow-wrap: anywhere; }\n.dsh-prompt-enhance-settings-footer { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 8px; border-top: 1px solid var(--dsw-alias-border-l4); padding: 16px 0; }\n.dsh-prompt-enhance-save-status { margin-right: auto; color: var(--dsw-alias-label-secondary); font-size: 13px; }\n@media (max-width: 650px) {\n  .dsh-prompt-enhance-comparison { grid-template-columns: minmax(0, 1fr); gap: 16px; }\n  .dsh-prompt-enhance-original { padding: 0 0 16px; border-right: 0; border-bottom: 1px solid var(--dsw-alias-border-l4); }\n}\n@media (max-width: 480px) {\n  .dsh-prompt-enhance-setting-row, .dsh-prompt-enhance-model-fields { grid-template-columns: minmax(0, 1fr); gap: 8px; }\n  .dsh-prompt-enhance-context-choices { flex-direction: column; }\n  .dsh-prompt-enhance-save-status { flex-basis: 100%; }\n}\n.dsh-prediction-mirror { position:absolute; inset:0 0 auto; pointer-events:none; user-select:none; visibility:hidden; }\n.dsh-prediction-mirror * { visibility:hidden !important; }\n.dsh-prediction-mirror .dsh-prediction-suffix { visibility:visible !important; color:var(--dsw-alias-label-caption); white-space:pre-wrap; }\n[data-composer-input][data-prediction-visible] ~ [data-composer-placeholder] { visibility:hidden; }\n.dsh-prediction-badge { position:absolute; right:12px; bottom:3px; max-width:calc(100% - 24px); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--dsw-alias-label-caption); font-size:11px; line-height:16px; pointer-events:none; }\n.dsh-prediction-badge:empty { display:none; }\n';

// src/client/prediction.tsx
var import_react3 = require("react");

// src/client/prediction-controller.ts
var PredictionController = class {
  constructor(port) {
    this.port = port;
  }
  suggestion = "";
  message = "";
  key = "";
  attempted = /* @__PURE__ */ new Set();
  timer;
  active;
  lastStart = -Infinity;
  disposed = false;
  get pending() {
    return !!this.active;
  }
  now() {
    return this.port.now?.() ?? Date.now();
  }
  reconcile() {
    if (this.disposed) return;
    const state = this.port.read();
    if (state.key !== this.key) {
      this.stop();
      this.key = state.key;
      this.suggestion = "";
      this.message = "";
      this.port.changed();
    }
    if (!state.eligible || !state.request) {
      this.stop();
      this.suggestion = "";
      this.message = "";
      this.port.changed();
      return;
    }
    if (this.active || this.timer || this.suggestion || this.attempted.has(state.dedupeKey ?? state.key)) return;
    const delay = Math.max(PREDICTION_DEBOUNCE_MS, PREDICTION_INTERVAL_MS - (this.now() - this.lastStart));
    this.timer = setTimeout(() => {
      this.timer = void 0;
      void this.start();
    }, delay);
  }
  async start() {
    const state = this.port.read();
    if (this.disposed || !state.eligible || !state.request || state.key !== this.key || this.attempted.has(state.dedupeKey ?? state.key)) return;
    this.remember(state);
    this.lastStart = this.now();
    const active = { key: state.key, abort: new AbortController() };
    this.active = active;
    this.port.changed();
    const timeout = setTimeout(() => {
      if (this.active === active) {
        this.stop();
        this.message = m("m046");
        this.port.changed();
      }
    }, PREDICTION_TIMEOUT_MS);
    try {
      const result = await this.port.predict(structuredClone(state.request), active.abort.signal);
      if (this.disposed || this.active !== active || active.abort.signal.aborted) return;
      const current = this.port.read();
      if (!current.eligible || current.key !== state.key) return;
      if (Array.from(result.text).length > PREDICTION_CHAR_LIMIT || /⟦DSH_REF_/u.test(result.text)) throw new Error(m("m047"));
      this.suggestion = result.text.trim() ? result.text : "";
      this.message = result.context?.warnings.join(" ") ?? "";
    } catch (error) {
      if (!this.disposed && this.active === active && !active.abort.signal.aborted) this.message = error instanceof Error ? error.message : m("m048");
    } finally {
      clearTimeout(timeout);
      if (this.active === active) this.active = void 0;
      if (!this.disposed) this.port.changed();
    }
  }
  accept() {
    const state = this.port.read();
    if (!this.suggestion || !state.eligible || state.key !== this.key) {
      this.reconcile();
      return false;
    }
    const text = this.suggestion;
    this.stop();
    this.suggestion = "";
    this.message = "";
    const inserted = this.port.insert(text);
    this.stop();
    const applied = this.port.read();
    this.key = applied.key;
    this.remember(applied);
    this.port.changed();
    return inserted;
  }
  dismiss() {
    this.stop();
    this.remember(this.port.read());
    this.suggestion = "";
    this.message = "";
    this.port.changed();
  }
  remember(state) {
    this.attempted.add(state.dedupeKey ?? state.key);
    if (this.attempted.size > 32) this.attempted.delete(this.attempted.values().next().value);
  }
  stop() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = void 0;
    const active = this.active;
    this.active = void 0;
    active?.abort.abort();
  }
  dispose() {
    this.disposed = true;
    this.stop();
    this.suggestion = "";
    this.message = "";
  }
};

// src/client/prediction.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function caretAtEnd(editor) {
  const selection = editor.ownerDocument.getSelection();
  if (!selection?.isCollapsed || !selection.rangeCount || !selection.anchorNode || !editor.contains(selection.anchorNode)) return false;
  const anchorElement = selection.anchorNode instanceof Element ? selection.anchorNode : selection.anchorNode.parentElement;
  const paragraph = anchorElement?.closest("p");
  if (paragraph && paragraph !== editor.lastElementChild) return false;
  if (selection.anchorNode === editor && selection.anchorOffset !== editor.childNodes.length) return false;
  const tail = selection.getRangeAt(0).cloneRange();
  tail.selectNodeContents(editor);
  tail.setStart(selection.anchorNode, selection.anchorOffset);
  const rest = tail.cloneContents();
  return !rest.textContent && !rest.querySelector('[data-lexical-decorator], [contenteditable="false"]');
}
function mountPredictionView(editor, badge) {
  const grow = editor.parentElement;
  const oldHeight = grow.style.minHeight;
  const mirror = document.createElement("div");
  mirror.className = "dsh-prediction-mirror";
  mirror.setAttribute("aria-hidden", "true");
  mirror.inert = true;
  grow.append(mirror);
  const clear = () => {
    mirror.replaceChildren();
    mirror.hidden = true;
    grow.style.minHeight = oldHeight;
    editor.removeAttribute("data-prediction-visible");
    badge.textContent = "";
  };
  return {
    show(text, message) {
      message = localize(message);
      clear();
      badge.textContent = text ? t("m049", { p0: message ? ` \xB7 ${message}` : "" }) : message;
      badge.title = message;
      if (!text) return;
      const copy = editor.cloneNode(true);
      copy.removeAttribute("data-composer-input");
      copy.removeAttribute("id");
      copy.removeAttribute("role");
      copy.removeAttribute("tabindex");
      copy.removeAttribute("aria-label");
      copy.contentEditable = "false";
      copy.removeAttribute("data-prediction-visible");
      for (const child of copy.querySelectorAll("[id], [tabindex]")) {
        child.removeAttribute("id");
        child.removeAttribute("tabindex");
      }
      const paragraph = copy.querySelector("p:last-child") ?? copy;
      if (paragraph.childNodes.length === 1 && paragraph.firstChild?.nodeName === "BR") paragraph.replaceChildren();
      const suffix = document.createElement("span");
      suffix.className = "dsh-prediction-suffix";
      suffix.textContent = text;
      paragraph.append(suffix);
      mirror.hidden = false;
      mirror.append(copy);
      grow.style.minHeight = `${Math.max(editor.offsetHeight, mirror.scrollHeight)}px`;
      editor.setAttribute("data-prediction-visible", "");
    },
    dispose() {
      clear();
      mirror.remove();
    }
  };
}
function PredictionOverlay({ ctx, sessionId, settings, inputActions }) {
  const marker = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    const badge = marker.current;
    const card = badge?.closest("[data-composer-card]");
    const editor = card?.querySelector("[data-composer-input]");
    const session = ctx.sessions.binding(sessionId);
    if (!badge || !card || !editor || !session || !inputActions) return;
    const input = ctx.conversation.input.for(session.ctx);
    const directory = ctx.modelDirectories.directoryFor(sessionId);
    const blocks = ctx.conversation.blocks.storeFor(sessionId);
    const nonce = crypto.randomUUID();
    let composing = false, compositionUntil = 0, disposed = false;
    const view = mountPredictionView(editor, badge);
    const read = () => {
      const state = input.state.getSnapshot(), snapshot = session.session.getSnapshot();
      const models = directory.store.getSnapshot(), events = session.eventSource.getSnapshot();
      const selection = settings.value.modelStrategy === "dedicated" ? settings.value.dedicated : models.current;
      const status = ctx.uiSession.sessionStatus.getSnapshot().get(sessionId);
      const hasHistory = events.entries.some((entry) => entry.type === "event" && entry.event.type === "turn/end" && entry.event.data.reason.kind === "completed");
      const eligible = settings.ready && settings.capabilities.owner && settings.value.predictionEnabled && !settings.enhancing.has(sessionId) && ctx.sessions.binding(sessionId) === session && snapshot.openState === "open" && !snapshot.removed && snapshot.subagent === null && !sessionId.startsWith("im:") && !snapshot.running && !status?.running && !status?.pendingInteraction && !snapshot.pendingSubmissions.length && state.phase === "plain" && !state.claim && !state.queue?.length && !blocks.getSnapshot() && !/^\s*\//u.test(state.draft) && state.draft.length <= DRAFT_CHAR_LIMIT && (!!state.draft.trim() || hasHistory) && !!selection && (settings.value.modelStrategy === "dedicated" ? settings.capabilities.models.some((model) => model.provider === selection.provider && model.model === selection.model && (!selection.reasoningEffort || model.efforts.includes(selection.reasoningEffort))) : models.status === "ready" && models.routable) && document.visibilityState === "visible" && document.activeElement === editor && editor.isContentEditable && editor.getBoundingClientRect().width > 0 && !composing && Date.now() >= compositionUntil && !editor.hasAttribute("data-composer-composing") && !card.querySelector("[data-trigger-menu]") && caretAtEnd(editor);
      const dedupeKey = JSON.stringify([sessionId, state.draft, state.occurrences, state.attachmentIds, selection, models.current, settings.value, events.revision]);
      const key = JSON.stringify([state.draftRev, dedupeKey]);
      let request = null;
      if (eligible && selection) {
        try {
          const protectedDraft = protectReferences({ text: state.draft, references: state.occurrences.map(({ occurrenceId: _id, ...ref }) => ref) }, nonce);
          request = { sessionId, draft: protectedDraft.text, protectedTokens: protectedDraft.tokens, selection, settings: settings.value };
        } catch {
        }
      }
      return { key, dedupeKey, eligible: !!eligible && !!request, request };
    };
    const controller = new PredictionController({
      read,
      changed: () => {
        if (!disposed) view.show(controller.suggestion, controller.message);
      },
      predict: async (request, signal) => {
        const result = await ctx.remote.promptEnhance.predict(request, signal);
        if (!result.ok) throw new Error(result.error.message);
        return result.value;
      },
      insert: (text) => {
        const draft = input.state.getSnapshot();
        if (draft.draft === "" && !draft.occurrences.length && !inputActions.insertText("", inputActions.captureInsertion())) return false;
        return inputActions.insertText(text, inputActions.captureInsertion());
      }
    });
    const reconcile = () => {
      if (!disposed) controller.reconcile();
    };
    const onCompositionStart = () => {
      composing = true;
      reconcile();
    };
    const onCompositionEnd = () => {
      composing = false;
      compositionUntil = Date.now() + 20;
      reconcile();
      setTimeout(reconcile, 25);
    };
    const onKey = (event) => {
      if (event.defaultPrevented || event.isComposing || event.keyCode === 229 || composing || Date.now() < compositionUntil || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
      if (event.key === "Tab" && controller.suggestion && read().eligible && controller.accept()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      } else if (event.key === "Escape" && (controller.suggestion || controller.pending)) {
        controller.dismiss();
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    editor.addEventListener("keydown", onKey, true);
    editor.addEventListener("compositionstart", onCompositionStart);
    editor.addEventListener("compositionend", onCompositionEnd);
    editor.addEventListener("focus", reconcile);
    editor.addEventListener("blur", reconcile);
    document.addEventListener("selectionchange", reconcile);
    document.addEventListener("visibilitychange", reconcile);
    const mutation = new MutationObserver((records) => {
      if (records.some((record) => record.target instanceof Element && !record.target.closest(".dsh-prediction-mirror, .dsh-prediction-badge") && !(record.type === "attributes" && (record.attributeName === "data-prediction-visible" || record.target === editor.parentElement)))) reconcile();
    });
    mutation.observe(card, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["data-composer-composing", "contenteditable", "hidden"] });
    const stopLocale = subscribeLocale(() => view.show(controller.suggestion, controller.message));
    const resize = new ResizeObserver(() => view.show(controller.suggestion, controller.message));
    resize.observe(editor);
    const stops = [settings.subscribe(reconcile), input.state.subscribe(reconcile), directory.store.subscribe(reconcile), session.session.subscribe(reconcile), session.eventSource.subscribe(reconcile), blocks.subscribe(reconcile), ctx.uiSession.sessionStatus.subscribe(reconcile)];
    void directory.load().then(reconcile).catch(() => {
    });
    void settings.load().then(reconcile);
    reconcile();
    return () => {
      disposed = true;
      controller.dispose();
      mutation.disconnect();
      stopLocale();
      resize.disconnect();
      stops.forEach((stop) => stop());
      editor.removeEventListener("keydown", onKey, true);
      editor.removeEventListener("compositionstart", onCompositionStart);
      editor.removeEventListener("compositionend", onCompositionEnd);
      editor.removeEventListener("focus", reconcile);
      editor.removeEventListener("blur", reconcile);
      document.removeEventListener("selectionchange", reconcile);
      document.removeEventListener("visibilitychange", reconcile);
      view.dispose();
    };
  }, [ctx, sessionId, settings, inputActions]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { ref: marker, className: "dsh-prediction-badge", role: "status", "aria-live": "polite" });
}

// src/client/index.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var labels = { get moderate() {
  return t("m011");
}, get expanded() {
  return t("m012");
} };
var contextLabels = { get draft() {
  return t("m013");
}, get recent() {
  return t("m014");
}, get extended() {
  return t("m015");
} };
function EnhanceIcon({ pending, restore }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
      children: pending ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { className: "dsh-prompt-enhance-progress", cx: "12", cy: "12", r: "9", strokeDasharray: "42 15" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "m9 9 6 6m0-6-6 6" })
      ] }) : restore ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M9 14 4 9l5-5" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M9.6 5.4 11.76 10.44 16.8 12.6 11.76 14.76 9.6 19.8 7.44 14.76 2.4 12.6 7.44 10.44Z" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M18 4.2 19.08 6.72 21.6 7.8 19.08 8.88 18 11.4 16.92 8.88 14.4 7.8 16.92 6.72Z" })
      ] })
    }
  );
}
function EnhanceButton({ binding, settings }) {
  useLocale();
  const [, render] = (0, import_react4.useReducer)((n) => n + 1, 0);
  const [compareOriginal, setCompareOriginal] = (0, import_react4.useState)(true);
  const [previewSettings, setPreviewSettings] = (0, import_react4.useState)(settings.value);
  const [dismissed, setDismissed] = (0, import_react4.useState)("");
  const controller = (0, import_react4.useMemo)(() => new EnhanceController({ ...binding, changed: render, nonce: () => crypto.randomUUID() }), [binding]);
  (0, import_react4.useLayoutEffect)(() => {
    const unsubscribe = binding.subscribe(() => {
      controller.reconcile();
      render();
    });
    return () => {
      unsubscribe();
      controller.dispose();
    };
  }, [binding, controller]);
  (0, import_react4.useEffect)(() => {
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
  const enhanceSessionId = binding.read().sessionId;
  (0, import_react4.useLayoutEffect)(() => {
    settings.setEnhancing(enhanceSessionId, pending || !!controller.preview || controller.checkingPreview);
  });
  (0, import_react4.useEffect)(() => () => settings.setEnhancing(enhanceSessionId, false), [settings, enhanceSessionId]);
  const selection = controller.preview?.response.selection ?? controller.preview?.snapshot.selection;
  const start = () => {
    if (reason) return;
    const captured = structuredClone(settings.value);
    setDismissed("");
    setCompareOriginal(true);
    setPreviewSettings(captured);
    void controller.start(mode, captured);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh-prompt-enhance", "data-prompt-enhance": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_dsh_client_ui_primitives2.Button,
      {
        variant: "ghost",
        size: "sm",
        type: "button",
        className: "dsh-prompt-enhance-trigger",
        "aria-label": pending ? t("m016") : canUndo ? t("m017") : t("m018"),
        "aria-busy": pending,
        "aria-disabled": !pending && !canUndo && !!reason,
        title: pending ? t("m019") : canUndo ? t("m017") : diagnostic(reason) || t("m020", { p0: labels[mode] }),
        onClick: () => {
          setDismissed("");
          if (pending) controller.cancel();
          else if (canUndo) controller.restore();
          else start();
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(EnhanceIcon, { pending, restore: canUndo })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh-prompt-enhance-sr", role: "status", "aria-live": "polite", children: pending ? t("m021") : diagnostic(controller.message) }),
    controller.message && dismissed !== controller.message && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_dsh_client_ui_primitives2.Toast,
      {
        text: diagnostic(controller.message),
        holdMs: 4500,
        onDone: () => setDismissed(controller.message)
      },
      controller.message
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_dsh_client_ui_primitives2.Modal,
      {
        open: !!controller.preview,
        onClose: () => controller.closePreview(),
        title: t("m022"),
        closeLabel: t("m023"),
        description: `${labels[previewSettings.mode]} \xB7 ${contextLabels[previewSettings.context]}`,
        className: "dsh-prompt-enhance-dialog",
        contentClassName: "dsh-prompt-enhance-dialog-body",
        footer: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives2.Button, { variant: "ghost", onClick: () => controller.closePreview(), children: t("m024") }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives2.Button, { variant: "primary", disabled: controller.checkingPreview, onClick: () => {
            setDismissed("");
            void controller.acceptPreview();
          }, children: controller.checkingPreview ? t("m025") : t("m026") })
        ] }),
        children: controller.preview && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh-prompt-enhance-preview-toolbar", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { className: "dsh-prompt-enhance-meta", children: [
              selection?.model,
              selection?.reasoningEffort && ` \xB7 ${selection.reasoningEffort}`,
              " \xB7 ",
              previewSettings.modelStrategy === "follow" ? t("m027") : t("m028"),
              controller.preview.snapshot.attachmentIds.length > 0 && t("m029", { p0: controller.preview.snapshot.attachmentIds.length })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: "dsh-prompt-enhance-compare-toggle", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { type: "checkbox", checked: compareOriginal, onChange: (event) => setCompareOriginal(event.target.checked) }),
              t("m030")
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: `dsh-prompt-enhance-comparison${compareOriginal ? "" : " dsh-prompt-enhance-comparison-solo"}`, children: [
            compareOriginal && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "dsh-prompt-enhance-original", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { children: t("m031") }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("pre", { className: "dsh-prompt-enhance-text", children: controller.preview.snapshot.draft.text })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { children: t("m032") }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("pre", { className: "dsh-prompt-enhance-text", children: controller.preview.draft.text })
            ] })
          ] }),
          controller.preview.response.context?.warnings.map((warning, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "dsh-prompt-enhance-warning", role: "status", children: localize(warning, controller.preview.response.context?.warningMessages?.[index] ?? void 0) }, warning)),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("details", { className: "dsh-prompt-enhance-sources", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("summary", { children: [
              t("m033"),
              controller.preview.response.context?.sources.length ?? 0,
              t("m034")
            ] }),
            controller.preview.response.context?.sources.map((source, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "dsh-prompt-enhance-source", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h4", { children: sourceLabel(source) }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("pre", { className: "dsh-prompt-enhance-text", children: source.text })
            ] }, index)),
            !controller.preview.response.context?.sources.length && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: t("m035") })
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
    if (ctx.sessions.binding(sessionId) !== session || snapshot.removed || snapshot.openState !== "open") return t("m036");
    if (snapshot.subagent !== null) return t("m037");
    if (state.claim || state.phase === "claimed" || /^\s*\/\S/u.test(state.draft)) return t("m038");
    if (state.phase !== "plain" || blocks.getSnapshot() || ctx.uiSession.sessionStatus.getSnapshot().get(sessionId)?.pendingInteraction) return t("m039");
    if (!state.draft.trim()) return t("m040");
    if (state.draft.length > DRAFT_CHAR_LIMIT) return t("m041", { p0: DRAFT_CHAR_LIMIT.toLocaleString() });
    if (!settings.ready) return settings.error || m("m042");
    if (settings.value.modelStrategy === "dedicated") {
      const selected = settings.value.dedicated;
      if (!selected || !settings.capabilities.models.some((model) => model.provider === selected.provider && model.model === selected.model && (!selected.reasoningEffort || model.efforts.includes(selected.reasoningEffort)))) return t("m043");
    } else if (models.status !== "ready" || !models.routable || !models.current) return t("m044");
    return "";
  };
  return {
    reason,
    read: () => {
      const state = input.state.getSnapshot();
      const current = directory.store.getSnapshot().current;
      return {
        sessionId,
        revision: state.draftRev,
        draft: { text: state.draft, references: state.occurrences.map(({ occurrenceId: _id, ...reference }) => ({ ...reference })) },
        attachmentIds: [...state.attachmentIds],
        selection: settings.value.modelStrategy === "dedicated" ? settings.value.dedicated : current,
        current: current ?? null,
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
var inject = ["locale", "remote", "slots", "sessions", "conversation", "modelDirectories", "uiSession"];
async function apply(ctx) {
  const unmountRemote = await ctx.remote.$mount(TYPERT_REMOTE);
  const ui = ctx.inject(["locale", "remote.promptEnhance", "remote.session", "slots", "sessions", "conversation", "modelDirectories", "uiSession"], (scope) => {
    installLocale(scope);
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
      label: () => t("m045"),
      inject: () => ({ settings })
    }, EnhanceSettingsPage));
    scope.slots.inject("conversation.input.overlay", () => scope.slots.register({
      name: "conversation.input.overlay",
      id: "dsh-prompt-improver",
      order: 100,
      inject: (sessionId) => ({ ctx: scope, sessionId, settings })
    }, PredictionOverlay));
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
