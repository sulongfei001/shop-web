import './SlideTop.css'
import React, {Component} from "react";
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';

class SlideTop extends Component {
    render() {
        return (
            <CSSTransition {...this.props} timeout={this.props.timeout} classNames="slide-top">
                {this.props.children ? this.props.children : <div/>}
            </CSSTransition>
        );
    }
}

SlideTop.propTypes = {
    timeout: PropTypes.number
};

SlideTop.defaultProps = {
    timeout: 230
};

export default SlideTop;