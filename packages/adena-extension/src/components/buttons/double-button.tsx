import theme, { FontsType } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';
import Button, { ButtonHierarchy } from './button';
import Text from '@components/text';

interface ButtonProps {
  onClick: () => void;
  text: string;
  props?: React.ComponentPropsWithoutRef<'button'>;
  hierarchy?: ButtonHierarchy;
  bgColor?: string;
  fontType?: FontsType;
}

interface WrapperStyleProps {
  margin?: string;
}

interface DubbleButtonProps extends WrapperStyleProps {
  leftProps: ButtonProps;
  rightProps: ButtonProps;
}

export const Wrapper = styled.div<WrapperStyleProps>`
  ${({ theme }) => theme.mixins.flexbox('row', 'center', 'space-between')};
  width: 100%;
  gap: 10px;
  ${({ margin }) => margin && `margin: ${margin}`};
`;

const DubbleButton = ({ margin, leftProps, rightProps }: DubbleButtonProps) => {
  return (
    <Wrapper margin={margin}>
      <Button
        fullWidth
        hierarchy={leftProps.hierarchy ?? ButtonHierarchy.Dark}
        onClick={leftProps.onClick}
        bgColor={leftProps.bgColor}
        {...leftProps.props}
      >
        <Text type={leftProps.fontType ?? 'body1Bold'}>{leftProps.text}</Text>
      </Button>
      <Button
        fullWidth
        hierarchy={rightProps.hierarchy ?? ButtonHierarchy.Primary}
        onClick={rightProps.onClick}
        bgColor={rightProps.bgColor}
        {...rightProps.props}
      >
        <Text type={rightProps.fontType ?? 'body1Bold'}>{rightProps.text}</Text>
      </Button>
    </Wrapper>
  );
};

export default DubbleButton;
