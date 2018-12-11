import './Stretch.css'
import React, {Component} from "react";
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';

class Stretch extends Component {
    render() {
        return (
            <CSSTransition {...this.props} timeout={this.props.timeout} classNames="stretch">
                {this.props.children ? this.props.children : <div/>}
            </CSSTransition>
        );
    }
}

Stretch.propTypes = {
    timeout: PropTypes.number
};

Stretch.defaultProps = {
    timeout: 200
};

export default Stretch;