import React from 'react';
import Page from "../../../ui/Page/Page";
import UserContext from "../../../model/UserContext";
import OrganizationContext from "../../../model/OrganizationContext";
import ActivityApi from "../../../api/BabyActivityApi";
import Screen from "../../../utils/Screen";

class ActivityRedirect extends Page {
    constructor(props) {
        super(props);
        this.state = {};
        Screen.loading(true);
    }

    componentDidMount() {
        let { history } = this.props;
        let { partnerId, activityCategoryId } = this.props.match.params;
        if (!partnerId) partnerId = 0;
        if (!activityCategoryId) activityCategoryId = 1;
        let organizationContext = OrganizationContext.get();
        organizationContext.organizationId = partnerId;
        organizationContext.activityCategoryId = activityCategoryId;
        OrganizationContext.set(organizationContext);
        if (!this.checkUserLoggedIn()) {
            return;
        }
        let userContext = UserContext.get();
        if (userContext.agreement === undefined) {
            history.replace("/baby/activity/agreement");
        } else {
            ActivityApi.BabyEnter({
                accessToken: userContext.userToken,
                mechanismCategoryId: organizationContext.organizationId,
                activityCategoryId: activityCategoryId
            }, data => {
                let state = data.state;
                if (state === 1) {
                    history.replace("/baby/activity/none_type" + activityCategoryId);
                } else if (state === 2) {
                    history.replace("/baby/activity/list_type" + activityCategoryId);
                } else if (state === 3) {
                    history.replace("/baby/activity/applySuccess_type" + activityCategoryId);
                } else if (state === 4) {
                    history.replace("/baby/activity/applyAuditionsPass_type" + activityCategoryId);
                } else if (state === 5) {
                    history.replace("/baby/activity/applyAuditions_type" + activityCategoryId);
                } else if (state === 6) {
                    history.replace("/baby/list");
                }
            }, err => {
                Screen.alert(err, () => {
                    Screen.loading(false);
                    this.props.history.goBack()
                })
            });
        }
    }

    render() {
        return (
            <div />
        );
    }
}

export default ActivityRedirect;