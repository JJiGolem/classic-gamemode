import React from 'react';
import Menu from './Menu.jsx';
import Loader from '../LoaderBank.jsx';
import { money, index, days } from '../../source/bank.js';

export default class PayNalog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: undefined,
            daysHouse: 0,
            daysBiz: 0,
            sumRentHouse: 0,
            sumRentBiz: 0
        }
    }

    payHouse(event) {
        event.preventDefault();
        const { info, addForm } = this.props;
        index[0] = info.houses[0].name;
        days[0] = Number(this.state.daysHouse);
        money[0] = Number(this.state.sumRentHouse);
        addForm(<Loader position='42% 35%' size='small' />)
        mp.trigger('pushHouse.client', info.houses[0].name, Number(this.state.daysHouse))
        this.setState({daysHouse: 0, sumRentHouse: 0})
    }

    payBiz(event) {
        event.preventDefault();
        const { info, addForm } = this.props;
        index[0] = info.biz[0].name;
        days[0] = Number(this.state.daysBiz);
        money[0] = Number(this.state.sumRentBiz);
        addForm(<Loader position='42% 35%' size='small' />)
        mp.trigger('pushBiz.client', info.biz[0].name, Number(this.state.daysBiz))
        this.setState({daysBiz: 0, sumRentBiz: 0})
    }

    back(event) {
        event.preventDefault();
        this.props.setPage(<Menu />)
    }

    getHouse() {
        const { info, bank } = this.props;
        if(info.houses.length !== 0) {
            return (
                <div className='houseBizBank' style={{position: 'absolute', left: '40px'}}>
                    <div style={{fontSize: '22px', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px'}}>Оплата жилья</div>
                    <div>Номер дома: №{info.houses[0].name}</div>
                    <div>Класс: {info.houses[0].class}</div>
                    <div>Квартплата: ${info.houses[0].rent}/день</div>
                    <div>Оплачено: {info.houses[0].days}/30</div>
                    <div style={{marginTop: '10px'}}>Выберите количество дней для оплаты</div>
                    <div className='buttonsDaysBank'>
                        <button onClick={this.dicH.bind(this)} id='butDayBank'><div className='textButDay'>-</div></button>
                            {this.state.daysHouse}
                        <button onClick={this.incH.bind(this)} id='butDayBank'><div className='textButDay'>+</div></button>
                    </div>
                    <div style={{width: '100%', textAlign: 'center'}}>
                        <button id='butPayHouseBank' onClick={this.payHouse.bind(this)}>Оплатить</button>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='houseBizBank' style={{height: '327px', paddingTop: '6px', position: 'absolute', left: '40px'}}>
                    <div style={{width: '100%', textAlign: 'center'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="124.547" height="117.09" viewBox="0 0 124.547 117.09" style={{marginTop: '70px'}}>
                            <g id="Group_55" data-name="Group 55" transform="translate(0.001 0)">
                                <path id="Path_26" data-name="Path 26" d="M170.6,300.251a3.535,3.535,0,0,0-3.589,3.592v49.063h-25.45V332.873a3.545,3.545,0,0,0-3.461-3.522H119.7a3.629,3.629,0,0,0-3.656,3.522v20.034H90.655V305.474a3.525,3.525,0,0,0-7.043,0V356.5a3.488,3.488,0,0,0,3.458,3.468H119.7a3.488,3.488,0,0,0,3.458-3.468V336.465h11.353V356.5a3.518,3.518,0,0,0,3.589,3.468h32.5a3.488,3.488,0,0,0,3.458-3.468V303.84a3.508,3.508,0,0,0-3.458-3.589Z" transform="translate(-66.591 -242.877)"/>
                                <path id="Path_27" data-name="Path 27" d="M123.525,78.475,95.2,50.032v-19.4a3.585,3.585,0,0,0-3.656-3.579,3.5,3.5,0,0,0-3.458,3.579V42.915l-23.354-23.5A3.431,3.431,0,0,0,62.321,18.3a3.545,3.545,0,0,0-2.546,1.114L1.093,78.082a3.354,3.354,0,0,0,0,4.957,3.354,3.354,0,0,0,4.961,0L62.308,26.917l56.126,56.653a3.468,3.468,0,0,0,2.546.919,3.941,3.941,0,0,0,2.546-.919,3.689,3.689,0,0,0,0-5.095Z" transform="translate(0 -18.3)"/>
                            </g>
                        </svg>
                    </div>
                    <div style={{fontSize: '22px', fontWeight: 'bold', textAlign: 'center', marginTop: '15px'}}>У Вас нет дома</div>
                </div>
            )
        }
    }

    getBiz() {
        const { info } = this.props;
        if(info.biz.length !== 0) {
            return (
                <div className='houseBizBank' style={{position: 'absolute', right: '40px'}}>
                    <div style={{fontSize: '22px', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px'}}>Оплата бизнеса</div>
                    <div>Номер бизнеса: {info.biz[0].name}</div>
                    <div>Класс: {info.biz[0].type}</div>
                    <div>Аренда: ${info.biz[0].rent}/день</div>
                    <div>Оплачено: {info.biz[0].days}/30</div>
                    <div style={{marginTop: '10px'}}>Выберите количество дней для оплаты</div>
                    <div className='buttonsDaysBank'>
                        <button onClick={this.dicB.bind(this)} id='butDayBank'><div className='textButDay'>-</div></button>
                            {this.state.daysBiz}
                        <button onClick={this.incB.bind(this)} id='butDayBank'><div className='textButDay'>+</div></button>
                    </div>
                    <div style={{width: '100%', textAlign: 'center'}}>
                        <button id='butPayHouseBank' onClick={this.payBiz.bind(this)}>Оплатить</button>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='houseBizBank' style={{height: '327px', position: 'absolute', right: '40px'}}>
                    <div style={{width: '100%', textAlign: 'center'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="127.688" height="111.486" viewBox="0 0 127.688 111.486" style={{marginTop: '70px'}}>
                            <g id="Group_54" data-name="Group 54" transform="translate(0 0)">
                                <path id="Path_101" data-name="Path 101" d="M274.16,263.75H256.81a8.618,8.618,0,0,0-8.61,8.61v13.306a8.618,8.618,0,0,0,8.61,8.61h17.35a8.618,8.618,0,0,0,8.61-8.61V272.36A8.618,8.618,0,0,0,274.16,263.75Zm2.348,21.916a2.355,2.355,0,0,1-2.348,2.348H256.81a2.355,2.355,0,0,1-2.348-2.348V272.36a2.355,2.355,0,0,1,2.348-2.348h17.35a2.355,2.355,0,0,1,2.348,2.348Z" transform="translate(-183.443 -203.037)"/>
                                <path id="Path_102" data-name="Path 102" d="M127.688,67.577a2.906,2.906,0,0,0-.417-1.539l-18.994-33.4a3.148,3.148,0,0,0-2.713-1.592H22.1a3.094,3.094,0,0,0-2.713,1.592L.417,66.038A3.165,3.165,0,0,0,0,67.577a18.315,18.315,0,0,0,10.958,16.75V139.4a3.14,3.14,0,0,0,3.131,3.131h99.484A3.14,3.14,0,0,0,116.7,139.4V84.719a1.378,1.378,0,0,0-.026-.339A18.366,18.366,0,0,0,127.688,67.577ZM23.925,37.338h79.811l14.846,26.117H9.106ZM90.874,69.69a12.033,12.033,0,0,1-23.69,0Zm-30.343,0a12.049,12.049,0,0,1-23.716,0Zm-54.06,0H30.187a12.049,12.049,0,0,1-23.716,0ZM52.6,136.274h-18V102.486a4.46,4.46,0,0,1,4.462-4.462h9.106a4.46,4.46,0,0,1,4.462,4.462v33.787Zm57.843,0H58.861V102.486A10.74,10.74,0,0,0,48.137,91.763H39.032a10.74,10.74,0,0,0-10.723,10.723V136.3H17.22V85.867c.365.026.731.026,1.1.026A18.292,18.292,0,0,0,33.5,77.8a18.3,18.3,0,0,0,30.37,0,18.249,18.249,0,0,0,30.317,0,18.292,18.292,0,0,0,15.185,8.088c.365,0,.7-.026,1.07-.026v50.407Zm-1.07-56.643a12.027,12.027,0,0,1-11.845-9.914h23.716A12.1,12.1,0,0,1,109.372,79.631Z" transform="translate(0 -31.05)"/>
                            </g>
                        </svg>
                    </div>
                    <div style={{fontSize: '22px', fontWeight: 'bold', textAlign: 'center', marginTop: '15px'}}>У Вас нет бизнеса</div>
                </div>
            )
        }
    }

    incH(event) {
        event.preventDefault();
        const { daysHouse } = this.state;
        const { info, bank } = this.props;
        let maxDays = 30 - info.houses[0].days;
        let maxMoney = Math.floor(bank.money / info.houses[0].rent);
        let max;
        maxDays < maxMoney ? max= maxDays : max = maxMoney
        if(daysHouse < max) {
            if(daysHouse < maxDays) {
                if(daysHouse < maxMoney) {
                    this.setState({daysHouse: daysHouse+1, sumRentHouse: info.houses[0].rent*(daysHouse+1), error: ''})
                } else {
                    this.setState({error: 'Недостаточно денег'})
                }
            } else {
                this.setState({error: 'Дом не может быть оплачен больше, чем на 30 дней'})
            }
        }
    }

    dicH(event) {
        event.preventDefault();
        const { daysHouse } = this.state;
        const { info } = this.props;

        if(daysHouse > 0) {
            this.setState({daysHouse: daysHouse - 1, sumRentHouse: info.houses[0].rent*(daysHouse-1), error: ''})
        }
    }

    incB(event) {
        event.preventDefault();
        const { daysBiz } = this.state;
        const { info, bank } = this.props;
        let maxDays = 30 - info.biz[0].days;
        let maxMoney = Math.floor(bank.money / info.biz[0].rent);
        let max;
        maxDays < maxMoney ? max= maxDays : max = maxMoney
        if(daysBiz < max) {
            if(daysBiz < maxDays) {
                if(daysBiz < maxMoney) {
                    this.setState({daysBiz: daysBiz+1, sumRentBiz: info.biz[0].rent*(daysBiz+1), error: ''})
                } else {
                    this.setState({error: 'Недостаточно денег'})
                }
            } else {
                this.setState({error: 'Бизнес не может быть оплачен больше, чем на 30 дней'})
            }
        }
    }

    dicB(event) {
        event.preventDefault();
        const { daysBiz } = this.state;
        const { info } = this.props;

        if(daysBiz > 0) {
            this.setState({daysBiz: daysBiz - 1, sumRentBiz: info.biz[0].rent*(daysBiz-1), error: ''})
        }
    }

    render() {
        return (
            <div className='pageBank'>
                
                <div className='blockPayBank' style={{marginTop: '10px'}}>
                    {this.getHouse()}
                    {this.getBiz()}
                    <div style={{position: 'absolute', top: '325px', left: '260px'}}>
                        <button onClick={this.back.bind(this)} id='buttonBackBank'>Назад</button>
                    </div>
                    <div style={{width: '100%', textAlign: 'center', color: 'red', marginTop: '10px'}}>
                        {this.state.error}
                    </div>
                </div>
            </div>
        )
    }
}