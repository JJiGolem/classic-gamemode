/* eslint-disable no-undef */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {closeBankPage} from "../actions/action.bankPages";
import {setLoadingBank, setArgsBank} from "../actions/action.bank";

class BankTaxes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            houseDays: 0,
            bizDays: 0
        };

        this.incrementHouseDays = this.incrementHouseDays.bind(this);
        this.decrementHouseDays = this.decrementHouseDays.bind(this);
        this.incrementBizDays = this.incrementBizDays.bind(this);
        this.decrementBizDays = this.decrementBizDays.bind(this);
    }

    incrementHouseDays() {
        const { houseDays } = this.state;
        const { bank } = this.props;

        if ((houseDays < 30 - bank.houses[0].days) && ((houseDays + 1)*bank.houses[0].rent <= bank.money)) {
            this.setState({ houseDays: houseDays + 1 });
        }
    }

    decrementHouseDays() {
        const { houseDays } = this.state;
        const { bank } = this.props;

        if ((houseDays > 0) && ((houseDays - 1)*bank.houses[0].rent <= bank.money)) {
            this.setState({ houseDays: houseDays - 1 });
        }
    }

    payHouse() {
        const { houseDays } = this.state;
        const { bank, setLoading, setArgs } = this.props;

        setArgs({ money: parseInt(bank.houses[0].rent*houseDays), name: bank.houses[0].name, days: parseInt(houseDays) });
        setLoading(true);
        mp.trigger('bank.house.push', bank.houses[0].name, parseInt(houseDays));
        this.setState({ houseDays: 0 });
    }

    incrementBizDays() {
        const { bizDays } = this.state;
        const { bank } = this.props;

        if ((bizDays < 30 - bank.biz[0].days) && ((bizDays + 1)*bank.biz[0].rent <= bank.money)) {
            this.setState({ bizDays: bizDays + 1 });
        }
    }

    decrementBizDays() {
        const { bizDays } = this.state;
        const { bank } = this.props;

        if ((bizDays > 0) && ((bizDays - 1)*bank.biz[0].rent <= bank.money)) {
            this.setState({ bizDays: bizDays - 1 });
        }
    }

    payBiz() {
        const { bizDays } = this.state;
        const { setLoading, setArgs, bank } = this.props;

        setArgs({ money: parseInt(bank.biz[0].rent*bizDays), id: bank.biz[0].id, days: parseInt(bizDays) });
        setLoading(true);
        mp.trigger('bank.biz.push', bank.biz[0].id, parseInt(bizDays));
        this.setState({ bizDays: 0 });
    }

    getPayHouseForm() {
        const { bank } = this.props;
        const { houseDays } = this.state;

        if (bank.houses.length > 0) {
            return (
                <div style={{ textAlign: 'left' }}>
                    <div className='taxes_info-bank-react'>
                        <div>Номер дома: { bank.houses[0].name }</div>
                        <div>Класс: { bank.houses[0].class }</div>
                        <div>Квартплата: ${ bank.houses[0].rent }/день</div>
                        <div>Оплачено: { bank.houses[0].days }/30</div>
                        <div style={{ position: 'absolute', bottom: '0', width: '90%' }}>
                            <div>Дни для оплаты:</div>
                            <div style={{ textAlign: 'center', marginTop: '5%',  }}>
                            <span
                                className='button_taxes-bank-react'
                                onClick={this.decrementHouseDays}
                                style={{
                                    padding: '1% 5.5% 3% 5.5%',
                                    color: houseDays == 0 && 'gray',
                                    borderColor: houseDays == 0 && 'gray',
                                    background: houseDays == 0 && 'transparent'
                                }}
                            >
                                -
                            </span>
                                <span>{ houseDays }</span>
                                <span
                                    title={ ((houseDays >= 30 - bank.houses[0].days) || ((houseDays + 1)*bank.houses[0].rent > bank.money)) && "Недостаточно денег на счете"}
                                    className='button_taxes-bank-react'
                                    onClick={this.incrementHouseDays}
                                    style={{
                                        color: ((houseDays >= 30 - bank.houses[0].days) || ((houseDays + 1)*bank.houses[0].rent > bank.money)) && 'gray',
                                        borderColor: ((houseDays >= 30 - bank.houses[0].days) || ((houseDays + 1)*bank.houses[0].rent > bank.money)) && 'gray',
                                        background: ((houseDays >= 30 - bank.houses[0].days) || ((houseDays + 1)*bank.houses[0].rent > bank.money)) && 'transparent'
                                    }}
                                >
                                +
                            </span>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '7%' }}>
                                {
                                    houseDays > 0
                                        ? <button className='button_pay_taxes-bank-react' onClick={this.payHouse.bind(this)}>
                                            Оплатить
                                        </button>
                                        : <span>Количество дней не выбрано</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginTop: '10%' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="60%" viewBox="0 0 124.547 117.09">
                            <g id="Group_55" data-name="Group 55" transform="translate(0.001 0)">
                                <path id="Path_26" data-name="Path 26" d="M170.6,300.251a3.535,3.535,0,0,0-3.589,3.592v49.063h-25.45V332.873a3.545,3.545,0,0,0-3.461-3.522H119.7a3.629,3.629,0,0,0-3.656,3.522v20.034H90.655V305.474a3.525,3.525,0,0,0-7.043,0V356.5a3.488,3.488,0,0,0,3.458,3.468H119.7a3.488,3.488,0,0,0,3.458-3.468V336.465h11.353V356.5a3.518,3.518,0,0,0,3.589,3.468h32.5a3.488,3.488,0,0,0,3.458-3.468V303.84a3.508,3.508,0,0,0-3.458-3.589Z" transform="translate(-66.591 -242.877)"/>
                                <path id="Path_27" data-name="Path 27" d="M123.525,78.475,95.2,50.032v-19.4a3.585,3.585,0,0,0-3.656-3.579,3.5,3.5,0,0,0-3.458,3.579V42.915l-23.354-23.5A3.431,3.431,0,0,0,62.321,18.3a3.545,3.545,0,0,0-2.546,1.114L1.093,78.082a3.354,3.354,0,0,0,0,4.957,3.354,3.354,0,0,0,4.961,0L62.308,26.917l56.126,56.653a3.468,3.468,0,0,0,2.546.919,3.941,3.941,0,0,0,2.546-.919,3.689,3.689,0,0,0,0-5.095Z" transform="translate(0 -18.3)"/>
                            </g>
                        </svg>
                    </div>
                    <div style={{ marginTop: '5%', fontSize: '120%' }}>У Вас нет дома</div>
                </div>
            )
        }
    }

    getPayBusinessForm() {
        const { bank } = this.props;
        const { bizDays } = this.state;

        if (bank.biz.length > 0) {
            return (
                <div style={{ textAlign: 'left' }}>
                    <div className='taxes_info-bank-react'>
                        <div>Название: { bank.biz[0].name }</div>
                        <div>Тип: { bank.biz[0].type }</div>
                        <div>Налог: ${ bank.biz[0].rent }/день</div>
                        <div>Оплачено: { bank.biz[0].days }/30</div>
                        <div style={{ position: 'absolute', bottom: 0, width: '90%' }}>
                            <div style={{ marginTop: '5%' }}>Дни для оплаты:</div>
                            <div style={{ textAlign: 'center', marginTop: '5%',  }}>
                            <span
                                className='button_taxes-bank-react'
                                onClick={this.decrementBizDays}
                                style={{
                                    padding: '1% 5.5% 3% 5.5%',
                                    color: bizDays == 0 && 'gray',
                                    borderColor: bizDays == 0 && 'gray',
                                    background: bizDays == 0 && 'transparent'
                                }}
                            >
                                -
                            </span>
                                <span>{ bizDays }</span>
                                <span
                                    title={ ((bizDays >= 30 - bank.biz[0].days) || ((bizDays + 1)*bank.biz[0].rent > bank.money)) && "Недостаточно денег на счете"}
                                    className='button_taxes-bank-react'
                                    onClick={this.incrementBizDays}
                                    style={{
                                        color: ((bizDays >= 30 - bank.biz[0].days) || ((bizDays + 1)*bank.biz[0].rent > bank.money)) && 'gray',
                                        borderColor: ((bizDays >= 30 - bank.biz[0].days) || ((bizDays + 1)*bank.biz[0].rent > bank.money)) && 'gray',
                                        background: ((bizDays >= 30 - bank.biz[0].days) || ((bizDays + 1)*bank.biz[0].rent > bank.money)) && 'transparent'
                                    }}
                                >
                                +
                            </span>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '7%' }}>
                                {
                                    bizDays > 0
                                        ? <button className='button_pay_taxes-bank-react' onClick={this.payBiz.bind(this)}>
                                            Оплатить
                                        </button>
                                        : <span>Количество дней не выбрано</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginTop: '10%' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="65%" height="60%" viewBox="0 0 127.688 111.486">
                            <g id="Group_54" data-name="Group 54" transform="translate(0 0)">
                                <path id="Path_101" data-name="Path 101" d="M274.16,263.75H256.81a8.618,8.618,0,0,0-8.61,8.61v13.306a8.618,8.618,0,0,0,8.61,8.61h17.35a8.618,8.618,0,0,0,8.61-8.61V272.36A8.618,8.618,0,0,0,274.16,263.75Zm2.348,21.916a2.355,2.355,0,0,1-2.348,2.348H256.81a2.355,2.355,0,0,1-2.348-2.348V272.36a2.355,2.355,0,0,1,2.348-2.348h17.35a2.355,2.355,0,0,1,2.348,2.348Z" transform="translate(-183.443 -203.037)"/>
                                <path id="Path_102" data-name="Path 102" d="M127.688,67.577a2.906,2.906,0,0,0-.417-1.539l-18.994-33.4a3.148,3.148,0,0,0-2.713-1.592H22.1a3.094,3.094,0,0,0-2.713,1.592L.417,66.038A3.165,3.165,0,0,0,0,67.577a18.315,18.315,0,0,0,10.958,16.75V139.4a3.14,3.14,0,0,0,3.131,3.131h99.484A3.14,3.14,0,0,0,116.7,139.4V84.719a1.378,1.378,0,0,0-.026-.339A18.366,18.366,0,0,0,127.688,67.577ZM23.925,37.338h79.811l14.846,26.117H9.106ZM90.874,69.69a12.033,12.033,0,0,1-23.69,0Zm-30.343,0a12.049,12.049,0,0,1-23.716,0Zm-54.06,0H30.187a12.049,12.049,0,0,1-23.716,0ZM52.6,136.274h-18V102.486a4.46,4.46,0,0,1,4.462-4.462h9.106a4.46,4.46,0,0,1,4.462,4.462v33.787Zm57.843,0H58.861V102.486A10.74,10.74,0,0,0,48.137,91.763H39.032a10.74,10.74,0,0,0-10.723,10.723V136.3H17.22V85.867c.365.026.731.026,1.1.026A18.292,18.292,0,0,0,33.5,77.8a18.3,18.3,0,0,0,30.37,0,18.249,18.249,0,0,0,30.317,0,18.292,18.292,0,0,0,15.185,8.088c.365,0,.7-.026,1.07-.026v50.407Zm-1.07-56.643a12.027,12.027,0,0,1-11.845-9.914h23.716A12.1,12.1,0,0,1,109.372,79.631Z" transform="translate(0 -31.05)"/>
                            </g>
                        </svg>
                    </div>
                    <div style={{ marginTop: '5%', fontSize: '120%' }}>У Вас нет бизнеса</div>
                </div>
            )
        }
    }

    render() {
        const { closePage } = this.props;
        const { error } = this.state;

        return (
            <Fragment>
                <div className='taxes_back-bank-react'>
                    <div className='taxes_block-bank-react' style={{ left: '5%' }}>
                        <span style={{ fontSize: '170%' }}>Оплата жилья</span>
                        { this.getPayHouseForm() }
                    </div>
                    <div className='taxes_block-bank-react'>
                        <span style={{ fontSize: '170%' }}>Оплата бизнеса</span>
                        { this.getPayBusinessForm() }
                    </div>
                </div>
                <div className='buttons_panel-bank-react' style={{ marginTop: '-1%' }}>
                    <button className='button_panel-bank-react' onClick={closePage}
                            style={{ padding: '2% 5%', fontSize: '110%' }}
                    >
                        Отмена
                    </button>
                </div>

                <div style={{ color: 'red', marginTop: '5%' }}>{ error }</div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    bank: state.bank
});

const mapDispatchToProps = dispatch => ({
    closePage: () => dispatch(closeBankPage()),
    setArgs: args => dispatch(setArgsBank(args)),
    setLoading: flag => dispatch(setLoadingBank(flag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BankTaxes);