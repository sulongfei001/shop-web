import {Component} from 'react';
import UserContext from "../../model/UserContext";
import Share from "../../utils/Share";

class Page extends Component {
    constructor(props) {
        super(props);
        this.isChildRoute = this.isChildRoute.bind(this);
        this.checkUserLoggedIn = this.checkUserLoggedIn.bind(this);
        this.checkNetWork = this.checkNetWork.bind(this)
        this.matchedUrl = props.match.url;
        this.scrollTop = 0;
        Share.prepare({
            enabled: 1,
            title: '汪汪与乌糖官方商城',
            content: '汪汪与乌糖玩偶、抱枕！\n官方商城，正品保证！',
            url: 'https://shop.yiyayiyawao.com/?from=singlemessage&isappinstalled=0',
            logo: 'https://cdn.yiyayiyawao.com/brand/logo/38e00a9d-9002-4bc3-bfe0-a8a533c41bcc.jpg?x-oss-process=style/share_logo'
        });
        console.log("Page构造函数执行完毕");
    }

    isChildRoute() {
        let {location} = this.props;
        let pathname = location.pathname;
        let isChildRoute = pathname.indexOf(this.matchedUrl + '/') > -1;
        if (isChildRoute === true) this.needRestore = true;
        return isChildRoute;
    }

    checkUserLoggedIn() {
        let {history, match} = this.props;
        return UserContext.isLoggedIn(history, match);
    }

    // 判断网络类型 wifi or 4g
    checkNetWork () {
        let networkInfo = window.navigator.connection
        let networkType = (networkInfo.type || networkInfo.effectiveType).toLowerCase()
        console.log('这是wifi么', networkType)
        return networkType === 'wifi' ? true : false
    }
}


export default Page;