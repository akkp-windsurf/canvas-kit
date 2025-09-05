import React from 'react';
import {Popup, usePopupModel} from '@workday/canvas-kit-react/popup';
import {PrimaryButton} from '@workday/canvas-kit-react/button';

export const FloatingUISizeDemo = () => {
  const model = usePopupModel();

  return (
    <div style={{height: '200px', overflow: 'hidden', border: '2px solid #ccc', padding: '20px'}}>
      <p>This container has limited height (200px) to demonstrate size middleware:</p>
      <Popup model={model}>
        <Popup.Target as={PrimaryButton}>Open Size-Constrained Popup</Popup.Target>
        <Popup.Popper useFloatingUI enableSizeMiddleware maxHeight={150}>
          <Popup.Card>
            <Popup.CloseIcon aria-label="Close" />
            <Popup.Heading>Size-Constrained Popup</Popup.Heading>
            <Popup.Body>
              This popup demonstrates the size middleware in action. The content is automatically
              constrained to fit within the available space. If there's not enough room, the popup
              will become scrollable rather than overflowing outside the viewport.
              <br />
              <br />
              This is a lot of content that would normally cause the popup to overflow, but with
              FloatingUI's size middleware, it will be properly constrained and scrollable.
              <br />
              <br />
              The size middleware addresses the core issue mentioned in GitHub issue #2001 by
              automatically handling popup sizing in restricted screen spaces.
            </Popup.Body>
          </Popup.Card>
        </Popup.Popper>
      </Popup>
    </div>
  );
};
