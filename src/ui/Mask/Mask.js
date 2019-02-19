import './Mask.css'
import React, { Component } from "react";

class Mask extends Component {
    render() {
        return (
            <div className="Mask" {...this.props} onTouchMove={e => { 
                e.stopPropagation() }}>
                <div className="wrapper" />
            </div>
        );
    }
}

export default Mask;