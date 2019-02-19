class Cookies {
    static get(name) {
        return parseCookie()[name];
    }

    static set(name, value) {
        document.cookie = name + '=' + value + ';path=/';
    }

    static getAll() {
        return parseCookie();
    }

    static del(name) {
        document.cookie = name + '=;path=/;expires=' + new Date(Date.now() - 1).toUTCString();
    }
}

const parseCookie = () => {
    let cookie = {};
    let cookieString = document.cookie;
    if (cookieString && cookieString.length > 0) {
        cookieString.split(';').forEach(item => {
            let data = item.split('=');
            if (data.length === 2) cookie[data[0].trim()] = data[1].trim();
        });
    }
    return cookie;
};

export default Cookies;