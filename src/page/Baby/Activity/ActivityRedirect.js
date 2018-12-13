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
        let { partnerId, type } = this.props.match.params;
        if (!partnerId) partnerId = 0;
        let organizationContext = OrganizationContext.get();
        organizationContext.organizationId = partnerId;
        OrganizationContext.set(organizationContext);
        if (!this.checkUserLoggedIn()) {
            return;
        }
        // TODO:   
        history.replace("/baby/activity/list_" + type);
        return;
        let userContext = UserContext.get();
        if (userContext.agreement === undefined) {
            history.replace("/baby/activity/agreement");
        } else {
            ActivityApi.BabyEnter({
                accessToken: userContext.userToken,
                mechanismCategoryId: organizationContext.organizationId
            }, data => {
                console.log('判断用户跳转===>', data)
                let state = data.state
                if (state === 1) {
                    history.replace("/baby/activity/none");
                } else if (state === 2) {
                    history.replace("/baby/activity/list_" + type);
                } else if (state === 3) {
                    history.replace("/baby/activity/applySuccess");
                } else if (state === 4) {
                    history.replace("/baby/activity/applyAuditionsPass");
                } else if (state === 5) {
                    history.replace("/baby/activity/applyAuditions");
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