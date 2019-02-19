import Screen from "./Screen";

/**
 * 滚动恢复
 */
class ScrollRestoration {
    constructor(page) {
        this.page = page;
        this.onScroll = this.onScroll.bind(this);
        this.restoreScrollTop = this.restoreScrollTop.bind(this);
    }

    registerOnScroll() {
        window.addEventListener("scroll", this.onScroll);
    }

    unregisterOnScroll() {
        window.removeEventListener("scroll", this.onScroll);
    }

    onScroll() {
        if (Screen.scrollTop() > 0 && this.page.isChildRoute() === false) this.scrollTop = Screen.scrollTop();
    }

    restoreScrollTop() {
        if (this.page.isChildRoute() === false && this.page.needRestore === true) {
            this.needRestore = false;
            if (Math.abs(this.scrollTop - Screen.scrollTop()) > 10) Screen.setScrollTop(this.scrollTop);
        }
    }
}

export default ScrollRestoration;
