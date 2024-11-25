# Thinking Claude Extension

A Chrome extension that enhances Claude AI's thinking process visualization with dynamic React components.

## Project Overview

This extension enhances Claude.ai's thinking process blocks by making them more readable and interactive while maintaining the original UI aesthetics.

### Core Features

- Collapsible thinking process blocks
- Dynamic streaming state handling
- Auto-wrapping content with vertical scrolling
- Preserved copy functionality
- Original UI style maintenance

## Technical Implementation

### Core Architecture

#### ThinkingBlockManager (Singleton)

- Central manager for block detection and enhancement
- Handles initialization, processing, and cleanup
- Maintains state of processed blocks and React roots
- Provides graceful fallback to original UI

#### Block Processing

- Unique block ID generation and tracking
- React component mounting in DOM
- Streaming state detection
- Automatic cleanup of unmounted components

#### CSS Management

- Multi-stage CSS injection for FOUC prevention
- Graceful fallback with smooth transitions
- Original UI preservation for error cases
- Scoped styles for enhanced components

### Implementation Details

#### Block Detection

- Use data attributes for tracking (data-tc-block-id, data-tc-container-id)
- Process blocks only once, with reprocessing capability
- Handle streaming state changes via mutation observer
- Clean up React roots and processed state on unmount

#### CSS Strategy

1. Initial styles (prevent FOUC)
   - Hide blocks with transition
   - Immediate injection on page load
2. Enhanced UI styles
   - Scoped to processed blocks
   - Preserve original UI as fallback
3. Transition handling
   - Smooth transitions between states
   - Graceful fallback if enhancement fails

#### Resource Management

- Disconnect mutation observer
- Clear interval checks
- Unmount React roots
- Remove processed block tracking
- Clean up injected styles

### Best Practices

#### Error Handling

- Graceful fallback to original UI
- Clear error logging
- Resource cleanup on failure

#### Performance

- Minimal DOM operations
- Efficient block tracking
- Optimized mutation observer

#### User Experience

- Smooth transitions
- No visual disruption
- Consistent behavior

### Known Limitations

1. Initial page load may show brief flash of original UI
2. Streaming state detection depends on Claude's DOM structure
3. React component remounting during streaming responses

### Future Improvements

#### Performance

- Optimize block detection
- Reduce style recalculations
- Improve streaming handling

#### Features

- User configuration options
- Additional visual enhancements
- More interactive elements

#### Testing

- Unit tests for core functionality
- Integration tests for UI components
- Performance benchmarking

### Development Guidelines

#### Code Organization

- Keep ThinkingBlockManager as single source of truth
- Use TypeScript for type safety
- Follow React best practices
- Use kebab-case for file names
- Use descriptive variable names
- Document code thoroughly for OSS contributors

#### Style Management

- Use Tailwind CSS to match Claude's UI
- Copy exact class names where possible
- Maintain clear CSS hierarchy
- Use scoped styles when possible
- Handle transitions smoothly

#### Testing

- Test error scenarios
- Verify cleanup functionality
- Check streaming state handling
- Test with various content lengths
- Verify component lifecycle
