import React, { Component } from 'react'
import MessageBottom from '../../ui/MessageBottom/MessageBottom'
import CartStore from '../../utils/CartStore'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import Fade from '../Fade/Fade'
import Alert from '../Alert/Alert'

import './sku.css'
class Sku extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        let properties = props.goodsProperties.map(p => {
            return {
                name: p.displayName,
                items: p.propertyItems.map(i => {
                    let item = {
                        id: i.propertyItemId,
                        name: i.itemValue
                    };
                    let mainItems = props.goodsMainProperties.filter(g => g.propertyItemId === item.id);
                    if (mainItems.length > 0) {
                        item.logo = mainItems[0].picture;
                        item.pictures = mainItems[0].pictureList;
                        item.originalPictures = mainItems[0].originalPictureList;
                    }
                    return item;
                })
            };
        })
        let skuList = props.goodsSkus.map(s => {
            return {
                goodsId: props.goodsId,
                id: s.goodsSkuId,
                itemIds: [s.propertyItemId1, s.propertyItemId2, s.propertyItemId3, s.propertyItemId4].filter(i => i > 0),
                price: s.price,
                salePrice: s.priceForSale,
                maxBuy: s.maxNumber,
                stock: s.stock,
                timeLimit: s.timeLimit
                // timeLimit: {
                //     buyPrice: 10,//限购价格
                //     maxNumber: 2,//最大数量
                //     buyNumber: 2,//可购买数量
                //     alreadyBuyNumber: 0,//已买数量
                //     stock: 99,//抢购库存
                //     timeLimitName: "秒杀1",//活动名称
                //     activeTimeStart: 1522740830000,//生效时间
                //     activeTimeEnd: 1527782400000,//过期时间
                //     beforeTime: 1522740820000,//提前展示时间
                //     status: 3  //状态  2.预告中;3.进行中
                // }
            };
        })
        this.skuSelected = this.skuSelected.bind(this)
        this.selectItem = this.selectItem.bind(this)
        this.decreaseBuyNumber = this.decreaseBuyNumber.bind(this)
        this.increaseBuyNumber = this.increaseBuyNumber.bind(this)
        this.state = {
            properties,
            skuList,
            selectedItems: properties.map(() => {
                return undefined
            }),
            mainItemId: properties[0].items[0].id,
            buyNumber: 1,
            confirmText: props.confirmText
        }
    }

    componentWillMount() {
        this.defaultSel()
    }

    decreaseBuyNumber() {
        let { buyNumber } = this.state;
        if (this.isMinusBuyNumberEnabled()) {
            buyNumber--;
            this.setState({
                buyNumber: buyNumber
            });
        }
    }

    increaseBuyNumber() {
        let { buyNumber } = this.state;
        if (this.isPlusBuyNumberEnabled()) {
            buyNumber++;
            this.setState({
                buyNumber: buyNumber
            });
        }
    }

    getSelectedPropertyItems() {
        let { selectedItems } = this.state;
        return selectedItems ? selectedItems.filter(s => s !== undefined) : [];
    }
    isMinusBuyNumberEnabled() {
        let { selectedSku, buyNumber } = this.state;
        return selectedSku && buyNumber > 1;
    }

    isPlusBuyNumberEnabled() {
        let { selectedSku, buyNumber } = this.state;
        if (selectedSku) {
            let timeLimit = selectedSku.timeLimit
            return timeLimit ? buyNumber < timeLimit.buyNumber : buyNumber < Math.min(selectedSku.stock, selectedSku.maxBuy)
        }
        return false
    }

    getStock(pIndex, item) {

        let { skuList, selectedItems } = this.state
        let filteredSkuList = skuList.filter(sku => sku.itemIds.indexOf(item.id) > -1 &&
            (selectedItems.filter(sItem => sItem !== undefined).length === 0 ||
                selectedItems.map((sItem, sIndex) => pIndex === sIndex || sItem === undefined || sku.itemIds.indexOf(sItem.id) > -1).reduce((a, b) => a && b)));
        return filteredSkuList.length > 0 ? filteredSkuList.map(sku => sku.timeLimit ? sku.timeLimit.stock : sku.stock).reduce((a, b) => a + b) : 0;
    }
    // 检测是否能够再次购买
    isBuyAgain() {
        let { limitBuyNumber, limitBuyTotal } = this.state
        //   限购数量      限购数量 - 可购买数量 = 已购买数量   相等则不可购买 返回false    不相等则可购买 返回true
        return (limitBuyTotal === limitBuyTotal - limitBuyNumber) ? false : true
    }

    // 默认选中最便宜的
    defaultSel() {
        let { properties, skuList, selectedSku } = this.state
        if (selectedSku) return console.warn('已有数据,不在执行')
        let defaultSel = skuList.sort((a, b) => {
            let aPrice = a.timeLimit ? a.timeLimit.buyPrice : a.salePrice
            let bPrice = b.timeLimit ? b.timeLimit.buyPrice : b.salePrice
            return aPrice - bPrice
        })
        let itemIds
        for (let i = 0, len = defaultSel.length; i < len; i++) {
            let item = defaultSel[i]
            let timeLimit = item.timeLimit
            if (timeLimit) {
                if (timeLimit.stock > 0 && timeLimit.buyNumber > 0) {
                    itemIds = item.itemIds
                    break
                }
            } else {
                if (item.stock >= 1 && item.maxBuy >= 1) {
                    itemIds = item.itemIds
                    break
                }
            }
        }
        // 修复无itemids 情况下的bug 即暂无商品
        itemIds && itemIds.forEach(i => {
            properties.forEach((p, pIndex) => {
                p.items.forEach(sku => {
                    if (sku.id === i) {
                        this.selectItem(pIndex, sku)
                    }
                })
            })
        })
    }

    selectItem(propertyIndex, item) {
        let { selectedItems, selectedSku, skuList, properties, mainItemId, buyNumber, limitBuyTotal, limitBuyNumber } = this.state
        if (selectedItems[propertyIndex] !== undefined && selectedItems[propertyIndex].id === item.id) {
            selectedItems[propertyIndex] = undefined;
            if (propertyIndex === 0) mainItemId = properties[0].items[0].id;
        } else {
            selectedItems[propertyIndex] = item;
            if (propertyIndex === 0) mainItemId = item.id;
        }
        if (selectedItems.filter(sItem => sItem === undefined).length === 0) {
            let selectedIdString = selectedItems.map(sItem => sItem.id).reduce((a, b) => a + ',' + b);
            selectedSku = skuList.filter(sku => sku.itemIds.reduce((a, b) => a + ',' + b) === selectedIdString)[0]
            let timeLimit = (selectedSku && selectedSku.timeLimit) ? selectedSku.timeLimit : null
            limitBuyTotal = (timeLimit && timeLimit.status === 3) ? timeLimit.maxNumber : null
            limitBuyNumber = (timeLimit && timeLimit.status === 3) ? timeLimit.buyNumber : null
            // 增加限时购 逻辑变更
            let maxBuy = Math.min(selectedSku.maxBuy, limitBuyNumber ? limitBuyNumber : selectedSku.stock)
            if (buyNumber > maxBuy) buyNumber = maxBuy
        } else {
            selectedSku = undefined
            buyNumber = 1
        }
        console.log('最终选择===>', selectedSku, limitBuyNumber, limitBuyTotal)
        this.setState({
            limitBuyTotal: selectedSku ? limitBuyTotal : null,
            limitBuyNumber: selectedSku ? limitBuyNumber : null,
            selectedItems,
            selectedSku,
            mainItemId,
            buyNumber
        })
    }
    skuSelected() {
        let undefinedIndexes = []
        let { match, onSel } = this.props
        let { selectedItems, properties, confirmText, selectedSku, buyNumber } = this.state
        for (let i = 0; i < selectedItems.length; i++) {
            if (selectedItems[i] === undefined) undefinedIndexes.push(i)
        }
        if (undefinedIndexes.length > 0) {
            this.setState({
                alertMessage: '请选择' + undefinedIndexes.map(i => properties[i].name).reduce((a, b) => a + '、' + b)
            })
        } else {
            if (confirmText === ADD_TO_CART) {
                console.log('我选择的商品', selectedSku)
                if (onSel) {
                    return onSel(selectedSku,buyNumber)
                }
                // 当存在限购时 直接更新商品数量
                if (selectedSku.timeLimit) {
                    let skuList = CartStore.getSkuList()
                    let goods = skuList.filter(i => i.skuId === selectedSku.id)
                    if (goods.length > 0) {
                        let storageNum = goods[0].buyNumber
                        let limitNum = selectedSku.timeLimit.buyNumber
                        let nowNum = storageNum + buyNumber
                        buyNumber = nowNum > limitNum ? limitNum : nowNum
                    }
                    CartStore.updateSku(selectedSku.id, buyNumber, selectedSku.goodsId)
                } else {
                    CartStore.addSku(selectedSku.id, buyNumber, null, selectedSku.goodsId)
                }
                this.setState({
                    alertMessage: '已加入购物车',
                    buyNumber: 1
                })
            } else {
                this.props.history.push(match.url + '/order/confirm/' + encodeURIComponent(JSON.stringify({
                    requestSkuList: [
                        {
                            id: selectedSku.id,
                            number: buyNumber
                        }
                    ]
                })))
            }
        }
    }



    render() {
        let { properties, skuList, limitBuyNumber, limitBuyTotal, buyNumber, selectedSku, selectedItems, confirmText, alertMessage } = this.state
        const { onClose } = this.props
        // 默认选择第一属性
        let mainProperty = properties ? properties[0] : undefined

        let minPrice
        let maxPrice
        let minSalePrice
        let maxSalePrice
        // let totalStock = 0
        if (skuList) {
            for (let i = 0; i < skuList.length; i++) {
                let sku = skuList[i]
                minPrice = minPrice ? Math.min(sku.price, minPrice) : sku.price
                maxPrice = maxPrice ? Math.max(sku.price, maxPrice) : sku.price
                minSalePrice = minSalePrice ? Math.min(sku.salePrice, minSalePrice) : sku.salePrice
                maxSalePrice = maxSalePrice ? Math.max(sku.salePrice, maxSalePrice) : sku.salePrice
                // totalStock += sku.stock
            }
        }

        let selectedPropertyItems = this.getSelectedPropertyItems()

        // 当用户没有选择商品时 默认选择第一个 skulogo
        let skuLogo = mainProperty ? mainProperty.items[0].logo : undefined
        // 用户选择商品, skulogo 更改
        if (selectedItems && selectedItems[0] !== undefined) {
            skuLogo = mainProperty.items.filter(item => item.id === selectedItems[0].id)[0].logo
        }
        let minusBuyEnabled = this.isMinusBuyNumberEnabled()
        let plusBuyEnabled = this.isPlusBuyNumberEnabled()
        let isBuyAgain = this.isBuyAgain()
        return <MessageBottom confirmText={isBuyAgain ? confirmText : LIMIT_BUY}
            confirmStyle={isBuyAgain ? {} : { backgroundColor: '#888' }}
            onClose={() => onClose()}
            onConfirm={isBuyAgain ? this.skuSelected : () => { }}>
            <div className="sku-select">
                <div className="clearfix">
                    <div className="pic fl" style={{ backgroundImage: 'url(' + skuLogo + ')' }} />
                    <div className="fl sku-selected-info">
                        <p
                            className="price">&yen;{selectedSku ? (selectedSku.timeLimit ? selectedSku.timeLimit.buyPrice : selectedSku.salePrice.toFixed(2)) : minSalePrice.toFixed(2)}
                            {
                                (typeof limitBuyTotal === 'number') && limitBuyTotal >= 0 && <span className='sku-limit-buy' />
                            }

                        </p>
                        <p className="chosen">
                            {selectedPropertyItems.length > 0 ? ('已选择：' + selectedPropertyItems
                                .map(item => item.name).reduce((a, b) => a + ' / ' + b)) : '未选择'}
                        </p>
                        {
                            (typeof limitBuyTotal === 'number') && limitBuyTotal >= 0 && <p className="color-main">
                                限购{limitBuyTotal}件(已购{limitBuyTotal - limitBuyNumber}件)
                        </p>
                        }
                    </div>
                </div>


                <div className="property-box">
                    {properties.map((p, pIndex) =>
                        <div key={pIndex} className="property-item">
                            <h6>{p.name}</h6>
                            {p.items.map(item => {
                                let stock = this.getStock(pIndex, item);
                                let classNames = [];
                                if (stock === 0) classNames.push('disabled');
                                if (selectedPropertyItems.filter(sItem => sItem.id === item.id).length > 0) classNames.push('selected');
                                return (
                                    <a key={item.id}
                                        className={classNames.length > 0 ? classNames.reduce((a, b) => a + ' ' + b) : ''}
                                        onClick={e => stock === 0 ? void (0) : this.selectItem(pIndex, item)}>
                                        {item.name}
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="buy-number">
                    <label>购买数量</label>
                    <div className="buy-func">
                        <a className={(minusBuyEnabled ? '' : 'disabled ') + 'minus'}
                            onClick={() => this.decreaseBuyNumber()}>-</a>
                        <a className={((minusBuyEnabled || plusBuyEnabled) ? '' : 'disabled ') + 'number'}><span>{buyNumber}</span></a>
                        <a className={(plusBuyEnabled ? '' : 'disabled ') + 'plus'}
                            onClick={() => this.increaseBuyNumber()}>+</a>
                    </div>
                </div>
            </div>
            <TransitionGroup>
                {alertMessage &&
                    <Fade>
                        <Alert message={alertMessage} onClose={() => this.setState({ alertMessage: undefined })} />
                    </Fade>
                }
            </TransitionGroup>
        </MessageBottom>


    }

}
const ADD_TO_CART = '加入购物车';
const LIMIT_BUY = '已到达购买限制'
export default Sku