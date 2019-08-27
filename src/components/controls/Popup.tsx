import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import {Button, BusyButton} from './Button';
import { BootstrapVariant } from '../../models';

type PopupProps = {
  title: string,
  children: any,
  onHide: () => void,
  buttons: Array<{
    text: string,
    onClick: Function,
    variant?: BootstrapVariant,
    busy?: boolean,
    disabled?: boolean,
  }>
}

export class Popup extends Component<PopupProps> {
  render() {
    return (
      <Modal onHide={this.props.onHide} show={true}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.props.children}
        </Modal.Body>

        <Modal.Footer>
          {this.props.buttons.map((button, i) => {
            const UsedButton = button.busy ? BusyButton : Button;
            return (
              <UsedButton
                key={i}
                variant={button.variant}
                onClick={button.onClick}
                disabled={button.disabled || false}
                data-tst={this.props['data-tst'] + '-btn-' + i}
              >
                {button.text}
              </UsedButton>
            );
          })}
        </Modal.Footer>
      </Modal>
    );
  }
}
