<!-- markdownlint-disable MD024 -->

# Changelog of the extensions

## ci: - 11/30/2024 - @lumpinif

### Chrome Extension CI Improvements

- Enhanced version management in GitHub Actions workflow
  - Added robust semver validation supporting x.y.z and pre-release versions
  - Implemented automatic patch version increment for existing versions
  - Added support for pre-release versions (beta) with auto-increment
  - Added version downgrade prevention with clear error messages
  - Improved error handling for file operations and git commands
  - Added backup mechanism for safe version updates
  - Enhanced logging for better debugging and transparency

### File Operations

- Added safe JSON file updates with backup mechanism
- Improved handling of package.json and manifest.json version updates
- Added validation for version field existence in JSON files

## fix: - 11/30/2024 - @lumpinif

### Feature Cleanup & Navigation

- Fixed thinking block toggle not working when navigating between pages
- Improved cleanup and reinitialization of features during page navigation
- Added proper cleanup for mutation observer to prevent memory leaks
- Added background script for better navigation handling between pages

### Code Quality

- Removed debug console logs while keeping error logs for better production monitoring
- Added [TC] prefix to error messages for better identification
- Improved error handling and cleanup process

## feat/fix/ref: - 11/28/2024 - @lumpinif

### Architecture

- Implement feature management architecture for better extensibility
  - Add ExtensionManager for high-level orchestration
  - Create FeatureManager for feature lifecycle
  - Convert TCThinkingBlock to new architecture
  - Add configurable MutationObserverService
  - Remove singleton pattern usage
- Improve code organization and modularity
  - Clear separation of concerns
  - Dependency injection pattern
  - Standardized feature lifecycle

## feat/fix/ref: - 11/27/2024 - @lumpinif

### Performance & Code Quality

- Extremely streamline code structure and implementation approach
- Much optimized performance
- Streamline and organize code for thinking-block implementation

### Bug Fixes

- Fix flash of unstyled content (FOUC)
- Fix stutter when submitting new replies
- Fix FOUC and streaming issues for thinking-block implementation

### UI Improvements

- Update chevron icon with transition effect

### Architecture

- Implement ultimate approach with simplest and most effective implementation after experimentation

## fix: - 11/17/2024 - @lumpinif

### Observer Management and Memory Leak Prevention

- Added observer tracking using Set to manage all MutationObservers
- Added cleanup on element removal to prevent dangling observers
- Added global cleanup on window unload
- Added observer cleanup when observed elements are removed from DOM

### Code Quality

- Fixed code formatting and linting issues flagged by Biome

### Development Setup

- Added .vscode settings with Biome extension recommendation

### Platform Updates

- Updated code in both Chrome and Firefox extensions
