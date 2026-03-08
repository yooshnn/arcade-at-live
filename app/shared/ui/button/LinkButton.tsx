import type { ButtonProps } from './Button';
import * as React from 'react';
import { Button } from './Button';

export interface LinkButtonProps extends Omit<ButtonProps, 'render' | 'nativeButton'> {
  render?: React.ReactElement;
  href?: string;
}

export function LinkButton({ ref, render = <a />, ...props }: LinkButtonProps & { ref?: React.RefObject<HTMLAnchorElement | null> }) {
  return (
    <Button
      ref={ref as any}
      render={render}
      nativeButton={false}
      {...props}
    />
  );
}
LinkButton.displayName = 'LinkButton';
