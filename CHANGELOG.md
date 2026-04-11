# Changelog

All notable changes to this project are documented in this file based on the repository commit history.

## [1.0.1] - 2026-04-12

### Fixed

- Added an explicit fallback for dialog injection so `useGDialog()` returns a safe default when the plugin is not available.
- Improved resilience for composables that depend on the injected dialog controller.

### Changed

- Bumped the package version to `1.0.1`.

## [1.0.0] - 2026-02-26

### Added

- Added utility types for extracting component props and confirm callback data from dialog components.
- Added type-focused tests covering inferred dialog props, confirm helpers, return-data helpers, and functional components.
- Expanded the README with installation steps, API reference, dialog examples, and non-`setup()` usage guidance.

### Changed

- Improved type inference for `addDialog`, `useDialogConfirm`, and `useDialogReturnData`.
- Made confirm and return-data helpers accept optional props only when the dialog component does not require additional props.
- Updated package metadata and development dependencies for the `1.0.0` release.

## [0.0.4] - 2024-03-18

### Changed

- Renamed `RDialogSpawn` to `GDialogSpawn`.
- Updated exports, tests, build config, and documentation to match the new naming.
- Refreshed package metadata and typings for the published package.

## [0.0.1] - 2023-12-04

### Added

- Initial release of the Vue 3 dialog management utilities.
- Added the dialog plugin, spawn component, composables, injection key, shared types, tests, and build configuration.
