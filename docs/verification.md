# 验证记录

## 2026-10-28 完整中英文适配

本轮增加字典键与插值一致性、英文格式、旧响应兼容、原始诊断、原生 locale 生命周期与英文页面/导出回归。正式构建在隔离浏览器中验证未保存设置、预览、请求、筛选和预测的语言切换，以及中英、深浅主题和窄窗口。安装前需重新核对日用会话及后台任务空闲并备份。最终命令结果、截图、包摘要和实机验收状态以工作区 `output/bilingual-ui-20261028/delivery.md` 为准；本段不将尚未完成的步骤记为通过。

简体中文 · [English](verification.en.md)

[返回 README](../README.md) · [使用指南](guide.md) · [开发说明](development.md)

各节保留对应日期的版本、环境与验证范围。历史本机路径用于追溯，不是公开下载地址，也不是当前安装指令。

## 2026-10-28：0.2.10 设置原型落地

按确认原型，将神秘提示词注入与输入预测改为靠右对齐的宿主 `Switch`，缩短说明，单独展示 Tab/Esc 与模型用量提示；移除预测参考说明区域。既有增强参考范围选项、保存/取消流程及记忆不可用状态保留，不改变设置结构、预测提示词或模型调用。

`npm run check` 构建、类型及 68/68 测试通过；`npm run check:package` 的 39 个文件通过。8 组正式组件 UI 回归通过，包含原生开关默认值、取消、保存后生效、两个开关对齐及去除参考说明；另外验证 Space/Enter、记忆不可用提示、深浅主题及 1000/420/320px 无横向溢出。首次布局检查发现扩大点击区域溢出 6px，调整为向左扩展后六种布局全部通过。

源码基线、测试和后续安装证据保存在开发目录 `output/prompt-settings-ui-20261028/`；本包中的记录为打包时结果，最终日用安装状态以该目录的 `installation.md` 为准。

## 2026-10-28：0.2.9 日用适配修复

日用 rc.3 实测发现两处问题：空框的 placeholder 可能被追加到 mirror 后，原相邻选择器失效；发送后宿主清空 history，首条预测插入前缺少可撤销的空稿基线。前者改为同级选择器；后者仅在明确 Tab 接受空稿时，先通过原生 `inputActions.insertText('', captureInsertion())` 建立空编辑基线，再插入建议。没有改宿主文件或替换撤销系统。

`npm run check` 构建、类型及 68/68 测试通过；`npm run check:package` 的 39 个文件通过；根目录跨插件测试 7/7 通过。原生编辑器回归新增 placeholder 可见性及发送后清空历史的场景，共 12 组通过。

已安装到日用 desktop profile：旧名 `dsh-link-prompt-enhance 0.2.3` 迁移为 `dsh-prompt-improver 0.2.9`，同时安装 `dsh-memory 0.1.8-rc.2`。实际 Windows 拼音候选窗中灰字暂停，Tab 不接受预测，空格正常提交中文。空框及续写的 Tab 接受与一次 Ctrl+Z、原生引用菜单、结构化引用和真实附件、多会话切换、手动增强及恢复原文均通过。深浅主题和 633px 实际窗口的多行换行、滚动无横向溢出。

最终正常重启成功，临时 CDP 9222 已移除；恢复深色主题、原模型及增强偏好，预测开关保持关闭。原 228 个会话文件、50 条记忆完整对象、其他 11 个插件和宿主 ASAR 均未改变。两轮验收聊天只更新记忆处理元数据，没有新增记忆；保留验收聊天及一个切换用空会话。个人中心账本记录 16 次本插件调用（含手动增强），均有用量回执，模型为日用 GLM-5.3-Flash。截图、安装包哈希、检查命令和限制见[日用安装验收报告](../../output/prediction-daily-20261028/installation.md)。下方未安装等边界描述是对应候选阶段的历史状态。

## 2026-10-28：0.2.8 输入预测候选

保留工作区 0.2.7 神秘提示词注入，新增默认关闭的输入预测。启用后使用增强模型、最近 3 轮完整对话及只读记忆；灰字与实际草稿分离，Tab 才插入。未安装日用 profile、未发布 GitHub release。

| 检查 | 实际结果 |
| --- | --- |
| 本插件 `npm run check` | 构建、两套类型检查、68/68 测试通过 |
| memory `npm run check` | 154/154 测试通过 |
| automation `npm run check` | 共享契约消费者构建、类型及 248/248 测试通过 |
| 根目录 `npm run check:shared`、`npm run test:integration` | 共享副本一致；7/7 跨插件测试通过 |
| 两插件 `npm run check:package` | 各 39 个发布文件通过导出、生成副本及包内容检查 |
| 既有增强/设置界面 | 8 组通过，含预测默认关闭、保存后才生效，以及原有增强/预览/恢复交互 |
| rc.3 原生富文本浏览器夹具 | 11 组通过：空框/续写、Tab/Esc/Shift+Tab、一次原生撤销与去重、引用/附件、组词事件、菜单优先级、多会话迟到取消、关闭设置、末尾空段光标保护、增强并用、滚动 |
| 隔离真实模型 | 经已有 router 适配器调用 `opencode/big-pickle` 两次；空框 12,386 ms，续写 19,600 ms；用量归属 `dsh-prompt-improver` 并带原会话 ID，记忆与会话文件字节不变 |

单元测试还覆盖旧配置缺省、独立预测提示词、记忆不可用/禁用、无历史空框跳过、三秒节流、30 秒期限、草稿变更取消、迟到结果、模型失败/空输出/超长输出、owner 与 IM/子会话身份边界。模型内部使用严格 suffix JSON，避免把回答误当作续写；语义质量仍需用户判断。

证据：开发目录 `output/playwright/prediction-20261028/` 中的 `prompt-check.log`、`memory-check.log`、`automation-check.log`、`native-checks.log`、`enhancement-ui.log`、`prediction-live.json` 及 light/dark/narrow 截图。输入框取自本机 rc.3 未修改的 ASAR，使用实际 Lexical、引用节点、原生 keymap 和 history；RPC 与会话壳为隔离夹具。另检查深浅主题、420px 窄屏换行，无输入区横向溢出。

