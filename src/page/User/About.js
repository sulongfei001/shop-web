import './About.css';
import imageWelcome from './welcome.png';
import React from 'react';
import Page from "../../ui/Page/Page";

class About extends Page {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                {!this.isChildRoute() &&
                <div className="About">
                    <div className="version" style={{backgroundImage: 'url(' + imageWelcome + ')'}}>
                        当前版本V1.0
                    </div>
                </div>
                }
            </div>
        );
    }
}

export default About;