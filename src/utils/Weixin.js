import UserContext from "../model/UserContext";
import GoodsApi from "../api/GoodsApi";
import WxjsApi from "../api/WxjsApi";
import Screen from "./Screen";

class Weixin {
    static goToOAuthPage() {
        // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx104ea41938a385d2&redirect_uri=https%3a%2f%2fshop.yiyayiyawao.com%2fwxoauth%2fcode&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect';
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx104ea41938a385d2&redirect_uri=https%3a%2f%2fshop.yiyayiyawao.com%2fwxoauth%2fcode&response_type=code&scope=snsapi_userinfo&state=dev#wechat_redirect';
    }

    static goToPay({ orderNo, onSuccess, onFail }) {
        let userContext = UserContext.get();
        onSuccess()
        if (window.WeixinJSBridge) {
            GoodsApi.orderPayment({
                accessToken: userContext.userToken,
                spBillCreateIp: '127.0.0.1',
                openId: userContext.weixinOpenId,
                orderNo: orderNo
            }, data => Weixin.pay(data, onSuccess, onFail), onFail);
        } else if (window.Bestnihon) {
            Weixin.onSuccess = onSuccess;
            Weixin.onFail = onFail;
            window.Bestnihon.shopPayWeixin(orderNo);
        }
    }

    static registerAppCallback() {
        if (window.Bestnihon && !window.shopWeixinPayFinish) {
            window.shopWeixinPayFinish = (orderNo, status) => {
                if (status === 1) {
                    Weixin.onSuccess();
                } else {
                    Weixin.onFail();
                }
            };
        }
    }

    static unregisterAppCallback() {
        window.shopWeixinPayFinish = undefined;
    }

    static pay(request, onSuccess, onFail) {
        if (window.WeixinJSBridge) {
            window.WeixinJSBridge.invoke(
                'getBrandWCPayRequest', request,
                function (res) {
                    if (res.err_msg === "get_brand_wcpay_request:ok") {
                        onSuccess && onSuccess();
                    } else {
                        onFail && onFail();
                    }
                }
            );
        } else {
            onFail && onFail();
        }
    }

    /**
     * 预览图片
     * @param current 当前显示图片的http链接
     * @param urls 需要预览的图片http链接列表
     */
    static previewImage(current, urls) {
        if (window.wx) {
            window.wx.previewImage({
                current: current,
                urls: urls,
            });
        }
    }

    /**
     * 初始化JS-SDK
     */
    static initJsSdk() {
        WxjsApi.getJsSdkConfig({
            url: window.location.href.split('#')[0]
        }, data => window.wx.config({
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'previewImage'],
        }), error => Screen.alert(window.location.href.split('#')[0]+'  '+error));
    }

    /**
     * 设置分享
     * @param title 分享标题
     * @param desc 分享描述
     * @param link 分享链接
     * @param imgUrl 分享图标
     * @param type 分享类型,music、video或link，不填默认为link
     * @param dataUrl 如果type是music或video，则要提供数据链接，默认为空
     * @param success 用户确认分享后执行的回调函数
     * @param cancel 用户取消分享后执行的回调函数
     */
    static share({ title, desc, link, imgUrl, type = 'link', dataUrl = '', success, cancel }) {
        window.wx.onMenuShareTimeline({
            title: title,
            link: link,
            imgUrl: imgUrl,
            success: success,
            cancel: cancel,
        });
        window.wx.onMenuShareAppMessage({
            title: title,
            desc: desc,
            link: link,
            imgUrl: imgUrl,
            type: type,
            dataUrl: dataUrl,
            success: success,
            cancel: cancel,
        });
        window.wx.onMenuShareQQ({
            title: title,
            desc: desc,
            link: link,
            imgUrl: imgUrl,
            success: success,
            cancel: cancel,
        });
        window.wx.onMenuShareWeibo({
            title: title,
            desc: desc,
            link: link,
            imgUrl: imgUrl,
            success: success,
            cancel: cancel,
        });
        window.wx.onMenuShareQZone({
            title: title,
            desc: desc,
            link: link,
            imgUrl: imgUrl,
            success: success,
            cancel: cancel,
        });
    }
}

export default Weixin;