class Storage {
    static replace(key, data) {
        this.store[key] = data;
    }

    static set(key, data) {
        data.expires = new Date(Date.now() + 300000);
        this.store[key] = Object.assign({}, Storage.store[key], data);
    }

    static get(key) {
        let data = this.store[key];
        if (data && data.expires < new Date()) {
            this.replace(key, undefined);
        }
        return this.store[key];
    }
}

Storage.store = {};

export default Storage;