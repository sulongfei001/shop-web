import Api from "./Api";
import HttpClient from "../utils/HttpClient";

class ActivityApi extends Api{
    static BabyEnter(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/babyEnter', request, data => {
            if (!data.state && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static SessionList(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/home/auditionList', request, data => {
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
            if (!data.UUID && onFail) {
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
            if (!data.state && onFail) {
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
}

const ROUTE_PREFIX = '/baby-service';


const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default ActivityApi;