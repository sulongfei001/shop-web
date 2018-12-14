import './ActivityPandect.css';
import React from 'react';
import { Link } from 'react-router-dom';
import test from '../img/test.png';
import Page from '../../../ui/Page/Page';
import Screen from "../../../utils/Screen";
import OrganizationContext from "../../../model/OrganizationContext";


class ActivityPandect extends Page {
    constructor(props) {
        super(props);
        this.state = {};
        Screen.loading(true);
    }

    componentDidMount() {
        Screen.loading(false);
    }

    render() {
        let organizationContext = OrganizationContext.get();
        let organizationId = (organizationContext.organizationId ? organizationContext.organizationId : 0);
        return (
            <div>
                <div className="ActivityPandect">
                    <Link to={'/baby/activity/partner/' + organizationId + '/type1'} style={{ backgroundImage: 'url(' + test + ')' }}>
                        <label>即将报名</label>
                    </Link>
                    <Link to={'/baby/activity/partner/' + organizationId + '/type1'} style={{ backgroundImage: 'url(' + test + ')' }}>
                        <label>即将报名</label>
                    </Link>
                    <Link to={'/baby/activity/partner/' + organizationId + '/type1'} style={{ backgroundImage: 'url(' + test + ')' }}>
                        <label>即将报名</label>
                    </Link>
                    <Link to={'/baby/activity/partner/' + organizationId + '/type1'} style={{ backgroundImage: 'url(' + test + ')' }}>
                        <label>即将报名</label>
                    </Link>
                    <Link to={'/baby/activity/partner/' + organizationId + '/type1'} style={{ backgroundImage: 'url(' + test + ')' }}>
                        <label>即将报名</label>
                    </Link>
                </div>
            </div>
        );
    };
}

export default ActivityPandect;