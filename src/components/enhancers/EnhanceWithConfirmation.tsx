import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Popup} from '../controls/Popup';
import {t} from '../util';

export const EnhanceWithConfirmation = ComposedComponent => class extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    onClick: PropTypes.func,
    title: PropTypes.string,
    children: PropTypes.node,
  };
  constructor() {
    super();
    this.state = {popupActive: false};
  }
  render() {
    const {onClick, title, children,...props} = this.props;
    const buttons = [{
      text: t('no'),
      onClick: () => this.setState({popupActive: false}),
      busy: true,
    }, {
      text: t('delete'),
      variant: 'danger',
      onClick: () => {
        this.setState({popupActive: false});
        onClick();
      },
      busy: true,
    }];
    return (
      <div style={{display: 'inline'}}>
        {this.state.popupActive ? (
          <div style={{display: 'inline'}}>
            <Popup title={title} buttons={buttons} onHide={() => this.setState({popupActive: false})} data-tst={props['data-tst'] + '-popup'}>
              {children}
            </Popup>
            <ComposedComponent {...props} onClick={() => this.setState({popupActive: false})} />
          </div>
        ) : (
          <ComposedComponent {...props} onClick={() => this.setState({popupActive: true})} />
        )}
      </div>
    );
  }
};