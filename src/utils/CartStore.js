class CartStore {
    static addSku(skuId, buyNumber, activityId, goodsId) {
        console.log(skuId, buyNumber, activityId, goodsId)
        let skuList = CartStore.getSkuList();
        let found = false;
        for (let i = 0; i < skuList.length; i++) {
            if (skuList[i].skuId === skuId) {
                skuList[i].buyNumber += buyNumber;
                activityId && (skuList[i].activityId = activityId)
                skuList[i].sel = true
                found = true;
                break;
            }
        }
        if (found) {
            setSku(skuList);
        } else {
            let obj = {
                skuId: skuId,
                buyNumber: buyNumber,
                goodsId: goodsId,
                sel: true
            }
            activityId && (obj.activityId = activityId)
            skuList.push(obj);
            setSku(skuList);
        }
    }
    /**
     * 
     * 
     * @static          添加属性
     * @param {any} key     需要检查的key
     * @param {any} value   key值
     * @param {any} attr    添加的属性名
     * @param {any} des     属性值
     * @memberof CartStore
     */
    static addAttr(key, value, attr, des) {
        console.log(key,value, attr,des)
        let skuList = CartStore.getSkuList()
        for (let i = 0, len = skuList.length; i < len; i++) {
            if (skuList[i][key] === value) {
                skuList[i][attr] = des
            }
        }
        setSku(skuList)
    }

    static getSkuList() {
        let skuListString = localStorage.getItem(LOCAL_STORAGE_KEY);
        return skuListString ? JSON.parse(skuListString) : [];
    }

    static updateSku(skuId, buyNumber,goodsId) {
        let skuList = CartStore.getSkuList();
        let found = false;
        for (let i = 0; i < skuList.length; i++) {
            if (skuList[i].skuId === skuId) {
                skuList[i].buyNumber = buyNumber;
                skuList[i].goodsId = goodsId;
                found = true;
                break;
            }
        }
        if (found) {
            setSku(skuList);
        } else {
            CartStore.addSku(skuId, buyNumber,null,goodsId);
        }
    }

    static removeSku(skuId, attr) {
        let skuList = CartStore.getSkuList();
        if (attr) {
            skuList.forEach(item => {
                skuId.forEach(i => {
                    if (item.skuId === i) {
                        delete item[attr]
                    }
                })

            })
        } else {
            skuList = skuList.filter(sku => sku.skuId !== skuId);
        }
        setSku(skuList);
    }
}

const setSku = skuList => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(skuList));

const LOCAL_STORAGE_KEY = 'skuList';

export default CartStore;