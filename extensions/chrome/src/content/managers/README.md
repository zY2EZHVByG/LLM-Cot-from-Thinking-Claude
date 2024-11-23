# Thinking Process Manager Architecture

This document outlines the architecture and workflow of the Thinking Process visualization feature in the Chrome extension.

## Architecture Overview

```mermaid
flowchart TB
    subgraph Extension["Chrome Extension Content Script"]
        Entry["index.tsx\nEntry Point"]
    end

    subgraph ThinkingBlock["ThinkingBlockManager"]
        direction TB
        Init["Initialize"]
        Process["Process Block"]
        Cleanup["Cleanup Resources"]
    end

    subgraph Managers["Manager Classes"]
        direction LR
        DOM["DOMObserverManager\n- Watch for new blocks\n- Periodic checks"]
        UI["UIComponentManager\n- Create UI elements\n- Style components"]
        Event["EventManager\n- Handle interactions\n- Manage UI state"]
        Style["StyleManager\n- Inject styles\n- Manage animations"]
    end

    Entry --> Init
    Init --> Style
    Init --> DOM
    DOM --> Process
    Process --> UI
    Process --> Event
    Event --> UI
```

## Component Workflow

```mermaid
sequenceDiagram
    participant Entry as index.tsx
    participant TBM as ThinkingBlockManager
    participant DOM as DOMObserverManager
    participant UI as UIComponentManager
    participant Event as EventManager
    participant Style as StyleManager

    Entry->>TBM: Initialize
    TBM->>Style: Inject Styles
    TBM->>DOM: Initialize Observer
    DOM->>DOM: Setup Periodic Check

    loop DOM Observation
        DOM->>TBM: Process New Block
        TBM->>UI: Create UI Components
        TBM->>Event: Setup Event Handlers
        Event-->>UI: Update UI State
    end

    Note over TBM,Event: User Interactions
    Event->>Event: Handle Toggle
    Event->>Event: Handle Copy
```

## Component Responsibilities

### ThinkingBlockManager

- Central coordinator for the thinking process feature
- Initializes and manages other components
- Processes new thinking blocks
- Handles cleanup on unload

### DOMObserverManager

- Observes DOM for new thinking blocks
- Performs periodic checks for missed blocks
- Manages retry mechanism for initialization
- Handles cleanup of observers

### UIComponentManager

- Creates UI elements (buttons, containers)
- Applies consistent styling
- Manages component hierarchy
- Handles component updates

### EventManager

- Sets up event listeners
- Manages UI state transitions
- Handles copy functionality
- Provides user feedback

### StyleManager

- Injects required styles
- Manages animation styles
- Ensures single style injection
- Handles style cleanup

## User Interaction Flow

```mermaid
stateDiagram-v2
    [*] --> Hidden: Initial State
    Hidden --> Visible: Click Toggle
    Visible --> Hidden: Click Toggle
    Visible --> Copied: Click Copy
    Copied --> Visible: After Feedback
    Hidden --> [*]: Cleanup
    Visible --> [*]: Cleanup
```

## Installation and Usage

The Thinking Process Manager is automatically initialized when the Chrome extension loads. It requires no manual setup and begins observing for thinking process blocks immediately.

## Development

To modify or extend the functionality:

1. Each manager is designed to be independent and focused on a single responsibility
2. New features should be added to the appropriate manager
3. The ThinkingBlockManager coordinates all interactions between managers
4. Follow the established TypeScript types and interfaces

## Error Handling

- DOM observation includes retry mechanism
- Event handlers include error prevention
- Style injection prevents duplicates
- All cleanup is handled automatically
