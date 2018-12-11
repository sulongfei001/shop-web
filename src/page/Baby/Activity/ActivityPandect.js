import './ActivityPandect.css';
import React from 'react';
import { Link } from 'react-router-dom';
import test from './test.png';
import Page from '../../../ui/Page/Page';
import Screen from "../../../utils/Screen";


class ActivityPandect extends Page {
    constructor(props) {
        super(props);
        this.state = {};
        Screen.loading(true);
    }

    componentDidMount(){
        Screen.loading(false);
    }

    render() {
        return (
            <div className="ActivityPandect">
                <Link to={'/baby/activity/redirect/type1'} style={{ backgroundImage: 'url(' + test + ')' }}>
                   <label>即将报名</label>
                </Link>
                <Link to={'/baby/activity/redirect/type1'} style={{ backgroundImage: 'url(' + test + ')' }}>
                   <label>即将报名</label>
                </Link>
                <Link to={'/baby/activity/redirect/type1'} style={{ backgroundImage: 'url(' + test + ')' }}>
                   <label>即将报名</label>
                </Link>
                <Link to={'/baby/activity/redirect/type1'} style={{ backgroundImage: 'url(' + test + ')' }}>
                   <label>即将报名</label>
                </Link>
                <Link to={'/baby/activity/redirect/type1'} style={{ backgroundImage: 'url(' + test + ')' }}>
                   <label>即将报名</label>
                </Link>
            </div>
        );
    };
}

export default ActivityPandect;