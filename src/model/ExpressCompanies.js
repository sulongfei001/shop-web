class ExpressCompanies {
    static get(companyId) {
        return companyMap.get(companyId);
    }

    static getKeyValues() {
        let ret = [];
        companyMap.forEach((value, key) => {
            ret.push({
                key: key,
                value: value
            });
        });
        return ret;
    }
}

const companyMap = new Map();
companyMap.set(1, "顺丰");
companyMap.set(2, "申通");
companyMap.set(3, "圆通");
companyMap.set(4, "韵达");
companyMap.set(5, "中通");
companyMap.set(6, "德邦");
companyMap.set(7, "EMS");
companyMap.set(8, "天天");
companyMap.set(9, "百世汇通");
companyMap.set(10, "优速");

export default ExpressCompanies;