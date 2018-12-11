import './GoodsListView.css'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Group from '../../page/Activity/SaleActivity/img/Group@3x.png'
import AddPrice from '../../page/Activity/SaleActivity/img/AddPrice@2x.png'
import complimentary from '../../page/Activity/SaleActivity/img/complimentaryIcon.png'
import vipIcon from '../../page/Activity/SaleActivity/img/vipIcon.png'
import LimitBuy from './labal4_xianshigou@2x.png'
import LazyLoadImg from '../LazyLoadImg/LazyLoadImg'
class GoodsListView extends Component {

    isTimeLimit(typeList, g) {
        if (!typeList) return false;
        let bol = typeList.indexOf(4) !== -1;
        return bol
    }
    render() {
        let { title, goodsList, routePrefix, style } = this.props;
        const flagImg = {
            1: Group, //满赠
            2: AddPrice, // 加价购
            4: LimitBuy,  // 限时购
            5: complimentary  //赠品
        };
        const flagStyle = {
            2: { width: '.82rem' },
            4: { width: '.82rem' },
            5: { width: '.82rem' }
        };

        return (
            <div className="GoodsListView" style={style}>
                {(title && goodsList.length > 0) &&
                    <h4>{title}</h4>
                }
                <ul>
                    {goodsList.map((g, i) => {
                        let price = (g.price || g.priceForSale) ? (g.price || g.priceForSale) : 0
                        return (<li key={'goods' + (g.id || g.goodsId)} className="fl">
                            <Link onClick={() => window.MtaH5.clickStat('click_goods', { 'name': g.name })} to={routePrefix + '/goods/details/' + (g.id || g.goodsId)} >

                                <LazyLoadImg
                                    className="pic"
                                    src={g.pic || g.pictureUrl}

                                />
                            </Link>

                            <Link onClick={() => window.MtaH5.clickStat('click_goods', { 'name': g.name })} to={routePrefix + '/goods/details/' + (g.id || g.goodsId)}>
                                <p className='two-txt'>{g.name}</p>
                                <div className="info">
                                    {/*会员价格*/}
                                    {/*<div className="vipPrice clearfix">*/}
                                        {/*/!*{this.isTimeLimit(g.goodsType, g) ?*!/*/}
                                            {/*/!*<span className='color-main fl'>*!/*/}
                                                {/*/!*<em>&yen;</em>{g.timeLimitPrice.toFixed(2)}*!/*/}
                                                    {/*/!*<span className="color-999"> &yen;</span>*!/*/}
                                                {/*/!*<span className="color-999" style={{ textDecoration: 'line-through' }}>{price.toFixed(2)}</span>*!/*/}
                                            {/*/!*</span> :*!/*/}
                                            {/*/!**!/*/}
                                        {/*/!*}*!/*/}
                                        {/*<span className='vipColor-main fl'>*/}
                                            {/*<em>&yen;</em>{price.toFixed(2)}*/}
                                            {/*<span className="vipLabel"><img src={vipIcon} alt=""/></span>*/}
                                        {/*</span>*/}
                                    {/*</div>*/}
                                    <div className="price clearfix">
                                        {this.isTimeLimit(g.goodsType, g) ? <span className='color-main fl'>
                                            <em>&yen;</em>{g.timeLimitPrice.toFixed(2)}
                                            <span className="color-999" style={{ fontSize:'.24rem' }}> &yen;</span>
                                            <span className="color-999" style={{ textDecoration: 'line-through',fontSize:'.24rem' }}>{price.toFixed(2)}</span>
                                        </span> :
                                            <span className='color-main fl'>
                                                <em>&yen;</em>{price.toFixed(2)}
                                            </span>
                                        }
                                        <span className='fr color-999 f20'>已售{g.sales}</span>
                                    </div>
                                    {
                                        g.goodsType && g.goodsType.length > 0 &&
                                        <div className="mt18">
                                            {
                                                // 促销活动类型：1.满赠；2.换购；3.满减；4.限时购；5.赠品
                                                g.goodsType.map(s => {
                                                    return <img
                                                        src={flagImg[s]}
                                                        style={flagStyle[s]}
                                                        key={s}
                                                        alt=""
                                                        className="activity-img inline-block-middle mr20" />
                                                })
                                            }
                                        </div>
                                    }

                                </div>
                            </Link>
                        </li>)
                    }
                    )}
                </ul>
            </div>
        );
    }
}

GoodsListView.propTypes = {
    title: PropTypes.string,
    goodsList: PropTypes.array.isRequired,
    routePrefix: PropTypes.string.isRequired
};

export default GoodsListView;