import './Home.css';
import { Route, Link } from 'react-router-dom';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import SearchBar from '../../ui/SearchBar/SearchBar';
import Swipe from '../../ui/Swipe/Swipe';
import FixedBottom from '../../ui/FixedBottom/FixedBottom';
import CategoryBar from '../../ui/CategoryBar/CategoryBar'
import GoodsListView from "../../ui/GoodsListView/GoodsListView";
import TabBar from "../../ui/TabBar/TabBar";
import Fade from "../../ui/Fade/Fade";
import Screen from "../../utils/Screen";
import GoodsDetails from "../Goods/GoodsDetails";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import GoodsApi from "../../api/GoodsApi";
import Alert from "../../ui/Alert/Alert";
import Redirect from "../../utils/Redirect";
import GoodsList from "../Goods/GoodsList";
import Page from "../../ui/Page/Page";
import PageRoot from "../../ui/PageRoot/PageRoot";
import ScrollRestoration from "../../utils/ScrollRestoration";
import CouponsCenter from '../Coupons/CouponsCenter/CouponsCenter';
import LazyLoadImg from '../../ui/LazyLoadImg/LazyLoadImg';

class Home extends Page {
	constructor(props) {
		super(props);
		this.state = {
			url: props.match.url,
			loading: true,
			isFreeFreight: 1,
		};
		this.scroll = this.scroll.bind(this);
		this.loadingGoods = false;
		this.scrollRestoration = new ScrollRestoration(this);
	}

	componentDidMount() {
		this.scrollRestoration.registerOnScroll();
		window.addEventListener("scroll", this.scroll);
		this.loadingGoods = true;
		GoodsApi.main({}, data => {
			this.loadingGoods = false;
			this.setState({
				loading: false,
				banners: data.advertisementList.map(ad => {
					return {
						pic: ad.pictureUrl,
						url: ad.url
					};
				}),
				categories: data.categoryList.map(cat => {
					return {
						id: cat.categoryId,
						pic: cat.picture,
						name: cat.name
					};
				}),
				goodsList: data.goodsInfo.goodsList.map(g => {
					return {
						id: g.goodsId,
						pic: g.pictureUrl,
						name: g.name,
						price: g.priceForSale,
						sales: g.salesVolume,
						goodsType: g.giftsStatsList,
						timeLimitPrice: g.timeLimitPrice
					};
				}),
				notice: data.notice,
				homeItems: data.moduleAdvertisementList.map(m => {
					let homeItem = {
						type: m.type
					};
					if (m.type === 4) {
						homeItem.pic = m.advertisements[0].pictureUrl;
						homeItem.url = m.advertisements[0].url;
					} else if (m.type === 5) {
						homeItem.pic = m.advertisements[0].pictureUrl;
						homeItem.url = m.advertisements[0].url;
						homeItem.goodsList = m.goodsList.map(g => {
							return {
								goodsId: g.goodsId,
								name: g.name,
								price: g.priceForSale,
								pic: g.pictureUrl
							};
						});
					} else if (m.type === 6) {
						homeItem.pic1 = homeItem.pic = m.advertisements[0].pictureUrl;
						homeItem.url1 = m.advertisements[0].url;
						homeItem.pic2 = homeItem.pic = m.advertisements[1].pictureUrl;
						homeItem.url2 = m.advertisements[1].url;
						homeItem.pic3 = homeItem.pic = m.advertisements[2].pictureUrl;
						homeItem.url3 = m.advertisements[2].url;
					} else if (m.type === 7) {
						homeItem.pic = m.advertisements[0].pictureUrl;
						homeItem.url = m.advertisements[0].url;
					}
					return homeItem;
				})
			}, () => {
				window.scrollTo(0, 1)
				window.scrollTo(0, 0)
			});
		}, error => {
			this.loadingGoods = false;
			this.setState({
				loading: false,
				alertMessage: error
			});
		});
	}

	componentWillUnmount() {
		this.scrollRestoration.unregisterOnScroll();
		window.removeEventListener("scroll", this.scroll);
	}

	componentDidUpdate() {
		this.scrollRestoration.restoreScrollTop();
	}

	scroll() {
		if (Screen.scrollHeight() - Screen.availHeight() - Screen.scrollTop() < 200 && !this.isChildRoute()) {
			this.loadGoods(this.state && this.state.goodsList ? this.state.goodsList.length : 0);
		}
	}

