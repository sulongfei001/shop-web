import Api from "./Api";
import HttpClient from "../utils/HttpClient";

class ActivityApi extends Api {
    // 获取商品关联的促销活动列表 商品详情中促销活动展示字段
    static rule(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndGifts/giftsListByGoodsId', request, data => {
            if (!data && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
    static list(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/frontEndGifts/goodsListByGiftsId', request, data => {
            if (!data && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
}

const ROUTE_PREFIX = '/shop';

const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default ActivityApi;