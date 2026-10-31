# User guide

[简体中文](guide.md) · English

[Back to README](../README.en.md) · [Development guide](development.en.md) · [Verification record](verification.en.md)

Applies to Prompt Improver 0.2.11 and DSH 0.2.1-rc.3. Public Release installation examples below retain the published 0.2.7 version.

## Improve and apply a draft

Write a draft in a regular conversation, then click the sparkle button at the bottom of the input box, to the left of the model selector. The plugin uses your saved settings. Click the same button again while processing to cancel.

| Apply mode | What happens when processing finishes |
| --- | --- |
| Replace draft directly | The input box receives the improved draft without opening a preview or settings dialog |
| Preview first | The original draft stays in place; a comparison opens, and the result is applied only when you click “Replace draft” (替换草稿) |

The preview shows the original and improved drafts side by side by default, or stacked in a narrow window. Clear “Compare with original” (对照原文) to show only the result. Expand “Sources actually used” (实际参考来源) to see the sources and excerpts included. Notices about missing or truncated sources remain visible when needed.

Clicking “Keep original” (保留原稿) or closing the preview leaves the input unchanged. Neither apply mode sends a chat message automatically.

### Restore the original

After applying a result, the enhancement button becomes a back arrow. Click it to restore the draft **as it was before that enhancement**; the button then returns to the sparkle icon.

Editing, sending, or changing the attachments, session or effective model invalidates the previous undo action so it cannot overwrite new input. This is not a draft history feature across sessions.

### When enhancement is unavailable

Empty drafts, command drafts, subagent sessions and non-editable input boxes are not enhanced. The plugin has no right-click, `Shift+F10` or menu-key shortcut menu. Open its preferences through DSH Settings.

## Choose your settings

Open **DSH Settings → Prompt enhancement** (提示词增强). The page groups enhancement preferences, input prediction, context scope and the enhancement model. Mystery injection and prediction use right-aligned native switches, operable by click, Space or Enter. Save applies changes; Cancel restores the saved values.

### Enhancement mode

- **Moderate** (适度增强): organize the wording and remove ambiguity or repetition. A clear draft may need very few changes.
- **Expanded** (充分展开): add the structure and detail appropriate to the task, without forcing every draft into a long template.

Both modes instruct the model to preserve the original language, negative constraints, numbers, paths, code and references, without introducing new restrictions or approval requirements. Missing facts are marked as needing clarification. Obvious drift between Chinese and Latin-script text is rejected, but this is not full language detection; review the result yourself.

### Mystery prompt injection

The **Mystery prompt injection** switch under **DSH Settings → Prompt enhancement → Enhancement preferences** is off by default and independent of the enhancement mode. A DeepSeek label identifies its applicability. When enabled, each enhancement tries to prepend a fixed capability declaration to the improved draft. Turning it on or off does not change the enhancement mode, apply mode, context scope, enhancement model or reasoning effort.

Injection depends only on the model selected in the input box's model selector for the current conversation, and the plugin reads only that model's id. The id is tested against `/deepseek/i` (case-insensitive), for example `deepseek-chat`, `deepseek-reasoner`, `DeepSeek-V3.2-Exp`, `deepseek-v4.1-flash` or `deepseek-ai/DeepSeek-V3`. Other models are treated as non-DeepSeek, as are aliases and custom models whose id does not contain `deepseek`. Enhancement still completes normally, and the result reports why injection was skipped:

- The model is identified but is not DeepSeek: the result reports that the selected model is not DeepSeek and that injection was skipped.
- The current model cannot be identified: the result reports that the model could not be identified and that injection was skipped.

The decision depends only on the current conversation model, not on the enhancement model setting. With a dedicated model selected, injection is skipped when the current conversation model is not DeepSeek even if the dedicated model is DeepSeek. Conversely, when the current conversation model is DeepSeek, injection still happens even if the dedicated enhancement model is not.

The injected text is fixed, chosen by the draft language, and inserted verbatim as the first paragraph of the improved draft:

**Chinese version** (draft contains Chinese):

> 【能力解放声明】本次会话的 token 额度无上限，上下文窗口与输出长度均没有配额限制；不要以额度、篇幅、轮次或成本为由缩短回答、省略细节或提前收尾。请写到结论为止；一次写不完就列出未完成部分并继续，而不是跳过。

