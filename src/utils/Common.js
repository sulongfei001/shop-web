import UserContext from "../model/UserContext";
import OrderApi from "../api/OrderApi"
import Screen from "../utils/Screen";
import Districts from "./Districts"
class Common {
    static data = {
        timerPollingNum: 0
    }
    /**
     * 转换时间戳
     *
     * @param {any} timestamp  时间戳 年月日
     * @returns 年+月+日
     */
    static timestampToTime(timestamp) {
        // var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let date = new Date(timestamp);
        let Y = date.getFullYear() + '.';
        let M =
            (date.getMonth() + 1 < 10
                ? '0' + (date.getMonth() + 1)
                : date.getMonth() + 1) + '.';
        let D = date.getDate() + '';
        // h = date.getHours() + ':';
        // m = date.getMinutes() + ':';
        // s = date.getSeconds();
        return Y + M + D;
    }
    /**
     * 百分比计算
     *
     * @static
     * @param {any} numerator 分子
     * @param {any} denominator 分母
     * @returns 百分比
     * @memberof Common
     */
    static percent(numerator, denominator) {
        let res = numerator / denominator * 100;
        return res + '%';
    }

    // 优惠券类型判断
    // 4&2是运费券
    // 1是满减
    // 3是现金
    static couponRoleType(type) {
        type = Number(type);
        const typeDes = {
            1: '满减券',
            2: '运费券',
            3: '现金券',
            4: '运费券'
        }
        return typeDes[type]
    }

    // 两个数组是否相等
    static isArrEquality(a, b) {
        let num = 0
        for (let i = 0, len = b.length; i < len; i++) {
            a.includes(b[i]) && (num += 1)
        }
        return num === b.length
    }

    // 今明后 判断
    static limitTime(time, now) {
        console.log('tiem', time, now)
        time = new Date(time)
        now = new Date(now)
        let retTxt
        let h = time.getHours()
        let m = time.getMinutes()
        h = h === 0 ? '00': h
        m = m === 0 ? '00': m
        let hm =  h+ ':' + m + '开抢'
        if (now.getFullYear() === time.getFullYear() && now.getMonth() === time.getMonth()) {
            let abs = Math.abs(time.getDate() - now.getDate())
            console.log('abs'+abs)
            switch (abs) {
                case 0:
                    retTxt = '今天' 
                    break
                case 1:
                    retTxt = '明天' 
                    break
                default:
                    retTxt = time.getMonth() + 1 + '月' + time.getDate() + '日'  
                    break
            }
        }
        return retTxt + hm
    }
    /**
     * 
     * 倒计时 return  01天01小时03分钟30秒
     * @static
     * @param {any} time 倒计时时间戳
     * @param {any} colon true: 冒号形式  20:30:00
     * @returns  01天01小时03分钟30秒 || 1:20:30:00
     * @memberof Common
     */
    static toHDMS(time, colon) {
        if (time <= 0) return false
        let dayMS = 86400000;
        let d = time / dayMS >= 1 ? parseInt(time / dayMS, 10) : 0;
        d = d && d <= 10 ? '0' + d : d;
        let realTime = (d ? time - d * dayMS : time) / 1000;
        let h = parseInt(realTime / 60.0 / 60.0, 10);
        let m = parseInt((realTime - h * 60.0 * 60.0) / 60.0, 10);
        let s = parseInt(realTime - h * 60.0 * 60.0 - m * 60.0, 10);
        h = h && h < 10 ? '0' + h : h;
        m = m && m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        let res = '';
        if (colon) {
            d && (res = res + d + ':')
            res = (h ? res + h : res + '00') + ':'
            res = (m ? res + m : res + '00') + ':'
            res = res + s
        } else {
            d && (res = res + d + '天');
            h && (res = res + h + '小时');
            m && (res = res + m + '分');
            res = res + s + '秒';
        }
        return res;
    }

