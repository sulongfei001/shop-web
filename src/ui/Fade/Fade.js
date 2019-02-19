import './Fade.css'
import React, {Component} from "react";
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';

class Fade extends Component {
    render() {
        return (
            <CSSTransition {...this.props} timeout={this.props.timeout} classNames="fade">
                {this.props.children ? this.props.children : <div/>}
            </CSSTransition>
        );
    }
}

Fade.propTypes = {
    timeout: PropTypes.number
};

Fade.defaultProps = {
    timeout: 230
};

export default Fade;