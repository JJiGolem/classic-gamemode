/* eslint-disable no-undef */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

import '../styles/bank.css';
import {loadBankInfo, closeBank} from "../actions/action.bank";
import BankMenu from "./BankMenu";
import AnsOperationBank from "./AnsOperationBank";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.getInfoPanel = this.getInfoPanel.bind(this);
    }

    // componentWillMount() {
    //     this.props.loadInfo({
    //         number: '1223',
    //         cash: 223123,
    //         money: 400,
    //         name: 'Immanuel Swift',
    //         houses: [
    //             {
    //                 name: 25,
    //                 class: 'Люкс',
    //                 rent: 290,
    //                 days: 13
    //             }
    //         ], // если нет, то []
    //         biz: [
    //             {
    //                 id: 3,
    //                 name: `"У дома твоей мамы в деревне"`,
    //                 type: 'Оружейный магазин',
    //                 rent: 500,
    //                 days: 30,
    //                 cashBox: 448448
    //             }
    //         ], // если нет, то []
    //         phoneMoney: 21 // если нет, то null
    //     });
    // }

    exitBank() {
        const { closeBank, bank } = this.props;

        if (!bank.isLoading) {
            closeBank();
            mp.trigger('bank.close');
        }
    }

    getLoader(percent) {
        return (
            <div className='block_loader-house-react' style={{ marginLeft: `${percent}%` }}>
                <div className='loader-house' style={{ borderColor: 'green', borderRightColor: 'transparent' }}></div>
            </div>
        )
    }

    getInfoPanel() {
        const { bank } = this.props;

        return (
            <div className='info_panel-bank-react'>
                <div className='account_name-bank-react'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25%" height="25%" viewBox="0 0 56.195 56.194">
                        <path id="Path_125" data-name="Path 125" d="M45.658,38.636H42.146a7.025,7.025,0,0,1-7.025-7.025V29.355a17.752,17.752,0,0,0,3.361-6.34c.072-.389.446-.581.7-.849a4.342,4.342,0,0,0,.6-5.229c-.137-.245-.385-.458-.371-.762,0-2.06.01-4.123,0-6.181A10.312,10.312,0,0,0,36.9,3.085,9.8,9.8,0,0,0,31.569.334a17.7,17.7,0,0,0-7.645.178A9.26,9.26,0,0,0,18.477,4.2,10.644,10.644,0,0,0,16.8,9.763c-.031,2.1-.007,4.2-.013,6.3.048.421-.309.705-.47,1.053a4.353,4.353,0,0,0,.995,5.325,2.057,2.057,0,0,1,.6,1.175,17,17,0,0,0,3.166,5.666v2.332a7.025,7.025,0,0,1-7.024,7.025H10.537S4.171,40.392,0,49.172v3.512A3.51,3.51,0,0,0,3.512,56.2H52.683a3.51,3.51,0,0,0,3.512-3.512V49.172C52.024,40.392,45.658,38.636,45.658,38.636Z" transform="translate(0 -0.002)" fill="#fff"/>
                    </svg>
                    <div>{ bank.name }</div>
                </div>

                <div className='info_panel_fields-bank-react'>
                    <div className='info_panel_field-bank-react'>
                        ${ bank.cash.toLocaleString('ru-RU') }
                        <div>
                            Наличные
                            <svg xmlns="http://www.w3.org/2000/svg" width="13%" height="13%" viewBox="0 0 22.014 16.658" fill='white'>
                                <path id="Path_50" data-name="Path 50" d="M20.781,41.794h-.524V39.02a2.208,2.208,0,0,0-2.33-2.054h-.483l0-1.031a1.488,1.488,0,0,0-1.571-1.385H1.91A1.812,1.812,0,0,0,0,36.21V49.823a1.488,1.488,0,0,0,1.571,1.385H17.932a2.207,2.207,0,0,0,2.33-2.054V46.376h.524a1.163,1.163,0,0,0,1.228-1.083V42.877A1.171,1.171,0,0,0,20.781,41.794ZM1.91,35.505H15.878a.462.462,0,0,1,.488.426l0,1.035H1.91a.736.736,0,1,1,0-1.461ZM19.174,49.15a1.182,1.182,0,0,1-1.246,1.1H1.567a.462.462,0,0,1-.488-.43V37.754a2.115,2.115,0,0,0,.831.167H17.928a1.182,1.182,0,0,1,1.246,1.1v2.774h-3.7a1.163,1.163,0,0,0-1.228,1.083v2.416a1.163,1.163,0,0,0,1.228,1.083h3.7V49.15Zm1.752-3.857a.135.135,0,0,1-.144.127h-5.3a.135.135,0,0,1-.144-.127V42.877a.138.138,0,0,1,.144-.127h5.3a.138.138,0,0,1,.144.127v2.416Z" transform="translate(0 -34.55)"/>
                            </svg>
                        </div>
                    </div>
                    <div className='info_panel_field-bank-react'>
                        ${ bank.money.toLocaleString('ru-RU') }
                        <div>
                            На счете
                            <svg xmlns="http://www.w3.org/2000/svg" width="15%" height="15%" viewBox="0 0 25.524 17.016">
                                <g id="Group_46" data-name="Group 46" transform="translate(0 -85.333)">
                                    <path id="Path_55" data-name="Path 55" d="M365.326,277.333h-1.063a1.6,1.6,0,0,0-1.6,1.6v1.063a1.6,1.6,0,0,0,1.6,1.6h1.063a1.6,1.6,0,0,0,1.6-1.6v-1.063A1.6,1.6,0,0,0,365.326,277.333Zm.532,2.659a.532.532,0,0,1-.532.532h-1.063a.532.532,0,0,1-.532-.532v-1.063a.532.532,0,0,1,.532-.532h1.063a.532.532,0,0,1,.532.532Z" transform="translate(-344.587 -182.429)" fill="#fff"/>
                                    <path id="Path_56" data-name="Path 56" d="M70.913,341.333H64.532a.532.532,0,0,0,0,1.064h6.381a.532.532,0,0,0,0-1.064Z" transform="translate(-60.81 -243.238)" fill="#fff"/>
                                    <path id="Path_57" data-name="Path 57" d="M70.913,298.667H64.532a.532.532,0,1,0,0,1.063h6.381a.532.532,0,1,0,0-1.063Z" transform="translate(-60.81 -202.699)" fill="#fff"/>
                                    <path id="Path_58" data-name="Path 58" d="M24.992,149.333H.532a.532.532,0,0,0-.532.532v3.19a.532.532,0,0,0,.532.532h24.46a.532.532,0,0,0,.532-.532v-3.19A.532.532,0,0,0,24.992,149.333Zm-.532,3.19H1.063V150.4h23.4v2.127Z" transform="translate(0 -60.81)" fill="#fff"/>
                                    <path id="Path_59" data-name="Path 59" d="M22.865,85.333H2.659A2.662,2.662,0,0,0,0,87.992v11.7a2.662,2.662,0,0,0,2.659,2.659H22.865a2.662,2.662,0,0,0,2.659-2.659v-11.7A2.662,2.662,0,0,0,22.865,85.333Zm1.6,14.357a1.6,1.6,0,0,1-1.6,1.6H2.659a1.6,1.6,0,0,1-1.6-1.6v-11.7a1.6,1.6,0,0,1,1.6-1.6H22.865a1.6,1.6,0,0,1,1.6,1.6v11.7Z" fill="#fff"/>
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div className='info_panel_field-bank-react'>
                        { String('00000000' + bank.number).slice(-8) }
                        <div>
                            Номер счета
                            <svg xmlns="http://www.w3.org/2000/svg" width="8%" height="8%" viewBox="0 0 14.597 16.682" fill='white'>
                                <path id="Path_60" data-name="Path 60" d="M16.6,6.256V4.171H13.988L14.509,0H12.424L11.9,4.171H7.733L8.255,0H6.169L5.648,4.171H2V6.256H5.387l-.52,4.171H2v2.085H4.607l-.521,4.171H6.171l.521-4.171h4.171l-.522,4.171h2.086l.521-4.171H16.6V10.426H13.208l.519-4.171Zm-5.474,4.171H6.952l.52-4.171h4.169Z" transform="translate(-2)"/>
                            </svg>
                        </div>
                    </div>
                    <div className='info_panel_field-bank-react'>
                        Classic
                        <div>
                            Статус счета
                            <svg xmlns="http://www.w3.org/2000/svg" width="13%" height="13%" viewBox="0 0 26.289 17.689" fill='white'>
                                <path id="crown" d="M25.254,49.311a.735.735,0,0,1-.019.219l-1.622,6.486a.737.737,0,0,1-.711.558l-9.729.049H3.44a.737.737,0,0,1-.715-.559L1.1,49.554a.736.736,0,0,1-.019-.225,1.549,1.549,0,1,1,1.447-.282l2.03,2.045a2.755,2.755,0,0,0,4.153-.281l3.336-4.421a1.549,1.549,0,1,1,2.212-.026l0,0L17.577,50.8a2.765,2.765,0,0,0,2.2,1.1,2.734,2.734,0,0,0,1.946-.806l2.043-2.043a1.548,1.548,0,1,1,1.483.254Zm-1.8,9.622a.737.737,0,0,0-.737-.737H3.653a.737.737,0,0,0-.737.737V60.7a.737.737,0,0,0,.737.737H22.718a.737.737,0,0,0,.737-.737Z" transform="translate(0 -43.75)"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    getPages() {
        const { pages } = this.props;

        return (
            pages.map((page, index) => (
                <div className='page-bank-react' key={index}>
                    { page }
                </div>
            ))
        )
    }

    getForm() {
        const { pages, bank } = this.props;

        return (
            <Fragment>
                { this.getInfoPanel() }
                <div className='logo-bank-react'>
                    <img src={require('../../../imgs/bank/logo.png')}/>
                </div>
                <div className='exitHouse' name='exit' onClick={this.exitBank.bind(this)}></div>

                { bank.isLoading ? this.getLoader(58) : this.getPages() }
            </Fragment>
        )
    }

    render() {
        const { bank } = this.props;

        return (
            <div className='main-form-bank'>
                { Object.keys(bank).length > 1 ? this.getForm() : this.getLoader() }
                { Object.keys(bank).length > 1 && bank.answer != null && <AnsOperationBank /> }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    bank: state.bank,
    pages: state.bankPages
});

const mapDispatchToProps = dispatch => ({
    loadInfo: info => dispatch(loadBankInfo(info)),
    closeBank: () => dispatch(closeBank())
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);