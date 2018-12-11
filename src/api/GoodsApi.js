import Api from "./Api";
import HttpClient from "../utils/HttpClient";

class GoodsApi extends Api {
    static main(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndGoods/main', request, data => {
            if (!data.goodsInfo && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static frontEndGoodsList(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndGoods/frontEndGoodsList', request, data => {
            if (!data.goodsList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static goodsList(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndGoods/goodsList', request, data => {
            if (!data.goodsList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static goodsGet(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndGoods/goodsGet', request, data => {
            if (!data.goods && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static categoryList(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndGoods/categoryList', request, data => {
            if (!data.categoryList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static orderConfirmData(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndGoods/orderConfirmData', request, data => {
            if (!data.goodsSkuList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static goodsCart(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndGoods/goodsCart', request, data => {
            if (!data.goodsSkuList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static orderPayment(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndGoods/orderPayment', request, data => {
            if (!data.appId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) {
                data.package = data.packageExtended;
                data.timeStamp = data.timestamp;
                data.timestamp = undefined;
                data.packageExtended = undefined;
                onSuccess(data);
            }
        }, onFail);
    }

    static commentsList(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndGoods/commentsList', request, data => {
            if (!data.commentsList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static goodsDiscount(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndGoods/goodsDiscount', request, data => {
            if (data.discountPrice === undefined && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
}

const ROUTE_PREFIX = '/shop';

const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default GoodsApi;