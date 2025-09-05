import React from 'react';
import {Popup} from '@workday/canvas-kit-react/popup';
import {PrimaryButton} from '@workday/canvas-kit-react/button';

export const BasicFloatingUIExample = () => {
  const [showPopup, setShowPopup] = React.useState(false);

  return (
    <div style={{padding: '2rem'}}>
      <Popup>
        <Popup.Target as={PrimaryButton} onClick={() => setShowPopup(!showPopup)}>
          Open FloatingUI Popup
        </Popup.Target>
        <Popup.Popper open={showPopup} useFloatingUI enableSizeMiddleware>
          <Popup.Card style={{width: '300px'}}>
            <Popup.Heading>FloatingUI Popup</Popup.Heading>
            <Popup.Body>
              This popup uses the new @floating-ui implementation with size middleware enabled. It
              will automatically resize to fit available space when constrained.
            </Popup.Body>
            <Popup.CloseButton onClick={() => setShowPopup(false)} />
          </Popup.Card>
        </Popup.Popper>
      </Popup>
    </div>
  );
};
