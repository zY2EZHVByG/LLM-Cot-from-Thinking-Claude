# Changelog

## 2024-11-23

### Important Notice 🔄

The original Chrome extension (now referred to as `chrome_v0`) has been deprecated and its development has been discontinued. This changelog tracks the new rewritten version (`chrome`) which offers improved architecture, better performance, and enhanced maintainability.

### Changed

- Complete rewrite of the extension with modern tech stack
- Improved CI/CD pipeline with automatic version syncing
- Added git pull to post-commit hook for auto-sync

## 2024-11-22

### Added

- Initial project structure and configuration setup for complete rewrite
- Deprecated old extension (`chrome_v0`) and started fresh development
- GitHub Actions workflow for Chrome extension
- Husky git hooks for code quality
- Automatic version bumping and release workflow
- Automatic GitHub release creation

### Changed

- Reorganized extension directory structure
- Improved development environment configuration

### Technical

- Set up manifest.json with required permissions and content scripts
- Configured extension icons
- Implemented storage permission for future feature development
