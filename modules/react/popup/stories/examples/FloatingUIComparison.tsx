import React from 'react';
import {Popup} from '@workday/canvas-kit-react/popup';
import {PrimaryButton, SecondaryButton} from '@workday/canvas-kit-react/button';

export const FloatingUIComparison = () => {
  const [showOld, setShowOld] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);

  return (
    <div
      style={{
        height: '300px',
        width: '400px',
        overflow: 'hidden',
        border: '1px solid #ccc',
        position: 'relative',
        padding: '16px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          display: 'flex',
          gap: '8px',
          flexDirection: 'column',
        }}
      >
        <Popup>
          <Popup.Target as={PrimaryButton} onClick={() => setShowOld(!showOld)}>
            PopperJS Implementation
          </Popup.Target>
          <Popup.Popper open={showOld}>
            <Popup.Card style={{width: '500px', height: '400px'}}>
              <Popup.Heading>PopperJS Implementation</Popup.Heading>
              <Popup.Body>
                This popup uses the old @popperjs implementation and may overflow the container.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </Popup.Body>
              <Popup.CloseButton />
            </Popup.Card>
          </Popup.Popper>
        </Popup>

        <Popup>
          <Popup.Target as={SecondaryButton} onClick={() => setShowNew(!showNew)}>
            FloatingUI Implementation
          </Popup.Target>
          <Popup.Popper open={showNew} useFloatingUI enableSizeMiddleware>
            <Popup.Card style={{width: '500px', height: '400px'}}>
              <Popup.Heading>FloatingUI Implementation</Popup.Heading>
              <Popup.Body>
                This popup uses @floating-ui with size middleware and automatically resizes to fit
                the available space. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </Popup.Body>
              <Popup.CloseButton />
            </Popup.Card>
          </Popup.Popper>
        </Popup>
      </div>
    </div>
  );
};
