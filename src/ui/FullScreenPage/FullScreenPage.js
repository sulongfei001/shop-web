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
            <div className="FullScreenPage" ref={page => this.page = page} {...this.props}>
                {this.props.children}
            </div>
        );
    }
}

export default FullScreenPage;