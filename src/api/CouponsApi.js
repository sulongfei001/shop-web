import Api from './Api';
import HttpClient from '../utils/HttpClient';

class CouponsApi extends Api {
    // 获取商品关联的优惠券 (完成)
    static goodsCouponList(request, onSuccess, onFail) {
        HttpClient.post(
            ROUTE_PREFIX + '/frontEndCoupon/couponList',
            request,
            data => {
                if (!data && onFail) {
                    onFail(SYSTEM_ERROR);
                } else if (onSuccess) onSuccess(data);
            },
            onFail,
        );
    }

    // 使用优惠券列表(可用/不可用) (完成)
    static enableCouponList(request, onSuccess, onFail) {
        HttpClient.post(
            ROUTE_PREFIX + '/frontEndCoupon/clipCoupons',
            request,
            data => {
                if (!data && onFail) {
                    onFail(SYSTEM_ERROR);
                } else if (onSuccess) onSuccess(data);
            },
            onFail,
        );
    }

    // 去使用优惠券的商品列表
    static couponGoodsList(request, onSuccess, onFail) {
        HttpClient.post(
            ROUTE_PREFIX + '/frontEndGoods/couponGoodsList',
            request,
            data => {
                if (!data && onFail) {
                    onFail(SYSTEM_ERROR);
                } else if (onSuccess) onSuccess(data);
            },
            onFail,
        );
    }

    // 领券中心
    static couponCenter(request, onSuccess, onFail) {
        HttpClient.post(
            ROUTE_PREFIX + '/frontEndCoupon/couponCenter',
            request,
            data => {
                if (!data && onFail) {
                    onFail(SYSTEM_ERROR);
                } else if (onSuccess) onSuccess(data);
            },
            onFail,
        );
    }

    // 我的优惠券
    static couponUser(request, onSuccess, onFail) {
        HttpClient.post(
            ROUTE_PREFIX + '/frontEndCoupon/couponUser',
            request,
            data => {
                if (!data && onFail) {
                    onFail(SYSTEM_ERROR);
                } else if (onSuccess) onSuccess(data);
            },
            onFail,
        );
    }

    // 兑换优惠券
    static exchangeCoupons(request, onSuccess, onFail) {
        HttpClient.post(
            ROUTE_PREFIX + '/frontEndCoupon/exchangeCoupons',
            request,
            data => {
                if (!data && onFail) {
                    onFail(SYSTEM_ERROR);
                } else if (onSuccess) onSuccess(data);
            },
            onFail,
        );
    }

    // 领取优惠券
    static couponReceive(request, onSuccess, onFail) {
        HttpClient.post(
            ROUTE_PREFIX + '/frontEndCoupon/couponReceive',
            request,
            data => {
                if (!data && onFail) {
                    onFail(SYSTEM_ERROR);
                } else if (onSuccess) onSuccess(data);
            },
            onFail,
        );
    }
}

const ROUTE_PREFIX = '/shop';

const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default CouponsApi;
