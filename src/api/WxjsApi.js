import Api from "./Api";
import HttpClient from "../utils/HttpClient";

/**
 * 微信JS接口
 */
class WxjsApi extends Api {

    /**
     * 获取微信JS-SDK配置信息
     * @param url 当前的url
     * @param onSuccess 成功回调
     * @param onFail 失败回调
     */
    static getJsSdkConfig({ url }, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/wxjs/getJsSdkConfig', { url: url }, data => {
            if (!data.appId) {
                if (onFail) onFail(SYSTEM_ERROR);
            } else {
                if (onSuccess) onSuccess(data);
            }
        }, onFail);
    }
}

const ROUTE_PREFIX = '/common';

const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default WxjsApi;