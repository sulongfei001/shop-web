import Api from "./Api";
import HttpClient from "../utils/HttpClient";

class GlobalErrorApi extends Api {
    static submitError(request, onSuccess, onFail) {
        HttpClient.post('/logWebError', request, data => {
            if (data.logDate === undefined && onFail) {
                onFail(SYSTEM_ERROR);
            } else if (onSuccess) onSuccess(data);
        }, onFail);
    }

 
}

const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default GlobalErrorApi;