## Project Context

- This is a chrome production-ready extension built with typescript and react for Claude.ai.

- It is a chrome extension designed to be used together with `Thinking Claude`. Thinking Claude is a comprehensive set of instructions that guides Claude to think like a real human and responding with two main parts: a thinking process + a final answer.

## Current status and challenges

- Currently Claude already provides a code block with 'thinking' header for the thinking process and a final answer presented outside of the code block beneath the thinking process.

- The original UI is still limited for long text content reading, as it is not collapsible and content is not auto-wrapped which causes it horizontally overflow and resulting requiring user to horizontally scroll for more content, and not vertically scrollable.

- Regarding the copy button functionality, it is well implemented with the svg icons and the copy functionality, and it doesn't seem need any further improvement for now. We can just keep it as it is or adapt it into the new UI.

## Project Objectives

Our main object for now is to build the extension that mainly focuses on enhancing the code block with 'thinking' header for the thinking process by making the original code block more readable and collapsible while persisting the exsiting copy button functionality and strictly maintaining the original UI styles.

### Features

- Make the exsting code block with 'thinking' header for thinking process collapsible, which means it can be folded and unfolded when user clicks on the header text of the code block.
- Enhance the code block with 'thinking' header with context-specific status messages, such as "Claude is thinking..." when the thinking process is streaming, "Hide thinking process" when the thinking process is opened, and "View thinking process" when the thinking process is closed.
- Make the thinking process content auto-wrap and only vertically scrollable if the content is long
- Preserve the original copy button functionality
- Maintain the primitive and original UI styles

### Technical Implementation Details

### Styling Approach

- Use Tailwind CSS directly to match Claude's UI
- Copy exact class names from Claude's DOM where possible for visual consistency
- No need for custom design system currently as Claude's UI is stable
- Utilize shadcn/ui components for complex UI elements:
  - Use Collapsible component for thinking process block
  - Use Button component for copy functionality
  - Leverage built-in animations and accessibility features
  - No need to handle complex animations manually

### Component Libraries

- shadcn/ui: A collection of accessible and customizable React components
  - Pre-configured in the project
  - Uses Radix UI primitives under the hood
  - Provides consistent animations and interactions
  - Components we'll use:
    - Collapsible: For expandable thinking process
    - Button: For copy functionality
    - Card: For content container (if needed)

### DOM Structure

- Response container uses `data-is-streaming` attribute for streaming state
- Thinking process block structure:

  ```html
  <pre>
    <div class="relative flex flex-col rounded-lg">
      <!-- Header Section -->
      <div class="absolute pl-3 pt-2.5 text-xs">thinking</div>
      <!-- Copy Button Section -->
      <div class="pointer-events-none sticky my-0.5 ml-0.5 flex items-center justify-end px-1.5 py-1 mix-blend-luminosity top-0">
        <div class="from-bg-300/90 to-bg-300/70 pointer-events-auto rounded-md bg-gradient-to-b p-0.5 backdrop-blur-md">
          <button class="flex flex-row items-center gap-1 rounded-md p-1 py-0.5 text-xs transition-opacity delay-100 hover:bg-bg-200 opacity-60 hover:opacity-100">
            <!-- Copy Icon SVG -->
            <span class="text-text-200 pr-0.5">Copy</span>
          </button>
        </div>
      </div>
      <!-- Content Section -->
      <div class="code-block__code">
        <code class="language-thinking">
          <!-- Thinking Process Content -->
        </code>
      </div>
    </div>
  </pre>
  ```

- Content uses specific font families: "Fira Code", "Fira Mono", Menlo, Consolas

### Key Components

1. ThinkingProcess

   - Manages collapsible state
   - Handles streaming state
   - Preserves copy functionality
   - Maintains original UI appearance

2. Content Script (index.ts)
   - Observes DOM for Claude responses
   - Injects React components
   - Handles initialization and cleanup

### Performance Considerations

- Use efficient DOM observation strategies
- Minimize re-renders during streaming
- Maintain smooth collapse/expand animations

### Testing Requirements

- Test with various thinking process lengths
- Verify streaming state handling
- Ensure copy functionality works
- Check collapse/expand behavior

### Coding guidelines and structure

- The extension is built using React and Typescript, which is bundled with Webpack.
- Use kebab-case naming convention for file and component names
- Alaways use full name for the variable names for the maximum readability
- This project is OSS that needs to be well documented with comments for others to understand the code, including those who are beginners of development.
- The project structure should be based on the src directory structure recommended by Chrome extension development and react, following the best practices for prioritizing performance and maintainbility.
- Starting with a clean, well-organized and maintainable index.ts or index.tsx as the main entry point for the extension, following separated concerns and modules for different parts of the extension
- Always remember to keep the code following the best practices of single responsibility and modularity, DRY (Don't Repeat Yourself) and KISS (Keep It Simple, Stupid) rules
- Always keep in mind the performance and maintainability issues when making changes to the existing code structure, and try to keep the code as simple and clean as possible.

### Pitfalls and Technology approaches

- There are fews ways to implement our enhenced code block with 'thinking' header, such as directly modifying the dom structure and content, creating and implementinga brand new custom React component with full control while maintaining the original UI, or using a combination of both.
- Carefully consider the app flows and the effecient dom observations (e.g., MutationObserver) logic to make sure the implementation is maintainable and scaleable
- Regarding the dom observations, we need to watch for the streaming thinking process content as the Claude AI is thinking and generating the response in order to update the UI accordingly
- Always remember to prvent Flash of Unstyled Content (FOUC) from original UIs when page loads or refreshes,when we are updating the UI.
- Regarding the state management, we need to ensure the states are well managed and updated accordingly, such as the thinking process visibility and the thinking process content.
- The only place we need to enable this extension is the Claude chat pages, in which we need to check the url pattern if starts with `https://claude.ai/chat/(chatid)`, and make sure the extension is only taking effect when there is thinking process code block in the responses.
- There can be one response or more responses in one Claude chat page, and each response may contains one thinking process code block, so we need to consider the multiple responses situation and states when updating the UI.
- Always remember to ask for original HTML and UI styles for double check and corrections

### Key CSS Variables from Claude's theme

- Colors:
- Background colors: --bg-000 through --bg-500 (dark theme colors)
- Text colors: --text-000 through --text-500
- Accent colors:
- Main: --accent-main-000, --accent-main-100, --accent-main-200
- Secondary: --accent-secondary-000, --accent-secondary-100, --accent-secondary-200
- Border colors: --border-100 through --border-400
- Typography:
- Font families:
- Claude's messages: --font-claude-message (uses --font-serif)
- User messages: --font-user-message (uses --font-sans-serif)
- Base fonts defined in --font-serif and --font-sans-serif
