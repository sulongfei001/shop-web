import Api from "./Api";
import HttpClient from "../utils/HttpClient";

class FollowApi extends Api {
    static goodsFollow(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/favourite/goodsFollow', request, data => {
            if (data.resultCount === undefined && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static goodsUnfollow(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/favourite/goodsUnfollow', request, data => {
            if (data.resultCount === undefined && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static favouriteList(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/favourite/favouriteList', request, data => {
            if (data.goodsSkuList === undefined && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
}

const ROUTE_PREFIX = '/shop';

const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default FollowApi;