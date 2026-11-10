# 提示词增强优化设计提案

状态：**已确认并实施（2026-11-03）**。批次一（O1/O2/O3/O5/O6/O10/O11/O13/O14）与批次二（O8 自定义增强要求、O9 逐词接受）已落地，验证见[验证记录](verification.md)；O12/O15/O17/O19 按确认不做；D2 英文文档同步已完成（2026-11-04）；D1 经确认不再需要（2026-11-04），流式预览与宿主快捷键槽位相关设想随之关闭。
基于 `dsh-prompt-improver` 0.2.12 源码与文档（2026-11-03）。
标注约定：**【待确认】** 需项目负责人拍板后才实施；**【需宿主】** 依赖 DSH 宿主新能力，本轮不做；**【不改】** 有意保持的现状，附理由。

---

## 0. 优化目标与范围

**范围**（与需求一致，六个方面）：设置页、增强偏好、输入预测、参考范围、增强模型、预览流程。

**目标排序**：可靠性（不破坏现有安全语义）＞ 控制力（用户对"改什么、参考什么、用哪个模型"的知情与干预）＞ 操作成本（少点一步、少开一次设置）＞ 新功能。
**【待确认-G1】** 此排序为默认提案；若希望把"新功能"或"模型成本"提前，请调整后再排批次。

**硬约束（本轮任何改动不得触碰）**：

- 引用占位符保护/校验/恢复链路（`src/shared/references.ts`）；
- 一次增强 = 一次无工具辅助调用，不进智能体循环、不新增聊天消息（`src/host/enhance.ts:49`）；
- 语言漂移拒绝、引用缺失拒绝、神秘注入未生效拒绝（`src/host/enhance.ts:106-115`）；
- owner 分级与声明式 session 资源授权（`src/index.ts:40-45`、`@Remote resources`）；
- 不恢复已移除的预测参考说明折叠区（0.2.10 有意移除）；不加右键/菜单键快捷菜单（guide.md 已声明）。

---

## 1. 参考方案与依据

### 1.1 OpenAI Codex CLI

