import React from 'react';
import {Popup} from '@workday/canvas-kit-react/popup';
import {PrimaryButton} from '@workday/canvas-kit-react/button';

export const SizeMiddlewareDemo = () => {
  const [showPopup, setShowPopup] = React.useState(false);

  return (
    <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
      <div>
        <h3>Small Container (200x150px)</h3>
        <div
          style={{
            height: '150px',
            width: '200px',
            overflow: 'hidden',
            border: '1px solid #ccc',
            position: 'relative',
            padding: '8px',
          }}
        >
          <div style={{position: 'absolute', bottom: '8px', right: '8px'}}>
            <Popup>
              <Popup.Target as={PrimaryButton} onClick={() => setShowPopup(!showPopup)}>
                Open Popup
              </Popup.Target>
              <Popup.Popper open={showPopup} useFloatingUI enableSizeMiddleware>
                <Popup.Card style={{width: '400px', height: '300px'}}>
                  <Popup.Heading>Auto-Resized Popup</Popup.Heading>
                  <Popup.Body>
                    This popup would normally be 400x300px, but the size middleware automatically
                    constrains it to fit within the available space of the container. The content
                    becomes scrollable when it exceeds the available space. Lorem ipsum dolor sit
                    amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                  </Popup.Body>
                  <Popup.CloseButton />
                </Popup.Card>
              </Popup.Popper>
            </Popup>
          </div>
        </div>
      </div>

      <div>
        <h3>Medium Container (300x200px)</h3>
        <div
          style={{
            height: '200px',
            width: '300px',
            overflow: 'hidden',
            border: '1px solid #ccc',
            position: 'relative',
            padding: '8px',
          }}
        >
          <div style={{position: 'absolute', bottom: '8px', right: '8px'}}>
            <Popup>
              <Popup.Target as={PrimaryButton} onClick={() => setShowPopup(!showPopup)}>
                Open Popup
              </Popup.Target>
              <Popup.Popper open={showPopup} useFloatingUI enableSizeMiddleware maxWidth={250}>
                <Popup.Card style={{width: '400px', height: '300px'}}>
                  <Popup.Heading>Constrained Popup</Popup.Heading>
                  <Popup.Body>
                    This popup has a maxWidth of 250px set, so it will be constrained to the smaller
                    of the available space or the maxWidth value. The size middleware ensures the
                    popup never exceeds the boundaries of its container while maintaining usability
                    through scrollable content.
                  </Popup.Body>
                  <Popup.CloseButton />
                </Popup.Card>
              </Popup.Popper>
            </Popup>
          </div>
        </div>
      </div>
    </div>
  );
};
