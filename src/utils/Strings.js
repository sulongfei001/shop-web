class Strings {
    static defaultIfEmpty(str, defaultValue) {
        if (str === undefined || str === null || str === "undefined" || str === "null" || str.length === 0) {
            str = defaultValue;
        }
        return str;
    }
}

export default Strings;