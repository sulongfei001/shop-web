import './Confirm.css'
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Confirm extends Component {
    componentDidMount() {
        let box = this.box;
        let width = box.scrollWidth;
        let height = box.scrollHeight;
        box.style.width = width + 'px';
        box.style.height = height + 'px';
        box.style.marginLeft = '-' + width / 2 + 'px';
        box.style.marginTop = '-' + height / 2 + 'px';
    }

    render() {
        let {onConfirm, onCancel, title, message} = this.props;
        return (
            <div className="Confirm">
                <div className="mask" onClick={() => onCancel()}/>
                <div className="box" ref={input => this.box = input}>
                    {title &&
                    <h5>{title}</h5>
                    }
                    {message &&
                    <div className="message">{message}</div>
                    }
                    <div className="func">
                        <a className="cancel" onClick={() => onCancel()}>取消</a>
                        <a className="confirm" onClick={() => onConfirm()}>确定</a>
                    </div>
                </div>
            </div>
        );
    }
}

Confirm.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    title: PropTypes.string,
    message: PropTypes.string
};

export default Confirm;