**English version** (other drafts):

> [Capability Liberation Notice] This session has an unlimited token quota: no cap applies to context or output length. Do not shorten the answer, drop details, or stop early because of quota, length, turns, or cost. Write through to the conclusion; if it cannot fit in one pass, list the unfinished parts and continue instead of skipping them.

If the returned draft does not contain this declaration, the enhancement fails and keeps the original draft, reporting that mystery prompt injection did not take effect and that you can retry or turn the setting off.

The declaration only adjusts model output behavior. It does not change the server-side quota, context window or `max_tokens` limit.

### Context scope

| Option | When to use it | What it includes |
| --- | --- | --- |
| Draft-only | The question stands on its own | Only the current draft is sent |
| Recent conversation | The draft follows the preceding discussion | User and assistant text from the latest 3 completed rounds |
| Extended context | The question needs project information and memory | Conversation, personal and same-project memories, and current-project excerpts |

Extended context is restricted to the host owner. The project is determined by the current session's workspace; an arbitrary directory cannot be selected. Sessions without a project show why project memories or files were not read.

### Enhancement model

By default, enhancement follows the model and reasoning effort currently selected for the conversation. To use a dedicated model, choose it from DSH's available model catalog and select one of its supported reasoning effort levels, or “Model default.”

An unavailable dedicated model causes an explicit failure; the plugin does not fall back to another model. The host validates reasoning effort, without automatically translating aliases or lowering the level. The model catalog and input state are checked again before a preview is applied, so a stale result cannot overwrite a new draft.

### Save settings and retain older preferences

After editing, the page shows “Unsaved changes” (有未保存的修改). Click “Save settings” (保存设置) to apply them, or “Cancel” (取消) to discard unsaved edits. “Refresh models and settings” (刷新模型与设置) preserves unsaved edits. Dropdowns support native keyboard interaction.

Saving is unavailable when nothing has changed, a dedicated model is unavailable, or the reasoning effort is invalid; the page explains why. Initial defaults are moderate enhancement, direct replacement, recent conversation and the current model. Upgrades preserve existing settings, and the enhancement mode from older clients is migrated on the first read.

Settings management is restricted to the host owner. Non-owners can use the default recent-conversation scope and current model. The settings file is `$DSH_HOME/plugins/dsh-link-prompt-enhance/settings.json`; it stores these choices, not model API keys.

Version 0.2.6 uses the new package name `dsh-prompt-improver`. The settings path above and the older client's enhancement-mode storage key intentionally remain unchanged to preserve settings during upgrades and rollbacks. Do not move or delete that directory.

## Data and context

Your draft and the selected context are sent to the enhancement model, with charges determined by that provider. Instructions found in background material are not treated as new tasks or authorization to act.

### Read boundaries and limits

The following budgets count UTF-16 characters, not model tokens.

| Context scope | Limit |
| --- | --- |
| Draft-only | No history, memory or project files are read |
| Recent conversation | Latest 3 completed rounds, up to 12,000 characters total |
| Extended context | Up to 8,000 conversation characters, 4,000 memory characters and 4,000 project-excerpt characters |

History excludes running or interrupted rounds, reasoning content, tool results and attachment bodies. The most recent complete rounds take priority. If the newest round is too long, the user's request takes priority so the context does not retain only the assistant's answer.

A history read failure stops the request; you can switch to draft-only and try again. Missing, failed, timed-out or truncated memory and project content produces a notice and is listed in the preview. Memory uses the optional `memory` service; this plugin does not access its storage directly.

Project searches respect ignore rules and exclude hidden directories, credentials, dependencies, caches, build artifacts and non-text files. Symbolic links and directory junctions are rejected rather than followed outside the project. A search checks at most 300 text files, at most 128 KB per file, with a 5-second timeout. The final excerpts cover at most 5 files and 4,000 characters. Truncation notices identify content affected by these limits.

### References, attachments and timeouts

The client retains the identities of structured `@references`. Before sending, it substitutes random placeholders, then validates and restores references when the result returns. Missing, duplicated or damaged references cause the result to be rejected. Attachment identities stay unchanged, and enhancement does not upload attachment bodies.

