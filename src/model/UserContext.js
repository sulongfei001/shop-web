import Strings from "../utils/Strings";
import Weixin from "../utils/Weixin";

class UserContext {
    static get() {
        let userContext = {};
        userContext.userToken = localStorage.getItem('userContext.userToken');
        userContext.weixinToken = localStorage.getItem('userContext.weixinToken');
        userContext.weixinTokenExpires = localStorage.getItem('userContext.weixinTokenExpires');
        userContext.weixinOpenId = localStorage.getItem('userContext.weixinOpenId');
        userContext.pathname = sessionStorage.getItem('userContext.pathname');
        userContext.agreement = localStorage.getItem('userContext.agreement');
        userContext.identityCardName = localStorage.getItem('userContext.identityCardName');
        userContext.identityCard = localStorage.getItem('userContext.identityCard');
        userContext.weixinToken = Strings.defaultIfEmpty(userContext.weixinToken, undefined);
        userContext.weixinTokenExpires = Strings.defaultIfEmpty(userContext.weixinTokenExpires, undefined);
        userContext.weixinOpenId = Strings.defaultIfEmpty(userContext.weixinOpenId, undefined);
        userContext.userToken = Strings.defaultIfEmpty(userContext.userToken, undefined);
        userContext.agreement = Strings.defaultIfEmpty(userContext.agreement, undefined);
        userContext.identityCardName = Strings.defaultIfEmpty(userContext.identityCardName, undefined);
        userContext.identityCard = Strings.defaultIfEmpty(userContext.identityCard, undefined);
        userContext.pathname = Strings.defaultIfEmpty(userContext.pathname, "/home");
        userContext.clientIdentifier = localStorage.getItem('clientIdentifier')
        return userContext;
    }

    static set(userContext) {
        if (userContext.userToken) {
            localStorage.setItem('userContext.userToken', userContext.userToken);
        } else {
            localStorage.removeItem('userContext.userToken');
        }
        if (userContext.weixinToken) {
            localStorage.setItem('userContext.weixinToken', userContext.weixinToken);
        } else {
            localStorage.removeItem('userContext.weixinToken');
        }
        if (userContext.weixinTokenExpires) {
            localStorage.setItem('userContext.weixinTokenExpires', userContext.weixinTokenExpires);
        } else {
            localStorage.removeItem('userContext.weixinTokenExpires');
        }
        if (userContext.weixinOpenId) {
            localStorage.setItem('userContext.weixinOpenId', userContext.weixinOpenId);
        } else {
            localStorage.removeItem('userContext.weixinOpenId');
        }
        if (userContext.pathname) {
            sessionStorage.setItem('userContext.pathname', userContext.pathname);
        } else {
            sessionStorage.removeItem('userContext.pathname');
        }
        if (userContext.identityCardName) {
            localStorage.setItem('userContext.identityCardName', userContext.identityCardName);
        } else {
            localStorage.removeItem('userContext.identityCardName');
        }
        if (userContext.identityCard) {
            localStorage.setItem('userContext.identityCard', userContext.identityCard);
        } else {
            localStorage.removeItem('userContext.identityCard');
        }

        if (userContext.agreement) {
            localStorage.setItem('userContext.agreement', userContext.agreement);
        } else {
            localStorage.removeItem('userContext.agreement');
        }
        if (userContext.clientIdentifier) {
            localStorage.setItem('clientIdentifier', userContext.clientIdentifier);
        } else {
            localStorage.removeItem('clientIdentifier')
        }
    }

    static remove() {
        localStorage.removeItem('userContext.userToken');
        localStorage.removeItem('userContext.weixinToken');
        localStorage.removeItem('userContext.weixinTokenExpires');
        localStorage.removeItem('userContext.weixinOpenId');
        localStorage.removeItem('userContext.agreement');
        sessionStorage.removeItem('userContext.pathname');
        localStorage.removeItem('userContext.identityCardName');
        localStorage.removeItem('userContext.identityCard');
        localStorage.removeItem('clientIdentifier')
    }

    static isLoggedIn(history, match) {
        let userContext = UserContext.get();
        if (!userContext.userToken) {
            this.redirectLogin(history, match);
            return false;
        } else {
            return true;
        }
    }

    static redirectLogin(history, match) {
        UserContext.remove();
        let userContext = UserContext.get();
        userContext.pathname = match.url;
        UserContext.set(userContext);
        if (this.isWeixin()) {
            Weixin.goToOAuthPage();
        } else if (this.isBestnihonApp()) {
            history.replace("/account/loginForApp");
        } else {
            history.replace("/account/login");
        }
    }

    static isWeixin() {
        let weixinResults = window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i);
        let isWeixin = weixinResults && weixinResults.length > 0 && weixinResults[0] === 'micromessenger';
        return isWeixin || window.WeixinJSBridge;
    }

    static isBestnihonApp() {
        return window.Bestnihon;
    }

    static registerAppCallback() {
        if (this.isBestnihonApp() && !window.setAccessToken) {
            window.setAccessToken = accessToken => {
                let userContext = UserContext.get();
                userContext.userToken = accessToken;
                UserContext.set(userContext);
                UserContext.history.replace(userContext.pathname);
            };
        }
    }

    static unregisterAppCallback() {
        if (window.setAccessToken) window.setAccessToken = undefined;
    }
}

export default UserContext;