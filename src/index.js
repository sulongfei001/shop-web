import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import Screen from "./utils/Screen";
import createHistory from 'history/createBrowserHistory';
import FullScreenLoading from "./ui/FullScreenLoading/FullScreenLoading";
import AccountApi from "./api/AccountApi";
import UserContext from "./model/UserContext";
import RouteData from "./storage/RouteData";
import GlobalErrorApi from './api/GlobalErrorApi'

console.log("index初始化");
window.onerror = function(message, source, lineNo, colNo, error){
    // console.log('会直接调用',message, source, lineNo, colNo, error)
    let body = {
        message,source,lineNo,colNo
    }
    GlobalErrorApi.submitError(body,data=>{
        console.log('提交成功', data)
    },err => {
        console.error('提交报错', err)
    })
}

let rootElement = Screen.rootElement();
Screen.resetFontSize();
window.addEventListener("resize", () => Screen.resetFontSize());
let history = createHistory();
let pathname = history.location.hash.replace("#", "");
let userContext = UserContext.get();
RouteData.setStartRoute(pathname);

if (pathname.indexOf('weixinOauth') < 0 && userContext.userToken) {
    ReactDOM.render(<FullScreenLoading/>, rootElement);
    AccountApi.validate({
        accessToken: userContext.userToken
    }, () => {
        ReactDOM.render(<App/>, rootElement);
        //registerServiceWorker();
    }, () => {
        UserContext.remove();
        ReactDOM.render(<App/>, rootElement);
    });
} else {
    ReactDOM.render(<App/>, rootElement);
    //registerServiceWorker();
}

