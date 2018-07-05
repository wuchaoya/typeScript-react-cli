import React from 'react';
import { css, withStyles, IThemeProps } from 'withStyles';
import { IWithStyleProps } from 'Interfaces/react-with-style';

/**
 * buttonText: 按钮名称
 * sytles: 按钮样式
 */
export interface PropsButton {
  buttonText: string;
  [styles: string]: any;
}
const mapStyleToProps = ({ color }: IThemeProps) => ({
  title: {
    'color': color.text,
    'fontSize': '100px',
    'testAlign': 'center',
    'transition': 'color 300ms',
    'background-color': color.background
  }
});

@withStyles(mapStyleToProps)
export default class Button extends React.PureComponent<PropsButton, IWithStyleProps<typeof mapStyleToProps>> {
  public render() {
    const { buttonText } = this.props;
    return (
      <div {...css(this.props.styles.title)}>
        <span>{buttonText}</span>
      </div>
    );
  }
}
