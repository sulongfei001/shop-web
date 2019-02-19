import './Categories.css';
import React from 'react';
import { Route } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { Link } from 'react-router-dom';
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import TabBar from "../../ui/TabBar/TabBar";
import FullScreenPage from "../../ui/FullScreenPage/FullScreenPage";
import SearchBar from "../../ui/SearchBar/SearchBar";
import Swipe from "../../ui/Swipe/Swipe";
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import GoodsList from "../Goods/GoodsList";
import GoodsApi from "../../api/GoodsApi";
import Alert from "../../ui/Alert/Alert";
import Page from "../../ui/Page/Page";

class Categories extends Page {
    constructor(props) {
        super(props);
        this.selectCategory = this.selectCategory.bind(this);
        this.state = {
            url: props.match.url,
            loading: true
        };
    }

    componentDidMount() {
        GoodsApi.categoryList({}, data => {
            this.setState({
                loading: false,
                banners: data.advertisementList.map((ad, i) => {
                    return {
                        id: i,
                        pic: ad.pictureUrl,
                        url: ad.url
                    };
                }),
                categories: data.categoryList.map((c, i) => {
                    return {
                        id: c.categoryId,
                        name: c.name,
                        selected: i === 0,
                        logo: c.picture,
                        children: c.childCategories.map(d => {
                            return {
                                id: d.categoryId,
                                name: d.name,
                                logo: d.picture
                            };
                        })
                    };
                })
            });
        }, error => this.setState({
            loading: false,
            alertMessage: error
        }));
    }

    selectCategory(category) {
        let { categories } = this.state;
        for (let i = 0; i < categories.length; i++) {
            categories[i].selected = categories[i].id === category.id;
        }
        this.setState({
            categories: categories
        });
    }

    render() {
        let { loading, categories, banners, url, alertMessage } = this.state;
        let { history } = this.props;
        return (
            <div className="Categories">
                {!this.isChildRoute() &&
                    <FullScreenPage style={{ background: '#fff' }}>
                        {categories &&
                            <div className="splitter" />
                        }
                        <SearchBar placeholder={'请输入商品名称或品牌'} onSubmit={keyword => history.push('/search/' + encodeURIComponent(keyword))} />
                        {categories &&
                            <div className="category-menu">
                                {categories.map(category =>
                                    <a key={category.id} className={category.selected ? 'active' : ''} onClick={() => this.selectCategory(category)}>{category.name}</a>
                                )}
                            </div>
                        }
                        {categories &&
                            <div className="category-submenu">
                                <div className="banners">
                                    <Swipe history={history} banners={banners} />
                                </div>
                                <h6>{categories.filter(category => category.selected)[0].name}</h6>
                                {categories.filter(category => category.selected)[0].children.map(category =>
                                    <Link key={category.id} to={'/categories/' + category.id} className="menu-item" style={{ backgroundImage: 'url(' + category.logo + ')' }}>{category.name}</Link>
                                )}
                            </div>
                        }
                        <FixedBottom>
                            <TabBar />
                        </FixedBottom>
                        <TransitionGroup>
                            {loading &&
                                <Fade>
                                    <FullScreenLoading />
                                </Fade>
                            }
                            {alertMessage &&
                                <Fade>
                                    <Alert message={alertMessage} onClose={() => this.setState({ alertMessage: alertMessage })} />
                                </Fade>
                            }
                        </TransitionGroup>
                    </FullScreenPage>
                }
                <Route path={url + '/:categoryId'} component={GoodsList} />
            </div>
        );
    }
}

export default Categories;