# 增强模板功能设计提案（0.4.0）

状态：**待确认 · v2**（2026-11-09 重写）。合并原型验证（`output/prototype-templates-20261106/`）、生态插件排版调研与四轮设计收敛；v1 的「单动作、无默认」已被 2026-11-09 用户决策取代，本文为当前唯一有效版本。确认后按第 9 节步骤落地。

基于 `dsh-prompt-improver` 0.3.1 源码与 DSH 0.2.2-rc.1 宿主。

---

## 0. 一句话目标

星光按钮升级为**模板入口**：右键菜单提供「AI 增强 / 预测下一句 / 模板双动作（本地套用 + AI 适配）/ 设置跳转」；设置页以两 tab（增强偏好 | 增强模板）管理模板并支持**自定义左键默认执行动作**。本地套用零模型调用；AI 适配以模板为完整指令调用模型。

## 1. 设计决策记录

| # | 决策 | 结论 | 依据 |
| --- | --- | --- | --- |
| 1 | 模板本质 | 含 `{draft}` 占位符的文本骨架，两种用法：本地套用（零调用）/ AI 适配（完整指令调模型） | 用户 2026-11-06、2026-11-09 两轮指示 |
| 2 | 分组 | 砍除，≤20 条平铺 | 用户 2026-11-08 |
| 3 | 默认机制 | 一度砍除后**以「默认执行动作」形态回归**：左键动作可选（AI 增强 / 模板套用 / 模板 AI 适配），缺省 = AI 增强 | 用户 2026-11-09（「直接点击按钮保持原来的选项，并且用户可以自定义默认设置」） |
| 4 | 菜单形态 | 双动作：模板主区点击 = 本地套用；行内星光图标 = AI 适配；行内按钮事件隔离（stopPropagation） | 用户 2026-11-09；原型验证 |
| 5 | AI 适配指令构成 | **模板即完整指令**：模板文本填入草稿后作为完整指令发给模型，替代「增强方式」指令段 | 用户 2026-11-09 明确选择 |
| 6 | 菜单附加项 | 「预测下一句」（立即增强下方）+ footer 行内齿轮跳转设置页 | 用户 2026-11-09 |
| 7 | 删除确认 | 两击确认 + 3.5s 自动复位 | 生态调研 B2 |
| 8 | 编辑形态 | 列表行内展开编辑，不叠弹窗 | 生态调研 B3（三家互证） |
| 9 | 设置页布局 | 两 tab（增强偏好｜增强模板），宿主 `SegmentedTabs`；旧四分区并入「增强偏好」纵向排布；保存栏跨 tab 共用 | 用户 2026-11-09（「使用 tab 分隔」「集合到增强偏好中」） |
| 10 | 保存契约 | 整页「保存设置 / 取消」一次提交全部字段 | 既有契约 + `customInstructions` 先例 |
| 11 | 增强要求输入框 | 不可手动拉伸，随内容自动增高（`field-sizing: content` + JS scrollHeight 兜底，上限内滚） | 用户 2026-11-09 |
| 12 | 调研范围 | 仅采信 DSH 生态第三方插件（11 npm 包 + 4 本机副本）；兄弟仓库插件调研作废 | 用户 2026-11-06 |

## 2. 模板定义与契约

### 2.1 类型（`src/shared/types.ts` 新增）

```ts
export const DRAFT_PLACEHOLDER = '{draft}'
export const TEMPLATE_NAME_LIMIT = 40
export const TEMPLATE_TEXT_LIMIT = 2_000
export const TEMPLATE_LIMIT = 20

export interface EnhanceTemplate {
  id: string      // crypto.randomUUID()
  name: string    // trim 后 1–40 字符
  text: string    // trim 后非空，≤2000，恰好含一个 {draft}
}

/** 本地套用：占位符替换为草稿全文（replace 函数实参避免 $ 序列陷阱）。 */
export function applyTemplate(template: EnhanceTemplate, draft: string): string {
  return template.text.replace(DRAFT_PLACEHOLDER, () => draft)
}

/** 左键默认执行动作；缺省 = AI 增强（现状行为）。 */
export type DefaultAction =
  | { kind: 'enhance' }
  | { kind: 'template-apply'; templateId: string }
  | { kind: 'template-adapt'; templateId: string }
```

