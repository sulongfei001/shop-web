import Weixin from "./Weixin";

class Redirect {
    static go(history, url, replace) {
        if (url.indexOf("image-dev.best-nihon.com") > 0) {
            let images = [];
            images.push(url);
            Weixin.previewImage(url, images);
        } else if (url.indexOf('http') === 0) {
            window.location.href = url;
        } else {
            if (replace === true) {
                history.replace(url);
            } else {
                history.push(url);
            }
        }
    }
}

export default Redirect;