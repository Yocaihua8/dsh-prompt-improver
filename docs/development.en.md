# Development guide

[简体中文](development.md) · English

[Back to README](../README.en.md) · [User guide](guide.en.md) · [Verification record](verification.en.md)

## Workspace prerequisites

The repository, npm package identity and Cordis loader ID are `dsh-prompt-improver` as of 0.2.6. The RPC service remains `promptEnhance`; error codes, settings paths and the legacy browser storage key remain compatible. Do not replace these older identifiers indiscriminately when changing a package name. Historical verification records and old Releases retain their original names.

You need Git, Node.js **22.19.0 or newer**, the npm bundled with Node.js, and network access to the npm dependency registry. DSH dependencies are **0.2.1-rc.3** and are installed by `npm ci` according to `package-lock.json`. Building and unit testing do not require DSH Desktop to be installed or running, or any model API keys.

**Since 0.2.4, a standalone clone can be built and packaged.** `scripts/` includes the builder, package checker and contract synchronization script used by this plugin. `shared/` includes the memory contract source. All build inputs come from this repository and locally installed npm dependencies; the build no longer reads parent-directory scripts or other plugins.

**For installation**, use the prebuilt `lib` included in a Release or GitHub tag; see the [installation guide](guide.en.md#install-from-github). When the pnpm used by DSH finds the `main` target, `lib/index.js`, already present, it does not need to build the Git dependency. `prepack` remains in place to validate installation archives when creating them.

Build inputs and outputs:

```text
dsh-prompt-improver/
├─ scripts/                  # Local builder, package checker and contract sync
├─ shared/                   # Contract source
├─ src/                      # Product source and generated contract copy
├─ lib/                      # Build output distributed in Git and Releases
└─ package-lock.json         # Development dependency lockfile
```

## Build and check

Run from a development directory of your choice:

```powershell
git clone https://github.com/Yocaihua8/dsh-prompt-improver.git
cd dsh-prompt-improver
# Pin the tag to reproduce this Release; omit for default-branch development.
git checkout v0.2.12
npm ci
npm run check
npm run check:package
npm audit
npm audit --omit=dev
```

| Command | Purpose |
| --- | --- |
| `npm run sync:shared` | Update the generated contract from this repository's `shared/`; add `-- --check` to check consistency without writing |
| `npm run build` | Sync the shared contract and generate Typert, Host, client and type declarations |
| `npm run typecheck` | Check Host and client types |
| `npm test` | Run the existing TypeScript unit tests |
| `npm run check` | Run the build, type checks and unit tests in sequence |
| `npm run check:package` | Check the actual package file list and imports without creating a release archive |

To create an installation archive, use a new output directory:

```powershell
$packageOutput = '<new package output directory>'
New-Item -ItemType Directory -Force -Path $packageOutput | Out-Null
npm pack --pack-destination $packageOutput
```

`prepack` runs `check` and `check:package` again. Do not overwrite an archive at a path already delivered or installed. Passing the package check does not establish that desktop installation and interaction acceptance have passed.

Formal releases use only `X.Y.Z`: increment `Z` for fixes or host compatibility changes, increment `Y` and reset `Z` for compatible features, and increment `X` and reset the other components for breaking changes. Record supported hosts in `engines.dsh`, DSH peers and compatibility records instead of adding suffixes such as `+dsh.rc45.1` to formal versions. `check:package` rejects invalid formal versions and mismatches between `package.json.version` and either the top-level or root-package lockfile version. Archive filenames and release records must identify the same release. Replace existing compatibility builds through a subsequent patch release at a new path, preserving old archives. This change applies only to formal releases; existing prerelease conventions remain in place.

The repository uses `.gitattributes` to enforce LF text files, preventing Windows checkout conversion from changing CSS strings embedded in the client. Rebuilt `lib` files should match the committed artifacts. Fresh-clone validation first moves the existing `lib` out to verify regeneration from source.

Version 0.2.5 pins development Zod to **4.6.7** in the repository root project, uses `overrides.zod: "$zod"` to replace older copies in the DSH rc.3 dependency chain, and overrides Undici to **8.12.3**. DSH package versions, the Node.js requirement and runtime peer constraints remain unchanged. On 2026-10-27, both `npm audit` and `npm audit --omit=dev` returned **0 findings**. Audit again before changing dependencies or publishing.

These overrides apply only when this repository is the root npm project; see the [npm overrides documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#overrides). When installed into DSH, the plugin uses the host's peer dependencies. The archive does not modify the host ASAR, other plugins or profile override rules. A clean repository audit does not mean the entire DSH Desktop dependency tree is clean; fixes for bundled host dependencies must ship in a host release.

The package allowlist includes the complete `lib`, Cordis configuration, license, README files and `docs/`, including guides, verification records and redacted screenshots. It excludes source code, tests, build scripts and local output directories. Some development links point to test instructions in the repository; use a full checkout to read those files.

### Update the GitHub-installable package

`lib/` contains the prebuilt artifacts required for GitHub installation and must be committed with the corresponding source. After a product source change, run `npm run check` and `npm run check:package`, inspect the generated differences, then commit the source and `lib` together. Do not edit generated files by hand. Version 0.2.5 changes repository dependency resolution and regression tests; its enhancement logic and interface are inherited from 0.2.3.

Tag a verified commit for a Release, then upload the `.tgz` produced by `npm pack` from that commit and its `SHA256SUMS`. Store the checksum in the Release assets rather than putting an archive's own hash inside its documentation. Do not commit `node_modules`, `.cache`, local output or unredacted screenshots.

Before publishing, use an isolated `DSH_HOME` and test profile to verify GitHub installation, bundle configuration and entry-point loading without affecting the daily profile. `dsh --profile <test-profile-name> --dump-config` shows the composed configuration. Successful installation does not establish complete desktop interaction or real-model quality acceptance.

## Structure and interfaces

| Module | Responsibility |
| --- | --- |
| `src/client/` | Input button, request state, comparison preview, settings and draft lifecycle protection |
| `src/host/` | Enhancement calls, prompts, history, project retrieval and settings persistence |
| `src/shared/` | Request/response types, defaults, reference protection and generated contract |
| `src/index.ts` | Host plugin registration and RPC entry points |

RPC methods are `enhance`, `getSettings`, `saveSettings` and `capabilities`. The `enhance` response retains `text` and can return an actual-context report in `context` and the effective model in `selection`.

Enhancement requests declare session-resource authorization. Settings management and extended-context reads also check owner permissions. Settings, draft, attachments and the effective model are captured at click time; later settings are not read into that request. Both response application and preview adoption must match the client's current state to avoid overwriting new input.

Version 0.2.3 passes the existing session ID to model calls so Personal Center 0.1.17 can associate auxiliary usage, without adding a chat message or a separate plugin reporting flow.

### Generated files and shared contracts

The official Typert generator produces `lib/typert.*`; do not edit these files manually. The builder creates the `.cache/typert` workspace from local npm dependencies. The maintained memory contract source is `shared/memory-contract.ts`; the synchronization script creates `src/shared/generated/memory-contract.ts`. After changing the contract, run `npm run sync:shared`. The package check rejects a stale copy.

Extended context calls only `recallForProject` on the optional `memory` service and does not access its storage directly. Project retrieval runs the bundled ripgrep dependency through the host's subprocess service, ranking local matches using paths, identifiers and keywords from the draft. It does not call an extra model or create a vector database. Read limits are in the [user guide](guide.en.md#data-and-context).

The rc.3 structured-input adaptation for `setDraft` is centralized in the client binding. The client retains actual reference identities, sends placeholders to the Host, then validates and restores references.

## Validation levels

- **Unit and contract checks:** use `test/*.test.ts`; `test/quality-cases.json` contains 10 fixed quality samples.
- **Browser component acceptance:** follow the [single-button UI instructions (Chinese)](../test/browser/README.md) and run `single-button.js`. The page loads the real plugin build and the local DSH native UI, with Host/RPC fixtures. It does not use daily data or paid models. This optional check additionally requires a local DSH Desktop installation; substitute your installation and output paths. It is not a prerequisite for `npm run check`.
- **Real-model validation:** call an available model and inspect rewriting quality and sources. Historical results are dated and must not be presented as rerun results.
- **Desktop installation acceptance:** check loading, retained settings, preview, apply, restore and relevant failure cases in real DSH, then record versions and results.

Historical quality and installation evidence is in the [verification record](verification.en.md). README screenshot provenance is in the [screenshot record (Chinese)](screenshots/README.md); one screenshot demonstration is not a complete regression run.
## Prediction interfaces (0.2.8)

`predictionEnabled` is optional for compatibility and normalizes to false. The new owner/session-authorized `promptEnhance.predict(request, signal)` accepts `sessionId`, an optionally empty `draft`, protected reference tokens, model selection and a settings snapshot. It returns `{ text, context?, selection? }`; text is only the suffix. The Host checks saved settings, excludes IM/subagent/remote-principal history, and validates the model's private `{ "suffix": "..." }` response before returning it.

The client mounts through `conversation.input.overlay`, using rc.3 composer data attributes for a presentation-only mirror. Acceptance uses the native `captureInsertion/insertText` API, preserving reference chips, attachments and undo. Revision guards protect pending results; semantic deduplication suppresses immediate re-prediction after undo or dismissal.

Project memory uses v2 `recallForContext` with purpose `enhance`, or v1 only when v2 is undeclared. Projectless recall uses the new Host-only `recallForPersonal`. Keep the local context contract aligned with the workspace shared source and generate copies through the existing sync script. See the browser verification README and the workspace prediction integration test for validation.

## 0.2.11 locale and message compatibility

The client registers a typed `dsh-prompt-improver` namespace through `ctx.locale` and subscribes only the display layer. The imperative prediction overlay repaints on locale changes without reconciling its request controller. UI locale is not part of any model request or prompt.

`prompt-enhance/failed` details retain `reason` and optionally add `messageKey` and `messageParams`. `ContextReport.warningMessages` optionally accompanies the unchanged `warnings` array. Message dictionaries and parameter types live in `src/shared/messages.ts`. Known legacy messages are resolved at display time; unknown diagnostics remain verbatim under a localized summary. Source labels localize only their plugin-owned role/scope, preserving the topic, path, and source text.
