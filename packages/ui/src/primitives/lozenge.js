// @flow

import styled from 'react-emotion';

import { borderRadius, colors, gridSize } from '../theme';

const boldBackgroundColor = {
  default: colors.N60,
  primary: colors.primary,
  danger: colors.danger,
  create: colors.create,
  warning: colors.warning,
};
const boldTextColor = {
  default: 'white',
  primary: 'white',
  danger: 'white',
  create: 'white',
  warning: 'white',
};

const subtleBackgroundColor = {
  default: colors.N05,
  primary: colors.B.L90,
  danger: colors.R.L90,
  create: colors.G.L90,
  warning: colors.Y.L90,
};
const subtleBorderColor = {
  default: colors.N10,
  primary: colors.B.L80,
  danger: colors.R.L80,
  create: colors.G.L80,
  warning: colors.Y.L80,
};
const subtleTextColor = {
  default: colors.N50,
  primary: colors.B.L30,
  danger: colors.R.L30,
  create: colors.G.L30,
  warning: colors.Y.L30,
};

type Props = {
  /* Affects the visual style of the lozenge */
  appearance: 'default' | 'primary' | 'danger' | 'create' | 'warning',
  /* Which direction to crop text from */
  crop?: 'left' | 'right',
  /* The value displayed within the lozenge. */
  variant: 'bold' | 'subtle',
};

export const Lozenge = styled.div(({ appearance, variant, crop }: Props) => {
  const isClipRight = crop === 'right';
  const cropStyles = crop
    ? {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',

        // clip from beginning of string
        direction: isClipRight ? 'rtl' : null,
        textAlign: isClipRight ? 'left' : null,
      }
    : null;

  return {
    border: '1px solid transparent',
    backgroundColor:
      variant === 'bold'
        ? boldBackgroundColor[appearance]
        : subtleBackgroundColor[appearance],
    borderColor: variant === 'bold' ? null : subtleBorderColor[appearance],
    color:
      variant === 'bold'
        ? boldTextColor[appearance]
        : subtleTextColor[appearance],
    borderRadius,
    display: 'inline-block',
    fontSize: '0.85em',
    maxWidth: '100%',
    minWidth: 1,
    padding: `${gridSize / 2}px ${gridSize}px`,
    ...cropStyles,
  };
});
Lozenge.defaultProps = {
  appearance: 'default',
  variant: 'subtle',
};
