# FloatingUI Migration Spike Findings

## Overview
This spike explores migrating Canvas Kit's popup positioning from @popperjs/core to @floating-ui/dom to address popup sizing issues in restricted screen space.

## Key Benefits
1. **Better Size Handling**: The size middleware automatically resizes popups to fit available space, preventing overflow issues
2. **Smaller Bundle Size**: @floating-ui is more tree-shakeable than @popperjs, potentially reducing bundle size
3. **More Explicit API**: Less magic, more control over positioning logic with middleware system
4. **Modern Architecture**: @floating-ui is actively maintained and represents the evolution of Popper.js

## Implementation Details

### New Components Created
- `FloatingPopper`: Alternative implementation using @floating-ui/dom
- `FloatingUIComparison`: Example component demonstrating the differences

### Key Features Implemented
- **Size Middleware**: Automatically constrains popup dimensions to available space
- **Backward Compatibility**: Feature flag (`useFloatingUI`) allows gradual migration
- **Middleware System**: Replaces PopperJS modifiers with more composable middleware
- **Auto-update**: Automatic repositioning when anchor or floating elements change

### API Changes
New props added to `PopperProps`:
- `useFloatingUI?: boolean` - Enable FloatingUI implementation
- `enableSizeMiddleware?: boolean` - Enable automatic sizing
- `maxWidth?: number` - Maximum width constraint
- `maxHeight?: number` - Maximum height constraint

## Technical Implementation

### Migration from PopperJS to FloatingUI
```typescript
// Old PopperJS approach
const instance = createPopper(anchorEl, stackRef.current, {
  placement: popperPlacement,
  modifiers: [placementModifier, fallbackPlacementsModifier, ...customModifiers],
});

// New FloatingUI approach
const cleanup = autoUpdate(anchorEl, stackRef.current, () => {
  computePosition(anchorEl, stackRef.current!, {
    placement: initialPlacement,
    middleware: [offset(8), shift({padding: 8}), flip({fallbackPlacements}), size({...})],
  }).then(({x, y, placement}) => {
    // Manual style application
    Object.assign(stackRef.current.style, {left: `${x}px`, top: `${y}px`});
  });
});
```

### Size Middleware Implementation
The size middleware addresses the core issue mentioned in GitHub issue #2001:

```typescript
size({
  apply({availableWidth, availableHeight, elements}) {
    const floating = elements.floating as HTMLElement;
    
    const computedMaxWidth = maxWidth 
      ? Math.min(maxWidth, availableWidth)
      : availableWidth;
    const computedMaxHeight = maxHeight
      ? Math.min(maxHeight, availableHeight) 
      : availableHeight;

    Object.assign(floating.style, {
      maxWidth: `${Math.max(0, computedMaxWidth)}px`,
      maxHeight: `${Math.max(0, computedMaxHeight)}px`,
      overflow: 'auto',
      boxSizing: 'border-box',
    });
  },
})
```

## Breaking Changes
1. **Middleware vs Modifiers**: Custom PopperJS modifiers need to be rewritten as FloatingUI middleware
2. **Manual Style Application**: FloatingUI requires manual application of positioning styles
3. **API Differences**: Some PopperJS-specific options are not available in FloatingUI
4. **Instance Methods**: Direct PopperJS instance methods are not available with FloatingUI

## Compatibility Considerations
- Existing PopperJS implementation remains default behavior
- Feature flag allows opt-in to FloatingUI implementation
- All existing props and behaviors preserved when `useFloatingUI=false`
- Gradual migration path available for consumers

## Testing Strategy
1. **Unit Tests**: Verify both implementations work with existing test suite
2. **Visual Testing**: Compare popup behavior in restricted spaces
3. **Performance Testing**: Measure bundle size and runtime performance differences
4. **Integration Testing**: Ensure compatibility with existing Canvas Kit components

## Example Usage
```tsx
// Enable FloatingUI with size middleware
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

## Verification Results
- ✅ Lint checks pass
- ✅ TypeScript compilation successful
- ✅ No breaking changes to existing API
- ✅ Feature flag implementation allows gradual migration
- ✅ Size middleware successfully constrains popup dimensions
- ✅ Backward compatibility maintained

## Recommendations

### For Full Migration
1. **Phased Rollout**: Use feature flag to gradually migrate components
2. **Bundle Analysis**: Measure actual bundle size improvements
3. **Performance Testing**: Validate runtime performance improvements
4. **User Testing**: Gather feedback on popup behavior in real applications

### Next Steps
1. **Comprehensive Testing**: Test with all Canvas Kit popup-based components (Tooltip, Menu, Select, etc.)
2. **Documentation**: Create migration guide for consumers
3. **Performance Benchmarks**: Compare bundle size and runtime performance
4. **Accessibility Review**: Ensure no accessibility regressions
5. **Design Review**: Validate popup behavior meets design requirements

### Potential Concerns
1. **Learning Curve**: Teams will need to understand middleware system vs modifiers
2. **Custom Implementations**: Existing custom PopperJS modifiers need rewriting
3. **Bundle Size**: Need to verify actual bundle size improvements in real applications
4. **Maintenance**: Two positioning systems to maintain during transition period

## Conclusion
The FloatingUI migration successfully addresses the popup sizing issues mentioned in the GitHub issue. The size middleware provides automatic popup resizing that prevents overflow in restricted spaces. The implementation maintains backward compatibility while providing a clear migration path.

The spike demonstrates that FloatingUI is a viable replacement for PopperJS with tangible benefits for popup sizing scenarios. However, a full migration would require careful planning and testing to ensure no regressions in the extensive Canvas Kit ecosystem.
