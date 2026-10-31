# DSH Prompt Improver

Current release **0.2.12** is compatible with DSH 0.2.1-rc.3, 0.2.1-rc.4, and 0.2.1-rc.5.

## 0.2.11 bilingual interface

The complete plugin UI follows DSH **Settings → General → Language** immediately. Settings, enhancement controls, preview, source labels, errors, and prediction shortcuts support English and Simplified Chinese. Language changes retain unsaved settings, previews, suggestions, and pending requests without calling a model. Enhanced drafts and predictions continue to follow the draft and conversation language.

[简体中文](README.md) · English

Turn a draft in the DSH input box into a clearer prompt. Apply the result directly, or compare it with the original before deciding what to keep.

**Plugin 0.2.12 · Compatible with DSH 0.2.1-rc.3 / 0.2.1-rc.4 / 0.2.1-rc.5 · MIT license**

0.2.8 adds opt-in input prediction. Enable it in settings to suggest the next message in an empty composer or continue a draft after a pause. **Tab** inserts the faint suggestion; **Esc** dismisses it. Prediction uses the enhancement model and incurs model usage. Personal memory outside projects requires `dsh-memory 0.1.8-rc.2`.

Listed in **dsh-market**: [market page](https://awesome-dsh-plugin.com/p/Yocaihua8/dsh-prompt-improver/) · [accepted submission](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/9972).

[Plugin market](#install-from-the-plugin-market) · [Get started](#get-started) · [Common settings](#common-settings) · [User guide](docs/guide.en.md) · [Report an issue](https://github.com/Yocaihua8/dsh-prompt-improver/issues)

0.2.9 fixes two issues found in the desktop: an overlapping empty placeholder and the missing undo checkpoint for the first accepted prediction after submission. See the [verification record](docs/verification.en.md).

0.2.10 implements the approved settings prototype: right-aligned native switches, concise descriptions and separate shortcut/usage hints for mystery injection and input prediction. The prediction reference explanation is removed. Changes still take effect after saving.

## See it in action

### Improve a draft from the input box

Write a draft, then click the sparkle button at the bottom of the input box. The plugin updates your draft without sending a chat message.

![Real DSH input box with a neutral demo draft and the sparkle button at the bottom](docs/screenshots/enhance-entry.png)

### Compare before applying

Choose **Preview first** (先预览，再决定) to compare the original and improved drafts side by side. Click **Replace draft** (替换草稿) to apply the result, or **Keep original** (保留原稿) to continue editing.

![Real preview showing the original draft and the actual model output, with actions to keep or replace the draft](docs/screenshots/enhance-preview.png)

### Choose how to improve your prompts

Open **DSH Settings → Prompt enhancement** (提示词增强) to choose the enhancement mode, context scope and model. Click **Save settings** (保存设置) to apply your changes.

![Prompt enhancement settings showing moderate enhancement, preview mode, draft-only context and the current conversation model](docs/screenshots/enhance-settings.png)

*These real screenshots were captured on October 27, 2026, using DSH 0.2.1-rc.3 and plugin 0.2.3. The build and dependency changes in 0.2.4–0.2.5 and the package rename in 0.2.6 did not change this interface. The demo uses draft-only context and preview mode, which are not the initial defaults. Images retain the original Chinese UI, show only the relevant controls, and have personal configuration fields masked.*

## Get started

### Requirements

- **DSH 0.2.1-rc.3, 0.2.1-rc.4, or 0.2.1-rc.5**, with a working model configured.
- Network access to GitHub and the npm registry used by your installation.

### Install from the plugin market

Open the [market installation page](https://awesome-dsh-plugin.com/p/Yocaihua8/dsh-prompt-improver/) for screenshots and installation options. If you have `dshmarket` installed, you can also search for `dsh-prompt-improver` in DSH's **Plugin Market**.

The catalog entry currently points to the **v0.2.12** prebuilt package. Distribution sources may sync at different times; if search does not find the plugin yet, use the market page or the Release installation below.

### Install from a GitHub Release

Download the `.tgz` package and `SHA256SUMS` from the [v0.2.12 release](https://github.com/Yocaihua8/dsh-prompt-improver/releases/tag/v0.2.12), or install from the same GitHub tag using the command below. Both include the prebuilt `lib` directory; you do not need to compile the plugin locally.

**Upgrading from the old name?** Version 0.2.6 renames the repository and package to `dsh-prompt-improver`. If you have `dsh-link-prompt-enhance` installed, follow [Migrate from the old package](#migrate-from-the-old-package) before installing. Existing enhancement settings are preserved.

For DSH Desktop, back up the existing plugin and desktop profile configuration, wait for active tasks to finish, and quit DSH normally. Run the following in PowerShell, replacing the placeholder with your installation directory:

```powershell
$dshCli = '<DSH installation directory>\resources\runtime\cli\bin\dsh.cmd'
& $dshCli plugin --profile desktop add 'github:Yocaihua8/dsh-prompt-improver#v0.2.12'
```

Use the **CLI bundled with DSH Desktop**. For a standalone CLI installation, run `dsh plugin --profile <your-existing-web-profile> add 'github:Yocaihua8/dsh-prompt-improver#v0.2.12'` with your existing Web profile name. See the [installation and rollback guide](docs/guide.en.md#installation-and-rollback) for release archives, development branches and rollback steps.

To change the source, clone this repository and run `npm ci`, `npm run check` and `npm pack`. The build scripts and shared contract sources are included. Development requires Git and Node.js **22.19.0 or newer**; see the [development guide](docs/development.en.md) for details.

Version 0.2.5 reduced dependency audit findings in this repository's locked dependency tree from 40 to zero while retaining compatibility with DSH 0.2.1-rc.3. The plugin does not override the host's bundled dependencies. See the [verification record](docs/verification.en.md) for the audit scope and compatibility checks.

### Improve your first draft

1. Restart DSH and write a draft in a regular conversation.
2. Click the **sparkle button** to the left of the model selector and wait for the result.
3. By default, the result replaces the draft. Review it before sending. To compare first, choose preview mode in settings.

While enhancement is running, click the same button again to cancel. After applying a result, the button becomes a back arrow; click it to restore the original draft from that enhancement.

### Migrate from the old package

Version 0.2.5 and earlier use `dsh-link-prompt-enhance`. Adding the renamed package does not automatically remove the old one. After backing up and quitting DSH, remove the old package and install the new one with the same CLI and profile:

```powershell
$dshCli = '<DSH installation directory>\resources\runtime\cli\bin\dsh.cmd'
& $dshCli plugin --profile desktop remove dsh-link-prompt-enhance
if ($LASTEXITCODE -ne 0) { throw 'Failed to remove the old package. Check the output before continuing.' }
& $dshCli plugin --profile desktop add 'github:Yocaihua8/dsh-prompt-improver#v0.2.12'
if ($LASTEXITCODE -ne 0) { throw 'Installation failed. Restore the previous package before starting DSH.' }
```

If you have custom Cordis overrides or market-created enable/disable overrides for this plugin, update the old plugin's `id`, `name` or `target` references to `dsh-prompt-improver`, preserving their `disabled` and `config` values. Only change references to this plugin.

The settings file intentionally stays at `$DSH_HOME/plugins/dsh-link-prompt-enhance/settings.json` so both the renamed plugin and the old version can read it. Do not move or delete it. After restarting, check that there is one enhancement button and one settings entry, and that your previous choices are preserved. For rollback, remove the new package before reinstalling an old-name package and restore any changed Cordis references; see the [migration and rollback guide](docs/guide.en.md#migrate-from-the-old-package).

## Common settings

| Setting | Initial default | When to change it |
| --- | --- | --- |
| Enhancement mode | Moderate | Clarify the draft while preserving its intent; choose expanded mode for more structure and necessary detail |
| Apply result | Replace draft directly | Choose preview mode to compare the result before applying it |
| Context scope | Recent conversation | Use draft-only for standalone questions, or extended context for memory and project excerpts |
| Enhancement model | Current conversation model | Choose a dedicated model to improve prompts with a different model |
| Mystery prompt injection | Off | Injects a capability declaration at the start of the improved draft when the current conversation uses a DeepSeek model; other models are skipped automatically |

Upgrades preserve existing settings. The enhancement mode from older clients is migrated on the first read. If a dedicated model is unavailable, enhancement fails with a message instead of silently switching models. See the [user guide](docs/guide.en.md) for details.

## Data and costs

- Your draft and the selected context are sent to the enhancement model. Charges follow that model provider's pricing.
- **Draft-only** reads no conversation history, memory or project files. **Recent conversation** includes up to three completed conversation rounds.
- **Extended context** can read personal and same-project memories plus current-project excerpts. It requires host-owner permissions and the corresponding services; it does not write to memory.
- Enhancement does not upload attachment contents. Structured `@references` are validated and restored. Models can still miss requirements, so review the result before sending.

See [data and context](docs/guide.en.md#data-and-context) for limits, read boundaries and failure handling.

## Documentation and feedback

- [User guide](docs/guide.en.md): preview, restore, settings, installation and troubleshooting.
- [Development guide](docs/development.en.md): prerequisites, build checks, interfaces and tests.
- [Verification record](docs/verification.en.md): dated test, installation and real-model evidence.
- [Report an issue or suggestion](https://github.com/Yocaihua8/dsh-prompt-improver/issues): include the version, reproduction steps and redacted screenshots.
- [MIT license](LICENSE).
