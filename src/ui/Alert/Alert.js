import './Alert.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Alert extends Component {


    render() {
        let { message, title, confirmText, onClose, doubleBtn } = this.props;
        return (
            <div className="Alert">
                <div className="mask" onClick={() => onClose()} />
                <div className={`${doubleBtn ? 'box2' : 'box'}`} ref={input => this.box = input}>
                    {doubleBtn ?
                        (
                            <div>
                                {title && <h5 className="f36 color-000">{title}</h5>}
                                <div className="double-txt f30 color-888 mt30">{message}</div>
                                <div className='double-btn'>
                                    <div className="left-btn" onClick={e => doubleBtn.leftFn()}>{doubleBtn.leftBtn}</div>
                                    <div className="right-btn color-green" onClick={e => doubleBtn.rightFn()}>{doubleBtn.rightBtn}</div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {title && <h5>{title}</h5>}
                                <div className="message">{message}</div>
                                <a className="alert-confirm" onClick={(e) => onClose(e)}>{confirmText ? confirmText : '好的'}</a>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

Alert.propTypes = {
    message: PropTypes.string.isRequired,
    title: PropTypes.string,
    confirmText: PropTypes.string,
    onClose: PropTypes.func.isRequired
};

export default Alert;