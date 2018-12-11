import Api from "./Api";
import HttpClient from "../utils/HttpClient";

class OrderApi extends Api {
    static create(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/orderCreateTwo', request, data => {
            if (!data.uuid && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    // 轮询接口,查看订单是否成功
    static orderStatus(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/orderRedisGet', request, data => {
            if (data.state === 500 && onFail) {
                onFail(data.message);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static list(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/orderList', request, data => {
            if (!data.orderList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static userInfo(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/userInfo', request, data => {
            if (!data.userId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static notCommentsList(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/notCommentsList', request, data => {
            if (!data.goodsList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static commentsList(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/commentsList', request, data => {
            if (!data.goodsList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static orderInfo(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/orderInfo', request, data => {
            if (!data.order && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static orderCancel(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/orderCancel', request, data => {
            if (!data.resultCount && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static orderExpressReceipt(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/orderExpressReceipt', request, data => {
            if (!data.resultCount && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static expressCompanyList(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/expressCompanyList', request, data => {
            if (!data.expressCompanyList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static afterSaleList(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/afterSaleList', request, data => {
            if (!data.goodsSkuList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static afterSaleRecordList(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/afterSaleRecordList', request, data => {
            if (!data.goodsSkuList && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static afterSaleInfo(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/afterSaleInfo', request, data => {
            if (!data.afterSaleId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static afterSaleCreate(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/afterSaleCreate', request, data => {
            if (data.afterSaleId === undefined && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static returnExpressCompany(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/returnExpressCompany', request, data => {
            if (data.afterSaleId === undefined && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static afterSaleClose(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/closed', request, data => {
            if (!data.resultCount && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static orderGet(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndOrder/orderGet', request, data => {
            if (!data.state && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
}

const ROUTE_PREFIX = '/shop';

const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default OrderApi;