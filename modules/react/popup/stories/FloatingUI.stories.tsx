import React from 'react';
import {ComponentStoryObj, type Meta} from '@storybook/react';

import {FloatingUIComparison} from './examples/FloatingUIComparison';
import {SizeMiddlewareDemo} from './examples/SizeMiddlewareDemo';
import {BasicFloatingUIExample} from './examples/BasicFloatingUIExample';

const meta: Meta = {
  title: 'Components/Popups/Popup/FloatingUI Migration',
  component: FloatingUIComparison,
};

export default meta;

export const Basic: ComponentStoryObj<typeof BasicFloatingUIExample> = {
  render: () => <BasicFloatingUIExample />,
};

export const Comparison: ComponentStoryObj<typeof FloatingUIComparison> = {
  render: () => <FloatingUIComparison />,
};

export const SizeMiddleware: ComponentStoryObj<typeof SizeMiddlewareDemo> = {
  render: () => <SizeMiddlewareDemo />,
};
