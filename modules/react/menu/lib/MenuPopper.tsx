import {createSubcomponent, ExtractProps} from '@workday/canvas-kit-react/common';
import {usePopupPopper, Popper} from '@workday/canvas-kit-react/popup';

import {useMenuModel} from './useMenuModel';

export interface MenuPopperProps extends ExtractProps<typeof Popper> {}

export const useMenuPopper = usePopupPopper;

import {offset} from '@floating-ui/react-dom';

// We moved this out of the component function to prevent rebuilding this object on re-renders.
export const defaultMenuMiddleware = [offset(4)];

export const MenuPopper = createSubcomponent('div')({
  modelHook: useMenuModel,
  elemPropsHook: useMenuPopper,
})<MenuPopperProps>(({children, ...elemProps}) => {
  return (
    <Popper placement="bottom-start" middleware={defaultMenuMiddleware} {...elemProps}>
      {children}
    </Popper>
  );
});
