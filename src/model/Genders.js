class Genders {
    static get(gender) {
        return genderMap.get(gender);
    }

    static getKeyValues() {
        let ret = [];
        genderMap.forEach((value, key) => {
            ret.push({
                key: key,
                value: value
            });
        });
        return ret;
    }
}

const genderMap = new Map();
genderMap.set(0, '未设置');
genderMap.set(1, '男');
genderMap.set(2, '女');

export default Genders;