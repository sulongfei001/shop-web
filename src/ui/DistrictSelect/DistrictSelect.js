import './DistrictSelect.css'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Animate from "../../utils/Animate";
import Districts from "../../utils/Districts";
import imageClose from './close.png';

class DistrictSelect extends Component {
    constructor(props) {
        super(props);
        this.selectDistrict = this.selectDistrict.bind(this);
        this.switchIndex = this.switchIndex.bind(this);
        this.animate = new Animate();
        let districts = Districts.allData;
        let parents = Districts.parentsData;
        this.state = {
            selected: [],
            index: 0
        };

        this.allVisible = !props.includedIds;
        this.districts = districts;
        this.visibleDistricts = this.getVisibleDistricts(districts, parents);
        this.parents = parents;
    }

    componentWillUnmount() {
        this.animate.dispose();
    }

    static getId(district) {
        return district.split('_')[0];
    }

    static getName(district) {
        return district.split('_')[1];
    }

    getVisibleDistricts(districts, parents) {
        let visibleDistricts = {};
        let { includedIds } = this.props;
        if (includedIds && includedIds.indexOf(0) < 0) {
            includedIds.forEach(id => {
                let dList = districts;
                let pList = parents[(id).toString()];
                for (let i = pList.length - 1; i > -1; i--) {
                    visibleDistricts[pList[i]] = true;
                    dList = dList[pList[i]];
                }
                this.setVisible(id, dList, visibleDistricts)
            });
        } else {
            Object.keys(parents).forEach(id => {
                let dList = districts;
                let pList = parents[id];
                for (let i = pList.length - 1; i > -1; i--) {
                    visibleDistricts[pList[i]] = true;
                    dList = dList[pList[i]];
                }
                this.setVisible(parseInt(id, 10), dList, visibleDistricts);
            });
        }
        return visibleDistricts;
    }

    setVisible(id, districts, visibleDistricts) {
        let keys = Object.keys(districts).filter(key => parseInt(DistrictSelect.getId(key), 10) === id);
        if (keys.length > 0) {
            visibleDistricts[keys[0]] = true;
            let dList = districts[keys[0]];
            Object.keys(dList).forEach(key => this.setVisible(parseInt(DistrictSelect.getId(key), 10), dList, visibleDistricts));
        }
    }

    selectDistrict(e, district) {
        e.stopPropagation();
        let { selected, index } = this.state;
        if (index === selected.length) {
            selected.push(district);
        } else {
            while (index < selected.length) {
                selected.pop();
            }
            selected.push(district);
        }
        index = selected.length;
        if (Object.keys(this.getDistricts(index, selected)).length === 0) {
            let addressInfo = selected.map(name => {
                return {
                    id: DistrictSelect.getId(name),
                    name: DistrictSelect.getName(name)
                }
            })
            index = selected.length - 1;
            if (this.props.onSelected) {
                let selId = DistrictSelect.getId(district);
                this.props.onSelected(
                    {
                        id: parseInt(selId, 10),
                        name: DistrictSelect.getName(district)
                    },
                    this.parents[selId].map(p => {
                        return { id: parseInt(DistrictSelect.getId(p), 10), name: DistrictSelect.getName(p) };
                    }
                    ),
                    addressInfo
                );
            }
        }
        this.animate.start(this.content, { scrollTop: 0 }, 200);
        this.setState({
            selected: selected,
            index: index
        });
    }

    getDistricts(i, s) {
        let { index, selected } = this.state;
        let districts = this.districts;
        if (i) index = i;
        if (s) selected = s;
        if (index > 0) {
            for (let i = 0; i < index; i++) {
                districts = districts[selected[i]];
            }
        }
        return districts;
    }

    switchIndex(i) {
        this.setState({
            index: i
        })
    }

    render() {
        let { index, selected } = this.state;
        return (
            <div className="DistrictSelect" style={this.props.style}>
                <div className="menu clearfix">
                    <a className="close" onClick={() => this.props.onClose && this.props.onClose()} style={{ backgroundImage: 'url(' + imageClose + ')' }}> </a>
                    <a className={index === 0 ? 'func active' : 'func'} onClick={() => this.switchIndex(0)}>
                        {selected.length > 0 ? DistrictSelect.getName(selected[0]) : '请选择'}
                    </a>
                    {selected.map((s, i) =>
                        Object.keys(this.getDistricts(i + 1)).length > 0 &&
                        <a key={i} className={index === i + 1 ? 'func active' : 'func'} onClick={() => this.switchIndex(i + 1)}>
                            {selected.length > i + 1 ? DistrictSelect.getName(selected[i + 1]) : '请选择'}
                        </a>
                    )}
                </div>
                <div className="split" />
                <div className="content" ref={input => this.content = input}>
                    {Object.keys(this.getDistricts()).filter(district => this.allVisible || this.visibleDistricts[district]).map(district =>
                        <a key={DistrictSelect.getId(district)} style={{ paddingLeft: (1 + index * 4) * 0.32 + 'rem' }} onClick={e => this.selectDistrict(e, district)}>
                            {DistrictSelect.getName(district)}
                        </a>
                    )}
                </div>
            </div>
        );
    }
}

DistrictSelect.propTypes = {
    onSelected: PropTypes.func,
    onClose: PropTypes.func,
    includedIds: PropTypes.arrayOf(PropTypes.number),
};

export default DistrictSelect;