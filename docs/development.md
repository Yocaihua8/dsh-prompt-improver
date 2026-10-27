# 开发说明

[返回 README](../README.md) · [使用指南](guide.md) · [验证记录](verification.md)

## 工作区前提

需要 Node.js **22.19.0 或更高版本**，宿主和 DSH 相关依赖为 **0.2.1-rc.3**。依赖以本包 `package.json` 和 `package-lock.json` 为准。

**当前公开仓库不是完整的独立构建工作区。** `scripts/build.mjs` 与 `scripts/check-package.mjs` 是薄入口，分别引用仓库外的 `../../scripts/build-plugin.mjs` 和 `../../scripts/check-package.mjs`。公共实现还依赖同级的 `plugins.mjs`、`sync-shared.mjs`、相关契约登记及共享源文件。

这些资源来自原始 DSH Link 开发工作区，未包含在当前仓库中。**安装使用**可直接读取仓库内已构建的 `lib`，见[安装指南](guide.md#从-github-安装)。DSH 所用 pnpm 检测到 `main` 指向的 `lib/index.js` 已存在后，无需执行 Git 依赖构建；保留 `prepack` 用于维护者制作安装包时的检查。

**修改源码与重新构建**仍需要完整工作区。单独克隆后，即使安装了 npm 依赖，也不能直接完成 `npm run build`、`npm run check`、`npm run check:package` 或默认的 `npm pack`。请先从维护者取得与本版本匹配的完整工作区，不要通过跳过检查来生成安装包。

原工作区的基本关系如下；它仅说明依赖位置，不是可直接下载的目录清单：

```text
workspace/
├─ scripts/                  # 公共构建、包检查和契约同步实现
├─ shared/                   # 公共契约源文件
└─ dsh-link-prompt-enhance/   # 本仓库
```

## 构建与检查

**取得完整工作区后**，在插件目录中运行：

```powershell
npm ci
npm run check
npm run check:package
```

| 命令 | 内容 |
| --- | --- |
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

打包白名单包含完整 `lib`、Cordis 配置、许可证、README 和 `docs/`（含指南、验证记录及脱敏截图），不包含源码、测试、构建脚本或本机输出目录。部分开发文档链接指向仓库中的测试说明，阅读这类内容时请使用完整仓库。

### 更新 GitHub 可安装内容

`lib/` 是 GitHub 安装所需的预构建产物，应与对应源码一起提交。每次修改产品源码后，在完整工作区运行 `npm run check` 和 `npm run check:package`，检查生成物差异，再一并提交源码与 `lib`；不要手工编辑生成物。文档变更不需要修改插件版本，当前运行时仍为 0.2.3。

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

Typert 由官方生成器生成 `lib/typert.*`，不要手改。公共记忆契约来自原工作区的 `shared/memory-contract.ts`，通过构建登记生成包内 `src/shared/generated/memory-contract.ts` 副本。

扩展上下文只调用可选 memory 服务的 `recallForProject`，不直接访问其存储。项目检索通过宿主 subprocess 运行随包依赖提供的 ripgrep，以草稿路径、标识符和关键词在本地排序；不调用额外模型或建立向量库。读取上限见[使用指南](guide.md#数据与上下文)。

`setDraft` 的 rc.3 结构化输入适配集中在客户端 binding。引用的实际身份保留在客户端；Host 接收占位符，客户端校验并恢复引用。

## 验证层级

- **单元与契约检查**：使用现有 `test/*.test.ts`；`test/quality-cases.json` 保存 10 个固定质量样例。
- **浏览器组件验收**：按[单按钮 UI 验收说明](../test/browser/README.md)运行 `single-button.js`。该页加载正式插件构建及本机 DSH 原生 UI，Host/RPC 使用测试夹具，不连接日用数据或收费模型；其中路径属于原开发环境，运行前须替换并具备上述完整工作区。
- **真实模型验证**：实际调用可用模型，检查改写质量与来源；历史结果按日期记录，不能当作本次重跑。
- **桌面安装验收**：在真实 DSH 中检查加载、设置保留、预览、采用、恢复和相关异常，再记录版本及结果。

历史质量与安装证据见[验证记录](verification.md)。README 截图说明见[截图记录](screenshots/README.md)；一次截图演示不等同于完整回归。
