import './RouteSlide.css'
import React, {Component} from "react";
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';

class RouteSlide extends Component {
    render() {
        return (
            <CSSTransition {...this.props} timeout={this.props.timeout} classNames="route-slide">
                {this.props.children ? this.props.children : <div/>}
            </CSSTransition>
        );
    }
}

RouteSlide.propTypes = {
    timeout: PropTypes.number
};

RouteSlide.defaultProps = {
    timeout: 230
};

export default RouteSlide;