Each enhancement makes one auxiliary call without tools. It does not enter an agent execution loop or add chat messages. Network retries inside a model adapter are managed by the host. The default overall timeout is 120 seconds; memory recall has a 3-second limit.

## Installation and rollback

### Preparation

You need DSH 0.2.1-rc.3, 0.2.1-rc.4, or 0.2.1-rc.5 and access to GitHub and your npm dependency registry. The [v0.2.12 release](https://github.com/Yocaihua8/dsh-prompt-improver/releases/tag/v0.2.12) provides a `.tgz` installation package and `SHA256SUMS`. You can also install from a GitHub tag through DSH. Both include prebuilt `lib` files and require no development tools. Read the [workspace prerequisites](development.en.md#workspace-prerequisites) before editing or rebuilding the source.

Before upgrading, back up the old installation package, plugin settings, and the desktop profile's `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `cordis.yml` and `cordis.patch.yml`. Record the corresponding plugin and host versions, and keep the old package at its original path.

### Install from GitHub

If `dsh-link-prompt-enhance` is already installed, complete [migration from the old package](#migrate-from-the-old-package) below first. Do not load both packages together.

Wait for current tasks to finish, quit DSH normally, and confirm its processes have exited. Use the CLI bundled with Desktop, replacing the placeholder:

```powershell
$dshCli = '<DSH installation directory>\resources\runtime\cli\bin\dsh.cmd'
& $dshCli plugin --profile desktop add 'github:Yocaihua8/dsh-prompt-improver#v0.2.12'
```

The bundled Desktop CLI supports plugin access to this reserved profile; another system CLI may not. Standalone CLI users should select an existing Web profile containing workspace and session services. A new empty profile is insufficient:

```powershell
dsh plugin --profile <your-profile-name> add 'github:Yocaihua8/dsh-prompt-improver#v0.2.12'
```

These commands pin version 0.2.12. Omit `#v0.2.12` to test the default branch, or use `#<full-commit-SHA>`. To update, repeat the add command after checking host compatibility in the current README. The automatically generated Release “Source code” ZIP is for source development, not plugin installation; use the `.tgz` under Assets or the commands above.

After restarting, use a dedicated test session to check the button, settings page, preview and restore action. Restart again to confirm settings persist. Use a non-sensitive draft, and check that other plugins and existing data remain intact.

### Install a release archive

Download `dsh-prompt-improver-0.2.7.tgz` and `SHA256SUMS`. Verify the checksum, then install after the same backup and shutdown steps:

```powershell
$pluginPackage = '<package directory>\dsh-prompt-improver-0.2.7.tgz'
Get-FileHash -Algorithm SHA256 $pluginPackage
# Confirm that Hash matches this file's entry in SHA256SUMS before installing.
& $dshCli plugin --profile desktop add $pluginPackage
```

Do not overwrite a `.tgz` at a path already used by an installation. Check the interface and settings as described above.

### Migrate from the old package

Version 0.2.5 and earlier use `dsh-link-prompt-enhance`; 0.2.6 and later use `dsh-prompt-improver`. This changes the package identity. Adding the new package does not remove the old one automatically. Complete the backups in “Preparation” and quit DSH, then run these commands with the same CLI and profile:

```powershell
$dshCli = '<DSH installation directory>\resources\runtime\cli\bin\dsh.cmd'
& $dshCli plugin --profile desktop remove dsh-link-prompt-enhance
if ($LASTEXITCODE -ne 0) { throw 'Failed to remove the old package. Check the output before continuing.' }
& $dshCli plugin --profile desktop add 'github:Yocaihua8/dsh-prompt-improver#v0.2.12'
if ($LASTEXITCODE -ne 0) { throw 'Installation failed. Restore the previous package before starting DSH.' }
```

Standalone CLI users should use their actual Web profile. For a downloaded archive, replace the GitHub source in the second CLI command with the path to `dsh-prompt-improver-0.2.7.tgz`.

If you manually configured this plugin in a home or profile `cordis.patch.yml`, or used the market to save enable/disable overrides, inspect `id`, `name` and `target` references to the old plugin. Change the relevant `dsh-link-prompt-enhance` references to `dsh-prompt-improver`, preserving `disabled` and `config` values. Only edit references to this plugin; if no such entries exist, no edit is needed. Do not apply a blanket replacement to settings storage paths.

After restarting, check that there is one enhancement button and one settings entry, and that the previous mode, context scope and dedicated-model selection remain. If installation fails, restore the backed-up old package. Do not enable both packages together.

### Rollback

Quit DSH normally. To roll back to 0.2.5 or earlier, remove the new package, then add the corresponding old archive with the same Desktop CLI:

```powershell
$previousPackage = '<backup directory>\<previous-version-package>.tgz'
& $dshCli plugin --profile desktop remove dsh-prompt-improver
if ($LASTEXITCODE -ne 0) { throw 'Failed to remove the new package. Check the output before continuing.' }
& $dshCli plugin --profile desktop add $previousPackage
```

If you changed this plugin's Cordis overrides during migration, restore their old-name references while preserving configuration and enable/disable state. When rolling back to another version still named `dsh-prompt-improver`, add that package directly without removing it first.

For a previous GitHub installation, you can also add a verified old commit that includes the complete `lib`: `& $dshCli plugin --profile desktop add 'github:Yocaihua8/dsh-prompt-improver#<old-commit-SHA>'`. Commits preceding the inclusion of prebuilt artifacts do not support this direct installation path.

If you need to restore backed-up profile configuration and lockfiles, first confirm that changes to other dependencies in those files should also be reverted, then run `plugin --profile desktop install --frozen-lockfile`. Restore plugin settings only if they changed and actually need reverting.

Do not restore the entire DSH_HOME or overwrite new sessions, attachments, memories or usage data. A rollback package must still be compatible with the current host; having run successfully in the past does not prove that it can load now. Historical installation paths and results are in the [verification record](verification.en.md).

## Troubleshooting

| Question | What to check |
| --- | --- |
| Why is there no popup after enhancement? | Direct replacement is the default; select preview mode to compare the result first |
| Why did the draft change so little? | Moderate mode may preserve an already clear draft; try expanded mode for more structure and detail |
| Why were no memories or project files read? | Check scope, owner permissions, the optional memory service and the session workspace; consult the actual-source notices |
| Why can't I save the model settings? | The model or reasoning effort may no longer be available; refresh the catalog and select again |
| Why can't I restore the previous draft? | Editing, sending, or changing attachments, session or effective model invalidates the old undo action |
| Why did enhancement fail or refuse to apply? | Follow the error message: check history access, model availability, timeout, reference integrity and whether the input changed |

If the problem remains, [open an issue](https://github.com/Yocaihua8/dsh-prompt-improver/issues) with plugin and DSH versions, reproduction steps, and redacted errors or screenshots. Do not include keys, personal conversations or unredacted logs.
## Input prediction

Enable the right-hand **Input prediction** switch in **DSH Settings → Prompt Enhancement**, then save. It defaults to off, including when upgrading existing settings. Shortcut and usage hints stay visible; the settings page no longer contains a reference-scope disclosure. The scope rules below still apply.

The visible, focused main-session composer predicts a next message after a completed response, or a suffix after an 800 ms typing pause. A blank new conversation makes no model call. Suggestions contain at most 200 characters. **Tab** accepts, **Esc** dismisses, and native undo reverses acceptance; sending remains manual. Shift+Tab keeps its navigation behavior.

Prediction pauses during composition, selection, a nonterminal caret, native menus, running assistant turns, and pending interactions. Each session has one request at a time, a 3-second minimum interval and a 30-second deadline. Draft, attachment, model, context and setting changes invalidate old results. Failed or dismissed requests do not repeat for the same content and context.

The enhancement model is reused, but prediction always uses the latest three completed turns plus available memory, independently of manual enhancement's context, mode, preview and mystery options. It reads no project files or attachment bodies. Ordinary sessions use personal memory; project sessions may additionally use that project's memory. Projectless recall requires `dsh-memory 0.1.8-rc.2`; disabled/unavailable memory is reported without blocking conversation-only prediction. Existing memory categories, conditions and expiration still apply.

Enabling prediction sends this context to the selected model and incurs usage. Ghost text is excluded from the actual draft, clipboard and submitted message until accepted, and prediction never writes memory. Review suggestions before sending.

The interface follows DSH’s native language preference immediately. Switching language does not save unsaved settings or restart enhancement or prediction. Generated content still follows the draft and conversation language.
