import './FullScreenLoading.css'
import React, {Component} from 'react';
import FullScreenPage from "../FullScreenPage/FullScreenPage";

class FullScreenLoading extends Component {
    render() {
        return (
            <FullScreenPage style={{...this.props.style, backgroundColor:'#fff', zIndex: 100}}>
                <div className="FullScreenLoading">
                    <div className="rect1"/>
                    <div className="rect2"/>
                    <div className="rect3"/>
                    <div className="rect4"/>
                    <div className="rect5"/>
                </div>
            </FullScreenPage>
        );
    }
}

export default FullScreenLoading;