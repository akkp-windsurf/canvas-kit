import React from 'react';
import {Popup, usePopupModel} from '@workday/canvas-kit-react/popup';
import {PrimaryButton, SecondaryButton} from '@workday/canvas-kit-react/button';
import {Flex} from '@workday/canvas-kit-react/layout';

export const FloatingUIComparison = () => {
  const popperModel = usePopupModel();
  const floatingModel = usePopupModel();

  return (
    <Flex gap="m" alignItems="flex-start">
      <div>
        <h3>PopperJS (Default)</h3>
        <Popup model={popperModel}>
          <Popup.Target as={PrimaryButton}>Open PopperJS Popup</Popup.Target>
          <Popup.Popper>
            <Popup.Card>
              <Popup.CloseIcon aria-label="Close" />
              <Popup.Heading>PopperJS Implementation</Popup.Heading>
              <Popup.Body>
                This popup uses the traditional PopperJS implementation. It provides reliable
                positioning but may have overflow issues in constrained spaces.
                <br />
                <br />
                This is the default behavior that maintains backward compatibility with existing
                Canvas Kit implementations.
              </Popup.Body>
            </Popup.Card>
          </Popup.Popper>
        </Popup>
      </div>

      <div>
        <h3>FloatingUI (New)</h3>
        <Popup model={floatingModel}>
          <Popup.Target as={SecondaryButton}>Open FloatingUI Popup</Popup.Target>
          <Popup.Popper useFloatingUI enableSizeMiddleware>
            <Popup.Card>
              <Popup.CloseIcon aria-label="Close" />
              <Popup.Heading>FloatingUI Implementation</Popup.Heading>
              <Popup.Body>
                This popup uses the new FloatingUI implementation with size middleware enabled. It
                automatically constrains popup dimensions to fit available space.
                <br />
                <br />
                The size middleware addresses popup sizing issues mentioned in GitHub issue #2001 by
                preventing overflow in restricted screen spaces.
              </Popup.Body>
            </Popup.Card>
          </Popup.Popper>
        </Popup>
      </div>
    </Flex>
  );
};
