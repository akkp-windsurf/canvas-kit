import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  computePosition,
  autoUpdate,
  offset,
  shift,
  flip,
  size,
  Placement as FloatingUIPlacementType,
} from '@floating-ui/dom';

import {usePopupStack} from './hooks';
import {Placement} from './Popper';

export type FloatingUIPlacement = `${FloatingUIPlacementType}`;

export interface FloatingPopperProps {
  anchorElement?: React.RefObject<Element> | Element | null;
  children: ((props: {placement: Placement}) => React.ReactNode) | React.ReactNode;
  getAnchorClientRect?: () => DOMRect;
  open?: boolean;
  placement?: Placement;
  fallbackPlacements?: Placement[];
  onPlacementChange?: (placement: Placement) => void;
  portal?: boolean;
  enableSizeMiddleware?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  popperOptions?: any;
  popperInstanceRef?: React.Ref<any>;
}

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

function isRenderProp(
  children: any
): children is (props: {placement: Placement}) => React.ReactNode {
  if (typeof children === 'function') {
    return true;
  }
  return false;
}

export const FloatingPopper = React.forwardRef<HTMLDivElement, FloatingPopperProps>(
  (
    {portal = true, open = true, enableSizeMiddleware = true, ...elemProps}: FloatingPopperProps,
    ref
  ) => {
    if (!open) {
      return null;
    }

    return (
      <OpenFloatingPopper
        ref={ref}
        portal={portal}
        enableSizeMiddleware={enableSizeMiddleware}
        {...elemProps}
      />
    );
  }
);

const OpenFloatingPopper = React.forwardRef<HTMLDivElement, FloatingPopperProps>(
  (
    {
      anchorElement,
      getAnchorClientRect,
      placement: initialPlacement = 'bottom',
      fallbackPlacements = ['top', 'right', 'bottom', 'left'],
      onPlacementChange,
      children,
      portal,
      enableSizeMiddleware,
      maxWidth,
      maxHeight,
    }: FloatingPopperProps,
    ref
  ) => {
    const [placement, setPlacement] = React.useState<Placement>(initialPlacement);
    const stackRef = usePopupStack(ref, anchorElement as HTMLElement);
    const cleanupRef = React.useRef<(() => void) | null>(null);

    React.useLayoutEffect(() => {
      const anchorEl = getAnchorClientRect
        ? {getBoundingClientRect: getAnchorClientRect}
        : getElementFromRefOrElement(anchorElement ?? null);

      if (!anchorEl || !stackRef.current) {
        console.warn(
          `FloatingPopper: neither anchorElement or getAnchorClientRect was defined. A valid anchorElement or getAnchorClientRect callback must be provided to render a FloatingPopper`
        );
        return;
      }

      const middleware = [
        offset(8),
        shift({padding: 8}),
        flip({
          fallbackPlacements: fallbackPlacements
            ?.filter(p => p !== 'auto')
            .map(p => p as FloatingUIPlacementType),
        }),
      ];

      if (enableSizeMiddleware) {
        middleware.push(
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
        );
      }

      const updatePosition = () => {
        computePosition(anchorEl, stackRef.current!, {
          placement: (initialPlacement === 'auto'
            ? 'bottom'
            : initialPlacement) as FloatingUIPlacementType,
          middleware,
        }).then(({x, y, placement: computedPlacement}) => {
          if (stackRef.current) {
            Object.assign(stackRef.current.style, {
              left: `${x}px`,
              top: `${y}px`,
            });
          }

          if (computedPlacement !== placement) {
            setPlacement(computedPlacement as Placement);
            onPlacementChange?.(computedPlacement as Placement);
          }
        });
      };

      const cleanup = autoUpdate(anchorEl, stackRef.current, updatePosition);
      cleanupRef.current = cleanup;

      return cleanup;
    }, [
      anchorElement,
      getAnchorClientRect,
      initialPlacement,
      fallbackPlacements,
      enableSizeMiddleware,
      maxWidth,
      maxHeight,
      onPlacementChange,
      placement,
      stackRef,
    ]);

    React.useEffect(() => {
      return () => {
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }
      };
    }, []);

    const contents = <>{isRenderProp(children) ? children({placement}) : children}</>;

    if (!portal || !stackRef.current) {
      return contents;
    }

    return ReactDOM.createPortal(contents, stackRef.current);
  }
);
