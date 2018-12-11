class AfterSaleStatus {
    static getStatusMap() {
        return statusMap;
    }
}

const statusMap = new Map();
statusMap.set(1, '商家审核中');
statusMap.set(2, '已审核，待用户寄回');
statusMap.set(3, '审核不通过');
statusMap.set(4, '商家待收货');
statusMap.set(5, '商家已收货');
statusMap.set(6, '商家拒收');
statusMap.set(7, '售后处理中');
statusMap.set(8, '商品不存在问题，待寄回');
statusMap.set(9, '商家商品已寄回');
statusMap.set(10, '已退款');
statusMap.set(11, '商家换货中');
statusMap.set(12, '换货商品已寄出');
statusMap.set(13, '售后完成');
statusMap.set(14, '已关闭');

export default AfterSaleStatus;