### 2.2 设置契约（`EnhanceSettings` 新增两个可选键）

```ts
templates?: EnhanceTemplate[]     // 缺省 = 无模板；空数组不写入持久化对象
defaultAction?: DefaultAction     // 缺省 = { kind: 'enhance' }；缺省不写入持久化对象
```

- `settings.json` 路径与权限位不变；旧文件缺两键 = 无模板 + 左键 AI 增强，读取即合法，**零迁移**；回滚 0.3.1 时旧版本忽略新键，双向兼容；
- **归一化纪律（`validateSettings` 扩展，宽容不抛错）**：
  - 模板：单条无效（名称/占位符/超长违规）静默删除该条；超 20 条截断；非数组/字段类型异常整体视为无模板；空数组归一为缺省；
  - `defaultAction`：`templateId` 不指向现存模板、`templates` 为空、字段类型异常 → 静默回落 `{ kind: 'enhance' }`；
  - 归一化确定性（幂等、键序稳定）——`predict` 的设置一致性比较依赖。

### 2.3 套用与适配规则

- 本地套用：`applyTemplate` 同步替换，结果超 `DRAFT_CHAR_LIMIT`（32 000）拒绝并复用 m041；不产生处理中状态；
- AI 适配：`EnhanceRequest` 新增可选字段 `templateInstruction?: string`（点击时捕获的模板全文，`{draft}` 已由客户端填入草稿）；Host 端 `enhanceDraft` 用它**替换** `systemPrompt` 中「增强方式」（moderate/expanded）指令段，其余安全链路——引用保护、语言漂移拒绝、mystery 校验、超时、owner、`customInstructions` 附加段——**全部沿用不动**；适配同走撤销槽与预览/直接替换的 adoption 设置；
- 输入预测与模板无关；settings 快照中的新键仅随车通过校验。

## 3. 入口交互

### 3.1 状态机

| 操作 | 行为 |
| --- | --- |
| 左键（空闲） | 执行 `defaultAction`：enhance → 现有 AI 增强；template-apply → 本地套用；template-adapt → AI 适配 |
| 左键（处理中） | 取消（不变，仅 enhance/adapt 路径有处理中） |
| 左键（已采用） | 恢复原文（不变） |
| 右键 / Menu 键（空闲） | 打开菜单 |
| 右键（处理中） | 不打开（沿用 0.1.1 规则） |
| 右键（已采用 / 不可增强） | 不打开 |

- 套用路径无处理中状态，无取消竞态；AI 增强/适配/预测共用既有 pending/取消机制；
- 三种结果（套用/增强/适配）共用同一撤销槽；编辑草稿/换会话后撤销失效；
- 菜单打开期间可继续编辑草稿；动作按**当前**草稿执行。

### 3.2 菜单结构（宿主 `Menu`，portal + 锚定按钮向上弹出）

```
[MenuLabel] AI 增强
  立即增强（跟随设置）· 默认        ← controller.start（defaultAction === 'enhance' 时带徽标）
  预测下一句                       ← 触发一次灰字预测（对应正式版 prediction）
  ────────────────
[MenuLabel] 模板
  结构化任务   按目标·步骤…  ✨     ← 主区点击=本地套用；✨=AI 适配（行内图标，stopPropagation）
  代码审查     按严重程度…  ✨
  …（≤20 条，数组顺序）
  在「设置 → 提示词增强」中管理模板  ⚙   ← footer 行内齿轮：打开设置页模板 tab
```

