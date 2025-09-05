# FloatingUI Migration Guide

Canvas Kit has migrated from @popperjs/core to @floating-ui/dom for better popup positioning and sizing. This change is now enabled by default and addresses popup sizing issues in restricted screen space.

## What Changed

- **Default Behavior**: FloatingUI is now the default positioning engine for all popup components
- **Size Middleware**: Popups automatically resize to fit available space, preventing overflow
- **Better Performance**: Smaller bundle size and improved tree-shaking
- **Backward Compatibility**: You can still opt back to PopperJS if needed

## Benefits

1. **Automatic Sizing**: Popups automatically constrain their dimensions to available space
2. **Overflow Prevention**: No more popups rendering off-screen in restricted spaces
3. **Smaller Bundle**: @floating-ui is more tree-shakeable than @popperjs
4. **Modern Architecture**: Built on the evolution of Popper.js

## Migration Steps

### For Most Users
No action required! The migration is automatic and backward compatible.

### If You Experience Issues
You can temporarily opt back to PopperJS:

```tsx
<Popup.Popper useFloatingUI={false}>
  <Popup.Card>Content</Popup.Card>
</Popup.Popper>
```

### If You Have Custom PopperJS Modifiers
Custom PopperJS modifiers need to be rewritten as FloatingUI middleware. See the FloatingUI documentation for migration guidance.

## New Features

### Size Constraints
You can now set maximum dimensions:

```tsx
<Popup.Popper maxWidth={400} maxHeight={300}>
  <Popup.Card>Content automatically resizes</Popup.Card>
</Popup.Popper>
```

### Disable Size Middleware
If you don't want automatic sizing:

```tsx
<Popup.Popper enableSizeMiddleware={false}>
  <Popup.Card>Content</Popup.Card>
</Popup.Popper>
```

## Affected Components

All popup-based components benefit from this change:
- Popup
- Tooltip  
- Menu
- Combobox
- Select
- Dialog
- Tabs overflow menu
- Breadcrumbs overflow menu
- ActionBar overflow menu

## Need Help?

If you encounter issues with the migration, please file an issue on the Canvas Kit repository with details about your use case.
