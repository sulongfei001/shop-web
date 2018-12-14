import './FullScreenPage.css'
import React, {Component} from 'react';
import Screen from "../../utils/Screen";

class FullScreenPage extends Component {
    constructor(props) {
        super(props);
        this.resize = this.resize.bind(this);
    }

    componentDidMount() {
        this.resize();
        window.addEventListener("resize", this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    resize() {
        let margin = Screen.margin();
        this.page.style.left = margin + 'px';
        this.page.style.right = margin + 'px';
    }

    render() {
        return (
            // React组件的ref属性也可以是一个回调函数，并且这个回调函数会在组件被挂载后立刻被执行。回调函数的参数对应组件实例的引用，这个回调函数可以立即使用组件，或者保存这个引用便于以后使用。
            <div className="FullScreenPage" ref={page => this.page = page} {...this.props}>
                {this.props.children}
            </div>
        );
    }
}

export default FullScreenPage;