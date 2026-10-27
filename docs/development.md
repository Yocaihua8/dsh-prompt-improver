# 开发说明

[返回 README](../README.md) · [使用指南](guide.md) · [验证记录](verification.md)

## 工作区前提

需要 Git、Node.js **22.19.0 或更高版本**、随 Node.js 安装的 npm，以及访问 npm 依赖源的网络。DSH 相关依赖为 **0.2.1-rc.3**，由 `npm ci` 按 `package-lock.json` 安装；构建和单元测试不要求先安装或启动 DSH Desktop，也不需要模型密钥。

**从 0.2.4 起，单独克隆本仓库即可构建与打包。** `scripts/` 包含本插件使用的构建器、包检查器和契约同步脚本，`shared/` 包含记忆契约源文件；所有构建输入均位于仓库和本地安装的 npm 依赖中，不再读取父目录脚本或其他插件。

**安装使用**可直接读取 Release 或 GitHub 标签内已构建的 `lib`，见[安装指南](guide.md#从-github-安装)。DSH 所用 pnpm 检测到 `main` 指向的 `lib/index.js` 已存在后，无需执行 Git 依赖构建；`prepack` 保留用于制作安装包时的检查。

仓库内的构建输入与输出：

```text
dsh-link-prompt-enhance/
├─ scripts/                  # 本地构建、包检查和契约同步实现
├─ shared/                   # 契约源文件
├─ src/                      # 产品源码与生成契约副本
├─ lib/                      # 构建输出，随 Git 和 Release 分发
└─ package-lock.json         # 开发依赖锁文件
```

## 构建与检查

在任意开发目录中运行：

```powershell
git clone https://github.com/Yocaihua8/dsh-link-prompt-enhance.git
cd dsh-link-prompt-enhance
# 复现本次 Release 时固定标签；开发默认分支时可省略
git checkout v0.2.5
npm ci
npm run check
npm run check:package
npm audit
npm audit --omit=dev
```

| 命令 | 内容 |
| --- | --- |
| `npm run sync:shared` | 从仓库内 `shared/` 更新生成契约副本；加 `-- --check` 只检查一致性 |
| `npm run build` | 同步共享契约，生成 Typert、Host、客户端与类型声明 |
| `npm run typecheck` | 检查 Host 和客户端类型 |
| `npm test` | 运行现有 TypeScript 单元测试 |
| `npm run check` | 依次执行构建、类型检查和单元测试 |
| `npm run check:package` | 检查实际打包文件和导入，不生成正式安装包 |

需要制作安装包时，使用新的输出目录：

```powershell
$packageOutput = '<新的安装包输出目录>'
New-Item -ItemType Directory -Force -Path $packageOutput | Out-Null
npm pack --pack-destination $packageOutput
```

`prepack` 会再次执行 `check` 和 `check:package`。不要覆盖已经交付或安装的同路径安装包。包检查通过不代表完成了实际桌面安装和交互验收。

仓库通过 `.gitattributes` 固定文本为 LF，避免 Windows 检出时的换行转换改变嵌入客户端的 CSS 字符串。构建后的 `lib` 应与提交中的产物一致；全新克隆验证会先移出已有 `lib`，检查从源码重新生成的结果。

0.2.5 在仓库根项目中固定开发用 Zod 为 **4.6.7**，使用 `overrides.zod: "$zod"` 统一 DSH rc.3 依赖链中的旧副本，并将 Undici 覆盖为 **8.12.3**。DSH 包版本、Node.js 要求及运行时 peer 约束保持不变。2026-10-27 的 `npm audit` 和 `npm audit --omit=dev` 均返回 **0 项告警**；更新依赖或发布前仍需重新审计。

这些覆盖只作用于本仓库作为根项目的 npm 安装，见 [npm overrides 说明](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#overrides)。插件安装到 DSH 后使用宿主提供的 peer 依赖，安装包不会改写宿主 ASAR、其他插件或 profile 的覆盖规则。仓库审计清零不代表整个 DSH Desktop 的依赖审计清零；宿主自带依赖的修复需由宿主版本单独交付。

打包白名单包含完整 `lib`、Cordis 配置、许可证、README 和 `docs/`（含指南、验证记录及脱敏截图），不包含源码、测试、构建脚本或本机输出目录。部分开发文档链接指向仓库中的测试说明，阅读这类内容时请使用完整仓库。

### 更新 GitHub 可安装内容

`lib/` 是 GitHub 安装所需的预构建产物，应与对应源码一起提交。每次修改产品源码后运行 `npm run check` 和 `npm run check:package`，检查生成物差异，再一并提交源码与 `lib`；不要手工编辑生成物。0.2.5 修订仓库依赖解析与回归测试，增强逻辑和界面沿用 0.2.3。

Release 应从已验证的提交打标签，上传该提交经 `npm pack` 生成的 `.tgz` 和 `SHA256SUMS`。校验值记录在 Release 资产中，避免在包内文档中保存该包自身的哈希。不要将 `node_modules`、`.cache`、本机输出或未脱敏截图加入 Git。

发布前应使用独立 `DSH_HOME` 和测试 profile 验证 GitHub 安装、bundle 配置和入口加载，避免影响日用配置。`dsh --profile <测试配置名称> --dump-config` 可检查合并后的配置；安装成功不等同于完成真实桌面交互和模型质量验收。

## 结构与接口

| 模块 | 职责 |
| --- | --- |
| `src/client/` | 输入框按钮、请求状态、对照预览、设置页和草稿生命周期保护 |
| `src/host/` | 增强调用、提示词、历史、项目检索与设置持久化 |
| `src/shared/` | 请求与响应类型、默认设置、引用保护和生成契约 |
| `src/index.ts` | Host 插件注册与 RPC 入口 |

RPC 包括 `enhance`、`getSettings`、`saveSettings` 和 `capabilities`。`enhance` 响应保留 `text`，可返回实际上下文报告 `context` 和有效模型 `selection`。

增强请求声明 session 资源授权；设置管理和扩展上下文读取额外检查 owner。点击时固定设置、草稿、附件和有效模型快照，不读取请求之后的新设置；响应和预览采用都要符合客户端当前状态，避免覆盖新输入。

0.2.3 在模型调用中传递已有会话 ID，供个人中心 0.1.17 关联辅助用量，不新增聊天消息或独立插件上报流程。

### 生成文件与共享契约

Typert 由官方生成器生成 `lib/typert.*`，不要手改。构建器从本地 npm 依赖生成 `.cache/typert` 工作区。记忆契约的维护源为仓库内 `shared/memory-contract.ts`，同步脚本生成 `src/shared/generated/memory-contract.ts` 副本；更新契约后运行 `npm run sync:shared`，包检查会拒绝过期副本。

扩展上下文只调用可选 memory 服务的 `recallForProject`，不直接访问其存储。项目检索通过宿主 subprocess 运行随包依赖提供的 ripgrep，以草稿路径、标识符和关键词在本地排序；不调用额外模型或建立向量库。读取上限见[使用指南](guide.md#数据与上下文)。

`setDraft` 的 rc.3 结构化输入适配集中在客户端 binding。引用的实际身份保留在客户端；Host 接收占位符，客户端校验并恢复引用。

## 验证层级

- **单元与契约检查**：使用现有 `test/*.test.ts`；`test/quality-cases.json` 保存 10 个固定质量样例。
- **浏览器组件验收**：按[单按钮 UI 验收说明](../test/browser/README.md)运行 `single-button.js`。该页加载正式插件构建及本机 DSH 原生 UI，Host/RPC 使用测试夹具，不连接日用数据或收费模型；这项可选检查另需本机 DSH Desktop，替换说明中的安装与输出路径后运行，不属于 `npm run check` 的前提。
- **真实模型验证**：实际调用可用模型，检查改写质量与来源；历史结果按日期记录，不能当作本次重跑。
- **桌面安装验收**：在真实 DSH 中检查加载、设置保留、预览、采用、恢复和相关异常，再记录版本及结果。

历史质量与安装证据见[验证记录](verification.md)。README 截图说明见[截图记录](screenshots/README.md)；一次截图演示不等同于完整回归。