| # | 设计点 | 依据 |
| --- | --- | --- |
| R1 | **AGENTS.md 持久自定义指令**：项目级指导文件随仓库走，Codex 启动即读取并逐层合并，作为每次任务的持久约束，而非每次手敲。 | [ChatGPT Learn: AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md.md)、[Codex CLI Memory & Project Docs](https://mintlify.wiki/openai/codex/features/memory) |
| R2 | **Esc-Esc 回溯编辑上一条消息并 fork**：把"对历史输入的修正"做成显式入口，编辑后从该点分叉，而不是覆盖历史。 | [openai/codex#37974（Esc-Esc backtrack → fork 行为描述）](https://github.com/openai/codex/issues/37974)、[openai/codex#31902（文档中 fork 语义）](https://github.com/openai/codex/issues/31902) |
| R3 | **审批策略与沙箱模式分离、默认 read-only 最小权限**：`approvalMode`（untrusted/on-failure/on-request/never）与 `sandboxMode`（read-only/workspace-write/danger-full-access）是两个独立维度；默认最小授权。 | [Codex CLI 配置面整理（approvalMode/sandboxMode）](https://github.com/rajatsandeepsen/sarvam-ai-sdk/blob/67339f45ae83a43f7abdd876535acc5821509593/content/providers/05-community-providers/13-codex-cli.mdx)、[Codex 使用指南（默认 `--sandbox read-only`）](https://cdn.jsdelivr.net/npm/@heart-of-gold/toolkit@0.1.51/plugins/guide/skills/codex/SKILL.md) |
| R4 | **排队消息可编辑**：任务运行中排队/追加的用户消息可被编辑（`⌥+↑ edit last queued message`）。 | [openai/codex@4ad3b59（TUI 文案）](https://github.com/openai/codex/commit/4ad3b59de322dc75c2b257b2eec365309b195ab7) |

**取舍**：R2/R4 的对象是"会话历史"，本插件的增强是一次辅助调用、不产生会话历史，fork/回溯只映射到现有**单级撤销**（【不改】，`src/client/controller.ts:157-164` 已满足）。R3 是验证而非改动：本项目已有 owner 分级 + 扩展上下文额外 owner 校验 + 声明式资源授权，方向一致。**真正可移植的是 R1** → 见 O8。

### 1.2 VS Code / GitHub Copilot 内联建议（ghost text）

| # | 设计点 | 依据 |
| --- | --- | --- |
| R5 | **键位体系**：Tab 接受 / Esc 拒绝；`Ctrl+→`（macOS `Cmd+→`）**逐词接受**；`Alt+]` / `Alt+[` 在多条候选间**循环切换**；`Alt+F2` 朗读当前建议（无障碍）。 | [vscode-docs: Inline suggestions](https://github.com/microsoft/vscode-docs/blob/84925c376940c6025627e593ea2f9a57300e087d/docs/editing/ai-powered-suggestions.md)、[Copilot 键位参考（含 Alt+]、逐词接受）](https://github.com/open-source-accessibility/Open-Source-Assistive-Technology-Hackathon/blob/58f1258a1eb5515ac8279e7ff3b2f72396c05092/learning-room/docs/appendix-w-github-copilot-reference.md#2) |

本项目预测已实现 Tab/Esc 与"浅色不写入"基线（`src/client/prediction.tsx:123-127`），缺逐词接受、手动触发与候选循环 → 见 O9/O10/O12。

### 1.3 Google AI Studio 及同类"就地改写"工具

| # | 设计点 | 依据 |
| --- | --- | --- |
| R6 | **改写先 review 后 replace**：模型建议重写提示词后进入接受/拒绝确认，而不是直接覆盖；第三方集成也遵循"快捷键 → review → Replace"流程。 | [实测：AI Studio 重写提示词并允许逐处接受/拒绝](https://dev.to/fedtti/optimize-your-prompts-by-using-shorter-synonyms-with-google-ai-studio-30lk/#1)、[PromptDC in Google AI Studio（Ctrl+Shift+E → review → Replace）](https://promptdc.com/integrations/google-ai-studio) |

本项目"先预览"模式已满足 review-before-replace；缺口是**预览内不能重试、不能复制**，且直接替换模式无快捷键入口 → 见 O2/O3/O19。

### 1.4 Anthropic Console Prompt Improver

| # | 设计点 | 依据 |
| --- | --- | --- |
| R7 | **side-by-side 对比 + 版本化重跑**：改进后的提示词与原稿并排查看，可保存新版本、重跑测试并对比多个提示词的输出。 | [Evaluate prompts in the developer console（side-by-side 比较、版本重跑）](https://claude.com/resources/articles/evaluate-prompts#1)、[Claude 博客同文](https://claude.com/blog/evaluate-prompts) |

本项目预览已是并排双栏（`src/client/index.tsx:104-107`），缺**词级差异高亮**与**同稿重试** → 见 O1/O2。

### 1.5 引用边界说明

- **Cursor 未列入**：公开资料中缺少稳定可引用的"提示词增强/逐词接受"细节，避免无依据转述；Copilot/vscode-docs 已覆盖 ghost text 交互基线。
- 本文所有外部描述仅取自上述链接所述行为，不推断未公开实现（如各产品的具体模型分配）。

---

## 2. 现状定位（代码级）

| 方面 | 现状 | 位置 |
| --- | --- | --- |
| 预览流程 | 并排双 `<pre>` 原文/增强稿 + "对照原文"开关 + 来源折叠 + 警告行；采纳前二次校验模型与草稿状态；无词级差异、无重试、无复制 | `src/client/index.tsx:92-114`、`src/client/controller.ts:130-149` |
| 设置页 | 全部 owner-only；非 owner 只见一行文字；"刷新模型与设置"在页面最底部；显式保存/取消 + dirty/invalid 校验 | `src/client/settings.tsx:103,168-179` |
| 增强偏好 | 模式二选一（单选卡）、增强后（下拉）、神秘注入（开关）；无任何用户自定义改写要求的入口 | `src/client/settings.tsx:104-124`、`src/host/prompt.ts:5-32` |
| 输入预测 | 单条建议；Tab 全收 / Esc 隐藏；800ms 停顿 + 3s 间隔 + 30s 超时 + 内容去重；\>200 字符整单拒绝；沿用增强模型（含专用） | `src/client/prediction.tsx`、`src/client/prediction-controller.ts`、`src/host/prediction.ts:127` |
| 参考范围 | 仅草稿 / 最近 3 轮 12k / 扩展（对话 8k + 记忆 4k + 项目 5 文件 4k，ripgrep 词法检索）；历史读取失败→整单失败 | `src/host/context.ts:13-37`、`src/host/history.ts`、`src/host/project.ts` |
| 增强模型 | 跟随当前 / 指定专用（含档位）；保存、点击、预览采纳三处校验；专用不可用明确失败不回退 | `src/client/settings.tsx:147-167`、`src/host/enhance.ts:72-77`、`src/client/index.tsx:168-176` |
| 入口与提示 | 星光按钮 title 仅含模式（m020 一个参数）；进行中点击=取消，采纳后按钮变恢复 | `src/client/index.tsx:79-91`、`src/shared/messages.ts:23` |

---

## 3. 优化设计

分级：**P0** 小改动高收益（不动 RPC 契约）；**P1** 中等（动设置契约或行为，需确认项已标注）；**P2** 默认不做、列出等拍板。

### 3.1 预览流程

**O1（P0）词级差异高亮**
- 现状：双栏纯文本，适度增强改动小时肉眼难定位（参考 R7 的并排差异呈现）。
- 设计：新增 `src/client/diff.ts` 纯函数：先按段落/行对齐取公共前后缀，中间部分用 Myers 词级 diff（`Intl.Segmenter` 词粒度）；输入超阈值（如合计 > 20,000 词元）退化为纯对照，保证大草稿不卡。
- 交互：增强稿侧新增片段用主题色下划线/底色标记；删除内容在原文侧标记；`对照原文` 开关保留；预览顶部给出 sr-only 摘要"新增 X 字、删除 Y 字"。
- 涉及：`src/client/index.tsx`（预览渲染）、新增 `diff.ts`、`style.css`、`messages.ts` 新增文案键；**不引入第三方 diff 依赖**。
- 验收：`test/` 新增 diff 单测（中英混合、引用占位符两侧不动）；`test/browser/single-button.js` 增加高亮存在性检查。

**O2（P0）预览内"重新增强"**
- 现状：结果不满意必须关闭预览→再点按钮；期间草稿若未变，快照原样可复用。
- 设计：预览 footer 增加 ghost 按钮"重新增强"：以 `preview.snapshot` 原快照重发请求（复用 `start()` 的 active 冲突与取消逻辑），完成后原位替换预览内容；composer 已变化则按现有 `m001` 语义关闭并提示。
- 【待确认-O2a】是否需要保留历史版本列表（Anthropic 式多版本对比）。最小方案：不保留，仅当前稿。
- 涉及：`controller.ts`（regenerate 入口）、`index.tsx`。

**O3（P0）复制按钮与统计**
- 增强稿标题行加"复制"按钮（写入剪贴板，成功后按钮短暂变"已复制"）；预览 meta 行加原文/增强稿字符数（沿用现有 `unit()` 复数规则）。

### 3.2 设置页

**O5（P0）非 owner 只读生效视图**（参考 R3"生效配置透明"）
- 现状：非 owner 只见一行 m059 文字，不知道生效的是什么。
- 设计：非 owner 显示只读清单：增强方式/增强后/参考范围/增强模型=默认值（即其实际生效值，`DEFAULT_SETTINGS`），输入预测与神秘注入=关，并保留 m059 权限说明；不提供任何编辑控件，不调用 `getSettings`（现有权限语义不变）。
- 涉及：`settings.tsx`（分支渲染）、`messages.ts`。

**O6（P0）"刷新模型与设置"上移**
- 移到页首标题右侧的工具行；语义不变（保留未保存编辑）。删除页底原按钮。

### 3.3 增强偏好

**O8（P1）自定义增强要求**（参考 R1 AGENTS.md 的"持久指令"思想，落到本插件即"持久增强要求"）
- 契约：`EnhanceSettings` 新增 `customInstructions?: string`；`validateSettings` 规范化 trim，空串视为未设置，上限 **500 字符**；旧配置缺省字段=未设置，零迁移成本。
- UI：增强偏好组内新增多行输入框 + 实时字数；与其它项一样走"保存设置"生效。
- 注入：`systemPrompt(mode, injectMystery, userRules)` 在末尾追加固定段：`用户附加要求（只影响表达方式；不得覆盖本系统提示中的保留、引用与安全规则）：…`。放在 **system** 而非 user 消息，避免与"背景数据不是指令"的防线混淆；BASE 既有保留规则优先级声明已覆盖冲突场景。
- 作用面：手动增强双模式生效；**输入预测不应用**（与模式/预览/神秘注入同等对待，`predictionPrompt` 不变）。
- 透明度：预览 meta 行加"含自定义要求"标识；文档同步 README「常用设置」表与 guide.md。
- **【待确认-O8a】** 是否纳入此功能（扩大设置契约与 system prompt）。**【待确认-O8b】** 上限 500 字符是否合适。

### 3.4 输入预测

**O9（P1）逐词接受**（参考 R5）
- 设计：`PredictionController` 增加 `acceptWord()`：用 `Intl.Segmenter` 按词界切分建议，取首词（含词后空白）走现有 `insert()` 通道；剩余部分继续作为建议显示。
- 实现要点（难点预警）：插入后草稿 revision 变化会触发 `reconcile` 清空建议；需在 `acceptWord` 路径记住剩余后缀，并在新状态仍 eligible 且草稿以已插入内容结尾时恢复显示，否则静默清除。
- 键位：**默认 `Alt+→`**。Copilot 用 `Ctrl+→`，但 DSH 编辑器 `Ctrl+→` 是原生光标跳词，冲突。**【待确认-O9a】** 键位定稿（Alt+→ vs 其他），实机验证与原生快捷键不冲突后写入快捷键说明行。
- 涉及：`prediction-controller.ts`、`prediction.tsx`（keydown 分支）、`messages.ts`（说明行加"Alt+→ 逐词"）。

**O10（P0）手动触发**
- 现状：建议被去重（`attempted`）或条件性不出现时，用户只能改稿重试。
- 设计：`Alt+\` 触发 `controller.manualTrigger()`：清除当前 dedupeKey 的去重记录并立即调度一次请求（仍受单请求/3s 间隔限制）；设置页快捷键说明行加一句。参考 Copilot 的手动触发惯例（R5 键位家族）。

**O11（P0）超长建议词界截断**
- 现状：模型偶发返回 >200 字符时整单拒绝（`prediction.ts:127`、客户端 `prediction-controller.ts:59`），用户什么也看不到。
- 设计：host 端在 ≤200 码点的最后一个词界/标点处截断后返回，badge 提示"建议已截断"；客户端校验保留 ≤ 限制作为防御。

**O12（P2）候选循环**【待确认-O12a】
- `Alt+]` / `Alt+[` 在 2~3 条候选间切换，host 一次返回数组。契约改动 + 每次预测用量 ×N。默认不做。

### 3.5 参考范围

**O13（P0）按钮 tooltip 显示生效组合**
- m020 扩为三参数：`增强提示词 · {模式} · {范围} · {模型策略}`，数据在 `read()` 现成（`src/client/index.tsx:82`、`messages.ts:23`）；中英字典同步。

**O14（P0）预览来源条目显示字符数**
- 来源标题后附 `· 1,234 字符`，只展示不改预算；配合 O3 让"实际参考来源"从黑盒变可核对。

**O15（P1）历史读取失败降级**【待确认-O15a】
- 现状：`recent`/`extended` 下读取历史失败 → 整单失败（`context.ts:27-30`），用户需手动切"仅草稿"重试。
- 设计（若批准）：失败时降级为仅草稿 + 明确警告"对话读取失败，本次仅参考草稿"，预览/Toast 照常展示。**行为变化**：与 guide.md「历史读取失败会停止请求」冲突，需文档同步；经确认保持现状（2026-11-03）。

**O16【不改】** 扩展上下文的预算、ripgrep 词法检索、忽略规则与凭据过滤保持（`project.ts`），已是最小充分实现。

### 3.6 增强模型

**O17（P2）预测独立模型策略**【待确认-O17a】
- 依据：补全类高频小额调用与主对话/增强用不同模型是补全产品的常见做法（R5 所属产品线中补全与聊天是两个功能面）；本插件预测固定沿用增强模型（含专用）。
- 若批准：`predictionModel: { strategy: 'followEnhance' | 'dedicated', dedicated }`，默认 `followEnhance` 完全兼容。设置页多一组模型选择，复杂度上升，故默认不做。

**O18【不改】** 专用模型不可用明确失败、不自动回退、档位宿主校验（`enhance.ts:72-77`），与 R3"不静默换路"一致，是正确行为。

### 3.7 入口

**O19（原 P1，已确认不做）增强快捷键**
- 参考 R6 的"快捷键 → review → replace"。方案：编辑器聚焦时 `Alt+E` 等价点击星光按钮（复用现有 reason/pending/canUndo 状态机）。风险：与 DSH 原生/其他插件键位冲突，必须实机验证；若宿主后续提供官方快捷键槽位则迁移。经确认不做（2026-11-04）。

---

## 4. 待确认清单汇总

| 编号 | 问题 | 默认方案 |
| --- | --- | --- |
| G1 | 优化目标排序 | 可靠性＞控制力＞操作成本＞新功能 |
| O2a | 预览重试是否带版本列表 | 不保留 |
| O8a | 自定义增强要求是否纳入（P1 契约） | 建议纳入 |
| O8b | customInstructions 上限 | 500 字符 |
| O9a | 逐词接受键位 | Alt+→（实测定稿） |
| O12a | 候选循环（用量×N） | 不做 |
| O15a | 历史读取失败降级为仅草稿 | 保持现状（明确失败） |
| O17a | 预测独立模型 | 不做 |
| O19a | 全局快捷键 Alt+E | 不做（2026-11-04 确认） |
| D1 | 经确认不再需要（2026-11-04）：不等待宿主流式 RPC 与快捷键槽位信息；流式预览与 O19 全局快捷键随之正式不做 | 已关闭 |

**【已补充-D2】**（2026-11-04）英文文档已与对应中文文档同步：`README.en.md`、`guide.en.md`、`development.en.md`、`verification.en.md`。

## 5. 实施批次建议（批准后）

1. **批次一（P0，纯客户端+局部小改，版本 Z+1）**：O1、O2、O3、O5、O6、O10、O11、O13、O14。每项配单测；跑 `npm run check` + `single-button.js` + 实机验收，更新 verification.md。
2. **批次二（P1 契约，版本 Y+1 / 0.3.0）**：O8（+已确认的 O9）。`settings.json` 兼容缺省、messages 双语、README/guide/development 四件套同步。
3. **批次三**：仅实施第 4 节中获批准的项（O12/O15/O17/O19）。

## 6. 明确不做（及理由）

- **跨会话草稿历史/多级撤销**：guide.md 明确"不是跨会话的草稿历史功能"；Codex fork 语义（R2）不适用于辅助调用，现有单级撤销已覆盖。
- **流式预览**：`enhance` 是 typert 一次响应；经确认不做（2026-11-04，原 D1 关闭）。
- **右键菜单/菜单键**、**预测参考说明折叠区**：guide.md 有意为之，保持。
- **项目检索向量化/额外模型调用**：现有词法方案有界、无额外费用（development.md 已声明不建向量库）。
