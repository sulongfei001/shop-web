import HttpClient from "../utils/HttpClient";
import Api from "./Api";

class FileApi extends Api{
    static getObjectPolicy(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/file/getObjectPolicy', request, data => {
            if (!data.accessId && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }
}

const ROUTE_PREFIX = '/common';

const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default FileApi;