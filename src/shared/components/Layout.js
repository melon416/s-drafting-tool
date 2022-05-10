import React, { PureComponent } from 'react';

export class LayoutRows extends PureComponent {
  render() {
    const { children, className, style } = this.props;

    return (
      <div
        className={className}
        style={{
          display: 'flex', flexFlow: 'column', height: '100%', overflow: 'hidden', ...style,
        }}
      >
        {children}
      </div>
    );
  }
}

export class LayoutColumns extends PureComponent {
  render() {
    const { children, className, style } = this.props;

    return (
      <div
        className={className}
        style={{
          display: 'flex', flexFlow: 'row', height: '100%', overflow: 'hidden', ...style,
        }}
      >
        {children}
      </div>
    );
  }
}

export class LayoutRow extends PureComponent {
	containerRef = React.createRef();

	render() {
	  const {
	    children, className, flexible, visible, style, scrolling, flexGrow,syntheiaID, ...rest
	  } = this.props;

	  return (
  <div
    id={syntheiaID}
    ref={this.containerRef}
    className={className}
    style={{
			  flex: `${flexible ? `${flexGrow} 1` : '0 0'} auto`,
			  overflow: scrolling ? 'auto' : (flexible ? 'hidden' : 'visible'),
			  height: flexible && scrolling ? '100%' : undefined,
			  maxHeight: !flexible && scrolling ? '100%' : undefined,
			  display: visible === false ? 'none' : undefined,
			  ...style,
    }}
    {...rest}
  >
    {children}
  </div>
	  );
	}
}

LayoutRow.defaultProps = {
  flexGrow: 1,
};

export class LayoutColumn extends PureComponent {
  render() {
    const {
      children, className, flexible, visible, style, ...rest
    } = this.props;

    return (
      <div
        className={className}
        style={{
          flex: `${flexible ? '1 1' : '0 0'} auto`, height: '100%', overflow: 'hidden', display: visible === false ? 'none' : undefined, ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
}