	loadGoods() {
		if (this.loadingGoods === true || this.finishLoading) return false;
		this.loadingGoods = true;
		let goodsList = this.state.goodsList;
		if (goodsList === undefined) goodsList = [];
		let step = 10;
		if (goodsList.length % step > 0) return;
		GoodsApi.frontEndGoodsList({
			pageSize: step,
			pageNo: goodsList.length / step + 1
		}, data => {
			this.loadingGoods = false;
			if (data.goodsList.length === 0) this.finishLoading = true;
			data.goodsList.forEach(g => goodsList.push({
				id: g.goodsId,
				pic: g.pictureUrl,
				name: g.name,
				price: g.priceForSale,
				sales: g.salesVolume,
				goodsType: g.giftsStatsList,
				timeLimitPrice: g.timeLimitPrice
			}));
			this.setState({
				goodsList: goodsList
			});
		}, error => {
			this.loadingGoods = false;
			this.setState({
				alertMessage: error
			});
		});
	}

	render() {
		let { banners, categories, goodsList, loading, alertMessage, notice, homeItems } = this.state;
		let { match, history } = this.props;
		return (
			<div>
				{!this.isChildRoute() &&
					<div className="Home">
						<SearchBar placeholder={'输入商品名称或者品牌'}
							onSubmit={keyword => history.push('/search/' + encodeURIComponent(keyword))} />
						{banners &&
							<Swipe history={history} banners={banners} height={'3.6rem'} interval={5000} />
						}
						{categories &&
							<CategoryBar history={history} categories={categories} />
						}
						{notice && notice.length > 0 &&
							<div className="announce">
								<div className="container">
									<label style={{
										width: (0.26 * notice.length + 1) + 'rem',
										animationDuration: (notice.length % 10 === 0 ? notice.length / 10 : (notice.length / 10 + 1)) * 4 + 's'
									}}>{notice}</label>
								</div>
							</div>
						}
						{homeItems && homeItems.map((h, i) => {
							if (h.type === 4) {
								return (
									<div key={i} className="content1">
										<LazyLoadImg
											src={h.pic}
											onClick={() => { Redirect.go(history, h.url) }}
										/>
									</div>
								);
							} else if (h.type === 5) {
								return (
									<div key={i} className="content2">
										<LazyLoadImg
											className="banner"
											src={h.pic}
											onClick={() => { Redirect.go(history, h.url) }}
										/>
										<div className="content2-container">
											<div className="goods-list"
												style={{ width: (2.2 * h.goodsList.length + 0.4) + 'rem' }}>
												{h.goodsList.map(g =>
													<Link key={g.goodsId} to={match.url + '/goods/details/' + g.goodsId}
														className="goods-item" onClick={() => window.MtaH5.clickStat('click_home_grid_2', { 'name': g.name })}>
														<LazyLoadImg src={g.pic} className="goods-item-img" />
														<span className='two-txt goods-item-name'>{g.name}</span>
														<label className="price">&yen;{g.price.toFixed(2)}</label>
													</Link>
												)}
											</div>
										</div>
									</div>
								);
							} else if (h.type === 6) {
								return (
									<div key={i} className="content3">
										<LazyLoadImg className="banner1" src={h.pic1} onClick={() => {
												Redirect.go(history, h.url1);
											}}/>
										<LazyLoadImg className="banner2" src={h.pic2} onClick={() => {
												Redirect.go(history, h.url2);
											}}/>
										<LazyLoadImg className="banner2" src={h.pic3} onClick={() => {
												Redirect.go(history, h.url3);
											}}/>

									</div>
								);
							} else if (h.type === 7) {
								return (
									<div key={i} className="content4">
										<LazyLoadImg
											src={h.pic}
											onClick={() => { Redirect.go(history, h.url) }} />
									</div>
								);
							} else {
								return (<div />);
							}
						})}
						{goodsList &&
							<GoodsListView routePrefix={match.url} title={'推荐商品'} goodsList={goodsList} />
						}
						<div className="clear" style={{ marginBottom: '0.8rem' }} />
						<FixedBottom>
							<TabBar />
						</FixedBottom>
					</div>
				}
				<TransitionGroup>
					{loading &&
						<Fade>
							<FullScreenLoading />
						</Fade>
					}
					{alertMessage &&
						<Fade>
							<Alert message={alertMessage} onClose={() => this.setState({ alertMessage: undefined })} />
						</Fade>
					}
				</TransitionGroup>
				<Route path={match.url + '/goods/details/:id'} component={GoodsDetails} />
				<Route path={match.url + "/search/:keyword"} component={GoodsList} />
				<Route path={match.url + "/category/:categoryId"} component={GoodsList} />
				<Route path={match.url + "/freeFreightGoodsList"} component={GoodsList} />
				<Route path={match.url + "/regulation/:transportRuleIds"} component={GoodsList} />
				<Route path={match.url + "/couponscenter"} component={CouponsCenter} />
			</div>
		);
	}
}

export default Home;