import React from 'react';
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import AccountApi from "../../api/AccountApi";
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Fade from "../../ui/Fade/Fade";
import Alert from "../../ui/Alert/Alert";
import UserContext from "../../model/UserContext";
import Page from "../../ui/Page/Page";

class WeixinOAuth extends Page {
    constructor(props) {
        super(props);
        let {code} = props.match.params;
        this.state = {
            code: code
        };
    }

    componentDidMount() {
        let userContext = UserContext.get();
        if (userContext.weixinOpenId !== undefined) {
            this.props.history.replace('/');
            return;
        }
        let {code} = this.state;
        if (!code) {
            window.location.href = "/?from=singlemessage&isappinstalled=0";
        } else {
            AccountApi.authorizeWithWeixin({
                code: code
            }, (data) => {
                userContext.weixinToken = data.weixinToken;
                userContext.weixinOpenId = data.weixinOpenId;
                userContext.weixinTokenExpires = data.weixinTokenExpires;
                if (!data.needPhoneNumber) {
                    userContext.userToken = data.accessToken;
                    UserContext.set(userContext);
                    window.location.href = '/?from=singlemessage&isappinstalled=0#' + userContext.pathname;
                } else {
                    UserContext.set(userContext);
                    window.location.href = '/?from=singlemessage&isappinstalled=0#/account/login';
                }
            }, (message) => {
                this.setState({alertMessage: message});
            });
        }
    }

    render() {
        let {alertMessage} = this.state;
        return (
            <div className="WeixinOAuth">
                <FullScreenLoading/>
                <TransitionGroup>
                    {alertMessage &&
                    <Fade>
                        <Alert message={alertMessage} onClose={() => {
                            this.setState({alertMessage: undefined});
                            this.props.history.replace('/');
                        }}/>
                    </Fade>
                    }
                </TransitionGroup>
            </div>
        );
    }
}

export default WeixinOAuth;