import './Swipe.css';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Animate from '../../utils/Animate'
import Screen from "../../utils/Screen";
import Weixin from "../../utils/Weixin";
import Redirect from "../../utils/Redirect";

class Swipe extends Component {
    constructor(props) {
        super(props);
        this.slideIndex = 1;
        this.animate = new Animate();
        this.translateX = 0;
        this.maxTranslateX = Screen.maxWidth() * (this.props.banners.length - 1);
        this.slideStart = this.slideStart.bind(this);
        this.slideEnd = this.slideEnd.bind(this);
        this.slideMove = this.slideMove.bind(this);
        this.slide = this.slide.bind(this);
        this.windowResize = this.windowResize.bind(this);
        this.play = this.play.bind(this);
        this.state = {};
    }

    componentDidMount() {
        this.play();
        window.addEventListener("resize", this.windowResize);
    }

    componentWillUnmount() {
        this.stopPlay();
        window.removeEventListener("resize", this.windowResize);
    }

    windowResize() {
        this.slide(this.slideIndex);
    }

    play() {
        if (!this.slideTimer) {
            this.slideTimer = setInterval(() => {
                this.slideNext();
            }, this.props.interval);
        }
    }

    stopPlay() {
        clearInterval(this.slideTimer);
        this.slideTimer = undefined;
        this.animate.dispose();
    }

    slideStart(event) {
        this.slider.style.transition = 'none';
        this.stopPlay();
        this.startX = event.touches[0].clientX;
        this.startTime = Date.now();
    }

    slideMove(event) {
        if (event.cancelable && !event.defaultPrevented) {
            event.preventDefault();
        }
        this.moveTranslateX(this.translateX - event.changedTouches[0].clientX + this.startX);
        let el =document.getElementsByTagName('video')[0]
        el && el.pause()
    }

    slideEnd(event) {
        let translateX = this.translateX - event.changedTouches[0].clientX + this.startX;
        this.moveTranslateX(translateX);
        this.setTranslateX(translateX);
        this.slider.style.transition = 'all 200ms';
        if (Date.now() - this.startTime < 300) {
            if (event.changedTouches[0].clientX < this.startX && this.slideIndex < this.props.banners.length) {
                this.slideNext()
            } else if (event.changedTouches[0].clientX > this.startX && this.slideIndex > 1) {
                this.slidePrev();
            }
        } else {
            let itemWidth = this.slider.clientWidth / this.props.banners.length;
            let translateX = this.translateX;
            this.slideIndex = Math.round(translateX / itemWidth) + 1;
            if (this.slideIndex > this.props.banners.length) this.slideIndex = this.props.banners.length;
            this.slide(this.slideIndex);
        }
        this.play();
    }

    slidePrev() {
        this.slideIndex = this.slideIndex === 1 ? this.props.banners.length : (this.slideIndex - 1);
        this.slide(this.slideIndex);
    }

    slideNext() {
        this.slideIndex = this.slideIndex === this.props.banners.length ? 1 : (this.slideIndex + 1);
        this.slide(this.slideIndex);
    }

    slide(index) {
        this.setState({slideIndex: index});
        const translateX = this.slider.clientWidth / this.props.banners.length * (index - 1);
        this.moveTranslateX(translateX);
        this.setTranslateX(translateX);
    }

    limitTranslateX(translateX) {
        if (translateX < 0) {
            translateX = 0;
        } else if (translateX > this.maxTranslateX) {
            translateX = this.maxTranslateX;
        }
        return translateX;
    }

    moveTranslateX(translateX) {
        this.slider.style.transform = 'translateX(-' + this.limitTranslateX(translateX) + 'px)';
    }

    setTranslateX(translateX) {
        this.translateX = this.limitTranslateX(translateX);
    }

    render() {
        let {banners, height} = this.props;
        let {slideIndex} = this.state;
        let style = {};
        if (height) {
            style.height = height;
        }
        return (
            <div className="Swipe" style={style}>
                <div className="container">
                    <ul ref={input => this.slider = input} style={{width: banners.length * 100 + '%', transition: 'all 200ms'}} onTouchStart={this.slideStart} onTouchEnd={this.slideEnd} onTouchMove={this.slideMove}>
                        {banners.map((banner, index) =>
                            <li key={'swipe' + index} style={{width: 100 / banners.length + '%'}}>
                               { 
                                   banner.isVideo ?  <video src={banner.video}
                                   width='100%'
                                   height='250px'
                                   poster={banner.pic}
                                   ref='swipeVideo'
                                   playsInline='true'
                                   controls
                                   onClick={e =>{
                                    this.stopPlay()   
                                    let el =document.getElementsByTagName('video')[0]
                                       el.play()
                                   } }
                                   ></video> :
                                   <img src={banner.pic} alt="" onClick={() => {
                                     if (banner.url) {
                                        Redirect.go(this.props.history, banner.url);
                                    } else {
                                        Weixin.previewImage(banner.picRaw, banners.map(b => b.picRaw));
                                    }
                                }}/>
                            }
                            
                            </li>
                        )}
                    </ul>
                </div>
                <div className="dots" style={{marginLeft: '-' + banners.length * 0.1 + 'rem'}}>
                    {banners.map((banner, index) => {
                        let classNames = ["dot"];
                        if (slideIndex === index + 1 || (!slideIndex && index === 0)) classNames.push("current");
                        return (
                            <div key={index} className={classNames.join(' ')}/>
                        );
                    })}
                </div>
            </div>
        );
    }
}

Swipe.propTypes = {
    interval: PropTypes.number,
    banners: PropTypes.array.isRequired,
    height: PropTypes.string,
};

Swipe.defaultProps = {
    interval: 3000
};

export default Swipe;