import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  hide,
  size,
  Placement as FloatingUIPlacement,
  Strategy,
  Middleware,
} from '@floating-ui/react-dom';

export type Placement = FloatingUIPlacement;
export const defaultFallbackPlacements: Placement[] = ['top', 'right', 'bottom', 'left'];

import {usePopupStack} from './hooks';

export type PopperOptions = {
  middleware?: Middleware[];
};

export interface PopperProps {
  /**
   * The reference element used to position the Popper. Popper content will try to follow the
   * `anchorElement` if it moves and will reposition itself if there is no longer room in the
   * window.
   */
  anchorElement?: React.RefObject<Element> | Element | null;
  /**
   * The content of the Popper. If a function is provided, it will be treated as a Render Prop and
   * pass the `placement` chosen by FloatingUI. This `placement` value is useful if your popup needs
   * to animate and that animation depends on the direction of the content in relation to the
   * `anchorElement`.
   */
  children: ((props: {placement: Placement}) => React.ReactNode) | React.ReactNode;
  /**
   * When provided, this optional callback will be used to determine positioning for the Popper element
   * instead of calling `getBoundingClientRect` on the `anchorElement` prop. Use this when you need
   * complete control over positioning. When this prop is specified, it is safe to pass `null` into the
   * `anchorElement` prop. If `null` is passed into the `anchorElement` prop, an `owner` will not be
   * provided for the `PopupStack`.
   */
  getAnchorClientRect?: () => DOMRect;
  /**
   * Determines if `Popper` content should be rendered. The content only exists in the DOM when
   * `open` is `true`
   * @default true
   */
  open?: boolean;
  /**
   * The placement of the `Popper` contents relative to the `anchorElement`. Accepts `auto`, `top`,
   * `right`, `bottom`, or `left`. Each placement can also be modified using any of the following
   * variations: `-start` or `-end`.
   * @default bottom
   */
  placement?: Placement;
  /**
   * Define fallback placements by providing a list of {@link Placement} in array (in order of preference).
   * The default preference is following the order of `top`, `right`, `bottom`, and `left`. Once the initial
   * and opposite placements are not available, the fallback placements will be in use. Use an empty array to
   * disable the fallback placements.
   */
  fallbackPlacements?: Placement[];
  /**
   * A callback function that will be called whenever FloatingUI chooses a placement that is different
   * from the provided `placement` preference. If a `placement` preference doesn't fit, FloatingUI
   * will choose a new one and call this callback.
   */
  onPlacementChange?: (placement: Placement) => void;
  /**
   * Define an array of middleware to change how the popper behaves. Middleware will be merged with default middleware.
   */
  middleware?: Middleware[];
  /**
   * If false, render the Popper within the
   * DOM hierarchy of its parent. A non-portal Popper will constrained by the parent container
   * overflows. If you set this to `false`, you may experience issues where you content gets cut off
   * by scrollbars or `overflow: hidden`
   * @default true
   */
  portal?: boolean;
  /**
   * The strategy of the Popper. `absolute` will position relative to the nearest positioned
   * ancestor (default). `fixed` will position relative to the viewport.
   * @default 'absolute'
   */
  strategy?: Strategy;
}

/**
 * A FloatingUI-based Popper component that provides improved positioning capabilities over PopperJS.
 * This component maintains backward compatibility with the existing PopperJS API while providing
 * better performance and smaller bundle size.
 *
 * Benefits over PopperJS:
 * - Smaller bundle size (~3KB vs ~20KB)
 * - Better collision detection with built-in flip() and shift() middleware
 * - Improved positioning algorithms
 * - Better performance with automatic cleanup
 * - Tree-shakeable middleware system
 *
 * `Popper` also automatically works with the {@link PopupStack} system.
 * `Popper` has no UI and will render any children to the `body` element and position around a
 * provided `anchorElement`.
 *
 * Prefer using {@link PopupPopper Popup.Popper} instead. Use this to make Popups that don't utilize
 * a PopupModel or any associate popup [hooks](#hooks).
 *
 * > **Note:** `Popper` renders any children to a `div` element created by the `PopupStack`. This
 * > element is not controlled by React, so any extra element props will _not_ be forwarded. The
 * > `ref` will point to the `div` element created by the `PopupStack`, however. In v4, an extra
 * > `div` element was rendered and that's where extra props were spread to. In v5+, you can provide
 * > your own element if you wish.
 */
