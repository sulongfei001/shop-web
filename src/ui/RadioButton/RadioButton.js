import './RadioButton.css'
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class RadioButton extends Component {
    constructor(props) {
        super(props);
        let checked = props.checked ? props.checked : false;
        this.switchState = this.switchState.bind(this);
        this.state = {
            checked: checked
        }
    }

    switchState() {
        let {checked} = this.state;
        let {onChange} = this.props;
        this.setState({checked: !checked});
        if (onChange) onChange(!checked);
    }

    render() {
        let {checked} = this.state;
        let classes = ['RadioButton'];
        if (checked) classes.push('checked');
        return (
            <a className={classes.reduce((a, b) => a + ' ' + b)} {...this.props} onClick={this.switchState}>
                <div className="circle"/>
            </a>
        );
    }
}

RadioButton.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func
};

export default RadioButton;