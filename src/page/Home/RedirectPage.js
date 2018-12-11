import React from 'react';
import Page from "../../ui/Page/Page";
import Redirect from "../../utils/Redirect";
import UserContext from "../../model/UserContext";
import Screen from "../../utils/Screen";

class RedirectPage extends Page {
    constructor(props) {
        super(props);
        let {url} = JSON.parse(decodeURIComponent(props.match.params.data));
        this.state = {
            url: url
        };
        Screen.loading(true);
    }

    componentDidMount() {
        Screen.loading(false);
        let {history, match} = this.props;
        if (UserContext.isLoggedIn(history, match)) {
            let {url} = this.state;
            Redirect.go(history, url, true);
        }
    }

    render() {
        return (
            <div>
                {!this.isChildRoute() &&
                <div>
                </div>
                }
            </div>
        );
    }
}

export default RedirectPage;