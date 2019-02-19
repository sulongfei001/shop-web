import Api from "./Api";
import HttpClient from "../utils/HttpClient";

class VerificationApi extends Api {
    static main(request, onSuccess, onFail) {
        HttpClient.post(ROUTE_PREFIX + '/cartBag/cartBagList', request, data => {
            onSuccess && onSuccess(data);
        }, onFail);
    }
}

const ROUTE_PREFIX = '/shop';

const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default VerificationApi;