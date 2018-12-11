class Arrays {
    static flatten(list) {
        return list.reduce((a, b) => a.concat(Array.isArray(b) ? this.flatten(b) : b));
    }

    static equal(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    static contains(array, item) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === item) return true;
        }
        return false;
    }
}

export default Arrays;