- 默认动作对应项行尾加 `· 默认` 徽标（纯视觉）；无模板时模板组不显示；
- 行内图标按钮与主区的点击隔离、`mousedown` 保光标（A5）——原型已验证；
- 键盘走查 / Escape / 焦点返回由宿主 Menu 承担；
- **React 陷阱（原型踩坑）**：`Menu` 的 `children` prop 与 JSX children 并存时后者覆盖前者——只用 JSX children 单通道。

### 3.3 预测项与快捷键提示

- 菜单「预测下一句」：手动触发一次预测（正式版自动预测由现有 `prediction.tsx` 承担，菜单项仅是显式入口）；
- 输入框下常驻快捷键提示：「Tab 接受预测 · Esc 隐藏建议 · 右键星光 = 模板菜单」（正式版沿用现有预测快捷键体系，提示文案归入 messages）。

## 4. 设置页（两 tab）

### 4.1 结构（宿主 `SegmentedTabs`，保存栏跨 tab 共用）

```
[ 增强偏好 | 增强模板 ]                    ← SegmentedTabs，点击才渲染对应面板
─────────────────────────────
tab 面板（单面板显示）
─────────────────────────────
[状态行]                    [取消] [保存设置]   ← 共用，一次提交全部字段
```

- **增强偏好 tab**（旧四分区纵向合并）：增强方式（radio）→ 增强后（下拉）→ 自定义增强要求（textarea，自适应增高不可拉伸）→ 输入预测（开关）→ 参考范围（radio）→ 增强模型（策略 + 专用模型下拉）；
- **增强模板 tab**（新）：见 4.2；
- `sameSettings` 补 `templates` 与 `defaultAction` 比较；保存载荷走 `validateSettings` 归一；
- 非所有者：只读 dl 清单新增「增强模板 → 无自定义模板」「默认执行动作 → AI 增强」两行，无 tab 化（保持现只读样式）。

### 4.2 增强模板 tab 内容

1. 标题「增强模板（N/20）」；
2. **默认执行动作下拉**：「AI 增强（跟随增强偏好）」（缺省）+ 每个现存模板两档 `{名}（本地套用）`、`{名}（AI 适配）`；所选模板删除时归一回落 AI 增强；
3. 「＋ 新建模板」按钮 + 模板列表（平铺）：行 = 名称 + 内容摘要（`{draft}` 显示为 `〔草稿〕`，ellipsis）+ 字符数 + 「编辑」「删除」；
4. 行内编辑卡（列表位置展开）：名称 input（n/40 计数）+ 内容 textarea（n/2000 计数）；placeholder 写明 `{draft}` 用法；Ctrl+Enter 提交、Esc 返回；校验行内红字：名称 1–40、内容非空 ≤2000、恰好一个 `{draft}`；
5. 删除两击确认（变红「再次点击确认」+ 3.5s 复位）；
6. 空态：还没有模板。新建后即可在输入框右键菜单中一键套用。

## 5. 兼容性设计（六层）

1. **数据契约**：两个可选键，缺省即合法，零迁移，双向可回滚；
2. **校验宽容**：模板/defaultAction 异常静默过滤回落，坏数据不阻断 enhance/predict；
3. **设置页**：新 tab 搭旧保存流程；`sameSettings` 一处扩展；
4. **predict 一致性**：快照自动携带新键，同源归一化不误报——**测试钉住**（含 defaultAction 非缺省值的场景）；
5. **enhance 链路**：仅新增可选 `templateInstruction`；无该字段时行为与 0.3.1 完全一致；Typert schema 构建时自动重生成；
6. **升级回滚**：0.3.1↔0.4.0 双向安全；settings.json 损坏时 m151 保护不变。

## 6. 边界与提示（messages.ts 新增，从 m178 起取号，中英同步）