边界：尚未在完整桌面实例中安装并交互验收；中文组词使用合成 composition 事件，Windows 实际输入法候选窗未实测。菜单以原生 keymap 仲裁配合测试菜单状态验证。真实模型测试使用临时数据和独立 DSH_HOME，不代表所有增强模型的响应速度或续写质量。

## 2026-10-28：0.2.7 神秘提示词注入

新增「神秘提示词注入」复选框（设置 → 提示词增强 → 增强偏好），默认关闭。开启后每次增强读取输入框当前会话模型，仅在模型 id 命中 `/deepseek/i` 时于改写稿开头注入固定声明块；其他模型或无法识别的别名按非 DeepSeek 处理，正常增强并提示已跳过。判断只依据当前会话模型，与跟随/专用增强模型无关。设置文件新增 `mystery` 字段，旧文件读取时按关闭处理，回滚到 0.2.6 时可忽略该字段。

| 检查 | 结果 |
| --- | --- |
| `npm run check` | 构建、Host/Client 类型检查与 **54/54 测试通过** |
| `npm pack` | 正常执行 `prepack`；**35 个发布文件**，包体 269.1 kB |
| 回归测试 | DeepSeek 当前模型注入；非 DeepSeek、别名与缺失模型均跳过并提示；专用增强模型不影响判断；结果丢弃声明时报 `mystery-missing`；英文草稿使用英文声明且不触发语言漂移 |
| 设置兼容 | 旧 `settings.json` 无 `mystery` 字段时读取为关闭；显式开启后可保存并读回 |

边界：本次未安装到真实桌面 profile，也未重跑真实模型与完整桌面交互；界面新增一项而截图仍保留 0.2.3 采集版本说明。声明只影响模型输出行为，不改变服务端额度、上下文窗口或 `max_tokens` 上限。

## 2026-10-27：0.2.6 改名与旧包迁移验证

仓库及安装包改名为 `dsh-prompt-improver`，Cordis、浏览器模块及 Typert 包注册使用新名称。版本更新为 0.2.6，继续适配 DSH 0.2.1-rc.3。中文界面、增强逻辑、RPC 服务 `promptEnhance`、错误码、设置文件路径和旧浏览器存储键保持不变；历史版本、安装记录及许可证原署名保留。README、使用指南和开发说明同步新仓库、安装包与迁移命令。

| 检查 | 结果 |
| --- | --- |
| `npm run check` | 构建、Host/Client 类型检查与 **47/47 测试通过** |
| `npm audit --json` / `npm audit --omit=dev --json` | 均为 **0 项告警**，退出码 0 |
| `npm pack` | 正常执行 `prepack`；**31 个发布文件**校验通过 |
| 真实 rc.3 宿主旧包 → 新包 → 旧包 | 三次启动和探针检查均通过，无新旧 Typert 包同时注册 |
| 安装产物与设置 | 新包全部 **20 个 `lib` 文件**与本次构建一致；迁移、回滚后演示设置逐字节不变 |

新增回归测试通过正式 Host 的设置接口读取旧目录中的非默认设置，检查读取不改写、保存仍写入旧路径，且没有生成第二份新目录设置。浏览器生命周期测试核对新模块、RPC 包和两个插槽的名称，卸载后清理资源。

安装迁移使用实际 DSH Desktop 0.2.1-rc.3 CLI，在独立 `DSH_HOME` 的完整 Web profile 中先安装 0.2.5，移除旧包后安装 0.2.6，再移除新包回装 0.2.5。检查包依赖、bundle 列表、Host 服务与 Typert 注册、非所有者设置访问拒绝、无效草稿拒绝，以及配置文件保留。测试服务均已停止，未修改日用安装或设置，没有模型调用。

边界：本次未重跑真实模型质量、完整桌面交互或其他操作系统；使用指南中已有自定义 Cordis 覆盖项的人工迁移步骤不包含在上述无自定义覆盖的安装试验中。审计范围仍仅为本仓库依赖树，不覆盖宿主自带依赖。真实界面截图保留 0.2.3 的采集版本说明，改名未改变截图中的界面。

## 2026-10-27：0.2.5 依赖审计修复与 rc.3 兼容验证

修复前重新运行 `npm audit --json`，退出码 1，报告 **40 项依赖告警（38 高、2 中）**。它们来自 Zod 和 Undici 的 4 条安全公告，包含依赖链传播，并非 40 个独立漏洞：

