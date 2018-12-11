import Api from "./Api";
import HttpClient from "../utils/HttpClient";

class CommentsApi extends Api {
    static create(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/comments/create', request, data => {
            if (!data.commentsId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

    static get(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/comments/get', request, data => {
            if (!data.commentsId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
}

const ROUTE_PREFIX = '/shop';

const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default CommentsApi;