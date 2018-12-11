class OrderStatus {
    static get(orderState, expressState) {
        if (orderState === 1) {
            return '待付款';
        } else if (orderState === 3) {
            return '已取消';
        } else if (orderState === 4) {
            return '已关闭';
        } else if (orderState === 5) {
            return "取消待退款"
        } else if (orderState === 6) {
            return "已退款"
        } else if (expressState === 2) {
            return '待发货';
        } else if (expressState === 3) {
            return '待收货';
        } else if (expressState === 4) {
            return '交易完成';
        } else if (expressState === 5) {
            return '交易完成';
        } else if (expressState === 6) {
            return "取消待退款"
        } else if (expressState === 7) {
            return "已退款"
        } else {
            return '';
        }
    }
}

export default OrderStatus;