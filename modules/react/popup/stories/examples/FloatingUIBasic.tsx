import React from 'react';
import {Popup, usePopupModel} from '@workday/canvas-kit-react/popup';
import {PrimaryButton} from '@workday/canvas-kit-react/button';

export const FloatingUIBasic = () => {
  const model = usePopupModel();

  return (
    <Popup model={model}>
      <Popup.Target as={PrimaryButton}>Open FloatingUI Popup</Popup.Target>
      <Popup.Popper useFloatingUI enableSizeMiddleware>
        <Popup.Card>
          <Popup.CloseIcon aria-label="Close" />
          <Popup.Heading>FloatingUI Popup</Popup.Heading>
          <Popup.Body>
            This popup uses FloatingUI instead of PopperJS for positioning. It includes automatic
            size middleware that will resize the popup to fit available space, preventing overflow
            issues in constrained environments.
          </Popup.Body>
        </Popup.Card>
      </Popup.Popper>
    </Popup>
  );
};