    // 轮询支付接口
    static payPolling(request, callBack) {
        let { orderId, success, fail } = request
        let userContext = UserContext.get()
        let body = {
            accessToken: userContext.userToken,
            orderId
        }
        OrderApi.orderGet(body, data => {
            // state : 1 goon  2 通过  0提示状态异常
            let state = data.state
            let list = data.orderList
            let realList = []
            list && list.forEach(o => {
                realList.push({
                    id: o.orderId + '_' + o.orderExpressId,
                    orderId: o.orderId,
                    expressId: o.orderExpressId,
                    date: o.createDate,
                    state: o.orderState,
                    expressState: o.orderExpressState,
                    totalPrice: o.payPrice,
                    no: o.orderNo,
                    skuList: o.goodsList.map(g => {
                        return {
                            id: g.goodsSkuId,
                            logo: g.pictureUrl,
                            name: g.name,
                            propertyItems: g.propertyItems,
                            priceForSale: g.priceForSale,
                            goodsId: g.goodsId,
                            number: g.quantity
                        };
                    })
                });
            });
            if (!state || state === 0) {
                callBack && callBack()
                Screen.loading(false, () => { Screen.alert('订单异常') })
            } else if (state !== 1) {
                callBack && callBack()
                Screen.loading(false, () => {
                    success && success(realList)
                })
            }
        }, error => {
            callBack && callBack()
            Screen.loading(false, () => {
                fail && fail()
                Screen.alert(error)
            })
        })
    }

    // 轮询订单创建状态
    // "state": 200,  //状态（0：处理中，200：生成订单成功，500：生成订单失败）
    // "message": "生成订单成功!", //消息
    // "orderId": 990,  //订单id
    // "orderNo": "ZF20180606114353398"//订单编号
    static orderStatus(request, callBack) {
        let { uuid, success, fail } = request
        let userContext = UserContext.get();
        let body = {
            accessToken: userContext.userToken,
            uuid
        }
        OrderApi.orderStatus(body, data => {
            let { state } = data
            if (state === 200) {
                callBack && callBack()
                success && success(data)
            }
        }, err => {
            callBack && callBack()
            fail && fail(err)
        }
        )
    }

    /**
     * 轮询
     *
     * @static
     * @param {*} request 接口中 请求参数,成功,失败回调处理
     * @param {*} api  接口
     * @memberof Common
     */
    static timerPolling(request, api) {
        clearInterval(this.timer)
        // 需求: 1000ms 和 2000 ms 各请求一次,超过两次后  3000ms请求一次
        let second = {
            0: 1000,
            1: 2000,
            2: 3000
        }
        let callBack = () => {
            clearInterval(this.timer)
            this.data.timerPollingNum = 0
        }
        this.timer = setInterval(() => {
            this.data.timerPollingNum++
            // 接口请求
            api && api(request, callBack)
            if (this.data.timerPollingNum === 1) {
                this.timerPolling(request, api)
            } else if (this.data.timerPollingNum === 2) {
                this.timerPolling(request, api)
            }
        }, second[this.data.timerPollingNum < 2 ? this.data.timerPollingNum : 2])
    }

    static decimalLength(num1, num2) {
        var length1
        var length2
        try {
            length1 = num1.toString().split('.')[1].length
        } catch (e) {
            length1 = 0
        }
        try {
            length2 = num2.toString().split('.')[1].length
        } catch (e) {
            length2 = 0
        }
        return [length1, length2]
    }
    //除法
    static accDiv(num1, num2) {
        var result = this.decimalLength(num1, num2)
        var length1 = result[0]
        var length2 = result[1]
        var integer1 = +num1.toString().replace('.', '')
        var integer2 = +num2.toString().replace('.', '')

        // 默认保留小数点最长的个数
        return integer1 / integer2 * Math.pow(10, length2 - length1)
    }
    //乘法 
    static accMul(arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    }
    //加法  
    static accAdd(arg1, arg2) {
        var r1, r2, m;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2))
        return (this.accMul(arg1, m) + this.accMul(arg2, m)) / m
    }
    //减法  
    static addition(arg1, arg2) {
        var r1, r2, m, n;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;
        return ((this.accMul(arg1, m) - this.accMul(arg2, m)) / m).toFixed(n);
    }

    static checkAddress(districts) {
        let data = Districts.allData
        let itemData
        for (let i = 0, len = districts.length; i < len; i++) {
            let item = districts[i]
            itemData = itemData ? itemData[`${item.id}_${item.name}`] : data[`${item.id}_${item.name}`]
            if (JSON.stringify(itemData) === '{}') {
                return false
            }
            if (i === len - 1) {
                return true
            }
        }
    }
}




export default Common;
