import './AccountLoginForApp.css';
import Page from "../../ui/Page/Page";
import React from "react";
import UserContext from "../../model/UserContext";
import Screen from "../../utils/Screen";
import imageSmile from './smile.png';

class AccountLoginForApp extends Page {
    constructor(props) {
        super(props);
        this.state = {};
        Screen.loading(true);
    }

    componentDidMount() {
        UserContext.history = this.props.history;
        window.Bestnihon.getAccessToken();
        let timer = setTimeout(() => {
            clearTimeout(timer);
            this.setState({
                showLoginButton: true,
            }, Screen.loading(false));
        }, 2000);
    }

    render() {
        let { showLoginButton } = this.state;
        return (
            <div>
                {showLoginButton &&
                <div className="AccountLoginForApp" onClick={() => window.Bestnihon.getAccessToken()}>
                    <div className="login-panel" style={{backgroundImage: 'url(' + imageSmile + ')'}}>
                        <label>请登录您的淘最霓虹账号</label>
                        <a>立即登录</a>
                    </div>
                </div>
                }
            </div>
        );
    }
}

export default AccountLoginForApp;