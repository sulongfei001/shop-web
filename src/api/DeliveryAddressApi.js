import Api from "./Api";
import HttpClient from "../utils/HttpClient";

class DeliveryAddressApi extends Api {
    static list(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/deliveryAddress/list', request, data => {
            if (!data.deliveryAddressList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static get(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/deliveryAddress/get', request, data => {
            if (!data.deliveryAddressId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static update(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/deliveryAddress/update', request, data => {
            if (!data.deliveryAddressId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static create(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/deliveryAddress/create', request, data => {
            if (!data.deliveryAddressId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static delete(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/deliveryAddress/delete', request, data => {
            if (!data.resultCount && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
}

const ROUTE_PREFIX = '/shop';

const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default DeliveryAddressApi;