export const Popper = React.forwardRef<HTMLDivElement, PopperProps>(
  ({portal = true, open = true, ...elemProps}: PopperProps, ref) => {
    if (!open) {
      return null;
    }

    return <OpenPopper ref={ref} portal={portal} {...elemProps} />;
  }
);

const getElementFromRefOrElement = (
  input: React.RefObject<Element> | Element | null
): Element | undefined => {
  if (input === null) {
    return undefined;
  } else if ('current' in input) {
    return input.current || undefined;
  } else {
    return input;
  }
};

// prevent unnecessary renders if middleware are not passed
const defaultMiddleware: PopperProps['middleware'] = [];

// Popper bails early if `open` is false and React hooks cannot be called conditionally,
// so we're breaking out the open version into another component.
const OpenPopper = React.forwardRef<HTMLDivElement, PopperProps>(
  (
    {
      anchorElement,
      getAnchorClientRect,
      middleware: customMiddleware = defaultMiddleware,
      placement: preferredPlacement = 'bottom',
      fallbackPlacements = defaultFallbackPlacements,
      onPlacementChange,
      children,
      portal,
      strategy = 'absolute',
    }: PopperProps,
    ref
  ) => {
    const stackRef = usePopupStack(ref, anchorElement as HTMLElement);

    const middleware = React.useMemo(() => {
      const mw: Middleware[] = [
        offset(8),
        flip({
          fallbackPlacements,
          padding: 8,
        }),
        shift({
          padding: 8,
        }),
        hide(),
        size({
          apply({availableWidth, availableHeight, elements}) {
            Object.assign(elements.floating.style, {
              maxWidth: `${availableWidth}px`,
              maxHeight: `${availableHeight}px`,
            });
          },
        }),
        ...customMiddleware,
      ];

      return mw;
    }, [customMiddleware, fallbackPlacements]);

    const {
      x,
      y,
      placement,
      strategy: computedStrategy,
      refs,
    } = useFloating({
      placement: preferredPlacement,
      strategy,
      middleware,
      whileElementsMounted: autoUpdate,
    });

    React.useEffect(() => {
      const anchorEl = getAnchorClientRect
        ? {getBoundingClientRect: getAnchorClientRect}
        : getElementFromRefOrElement(anchorElement ?? null);

      if (!anchorEl) {
        console.warn(
          `Popper: neither anchorElement or getAnchorClientRect was defined. A valid anchorElement or getAnchorClientRect callback must be provided to render a Popper`
        );
        return;
      }

      refs.setReference(anchorEl);
    }, [anchorElement, getAnchorClientRect, refs]);

    React.useEffect(() => {
      if (stackRef.current) {
        refs.setFloating(stackRef.current);
      }
    }, [stackRef, refs]);

    React.useEffect(() => {
      if (placement !== preferredPlacement) {
        onPlacementChange?.(placement);
      }
    }, [placement, preferredPlacement, onPlacementChange]);

    React.useLayoutEffect(() => {
      if (stackRef.current) {
        Object.assign(stackRef.current.style, {
          position: computedStrategy,
          top: `${y ?? 0}px`,
          left: `${x ?? 0}px`,
          width: 'max-content',
        });
      }
    }, [x, y, computedStrategy, stackRef]);

    const contents = <>{isRenderProp(children) ? children({placement}) : children}</>;

    if (!portal) {
      return contents;
    }

    return ReactDOM.createPortal(contents, stackRef.current!);
  }
);

// Typescript threw an error about non-callable signatures. Using typeof as a 'function' returns
// a type of `Function` which isn't descriptive enough for Typescript. We don't do any detection
// against the _type_ of function that gets passed, but we'll assume it is a render prop for now...
function isRenderProp(
  children: any
): children is (props: {placement: Placement}) => React.ReactNode {
  if (typeof children === 'function') {
    return true;
  }
  return false;
}
