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

import {usePopupStack} from './hooks';

export type Placement = FloatingUIPlacement;

export interface FloatingUIPopperProps {
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
   * `anchorElement` prop.
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
   * The positioning strategy to use. 'absolute' is the default and most common.
   * @default 'absolute'
   */
  strategy?: Strategy;
  /**
   * Custom middleware to apply. These will be added after the default middleware.
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
}

const defaultFallbackPlacements: Placement[] = ['top', 'right', 'bottom', 'left'];

/**
 * A FloatingUI-based Popper component that provides improved positioning capabilities over PopperJS.
 * This is a spike implementation to demonstrate the benefits of migrating from PopperJS to FloatingUI.
 *
 * Benefits over PopperJS:
 * - Smaller bundle size (~3KB vs ~20KB)
 * - Better collision detection and positioning algorithms
 * - More intuitive API with built-in middleware
 * - Better performance with automatic cleanup
 * - Tree-shakeable middleware system
 */
export const FloatingUIPopper = React.forwardRef<HTMLDivElement, FloatingUIPopperProps>(
  ({portal = true, open = true, ...elemProps}: FloatingUIPopperProps, ref) => {
    if (!open) {
      return null;
    }

    return <OpenFloatingUIPopper ref={ref} portal={portal} {...elemProps} />;
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

const OpenFloatingUIPopper = React.forwardRef<HTMLDivElement, FloatingUIPopperProps>(
  (
    {
      anchorElement,
      getAnchorClientRect,
      placement: preferredPlacement = 'bottom',
      fallbackPlacements = defaultFallbackPlacements,
      onPlacementChange,
      children,
      portal,
      strategy = 'absolute',
      middleware: customMiddleware = [],
    }: FloatingUIPopperProps,
    ref
  ) => {
    const stackRef = usePopupStack(ref, anchorElement as HTMLElement);

    const virtualElement = React.useMemo(() => {
      if (getAnchorClientRect) {
        return {
          getBoundingClientRect: getAnchorClientRect,
        };
      }
      return null;
    }, [getAnchorClientRect]);

    const referenceElement = virtualElement || getElementFromRefOrElement(anchorElement ?? null);

    const middleware = React.useMemo((): Middleware[] => {
      const defaultMiddleware: Middleware[] = [
        offset(4),
        flip({
          fallbackPlacements: fallbackPlacements.length > 0 ? fallbackPlacements : undefined,
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
      ];

      return [...defaultMiddleware, ...customMiddleware];
    }, [fallbackPlacements, customMiddleware]);

    const {
      x,
      y,
      placement,
      strategy: computedStrategy,
    } = useFloating({
      placement: preferredPlacement,
      strategy,
      middleware,
      elements: {
        reference: referenceElement,
        floating: stackRef.current,
      },
      whileElementsMounted: autoUpdate,
    });

    const prevPlacement = React.useRef(placement);
    React.useEffect(() => {
      if (placement !== prevPlacement.current) {
        onPlacementChange?.(placement);
        prevPlacement.current = placement;
      }
    }, [placement, onPlacementChange]);

    React.useLayoutEffect(() => {
      if (stackRef.current) {
        Object.assign(stackRef.current.style, {
          position: computedStrategy,
          top: y ? `${y}px` : '',
          left: x ? `${x}px` : '',
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

function isRenderProp(
  children: any
): children is (props: {placement: Placement}) => React.ReactNode {
  if (typeof children === 'function') {
    return true;
  }
  return false;
}