- [Zod 超长集合校验资源消耗](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5)：修复版本为 4.6.6；本仓库固定开发依赖 4.6.7，以 `overrides.zod: "$zod"` 移除 15 份 rc.3 依赖链中的 4.4.3 副本。
- Undici 的 [EventSource 缓冲](https://github.com/advisories/GHSA-4qv8-2p9j-2685)、[大小写 SRI 校验](https://github.com/advisories/GHSA-f72v-6w45-q472) 和[过多内容编码](https://github.com/advisories/GHSA-xjj6-f33q-929c)问题：8.12.2 已修复；本仓库覆盖为 8.12.3。

DSH 包版本仍为 0.2.1-rc.3，`engines.dsh`、Node.js 最低版本及运行时 peer 约束保持不变；未使用 `npm audit fix --force`。重新构建的 20 个 `lib` 文件与 0.2.4 一致，增强逻辑和界面没有变化。

在原项目之外、路径含空格的全新 Git 克隆中，移出预构建 `lib`，从 `npm ci` 开始验证。环境为 Windows / Node.js 24.14.0 / npm 11.9.0：

| 检查 | 结果 |
| --- | --- |
| `npm ci` | 锁文件安装成功，未读取原项目的依赖目录 |
| `npm audit --json` | 退出码 0，全部严重级别均为 **0** |
| `npm audit --omit=dev --json` | 退出码 0，生产依赖告警 **0** |
| `npm pack` 的正常 `prepack` | 构建、Host/Client 类型检查、**46/46 测试**及 **31 个发布文件**检查通过 |
| 重建后的 Git 差异 | 无差异，工作区干净 |

新增测试使用 rc.3 Typert Registry 实际解析到的 Zod，确认超长数组在遍历元素前被拒绝；使用 rc.3 HTTP 代理模块实际解析到的 Undici，验证回环请求、代理路由与恢复，以及大写 `SHA256` 的错误完整性值被拒绝。HTTP 验证仅连接临时回环服务。

将候选 0.2.5 `.tgz` 安装到实际 DSH Desktop 0.2.1-rc.3 CLI 管理的独立 `DSH_HOME` / Web profile。20 个已安装 `lib` 文件逐字节一致，启动成功。临时宿主探针通过插件与 Typert 注册、`capabilities`、严格 schema、非所有者设置访问拒绝、无效草稿拒绝等检查，未调用模型；测试服务已停止。探针首轮的预期错误文案与实现不符，修正测试断言后复验通过，未为此修改产品代码。日用插件设置的 SHA-256 与操作前一致。

**审计范围**：覆盖规则作用于本仓库的根 npm 项目，不会随插件安装改写 DSH 自带依赖。实测宿主仍提供 Zod 4.4.3 和 Undici 8.11.2；上述宿主测试证明兼容性，不证明宿主依赖已修复。整个 DSH Desktop 的依赖升级需由宿主单独交付。本次未重跑真实模型质量或完整桌面交互；不同操作系统未实测。

## 2026-10-27：0.2.4 独立构建与 Release 分发

将本插件所需的构建器、包检查器、契约同步脚本和 `shared/memory-contract.ts` 纳入仓库，入口改为仓库内引用，不再读取父目录或其他插件。版本更新为 0.2.4；依赖版本、增强逻辑、接口和界面不变。`.gitattributes` 固定 LF，避免 Windows 检出后的 CSS 换行使客户端构建出现差异。README 和指南更新为版本标签安装、Release 下载与独立构建说明。

验证环境：Windows，Node.js 24.14.0，npm 11.9.0，DSH 0.2.1-rc.3。将待提交文件导出为独立 Git 源，再用 `git clone --no-local` 克隆到原项目之外、路径含空格的临时目录；没有原工作区的父级脚本、`node_modules` 或构建缓存。先将克隆中的预构建 `lib` 移出，再执行：

| 检查 | 结果 |
| --- | --- |
| `npm ci` | 通过，按锁文件安装依赖 |
| `npm run check` | 从源码重建 Host、客户端、声明与 Typert；类型检查和 **44/44 测试通过** |
| `npm run check:package` | **31 个发布文件**通过，含全部导出、文档及 3 张脱敏截图 |
| `npm pack --pack-destination <新目录>` | 通过；正常执行 `prepack`，未使用跳过脚本选项 |
| 构建后 `git diff --exit-code` / `git status --porcelain` | 无差异、工作区干净；20 个 `lib` 文件可重新生成 |

新增回归检查覆盖契约副本过期时只报错不覆盖、LF/CRLF 一致性，以及真实 npm 包文件清单中的缺失导出、越界导入和遗漏截图。原有 42 项功能测试继续通过。

候选 `.tgz` 使用 Desktop 自带 CLI 安装到独立 `DSH_HOME` 的 Web profile，版本为 0.2.4，20 个已安装 `lib` 文件与构建产物逐字节一致。以回环地址、随机端口启动成功，没有插件未激活告警；随后停止测试服务。pnpm 的 peer 提示仍存在，对应 DSH 服务由宿主提供。没有修改日用安装或设置、调用模型或重跑桌面交互；README 沿用已脱敏的 0.2.3 真实截图，并标明版本和界面未变。

已知限制：`npm audit` 报告既有锁文件的 **40 项依赖告警（38 高、2 中）**，包含 Zod、Undici 及 DSH 依赖链传播；本次未升级这些依赖，不能将构建通过记作安全审计通过。Release 安装包的 SHA-256 以同页 `SHA256SUMS` 资产为准；构建日志和临时验证目录不进入仓库或安装包。

## 2026-10-27：GitHub 安装分发

在下方文档与截图工作完成后，追加将预构建 `lib/` 纳入 Git，并将 `docs/` 纳入打包白名单。运行时版本保持 0.2.3，宿主仍为 0.2.1-rc.3；业务源码、依赖版本和构建入口不变。README 与使用指南新增 GitHub 安装命令，开发说明区分直接安装和重新编译的工作区要求。

本次在完整开发工作区重新运行 `npm run check`：构建、Host/Client 类型检查和 **42/42 测试通过**。`npm run check:package` 通过，检查 **31 个发布文件**，包含全部 20 个 `lib` 文件、指南与脱敏截图。文档检查覆盖 5 份文档、36 处相对链接和图片引用，全部通过。

将待提交文件导出为独立 Git 仓库，在新的 `DSH_HOME` 中使用 Desktop 自带 CLI 执行 `plugin --profile <测试配置> add git+file:///...`，安装退出码为 0；没有运行插件构建或索取仓库外脚本。`--dump-config` 确认插件 bundle 自动加入。首次空 profile 缺少 `workspaceRegistry`，故另用完整 Web 模板验证：安装后通过 `--host 127.0.0.1 --port 0 --no-open` 正常启动，没有插件未激活告警；随后停止测试服务。安装的 ripgrep 可运行并返回 15.0.0。pnpm 报告 peer 提示，DSH 运行时由宿主提供对应依赖。

重新检查 README 在 1280px 和 390px 宽度下无页面横向溢出，3 张图片加载成功，首页锚点有效。此阶段验证对象为待提交的 Git 文件快照；未修改日用 profile、会话或模型设置，未调用模型，不将隔离 Web 启动记作本次桌面交互回归。

推送后，在同一独立 `DSH_HOME` 的另一个 Web 测试 profile 中执行 `dsh plugin --profile github-install-check add github:Yocaihua8/dsh-link-prompt-enhance`，退出码为 0。锁文件确认实际下载的提交为 `26002b93e662ce70138af9ae97dfb94c051e735a`，插件版本为 0.2.3；未传入跳过脚本选项，全部 20 个已安装 `lib` 文件与本次构建逐字节一致，`--dump-config` 确认插件 bundle 自动加入。GitHub 线上 README 的 3 张图片均加载成功，390px 宽度下无页面横向溢出。日用插件设置 SHA-256 与截图操作前仍一致；测试服务与文档预览已关闭。

## 2026-10-27：README 文档与真实界面截图

本次只重整文档并新增截图，未修改业务代码、接口、依赖或构建流程，未制作或安装新包。安装清单核对为提示词增强 0.2.3，宿主 CLI `--version` 返回 0.2.1-rc.3。

在新的演示会话中，使用“适度增强 / 先预览 / 仅草稿 / 跟随当前模型”实际运行一次增强，预览显示真实改写结果；未发送聊天消息。截图仅保留插件相关区域，角色配置和模型字段作不透明遮盖。图片、演示文本与处理说明见[截图记录](screenshots/README.md)。演示结束清空草稿、恢复原设置，并核对设置文件 SHA-256 与操作前一致。

2026-10-24 的安装与回滚段落从旧 README 移至本文末尾，保留原日期、版本和路径，不将历史步骤作为当前安装入口。本次截图演示不替代完整功能回归。

文档专项检查：5 份文档的 35 处相对链接和图片引用通过；3 张图片均有替代文本并成功加载。本地 GitHub Flavored Markdown 预览在 1280px 和 390px 宽度下无页面横向溢出，首页锚点有效；逐张检查导出图中的个人信息及元数据。`git diff --check` 通过。本次未运行构建或完整测试套件，因未改变代码行为；上述预览是本地渲染检查，不代表内容已经推送到 GitHub。

## 2026-10-25：0.2.3 会话关联

- 模型 stream 传入已有 `sessionId`，由个人中心 0.1.17 自动识别插件并汇总辅助用量，不添加聊天消息或独立上报逻辑。
- `npm run check` 构建、Host/Client 类型检查与 **42/42 测试通过**；根目录跨插件测试 **4/4 通过**，其中新增真实 loader、增强服务、预备模型服务和个人中心账本/聚合联测。
- 包和日志位于项目根 `output/plugin-usage-20261025/`；正常退出并备份后使用日常 desktop profile 安装，保留 0.2.2 旧包供回滚。插件安装未修改宿主 ASAR，没有创建独立 DSH 环境；后续独立的启动问题修复见下段。
- 自动检查与日常实测分别留证；本节下方记录本版本最终真实增强和重启结果，旧版实测不代替本版验收。

本轮实际安装：0.2.3 的 25 文件与新 tgz 一致，原设置摘要不变；配合候选个人中心 0.1.16 完成一次真实增强，账本记录 739 Token 和已有会话 ID，未新增聊天消息。该候选来源丢失已在个人中心 0.1.17 修复并通过延迟中间件回归。旧记录仍保留来源未知，不回填为本插件。

最终版启动曾遇 `desktop welcome: Web authentication failed`，现已按用户追加授权定位并修复：日常 Electron 旧端口认证 Cookie 累积导致 HTTP 431。宿主仅修改桌面启动入口的定向 Cookie 清理；六个插件安装内容、profile 配置、凭据及增强设置不变。恢复后以 0.1.17 / 0.2.3 在同一日常环境完成一次真实增强，实际回执模型为 `workbuddy/deepseek-v4.1-flash`，请求 `2f890cb1-12be-4c36-908c-0b48dad39c7f` 返回 **770 Token**，正确归属 `dsh-link-prompt-enhance`，带已有会话 ID 和对应 profile 范围。

插件明细显示 770 Token / 1 次，总调用 9,140 → 9,141，可确认总量 1,550,985,125 → 1,550,985,895。正常退出重启后，新读取结果与重启前一致、该请求仅计一次；缓存优先展示及原工具统计也已检查。190 个原会话逐字节未变，没有发送聊天消息，合成草稿已清空，日常 DSH 保持运行。最终回执和实际桌面截图见 原开发工作区的 `output/dsh-startup-auth-20261025/README.md`（历史本机报告，未随本仓库公开）；旧交付目录 `acceptance.json` 保留当时受阻状态，不覆盖历史证据或已发布 tgz。

## 2026-10-25：0.2.2 日用安装与真实交互验收

用户在原型、正式 UI 和组件验收后明确授权日用安装。本次将已确认的 UI 修订发布为 **0.2.2**，通过 DSH **0.2.1-rc.3** 自带 CLI 安装至既有 `desktop` profile。没有修改本轮已经验证的产品源代码、依赖或设置格式。

- 安装前 DSH 未运行；备份了源码、原 0.2.1 安装包和已安装目录、desktop profile 的包配置/锁文件/Cordis 配置，以及提示词增强设置。交付目录：`../../output/prompt-enhance-install-20261025-003535/`，备份位于其中 `backup/`。
- `npm pack` 的 prepack 自动执行 `npm run check` 与 `npm run check:package`：构建、Host/Client 类型检查、**42 项测试和 25 个发布文件检查全部通过**。日志为交付目录下 `pack.log`。
- 新包：`release/dsh-link-prompt-enhance-0.2.2.tgz`；SHA-256：`75151990D13BF3056C8BB2546D678DE674D581EBDB427EC0B8A2E1706A0211B0`。
- 使用 `E:\Dev\Toolchains\DeepSeek\resources\runtime\cli\bin\dsh.cmd plugin --profile desktop add <新包绝对路径>` 安装，退出码 0；日用插件版本为 0.2.2，安装目录 `lib/client.js` 与构建产物 SHA-256 完全一致。安装日志为 `install.log`。
- profile 的其他直接依赖不变，锁文件仅修改本插件路径、版本和 integrity；`cordis.yml`、`cordis.patch.yml`、`pnpm-workspace.yaml` 与备份一致。宿主 ASAR SHA-256 仍为 `EA8A259F62C8DB0EC58FE1679F414F0F3326944D4F20AB5A304A227A623F0D6A`。
- 正常启动日用 DSH 后，以原当前模型 **Kimi-K3.1-Pro / high** 处理非敏感彩虹说明测试草稿：直接替换没有弹窗，原按钮变为返回图标，点击恢复原稿；未点击发送消息。
- 原生 DSH 设置中的新分组正常加载；采用方式的原生下拉框可用键盘选择，未保存/已保存状态和保存结果正确。临时切换到预览后完成第二次真实增强，原文未被提前改写；对照和实际来源区显示，展开来源为 0，说明未采用补充上下文；确认采用后，同一返回图标仍能恢复原稿。
- 验收结束将设置恢复为原先的适度增强、直接替换、最近对话、跟随当前模型、无专用模型；`settings.json` SHA-256 与安装前完全一致（`076F6DE1B110C4E0B3B05DBA0A28D2438994A03B97EE76060A9711052D71757C`）。已清空本轮测试草稿，未发送聊天消息，DSH 保持运行。
- 实测截图：`screenshots/direct-return.png`、`screenshots/settings.png`、`screenshots/preview-sources.png`。本次安装未重复全部主题/窄窗/异常边界组合；这些覆盖由下方同一 UI 源码的组件验收和本次 prepack 测试提供，不混记为日用实测。
- 安装器报告已有 automation 0.1.5、character 0.2.2、platform 0.2.2 的 rc.2 兼容警告，以及 peer dependency 提示。本次未修改这些插件或授予兼容豁免；提示词增强已实际正常加载并完成上述验收。

回滚：先正常退出日用 DSH；使用同一宿主 CLI 将 `backup/dsh-link-prompt-enhance-previous.tgz` 重新添加到 desktop profile，再启动验证。不要覆盖整个 DSH_HOME 或其他插件；本次增强设置已与安装前一致，无需为回滚覆盖会话或其他用户数据。发布包在安装前生成；本段安装结果在成功验收后写入工作区文档，没有为了文档变更覆盖已验收安装包。

---

## 2026-10-25：单按钮 UI 修订（源码验收阶段，当时未日用安装）

按已确认原型修订 0.2.1 客户端界面，目标宿主仍为 DSH 0.2.1-rc.3。空闲双星和进行中的圆环/取消图形保持原路径与尺寸；采用后同一按钮切换为已确认的返回图标，点击恢复原文，不新增文字按钮。移除插件右键、Shift+F10 和菜单键入口，统一通过 DSH 设置管理偏好。预览保留对照、实际来源和必要警告，底栏仅有保留/替换操作；设置按组展示，保存状态和模型不可用原因分别提示。

- 修改前备份：`../../output/prompt-enhance-ui-20261025/before/`。该工作区没有 Git 元数据；按备份比对文件，未修改增强算法、控制器、Host、RPC、设置字段/存储格式、依赖或版本。已有设置及首次默认值沿用原实现。
- `npm run check`：构建、Host/Client 类型检查及 **42 项测试通过，0 失败**。日志：`../../output/prompt-enhance-ui-20261025/check.log`。
- `npm run check:package`：通过，检查 **25 个发布文件**；测试夹具不进入发布包。4 个新增浏览器脚本通过 `node --check`。日志：`../../output/prompt-enhance-ui-20261025/check-package.log`。
- 旧菜单浏览器脚本由 `test/browser/single-button.js` 替代。通过本地组件验收页运行 **7 组 UI 回归，全部通过**：原图标/单按钮/空草稿/无菜单；直接采用及原位恢复；取消、编辑和迟到响应；预览对照、实际来源、警告、采用/关闭和焦点；过期结果及不可用模型；保存成功/失败、未保存状态及刷新保留编辑；专用模型/档位不可用和附件身份保护。结果：`../../output/prompt-enhance-ui-20261025/browser/ui-regression.txt`。
- 验收页装载当前 `lib/client.js` 和只读提取的 DSH rc.3 原生 React、Button、Modal、Toast、图标及主题。Host/RPC 和模型响应为受控测试夹具；页面禁止网络连接，未调用真实模型或发送聊天消息。复现方式见 [浏览器验收说明](../test/browser/README.md)。这项组件验证不等于完整 Electron、真实模型或日用安装验收。
- 1024px 深浅主题设置和预览已实际查看；面板不透明，桌面原文/增强稿并排。深色 420px、320px 及浅色 320px 预览上下排列，无横向溢出；深色 320px 设置含专用模型字段同样没有溢出。窄窗测量与截图位于 `../../output/prompt-enhance-ui-20261025/browser/`。
- 设置中的 4 个下拉箭头均为 14px，右侧距离 12px，测得垂直中心偏差为 0。实际用方向键切换原生 select/radio；Tab 可到来源详情，Enter 展开来源和使用返回图标恢复，Escape 关闭预览后焦点返回原按钮。测试后恢复浏览器视口。
- 最终浏览器构建检查期间没有控制台警告或错误；证据为 `browser/console.json`。启动阶段曾修正验收夹具的 CSP、远程服务映射和等待提交时序，不将这些测试夹具问题计为产品通过证据。
- 本轮没有修改日用 profile、会话、设置、宿主 ASAR 或其他插件，没有运行安装命令，也没有生成或覆盖日用安装包。下方 2026-10-24 的安装/真实模型记录属于历史版本，不能用于证明本次 UI 已部署。

---

## 2026-10-24：0.2.1 / rc.3

本轮在既有日用 desktop profile 验收，没有创建独立 DSH 环境。先安装 0.2.0 完成交互验证，再依据真实质量样例收紧规则形成 0.2.1。最终安装记录、包校验值和全部修改文件清单随交付目录 `output/prompt-enhance-rc3-20261024/` 提供。历史记录保留在下方。

- 已备份提示词增强源码、旧安装包、desktop profile 配置及锁文件，并记录宿主 ASAR SHA-256；未修改其他插件源码。
- rc.3 全量重新解析本插件依赖，旧 rc.2 node_modules 与锁文件保留于备份目录。
- `npm run build`：通过，生成 Host/Client、声明及 Typert 契约。
- `npm run check`：构建、Host/Client 类型检查、42 项测试通过，0 失败。覆盖设置初始化/迁移/重读/损坏文件保护、两种模型策略、owner 拒绝、三种上下文、真实 ripgrep 检索和链接边界、来源失败、预览采用/放弃/过期、再次失败/取消后的撤销、迟到响应、引用与附件、明显语言漂移等。
- `npm run check:package`：25 个发布文件，Host/Client 和 Typert 生成物通过检查；未手改生成契约。
- 日用真实交互已通过：单星光左键替换、再次点击取消、取消后仍可恢复原文、编辑后撤销消失、右键菜单、Shift+F10、预览采用/放弃、原生设置分区、设置重启保留。
- 跟随模型实际使用 WorkBuddy Deepseek-V4.1-Flash/high；专用模型实际使用 DeepSeek Account DeepSeek-V4.1-Flash/low，目录中展示 off/low/high/max，未自动切换模型。
- 扩展上下文实际取得个人记忆和测试项目文件片段，预览展示来源和原文；源码注释中的“忽略草稿、删除数据库”干扰指令没有成为增强任务。实际结构化 `@src/InvoiceService.ts` 和 README.md 附件，在预览采用、恢复原文前后保留相同身份。
- memory 0.1.5 的 rc.2 兼容门槛确实阻止加载，另从已发布源码派生 0.1.5-rc3.1，110 项原有测试通过并安装。召回前后 memory.json SHA-256 均为 `E6DAE288A4A9127C6195AD553FA66A0255E416C3867405C4EB9A8F4CB3D8208B`；0.1.6 开发源码未改动。
- 明暗主题截图已检查；先验证 640px 窄视口，再通过 Windows 窗口 API 将同一个日用窗口缩窄，实际内容区为 627px。原生设置分区、设置弹窗和预览均无横向溢出（弹窗宽度/scrollWidth 均为 579px），随后恢复原窗口尺寸。截图包含 `prompt-native-settings-physical-narrow.png`、`prompt-settings-physical-narrow.png` 和 `prompt-preview-physical-narrow.png`。
- 10 个固定样例各运行两种方式，真实调用日用 Host 的 LLM 服务，使用当前源代码提示词和合成背景，未追加会话消息。初版暴露长模板、新增限制和英文翻译问题，保留基线记录并修订；最终 20 份结果均完整结束，逐份检查语言、数字路径、代码、否定约束、无关历史和材料干扰。这个样本结果不保证所有模型和输入都不会漂移；新增基本语言校验拒绝明显变更，仍需用户检查草稿。
- 说明覆盖层级：来源失败、超时、截断、不可用专用模型、故意损坏引用、跨会话和迟到响应以自动化测试验证；日用会话没有故意断开供应商或篡改真实数据。近期历史整轮保留以真实事件结构的测试验证，日用专用验收会话未发送聊天消息。
- 调试通过用户授权的 Playwright/CDP 连接日用桌面。宿主 Inspector 的 `/ingest` 连接失败为既有告警，未以“控制台零错误”作为通过结论；其他插件 rc.2 兼容告警保持本轮范围外。
- 0.2.1 安装后再次真实复验：专用模型英文预览保持英文和 No framework，采用/撤销成功；跟随当前模型直接替换保留中文及 100 字限制。重启保留专用模型、low 档位、扩展上下文和预览策略；结束时恢复测试前的适度增强/直接替换/最近对话/跟随模型，专用模型为 null，宿主主题恢复跟随系统。
- 实际预览产生后，通过宿主原生输入状态 API 模拟新草稿到达，旧预览自动关闭，新文字未被覆盖。设置刷新与增强相交时也按快照取消，没有覆盖草稿；待设置稳定后重新点击成功。Playwright 在后台窗口的稳定性等待曾超时，后续使用已核对元素的鼠标点击跳过该等待；这不是模型请求失败或产品通过证据。

---

## 较早版本的本机验收记录

## 0.1.3 公共构建与独立发布包验收（2026-10-20）

本轮接入根目录公共构建和包检查，保留原生会话输入区的增强入口、方式选择、取消及草稿保护行为。发布包运行时不依赖公共脚本或工作区源码。

- 根目录 `npm run check` 通过本插件构建、Host/Client 类型检查、**30 项测试**及包检查。工作区合计 **696 通过、1 跳过、0 失败**，其中跨插件集成测试 3 项通过；唯一跳过项属于 character 的可选真实 Host 附件 codec。日志：`../../.cache/workspace-check.log`。
- 六个候选 `.tgz` 独立解包后，在真实 DSH **0.2.1-rc.2** 的隔离 profile 启动；实际检查提示词增强的会话入口。本轮没有调用 LLM 或发送验收草稿，不将下文历史真实增强、图标主题和完整菜单流程计作本轮重跑。
- 本轮发布目录为 `../../output/release-20261020/`。完整结果见 原开发工作区的 `docs/plugin-unification-verification.md`（历史本机报告，未随本仓库公开）。未修改日常 profile、实际记忆或已有产物，未执行真实定时任务。

以下保留历史版本的验证日期、安装和模型调用记录。

日期：2026-10-19。DSH：本机已安装的 0.2.1-rc.2；Node.js：24.14.0；平台：Windows。

## 0.1.2 原版双闪星 SVG

按 0.1.0 安装包中的原图案重新绘制两个四角星 SVG 路径，保持原轮廓及大小比例，在 24×24 viewBox 内居中，以 18px 显示。使用 `currentColor`、1.8 线宽和圆角连接；没有嵌入截图、位图或字符图标。仅替换空闲图案，左键增强/取消、右键方式菜单及其他行为不变。

- `npm pack --pack-destination output`：构建、类型检查、30 项测试及包检查通过，生成 `dsh-link-prompt-enhance-0.1.2.tgz`。
- 在隔离 DSH Web profile 重新执行 `test/browser/icon-menu.js`，7 组检查通过，包括右键菜单和 420px 布局。深色与浅色实际截图确认原版图案，DOM 中为 1 个 SVG、2 条路径、0 张位图，控制台无错误或警告。
- 截图为 `output/playwright/sparkle-menu-dark.png`、`sparkle-menu-light.png`。本轮没有调用模型或发送消息，没有安装至日常配置。
- 修改文件：`src/client/index.tsx`、`package.json`、`package-lock.json`、`README.md`、`docs/verification.md`；其余源码、样式和测试文件未修改。

## 0.1.1 图标与右键菜单修订

本轮仅修改入口交互：所有宽度下显示一个 18px 内联 SVG 图标，28×28px 点击区域；左键增强，右键选择方式。移除常驻文字及独立下拉箭头，沿用宿主按钮、菜单和颜色。进行中显示进度圆环及取消图形，支持减少动画的系统设置。

- `npm run check`：构建、Host/Client 类型检查和原有 30 项测试通过，包括 Host/Client 加载卸载。
- `npm pack --pack-destination output`：prepack 检查通过，生成 0.1.1 安装包；包含 20 个文件，导出完整，无源码、缓存或凭据。仅同步本条验收记录后使用 `--ignore-scripts` 重打包，未重复执行已通过的代码检查。
- 新增 `test/browser/icon-menu.js`，通过 `playwright-cli -s=dsh-icon run-code --filename test/browser/icon-menu.js` 在真实宿主通过 7 组断言：图标独显、空草稿左键保护、右键两种方式、刷新后记忆、键盘导航及焦点返回、420px 布局、没有增强 RPC。
- 隔离数据目录为 `.cache/preview-dsh`，Web 端口 5494。使用当前构建和已有本地 OpenCode 供应插件，没有修改其他插件或日常配置。
- 实际左键发起请求后再次左键可取消，保留原文；请求期间右键不会打开方式菜单。
- Big Pickle 真实增强非敏感彩虹说明草稿成功，回填后可恢复原文；增强及恢复后会话日志中 `user/message`、`assistant/message` 均为 0，没有自动发送。
- 1280×900 和 420×800 检查菜单位置，窄窗口没有横向溢出。浅色和深色模式下 SVG 跟随宿主颜色。控制台 0 错误、0 警告。
- 截图：`output/playwright/icon-enhance-success.png`、`icon-menu-desktop.png`、`icon-menu-narrow.png`、`icon-dark.png`、`icon-menu-detail.png`。

本轮修改源码与文档：`src/client/index.tsx`、`src/client/style.css`、`test/browser/icon-menu.js`（新增）、`package.json`、`package-lock.json`、`README.md`、`docs/verification.md`。构建及安装包另存 `lib/` 与 `output/dsh-link-prompt-enhance-0.1.1.tgz`。未删除文件，也未安装到日常 DSH。

以下保留 0.1.0 首次完整功能验收记录；当时的按钮文字及下拉箭头已由本轮图标入口替代。

## 0.1.0 自动检查

- `npm run check`：官方 Typert 生成、Host/Client 构建和独立类型检查通过。
- `npm test`：30 项通过。覆盖两种方式、历史筛选/三轮/字符上限、当前模型与推理参数、引用身份及附件保留、回填、恢复、重复点击、取消、编辑/发送/切换模型/会话后的覆盖保护、空/截断/不完整响应、历史失败、超时及 Host/Client 加载卸载。
- Host 生命周期测试使用真实 Cordis、Typert Registry 和生成的 RPC 描述，核对严格输入 schema、会话资源和取消参数；卸载时取消进行中的调用并移除服务。
- Client 生命周期测试装载实际浏览器构建产物，复用宿主模块，通过 Cordis 的最小服务 fixture 核对 RPC 挂载、插槽与样式随插件卸载清理。
- 自动测试里的模型和输入框替身仅用于构造异常边界；产品代码直接使用 DSH 服务。
- `npm run check:package`：20 个打包文件，所有导出入口存在，无源码、运行缓存或凭据文件。
- `npm pack --pack-destination output`：成功生成 `dsh-link-prompt-enhance-0.1.0.tgz`。解压后 Host 和 Typert 入口可导入。
- 将解压后的安装包链接至第二个独立 profile（端口 5494）：Host/Client 加载成功，在插件管理页可见。禁用后按钮及样式数量为 0，重新启用后各为 1；该浏览器会话控制台 0 错误、0 警告。此项验证为本地解包加载，不是执行 pnpm 安装命令。
- `pwsh -NoProfile -File scripts/preview.ps1 -Port 5494`：隔离预览脚本实际启动成功。

## 隔离 DSH 浏览器验收

运行已安装 DSH 的 Web profile，数据根目录为项目内 `.cache/dsh-home`，监听 `127.0.0.1:5493`。只链接本插件和已有本地 `dsh-link-opencode` 模型供应插件；没有修改另一插件的源码，也没有复制日常 DSH 凭据或安装至日常配置。

通过 Playwright CLI 实际操作并检查：

| 场景 | 结果 |
| --- | --- |
| 按钮位置 | `conversation.input.right` 中显示，紧邻模型选择器左侧 |
| 两种模式 | 默认适度增强；可选充分展开；选择在切换会话及刷新后保留 |
| 真实适度增强 | OpenCode bridge / Big Pickle 将“小学生解释彩虹、中文、200 字”改写成可直接使用的提示词并回填 |
| 真实充分展开 | 同模型生成彩虹课堂计划提示词，含步骤、验收和待补充项 |
| 附件 | `sample.txt` 在增强及恢复后均保留；模型未收到附件正文 |
| 结构化引用 | 通过宿主 `@` 候选插入会话引用；真实增强及恢复后仍为不可编辑引用 chip，保持相同会话身份 |
| 手动取消 | 点击取消后原文保持；没有自动重试 |
| 等待中继续编辑 | 自动取消，保留用户的新草稿 |
| 模型选择变化 | 选择尚未完成时点击，后续选择状态变化使增强取消，没有迟到回填 |
| 热重载 | 构建更新触发插件重载；旧请求取消，没有重复按钮或迟到覆盖 |
| 失败 | MiMo V2.5 Free 返回模型已下线错误；提示失败并保留原文，未自动换模型 |
| 窄窗口 | 1280×900、600×800、420×800；窄屏使用图标按钮，最窄窗口随宿主控制区换行，无横向溢出 |
| 不自动发送 | 三次成功增强后，隔离会话日志中均没有正式 `user/message` 或 `assistant/message` 事件 |

截图保存在本机 `output/playwright/desktop-reference-success.png`、`narrow-reference-success.png`、`420-reference-success.png`。截图和运行数据不打入插件包。

## 边界

- 实际交互验收运行在已安装桌面发行包提供的 Web profile，复用同版宿主服务和浏览器插件模块；没有将插件装入日常 Electron profile。
- 真实成功调用使用 Big Pickle，该路由没有提供可切换的推理档位；显式推理档位传递由自动测试覆盖。
- 历史多轮筛选、截断、无响应依赖超时及引用破坏由自动测试覆盖；没有为这些异常额外制造真实计费调用。
- 本插件不控制模型生成内容的语义质量，增强后仍需人工检查。适配器内部可能有自己的重试行为。
- 公共 `setDraft` 类型与运行时行为在此版存在差异；语义回填已在实际宿主通过引用测试，升级 DSH 后应重新验证。
- 日常配置安装和发布不属于本次交付。

## 新增文件清单

当前项目原为空目录，未删除或改写既有项目文件。

| 文件 | 用途 |
| --- | --- |
| `package.json`、`package-lock.json` | 插件清单、导出、兼容版本、脚本和锁定依赖 |
| `cordis.patch.yml` | 宿主 bundle 注册 |
| `tsconfig.json`、`tsconfig.client.json` | 分离 Host 与 Client 类型环境 |
| `.gitignore` | 排除构建产物、依赖、缓存、截图及私密配置 |
| `LICENSE` | MIT 许可 |
| `src/index.ts` | Host RPC 服务、会话资源声明、卸载取消 |
| `src/host/enhance.ts` | 模型调用、超时与响应校验 |
| `src/host/history.ts` | 完成轮次筛选与历史截断 |
| `src/host/prompt.ts` | 两种方式的增强规则 |
| `src/shared/types.ts` | 请求、响应及公共限制 |
| `src/shared/references.ts` | 引用占位保护与语义恢复 |
| `src/client/index.tsx` | 宿主输入框按钮、菜单、提示、服务绑定 |
| `src/client/controller.ts` | 异步状态、快照保护与一次恢复 |
| `src/client/style.css`、`src/client/assets.d.ts` | 局部布局及 CSS 类型 |
| `scripts/build.mjs` | 官方 Typert 生成、Host/Client 构建 |
| `scripts/check-package.mjs` | 导出及打包内容检查 |
| `scripts/preview.ps1` | Windows 隔离预览 |
| `test/controller.test.ts` | 回填、恢复、附件及异步覆盖保护 |
| `test/references.test.ts` | 引用保留和异常拒绝 |
| `test/history.test.ts` | 历史完成状态、内容过滤和截断 |
| `test/host.test.ts` | 模型参数、异常分支、Host 加载卸载 |
| `test/client-lifecycle.test.ts` | 实际浏览器构建模块的加载卸载 |
| `README.md`、`docs/verification.md` | 安装、使用、边界、验证记录 |

生成物另存 `lib/` 和 `output/`，构建缓存与隔离运行数据存放 `.cache/`，不作为源码交付。

---

## 日用安装与回滚（2026-10-24 历史记录）

以下流程和路径对应 2026-10-24 的历史安装；安装包、备份路径及部署状态以本文对应日期的验证记录为准。执行回滚时应使用对应版本的备份，不能将历史路径当作当前版本。

1. 备份源码、原 tgz、desktop profile 的 `package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、`cordis.yml`、`cordis.patch.yml` 以及已有提示词增强设置。备份目录：`E:\Dev\Projects\dsh-link\output\prompt-enhance-rc3-20261024\backup`。
2. 等日用 DSH 空闲后从应用正常退出，确认进程已退出。不要强杀正在运行的任务。
3. 用宿主自带 CLI 安装独立新包；不要覆盖原 tgz：

   ```powershell
   & 'E:\Dev\Toolchains\DeepSeek\resources\runtime\cli\bin\dsh.cmd' plugin --profile desktop add 'E:\Dev\Projects\dsh-link\output\prompt-enhance-rc3-20261024\release\dsh-link-prompt-enhance-0.2.1.tgz'
   ```

   此命令使用 Desktop 专用 CLI 支持的 reserved-profile plugin access；不同的系统 CLI 不能假定具备该能力。
4. 正常重启日用 DSH，在专用测试会话验收按钮、设置、预览、当前/专用模型、引用和附件；再次重启检查设置保留。检查其他插件直接依赖和宿主 ASAR 校验值不变。
5. 失败时正常退出，恢复备份 profile 文件和旧提示词增强设置，用同一 Desktop CLI 执行 `plugin --profile desktop install --frozen-lockfile` 恢复旧依赖；必要时重新添加备份中的 0.1.3 tgz。重启核对旧版本。不要恢复整个 DSH_HOME，不删除或覆盖新增会话、附件、记忆或用量数据。旧版不读取新设置文件时可保留该文件供后续重试。

本包不修改宿主 ASAR 和个人中心补丁。本轮确认 memory 0.1.5 被 rc.3 版本门槛阻止加载，已另做 `dsh-memory-0.1.5-rc3.1.tgz`，只更新发布版基线的版本、宿主依赖及生成产物；原有 0.1.6 开发目录保持不变。可用相同 CLI 的 `plugin --profile desktop add` 安装该兼容包。整组回滚使用 `backup/before-install` 的 profile 配置及锁文件，同时恢复旧的 prompt-enhance 和 memory 依赖；旧 rc.2 插件在 rc.3 会重新受到兼容门槛限制，回滚不代表其可在 rc.3 加载。不要为回滚降级宿主或覆盖个人中心补丁。
