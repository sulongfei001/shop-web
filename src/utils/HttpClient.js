
import ClientID from './ClientID'

class HttpClient {
    static post(url, data, onSuccess, onFail) {
        data.clientIdentifier = ClientID.isViable()
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        }).then(data => {
            if (HttpClient.isError(data) && onFail) {
                onFail(data.message);
            } else if (onSuccess) {
                onSuccess(data);
            }
        }).catch(error => {
            window.onerror(error.message, error.source, error.lineno, error.colno,error) 
            onFail && onFail(SYSTEM_ERROR);
        });
    }

    static isError(data) {
        let isError = data.code || data.status === 500;
        // console.log(data);
        return isError;
    }
}

const SYSTEM_ERROR = '系统发生异常，请稍后重试';

export default HttpClient;