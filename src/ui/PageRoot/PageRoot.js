import ScrollRestoration from "../../utils/ScrollRestoration";
import Page from "../Page/Page";
import React from "react";
import {withRouter} from "react-router-dom";

/**
 * 页面JSX根节点
 */
class PageRoot extends Page {
    constructor(props) {
        super(props);
        this.scrollRestoration = new ScrollRestoration(this);
    }

    componentDidMount() {
        this.scrollRestoration.registerOnScroll();
    }

    componentDidUpdate() {
        this.scrollRestoration.restoreScrollTop();
    }

    componentWillUnmount() {
        this.scrollRestoration.unregisterOnScroll();
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export default withRouter(PageRoot);
