import './FixedBottom.css';
import React, {Component} from "react";
import Screen from "../../utils/Screen";

class FixedBottom extends Component {
    constructor(props) {
        super(props);
        this.resize = this.resize.bind(this);
    }

    componentDidMount() {
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    resize() {
        let margin = Screen.margin();
        this.container.style.left = margin + 'px';
        this.container.style.right = margin + 'px';
    }

    render() {
        return (
            <div className="FixedBottom" {...this.props} ref={container => this.container = container}>
                {this.props.children}
            </div>
        );
    }
}

export default FixedBottom;