import './SlideRight.css'
import React, {Component} from "react";
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';

class SlideRight extends Component {
    render() {
        return (
            <CSSTransition {...this.props} timeout={this.props.timeout} classNames="slide-right">
                {this.props.children ? this.props.children : <div/>}
            </CSSTransition>
        );
    }
}

SlideRight.propTypes = {
    timeout: PropTypes.number
};

SlideRight.defaultProps = {
    timeout: 230
};

export default SlideRight;