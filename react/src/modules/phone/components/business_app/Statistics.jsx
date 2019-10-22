import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {closeAppDisplay} from "../../actions/action.apps";
import Header from "./Header";

class Statistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPage: 1
        };

        this.getTableBody = this.getTableBody.bind(this);
    }

    getTableBody() {
        const { business } = this.props;
        const { selectedPage } = this.state;

        return (
            business.statistics.map((day, index) => (
                ((index / 6 < selectedPage) && (index / 6) > selectedPage - 1)
                && this.getTableRow(day, index)
            ))
        )
    }

    getTableRow(day, index) {
        return (
            <tr key={index}>
                <th>{this.getDateStatistics(new Date(day.date))}</th>
                <th style={{ color: '#55af14' }}>{day.money}$</th>
            </tr>
        )
    }

    getDateStatistics(date) {
        return `${String('00' + date.getDate()).slice(-2)}.${String('00' + Number(date.getMonth() + 1)).slice(-2)}`
    }

    getNavigatePanel() {
        const { business } = this.props;
        const { selectedPage } = this.state;

        let pages = [];
        let pagesCount = business.statistics.length / 6;

        for (let i = 1; i < pagesCount + 1; i++) {
            pages.push(i);
        }

        return (
            <div className='navigate_panel_stat-phone-react'>
                {
                    pages.map(page => (
                        <div style={{
                            fontSize: selectedPage == page ? '150%' : '110%',
                            marginTop: selectedPage == page && '3%'
                        }}
                             onClick={() => this.setState({ selectedPage: page })}
                        >
                            { page }
                        </div>
                    ))
                }
            </div>
        )
    }

    render() {
        const { business, closeApp } = this.props;
        const { selectedPage } = this.state;

        return (
            <Fragment>
                <div className='back_page-phone-react'>
                    <Header business={business}/>
                    <div style={{ textAlign: 'center', marginTop: '26%' }}>Финансовая статистика</div>

                    {
                        business.statistics && business.statistics.length !== 0
                        ? <div>
                                <table className='table_statistics-phone-react'>
                                    <colgroup>
                                        <col style={{ width: '30%' }}/>
                                        <col style={{ width: '70%' }}/>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>Дата</th>
                                            <th>Прибыль</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.getTableBody() }
                                    </tbody>
                                </table>
                            </div>
                        :   <div style={{ textAlign: 'center', marginTop: '40%', fontSize: '130%' }}>
                                Статистика отсутствует
                            </div>
                    }

                    { this.getNavigatePanel() }

                    <div className='house_buttons-phone-react' style={{ bottom: '3%', position: 'absolute' }}>
                        <div className='house_button-phone-react' onClick={() => closeApp()}>
                                <span className='ico_button_house-phone-react'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16.37 16.369" style={{marginTop: '5%'}}>
                                        <path id="Path_172" data-name="Path 172" d="M9.632,8.186,16.07,1.748A1.024,1.024,0,1,0,14.622.3L8.185,6.738,1.747.3A1.024,1.024,0,1,0,.3,1.748L6.737,8.186.3,14.623A1.023,1.023,0,1,0,1.747,16.07L8.185,9.633l6.437,6.437a1.024,1.024,0,0,0,1.448-1.448Z" transform="translate(0 -0.001)" fill="#f90040"/>
                                    </svg>
                                </span>
                            <div className='text_button_house-phone-react'>Назад</div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    info: state.info,
    business: state.info.biz[0]
});

const mapDispatchToProps = dispatch => ({
    closeApp: () => dispatch(closeAppDisplay())
});

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);