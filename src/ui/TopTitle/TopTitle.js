import './TopTitle.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FixedTop from '../FixedTop/FixedTop';
import back from './back.png';
import moreIcon from './moreIcon.png';

class TopTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <FixedTop {...this.props}>
                <div className="TopTitle">
                    <div className="topTitle">{this.props.title}</div>
                    <div className="topBack" onClick={this.props.onClickBack}><img src={back} /></div>
                    <div className="moreIcon" onClick={this.props.onClickMore}><img src={moreIcon} /></div>
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