import Api from "./Api";
import HttpClient from "../utils/HttpClient";

class BabyApi extends Api {
    static creatBaby(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/babyInfoCreate', request, data => {
            if (!data.babyInfoId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static getBabyList(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/babyInfoList', request, data => {
            if (!data.babyInfoList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static getBabyMessage(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/babyInfoGet', request, data => {
            if (!data.babyInfoId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static updateBaby(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/babyInfoUpdate', request, data => {
            if (!data.babyInfoId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    // 以下为新接口
    static isHaveBaby(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/isHaveBaby', request, data => {
            if (!data.result && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
}

const ROUTE_PREFIX = '/baby-service';

const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default BabyApi;