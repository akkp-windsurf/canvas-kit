import React from 'react';
import {Meta, StoryObj} from '@storybook/react';

import {FloatingUIBasic} from './examples/FloatingUIBasic';
import {FloatingUISizeDemo} from './examples/FloatingUISizeDemo';
import {FloatingUIComparison} from './examples/FloatingUIComparison';

export default {
  title: 'Components/Popups/Popup/FloatingUI',
  component: FloatingUIBasic,
} as Meta;

type Story = StoryObj;

export const Basic: Story = {
  render: FloatingUIBasic,
};

export const SizeMiddleware: Story = {
  render: FloatingUISizeDemo,
};

export const Comparison: Story = {
  render: FloatingUIComparison,
};
