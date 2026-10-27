# 单按钮 UI 验收

`single-button.js` 替代旧 `icon-menu.js`。验收页装载实际 `lib/client.js`，通过原插件注册的 slot 组件与 `SettingsClient`、`EnhanceController` 运行。React、Button、Modal、Toast、图标及主题直接来自本机 DSH 0.2.1-rc.3 的静态 Web 资源；只去掉测试副本中的 Host 启动段。

Host 服务和模型响应为内存测试夹具，用来控制取消、迟到响应、会话变化、模型不可用和保存失败。页面禁止网络连接，不会发送聊天消息、读取日用会话、调用真实模型、安装插件或修改 DSH 应用。测试资源不进入发布包。

## 启动

在插件目录执行，先构建，再复制安装程序内的只读静态资源：

```powershell
npm run check
$testAssets = 'E:\Dev\Projects\dsh-link\output\prompt-enhance-ui-20261025\browser\host'
$previousElectronMode = $env:ELECTRON_RUN_AS_NODE
try {
  $env:ELECTRON_RUN_AS_NODE = '1'
  & 'E:\Dev\Toolchains\DeepSeek\DeepSeek Harness.exe' test/browser/extract-host.cjs 'E:\Dev\Toolchains\DeepSeek\resources' $testAssets
} finally {
  $env:ELECTRON_RUN_AS_NODE = $previousElectronMode
}
node test/browser/serve-ui.mjs $testAssets 8768
```

打开 `http://127.0.0.1:8768/`，点击“运行 UI 回归”。成功时页面显示 7 组 PASS，覆盖原图标与尺寸、空草稿、菜单移除、直接采用、原位恢复、取消、迟到响应、预览原文/来源/警告、焦点返回、模型和档位不可用、编辑与会话变化保护、保存成功/失败、未保存编辑及箭头对齐。模拟响应会原样保留请求中的引用占位符；引用身份和附件异常的完整回归继续由 `npm test` 覆盖。

随后使用真实浏览器检查：

- 1024px 下深浅主题的设置页和预览；面板应不透明、对照应并排。
- 420px 和 320px 下无横向溢出；原文与增强稿上下排列。
- 原生选择框用方向键改选，原生 radio 用方向键切换；Tab 可到达来源详情、保存和采用操作；Escape 关闭预览并返回原按钮。
- 采用后只有返回图标，按 Enter 恢复，再显示原星光；手动编辑后旧撤销失效。

测试页只是组件验收，不能代替完整 DSH 的真实 RPC、模型质量、Electron 集成和安装后验收。宿主版本或 Web 入口格式变化时，提取器会停止，需重新核对静态资源映射。历史真实模型/日用验收记录见 `docs/verification.md`。
