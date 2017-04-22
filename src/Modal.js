import React from 'react';
import PropTypes from 'prop-types';
import focusStore from 'a11y-focus-store';
import ExecutionEnvironment from 'exenv';

function setFocusOn(applicationElement, element) {
  focusStore.storeFocus();
  if (applicationElement) applicationElement.setAttribute('aria-hidden', 'true');
}

function resetFocus(applicationElement) {
  if (applicationElement) applicationElement.removeAttribute('aria-hidden');
  focusStore.restoreFocus();
}

export default class ReactModal2 extends React.Component {
  static getApplicationElement() {
    console.warn('`ReactModal2.getApplicationElement` needs to be set for accessibility reasons');
  }

  static propTypes = {
    onClose: PropTypes.func.isRequired,

    closeOnEsc: PropTypes.bool,
    closeOnBackdropClick: PropTypes.bool,

    backdropClassName: PropTypes.string,
    backdropStyles: PropTypes.object,

    modalClassName: PropTypes.string,
    modalStyles: PropTypes.object
  };

  static defaultProps = {
    closeOnEsc: true,
    closeOnBackdropClick: true
  };

  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM) {
      setFocusOn(ReactModal2.getApplicationElement(), this.modal);
      document.addEventListener('keydown', this.handleDocumentKeydown);
    }
  }

  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM) {
      resetFocus(ReactModal2.getApplicationElement());
      document.removeEventListener('keydown', this.handleDocumentKeydown);
    }
  }

  handleDocumentKeydown = event => {
    if (this.props.closeOnEsc && event.keyCode === 27) {
      this.props.onClose();
    }
  }

  handleBackdropClick = () => {
    if (this.props.closeOnBackdropClick) {
      this.props.onClose();
    }
  }

  handleModalClick = event => {
    event.stopPropagation();
  }

  render() {
    return (
      <div ref={i => this.backdrop = i}
        className={this.props.backdropClassName}
        style={this.props.backdropStyles}
        onClick={this.handleBackdropClick}>
        <div ref={i => this.modal = i}
          className={this.props.modalClassName}
          style={this.props.modalStyles}
          onClick={this.handleModalClick}
          tabIndex="-1">
          {this.props.children}
        </div>
      </div>
    );
  }
}
