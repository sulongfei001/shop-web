/**
 * 分享
 */
import Weixin from "./Weixin";

class Share {

    /**
     * 准备调起分享
     * @param enabled 是否启用（1：启用，0：不启用）
     * @param title 标题
     * @param content 内容
     * @param url URL地址
     * @param logo LOGO图片地址
     */
    static prepare({ enabled, title, content, url, logo }) {
        if (window.Bestnihon) {
            window.Bestnihon.share(enabled, title, content, url, logo);
        } else if (window.wx) {
            Weixin.share({
                title: title,
                desc: content,
                link: url,
                imgUrl: logo,
            });
        }
    }
}

export default Share;