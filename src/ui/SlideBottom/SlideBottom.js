import './SlideBottom.css'
import React, {Component} from "react";
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';

class SlideBottom extends Component {
    render() {
        return (
            <CSSTransition {...this.props} timeout={this.props.timeout} classNames="slide-bottom">
                {this.props.children ? this.props.children : <div/>}
            </CSSTransition>
        );
    }
}

SlideBottom.propTypes = {
    timeout: PropTypes.number
};

SlideBottom.defaultProps = {
    timeout: 230
};

export default SlideBottom;