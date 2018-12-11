import HttpClient from '../utils/HttpClient';
import Api from "./Api";
import System from "../utils/System";

class AccountApi extends Api {
    static authorizeWithWeixin(request, onSuccess, onFail) {
        request.clientId = System.clientId();
        request.clientVersion = System.clientVersion();
        HttpClient.post(ROUTE_PREFIX + '/account/authorizeWithWeixin', request, data => {
            if (!data.needPhoneNumber && !data.accessToken && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static authorizeWithPhone(request, onSuccess, onFail) {
        request.clientId = System.clientId();
        request.clientVersion = System.clientVersion();
        HttpClient.post(ROUTE_PREFIX + '/account/authorizeWithPhone', request, data => {
            if (!data.accessToken && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static sendAuthorizeSms(request, onSuccess, onFail) {
        request.clientId = System.clientId();
        request.clientVersion = System.clientVersion();
        request.clientSecret = System.clientSecret();
        HttpClient.post(ROUTE_PREFIX + '/account/sendAuthorizeSms', request, data => {
            if (!data.smsToken && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail)
    }

    static validate(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/account/validate', request, data => {
            if (!data.clientId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail)
    }

    static modify(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/account/modify', request, data => {
            if (!data.updateDate && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail)
    }
}

const ROUTE_PREFIX = '/passport';

const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default AccountApi;