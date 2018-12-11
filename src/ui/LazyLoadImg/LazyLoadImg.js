import React, { Component } from 'react';
import Screen from "../../utils/Screen";

class LazyLoadImg extends Component {
    constructor(props) {
        super(props);
        this.lazyLoad = this.lazyLoad.bind(this, props.src);
    }

    componentDidMount() {
        this.isScroll()
        window.addEventListener("scroll", this.lazyLoad);
        window.addEventListener("resize", this.lazyLoad);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.lazyLoad);
        window.removeEventListener("resize", this.lazyLoad);
    }

    // 判断页面是否可滚动, 若不可滚动, 即刻显示图片
    isScroll() {
        if (document.body.clientHeight <= Screen.clientHeight()){this.lazyLoad()}
    }

    lazyLoad(src) {
        if (Screen.availHeight() + Screen.scrollTop() > this.img.offsetTop - 100) {
            this.img.src = src;
        }
    }

    render() {
        let props = Object.assign({}, this.props);
        props.src = "https://cdn.yiyayiyawao.com/null.jpg?x-oss-process=style/goods_desc"
        return (
            <img {...props} alt="" ref={input => {
                this.img = input}} />
        );
    }
}

export default LazyLoadImg; 