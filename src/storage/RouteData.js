/**
 * 路由数据
 */
class RouteData {

    /**
     * 设置应用的起始路由
     * @param route 路由
     */
    static setStartRoute(route) {
        if (route === '' || route === '/') route = '/home';
        startRoute = route;
    }

    /**
     * 判断应用起始页是否首页
     */
    static isStartFromHome() {
        return startRoute === '/home';
    }
}

let startRoute = '/home';

export default RouteData;