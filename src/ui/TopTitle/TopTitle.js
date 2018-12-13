import './TopTitle.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FixedTop from '../FixedTop/FixedTop';
import back from './back.png';

class TopTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <FixedTop>
                <div className="TopTitle">
                    <div className="topTitle">{this.props.title}</div>
                    <div className="topBack" onClick={this.props.onClick}><img src={back} /></div>
                </div>
            </FixedTop>
        )
    }
}

TopTitle.propTypes = {
    title: PropTypes.string
};

TopTitle.defaultProps = {
    title: ""
};

export default TopTitle;