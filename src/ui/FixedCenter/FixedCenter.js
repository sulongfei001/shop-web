import './FixedCenter.css'
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class FixedCenter extends Component {
    componentDidMount() {
        this.container.style.marginTop = '-' + this.container.clientHeight / 2 + 'px';
    }

    render() {
        let {width, widthUnit} = this.props;
        return (
            <div className="FixedCenter" style={{width: width + widthUnit, marginLeft: '-' + width/2 + widthUnit}} ref={input => this.container = input}>
                {this.props.children}
            </div>
        );
    }
}

FixedCenter.propTypes = {
    width: PropTypes.number.isRequired,
    widthUnit: PropTypes.string.isRequired
};

export default FixedCenter;