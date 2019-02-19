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
        let { onClickBack, onClickMore, title, style } = this.props;
        return (
            <FixedTop>
                <div className="TopTitle" style={style}>
                    <div className="topTitle">{title}</div>
                    <div className="topBack" onClick={onClickBack}><img src={back} /></div>
                    <div className="moreIcon" onClick={onClickMore}><img src={moreIcon} /></div>
                </div>
            </FixedTop>
        )
    }
}

TopTitle.propTypes = {
    title: PropTypes.string.isRequired
};

TopTitle.defaultProps = {
    title: ""
};

export default TopTitle;