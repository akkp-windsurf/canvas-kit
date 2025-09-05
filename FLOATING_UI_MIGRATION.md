# FloatingUI Migration Guide

## Overview
Canvas Kit now supports FloatingUI as an alternative to PopperJS for popup positioning. This migration addresses popup sizing issues in restricted screen spaces by providing automatic popup resizing capabilities.

## Key Benefits
1. **Better Size Handling**: The size middleware automatically resizes popups to fit available space, preventing overflow issues
2. **Smaller Bundle Size**: @floating-ui is more tree-shakeable than @popperjs, potentially reducing bundle size
3. **More Explicit API**: Less magic, more control over positioning logic with middleware system
4. **Modern Architecture**: @floating-ui is actively maintained and represents the evolution of Popper.js

## Migration Path

### Feature Flag Approach
The migration uses a feature flag approach to ensure backward compatibility:

```tsx
// Enable FloatingUI for a specific popup
<Popup.Popper useFloatingUI>
  <Popup.Card>Content</Popup.Card>
</Popup.Popper>

// Or use the FloatingPopper component directly
<FloatingPopper anchorElement={anchorRef}>
  <div>Content</div>
</FloatingPopper>
```

### Size Middleware
The key feature addressing issue #2001 is the size middleware:

```tsx
<Popup.Popper 
  useFloatingUI 
  enableSizeMiddleware 
  maxWidth={400} 
  maxHeight={300}
>
  <Popup.Card>
    {/* Content automatically resizes to fit available space */}
  </Popup.Card>
</Popup.Popper>
```

## API Changes

### New Props for Popper and PopupPopper
- `useFloatingUI?: boolean` - Enable FloatingUI implementation (default: false)
- `enableSizeMiddleware?: boolean` - Enable automatic sizing (default: true when useFloatingUI=true)
- `maxWidth?: number` - Maximum width constraint for size middleware
- `maxHeight?: number` - Maximum height constraint for size middleware

### FloatingPopper Component
A new `FloatingPopper` component is available for direct use:

```tsx
import {FloatingPopper} from '@workday/canvas-kit-react/popup';

<FloatingPopper
  anchorElement={anchorRef}
  placement="bottom"
  enableSizeMiddleware
  maxWidth={400}
>
  <div>Popup content</div>
</FloatingPopper>
```

## Migration Strategy

### Phase 1: Opt-in Usage
Use the feature flag to gradually migrate components:

```tsx
// Before
<Popup.Popper placement="bottom">
  <Popup.Card>Content</Popup.Card>
</Popup.Popper>

// After (opt-in)
<Popup.Popper placement="bottom" useFloatingUI>
  <Popup.Card>Content</Popup.Card>
</Popup.Popper>
```

### Phase 2: Component-by-Component Migration
Migrate specific components that benefit from size middleware:
- Tooltips in constrained spaces
- Dropdown menus with long content
- Select components with many options
- Dialog components on small screens

### Phase 3: Default Migration (Future)
In a future major version, FloatingUI may become the default implementation.

## Breaking Changes
When using `useFloatingUI=true`:
1. **Middleware vs Modifiers**: Custom PopperJS modifiers are not supported
2. **Instance Methods**: Direct PopperJS instance methods are not available
3. **Some PopperJS-specific options**: May not be available in FloatingUI

## Compatibility
- ✅ All existing PopperJS functionality remains default behavior
- ✅ Feature flag allows gradual migration
- ✅ No breaking changes when `useFloatingUI=false`
- ✅ Size middleware addresses popup sizing issues from issue #2001

## Testing
The implementation includes:
- Unit tests for both PopperJS and FloatingUI implementations
- Visual testing for popup behavior in restricted spaces
- Backward compatibility testing
- Performance testing for bundle size improvements

## Examples

### Basic Usage
```tsx
import {Popup} from '@workday/canvas-kit-react/popup';

function MyComponent() {
  return (
    <Popup model={model}>
      <Popup.Target>Open Popup</Popup.Target>
      <Popup.Popper useFloatingUI enableSizeMiddleware>
        <Popup.Card>
          <Popup.Body>
            This popup will automatically resize to fit available space
          </Popup.Body>
        </Popup.Card>
      </Popup.Popper>
    </Popup>
  );
}
```

### Size Constraints
```tsx
<Popup.Popper 
  useFloatingUI 
  enableSizeMiddleware 
  maxWidth={600} 
  maxHeight={400}
>
  <Popup.Card>
    Large content that will be constrained to fit
  </Popup.Card>
</Popup.Popper>
```

### Direct FloatingPopper Usage
```tsx
import {FloatingPopper} from '@workday/canvas-kit-react/popup';

function CustomPopup() {
  const [anchorElement, setAnchorElement] = React.useState(null);
  
  return (
    <>
      <button ref={setAnchorElement}>Trigger</button>
      <FloatingPopper 
        anchorElement={anchorElement}
        placement="top"
        enableSizeMiddleware
      >
        <div>Custom popup content</div>
      </FloatingPopper>
    </>
  );
}
```
