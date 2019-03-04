import Api from "./Api";
import HttpClient from "../utils/HttpClient";

class ActivityApi extends Api {
    static BabyEnter(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/babyEnter', request, data => {
            if (!data.state && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static SessionList(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/auditionList', request, data => {
            console.log(data)
            if (!data.total && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static SuccessMessage(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/enrollSuccess', request, data => {
            if (!data.babyInfo && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static PassMessage(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/successfulGet', request, data => {
            console.log(data)
            if (!data.babyInfo && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static AuditionsMessage(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/unsuccessfulGet', request, data => {
            if (!data.babyAuditionId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static changeBaby(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/babyEnroll', request, data => {
            if (!data.uuid && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static BabyConform(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/babyConforming', request, data => {
            if (!data.babyInfos && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static BabyResult(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/redisGet', request, data => {
            if (!data && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static BabySuccessfulConfirm(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/unsuccessfulConfirm', request, data => {
            if (!data.babyAuditionId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    // 以下为新接口
    static queryActivityCategory(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/queryActivityCategory', request, data => {
            if (!data.activityInfoList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static queryCommend(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/queryCommend', request, data => {
            console.log(data)
            if (!data.url && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static beforeSign(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/beforeSign', request, data => {
            console.log(data)
            if (!data.type && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
}

const ROUTE_PREFIX = '/baby-service';


const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default ActivityApi;