| 归属 | 条目（zh） |
| --- | --- |
| 菜单 | `增强选项`（aria）、`立即增强（跟随设置）`、`预测下一句`、`模板`、`用模板 {p0} 进行 AI 适配`（✨ aria）、`在「设置 → 提示词增强」中管理模板`、`打开提示词增强设置`（⚙ aria） |
| 徽标 | `默认`（菜单行尾小徽标） |
| 反馈 | `已套用模板「{p0}」`、`已按模板「{p0}」完成适配。`、`已取消适配。`、复用 m041 |
| Host 错误 | `适配失败，请检查模型可用性；原文已保留。`（复用既有 failed 通道，新增 reason=template-adapt-failed） |
| 设置页 | `增强模板`、`默认执行动作`、`AI 增强（跟随增强偏好）`、`{p0}（本地套用）`、`{p0}（AI 适配）`、`新建模板`、`模板名称`、`模板内容`、`用 {draft} 标记草稿填入位置，其余文字原样保留；最多 {p0} 字符。`、`模板名称不能为空`、`模板内容不能为空`、`模板内容必须恰好包含一个 {draft} 占位符`、`再次点击确认删除`、`已从草稿态移除；点击「保存设置」生效。`、`还没有模板。新建后即可在输入框右键菜单中一键套用。`、`编辑模板：{p0}` |
| 预测提示 | `Tab 接受预测 · Esc 隐藏建议`（常驻提示行，键名 kbd 呈现） |
| 只读 | `无自定义模板` |

## 7. 原型验证记录与验收层级

- **原型已验证**（`/proto`，原生壳 0.2.2-rc.1）：双动作菜单与事件隔离、菜单 children 单通道、默认动作 UI 未做（待实现）、两 tab 设置页、自适应输入框、两击删除、只读视图、gear 跳转、9 组自检；
- **验收层级**：`npm run check` → `check:package` → browser 回归（single-button.js 新增模板组）→ 隔离 DSH_HOME 安装 → 日用 profile 实机，记入 verification.md。

## 8. 实现步骤（依赖顺序）

| # | 步骤 | 涉及文件 |
| --- | --- | --- |
| 1 | 共享契约：EnhanceTemplate/DefaultAction/常量/applyTemplate/validateSettings 宽容归一 | `src/shared/types.ts` |
| 2 | Host：`enhance` 请求可选 `templateInstruction`，替换增强方式指令段；安全链路不动 | `src/shared/types.ts`、`src/host/enhance.ts`、`src/host/prompt.ts` |
| 3 | 控制器：套用（同步）、适配（走 pending/取消/撤销）、默认动作分派 | `src/client/controller.ts` |
| 4 | 文案键 zh/en | `src/shared/messages.ts` |
| 5 | 入口：双动作菜单、默认徽标、预测项、gear 跳转、快捷键提示 | `src/client/index.tsx` |
| 6 | 设置页：两 tab 改造 + 模板管理 + 默认动作下拉 + 只读行 | `src/client/settings.tsx` |
| 7 | 样式（D 系列纪律） | `src/client/style.css` |
| 8 | 测试：归一/迁移/坏数据、predict 一致性（含 defaultAction）、适配注入与安全链路、套用/撤销/超限、locale、browser 回归 | `test/*.test.ts`、`test/browser/single-button.js` |
| 9 | 文档中英八份 + 版本 0.3.1→0.4.0 发布流程 | `README*`、`docs/*`、`package.json` |

**不改动**：`src/shared/references.ts`、RPC 方法集合、设置文件路径与 owner 分级、预测行为、mystery/引用/语言校验。

## 9. 明确不做

- 模板分组与搜索；导入导出、收藏、用量统计、历史版本；
- 即时保存；入口按钮胶囊化/文字/光效；打字机空稿引导；hack 宿主 hash 类名；
- AI 适配的流式返回与多档位（沿用单次调用 + adoption 采用流程）。

## 10. 调研与原型索引

- 生态调研（15 家）结论与证据行号：2026-11-06 会话报告；A5 保光标、B1/B2/B3、B6、D 系列为本次采纳项；
- 原型：`output/prototype-templates-20261106/`（双动作菜单、两 tab 设置、gear、预测提示均已实装）；图形稿：`output/prompt-ui-research/diagrams/`（01 已更新为双动作版，02/03 待实现后随验收截图归档）。
