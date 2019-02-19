import './MessageBottom.css'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import imageClose from './close.png';
import FixedBottom from "../FixedBottom/FixedBottom";

class MessageBottom extends Component {
    render() {
        let { title, confirmText, children, onClose, onConfirm, leftTitle,hideBtn,confirmStyle } = this.props;
        return (
            <FixedBottom>
                <div className="MessageBottom">
                    <a className="close" style={{ backgroundImage: 'url(' + imageClose + ')' }} onClick={e => onClose()}> </a>
                    {title && (leftTitle ?
                        <h4 className='left-title'>{title}</h4> :
                        <h4 className='title'>{title}</h4>)
                    }
                    <div className="content">
                        {children ? children : <div />}
                    </div>
                    {
                        !hideBtn && <a className="confirm" onClick={e => onConfirm()} style={confirmStyle}>
                            {confirmText ? confirmText : '确认'}
                        </a>
                    }

                </div>
            </FixedBottom>
        );
    }
}

MessageBottom.propTypes = {
    title: PropTypes.string,
    confirmText: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
};

export default MessageBottom;