import * as React from 'react';
import {PrimaryButton} from '@workday/canvas-kit-react/button';
import {Popup} from '@workday/canvas-kit-react/popup';
import {FloatingUIPopper} from '../../lib/FloatingUIPopper';

export const FloatingUIComparison = () => {
  const [showPopperJS, setShowPopperJS] = React.useState(false);
  const [showFloatingUI, setShowFloatingUI] = React.useState(false);
  const popperJSRef = React.useRef<HTMLButtonElement>(null);
  const floatingUIRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div style={{padding: '24px', display: 'flex', gap: '16px', flexDirection: 'column'}}>
      <h2>PopperJS vs FloatingUI Comparison</h2>

      <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
        <PrimaryButton ref={popperJSRef} onClick={() => setShowPopperJS(!showPopperJS)}>
          PopperJS Implementation
        </PrimaryButton>

        <PrimaryButton ref={floatingUIRef} onClick={() => setShowFloatingUI(!showFloatingUI)}>
          FloatingUI Implementation
        </PrimaryButton>
      </div>

      <Popup.Popper
        open={showPopperJS}
        anchorElement={popperJSRef}
        placement="top"
        fallbackPlacements={['bottom', 'left', 'right']}
      >
        <div
          style={{
            backgroundColor: '#fdf6e3',
            border: '1px solid #d3d3d3',
            borderRadius: '4px',
            padding: '8px',
            maxWidth: '200px',
          }}
        >
          <strong>PopperJS Implementation</strong>
          <p>Uses custom fallback placements modifier for collision detection.</p>
          <p>Bundle size: ~20KB</p>
        </div>
      </Popup.Popper>

      <FloatingUIPopper
        open={showFloatingUI}
        anchorElement={floatingUIRef}
        placement="top"
        fallbackPlacements={['bottom', 'left', 'right']}
      >
        <div
          style={{
            backgroundColor: '#e3f2fd',
            border: '1px solid #2196f3',
            borderRadius: '4px',
            padding: '8px',
            maxWidth: '200px',
          }}
        >
          <strong>FloatingUI Implementation</strong>
          <p>Uses built-in flip() and shift() middleware for superior collision detection.</p>
          <p>Bundle size: ~3KB</p>
          <p>Better positioning algorithms and performance.</p>
        </div>
      </FloatingUIPopper>

      <div style={{marginTop: '16px'}}>
        <h3>Key Benefits of FloatingUI:</h3>
        <ul>
          <li>
            <strong>Smaller bundle size:</strong> ~3KB vs ~20KB (85% reduction)
          </li>
          <li>
            <strong>Better collision detection:</strong> Built-in flip() and shift() middleware
          </li>
          <li>
            <strong>Improved positioning:</strong> More sophisticated algorithms
          </li>
          <li>
            <strong>Tree-shakeable:</strong> Only import what you need
          </li>
          <li>
            <strong>Better performance:</strong> Automatic cleanup and optimizations
          </li>
          <li>
            <strong>Modern API:</strong> Cleaner, more intuitive interface
          </li>
        </ul>
      </div>
    </div>
  );
};
