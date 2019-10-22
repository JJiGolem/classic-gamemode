import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {addAppDisplay, closeAppDisplay} from "../../actions/action.apps";
import {disableHomePhone, setSellInfoBusiness, setSellStatusBusiness} from "../../actions/action.info";
import AnsSell from "./AnsSell";
import HeaderBusinessApp from "./Header";
import Error from "./Error";

class ConfirmSell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConfirm: false
        };

        this.cancel = this.cancel.bind(this);
        this.confirmSell = this.confirmSell.bind(this);
    }

    getLoader() {
        return (
            <div className="loader01" style={{ margin: '10% 5%' }}></div>
        )
    }

    cancel() {
        const { closeApp, disableHome, setSellInfo } = this.props;

        // eslint-disable-next-line no-undef
        mp.trigger('biz.sell.stop');

        disableHome(false);
        setSellInfo(null);
        closeApp();
    }

    confirmSell() {
        const { setSellStatus, disableHome } = this.props;

        disableHome(true);
        this.setState({ isConfirm: true });

        // eslint-disable-next-line no-undef
        mp.trigger('biz.sell');

        /*setTimeout(() => {
            setSellStatus(0);
        }, 1000);*/

        this.props.addApp({ name: 'AnsSell', form: <AnsSell /> });
    }

    getContent() {
        const { info, addApp, closeApp, setSell } = this.props;

        if (info.biz[0].ansSell.nick != null) {
            return (
                <Fragment>
                    <div style={{ textAlign: 'center', marginTop: '26%' }}>Подтверждение продажи</div>
                    <div style={{ marginTop: '20%' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" id="sell" width="40%" height="20%" viewBox="0 0 46.038 33.727">
                            <path id="sell" data-name="Path 130" d="M45.611,68.533a.768.768,0,0,0-.806.079L32.331,78.15a1.537,1.537,0,0,0-.382,2l-1.968.537-2.872-1.223a.762.762,0,0,0-.156-.048c-2.755-.526-4.184-.019-4.922.547H14.188a1.54,1.54,0,0,0-.482-1.813L1.233,68.612A.767.767,0,0,0,0,69.221V87.636a.766.766,0,0,0,.387.666l4.749,2.713a1.521,1.521,0,0,0,.758.2,1.54,1.54,0,0,0,1.05-.418l.89.711A2.284,2.284,0,0,0,9.445,95.2c.065.006.13.008.194.008a2.288,2.288,0,0,0,.352-.03,2.664,2.664,0,0,0,.619,1.487h0a2.668,2.668,0,0,0,1.828.94c.076.007.151.01.227.01l.034,0a2.261,2.261,0,0,0,.528,1.358,2.3,2.3,0,0,0,1.754.811,2.262,2.262,0,0,0,.786-.143,2.265,2.265,0,0,0,2,1.648c.065.006.13.008.194.008a2.23,2.23,0,0,0,1.445-.52l1.2-.93,2.833,1.893a2.673,2.673,0,0,0,1.48.447,2.73,2.73,0,0,0,.538-.053A2.673,2.673,0,0,0,27.6,99.769a2.646,2.646,0,0,0,3.41-2.328,2.671,2.671,0,0,0,3.472-2.978,2.643,2.643,0,0,0,1.893-1.15,2.691,2.691,0,0,0,.355-2.192l1.513-1.513.618.926a1.537,1.537,0,0,0,2.039.482L45.651,88.3a.767.767,0,0,0,.387-.666V69.221A.767.767,0,0,0,45.611,68.533ZM1.535,87.191V70.774L10.1,77.324,3.075,88.071ZM5.9,89.684l-1.488-.85,6.914-10.575,1.451,1.109Zm4.222,3.808a.722.722,0,0,1-.547.175.752.752,0,0,1-.45-1.3l1.919-1.484a.744.744,0,0,1,.484-.178l.063,0a.752.752,0,0,1,.45,1.3Zm2.447,2.581a1.151,1.151,0,0,1-.675-2L14.307,92.2a1.151,1.151,0,0,1,1.891.973,1.134,1.134,0,0,1-.359.744l-.658.513L13.4,95.8A1.138,1.138,0,0,1,12.565,96.072Zm3.919,1.189,0,0-1.024.8a.75.75,0,0,1-1.058-.088h0a.742.742,0,0,1-.175-.547.731.731,0,0,1,.239-.492l1.794-1.4.529-.409c.006,0,.01-.011.016-.016l.542-.423a.743.743,0,0,1,.483-.178.628.628,0,0,1,.064,0,.752.752,0,0,1,.447,1.3l-1.795,1.4Zm3.881.834-1.919,1.484a.713.713,0,0,1-.547.175.752.752,0,0,1-.45-1.3l.035-.027,1.884-1.457a.752.752,0,0,1,1,1.125ZM35.1,92.463a1.159,1.159,0,0,1-1.582.33l-.006,0-5.039-3.483a.767.767,0,1,0-.872,1.262l4.876,3.371,0,0a1.145,1.145,0,0,1-.411,2.078,1.131,1.131,0,0,1-.854-.163l-5.043-3.48a.768.768,0,0,0-.872,1.263l3.683,2.541h0a1.22,1.22,0,0,1,.331,1.648,1.147,1.147,0,0,1-1.577.333L26.381,97.2h0L25,96.218a.767.767,0,0,0-.889,1.251l1.423,1.009a2.193,2.193,0,0,1,.2.178,1.154,1.154,0,0,1-1.43,1.8L21.77,98.768A2.272,2.272,0,0,0,20.1,95.275a2.264,2.264,0,0,0-2.086-2.291,2.191,2.191,0,0,0-.3,0A2.665,2.665,0,0,0,13.7,90.761a2.282,2.282,0,0,0-3.625-1.07l-1.048.81-1.2-.955L13.2,81.5h6.735a2.208,2.208,0,0,0-.716,2.053,2.186,2.186,0,0,0,1.823,1.787,7.53,7.53,0,0,0,4.171-.6l1.956,1.245a.766.766,0,0,0,.138.062l7.48,4.818a1.253,1.253,0,0,1,.364.387c0,.009.008.017.013.026A1.161,1.161,0,0,1,35.1,92.463Zm.785-2.665a2.7,2.7,0,0,0-.258-.22l-7.588-4.888a.729.729,0,0,0-.108-.042l-2.257-1.436a.768.768,0,0,0-.794-.019,6.076,6.076,0,0,1-3.588.632.646.646,0,0,1-.563-.541.692.692,0,0,1,.36-.742,8.842,8.842,0,0,0,1.61-1.078.516.516,0,0,0,.128-.162.6.6,0,0,1,.081-.083c.225-.193,1.152-.776,3.676-.309L29.624,82.2a.751.751,0,0,0,.5.034l2.712-.739,4.539,6.807Zm4.255-.114L33.263,79.369l1.452-1.11,6.914,10.575ZM44.5,87.191l-1.54.88L35.937,77.324,44.5,70.774V87.191Z" transform="translate(0 -68.454)"/>
                        </svg>
                        <div style={{ marginTop: '5%' }}>Покупатель: { info.biz[0].ansSell.nick }</div>
                        <div>Сумма: <span style={{ color: '#30af25' }}>${ String(info.biz[0].ansSell.price).toLocaleString('ru-RU') }</span></div>
                    </div>

                    {
                        this.state.isConfirm &&
                        <div style={{ fontSize: '1.15em', fontWeight: 'bold', marginTop: '10%' }}>Предложение отправлено</div>
                    }

                    <div className='house_buttons-phone-react' style={{ bottom: '6%', position: 'absolute' }}>
                        {!this.state.isConfirm && <div className='house_button-phone-react' onClick={this.confirmSell}>
                            <span className='ico_button_house-phone-react'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16.729 12.286" style={{marginLeft: '5px'}}>
                                    <path id="Path_176" data-name="Path 176" d="M16.484,68.243a.836.836,0,0,0-1.183,0L5.28,78.264,1.427,74.412A.836.836,0,0,0,.245,75.595l4.444,4.444a.837.837,0,0,0,1.183,0L16.484,69.425A.836.836,0,0,0,16.484,68.243Z" transform="translate(0 -67.997)" fill="#74a607"/>
                                </svg>
                            </span>
                            <div className='text_button_house-phone-react'>Подтвердить</div>
                        </div>}
                        <div className='house_button-phone-react' onClick={this.cancel}>
                            <span className='ico_button_house-phone-react'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16.37 16.369" style={{marginTop: '5%'}}>
                                    <path id="Path_172" data-name="Path 172" d="M9.632,8.186,16.07,1.748A1.024,1.024,0,1,0,14.622.3L8.185,6.738,1.747.3A1.024,1.024,0,1,0,.3,1.748L6.737,8.186.3,14.623A1.023,1.023,0,1,0,1.747,16.07L8.185,9.633l6.437,6.437a1.024,1.024,0,0,0,1.448-1.448Z" transform="translate(0 -0.001)" fill="#f90040"/>
                                </svg>
                            </span>
                            <div className='text_button_house-phone-react'>Отменить</div>
                        </div>
                    </div>
                </Fragment>
            )
        } else {
            closeApp();
            addApp({ name: 'Error', form: <Error status='Покупатель с таким ID не найден'/> })
        }
    }

    render() {
        const { info, business } = this.props;

        return (
            <Fragment>
                <div className='back_page-phone-react' style={{ textAlign: 'center' }}>
                    <HeaderBusinessApp business={business}/>
                    {
                        info.biz[0].ansSell && Object.keys(info.biz[0].ansSell).length > 0
                            ? this.getContent()
                            : this.getLoader()
                    }
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
    closeApp: () => dispatch(closeAppDisplay()),
    addApp: app => dispatch(addAppDisplay(app)),
    setSellStatus: status => dispatch(setSellStatusBusiness(status)),
    disableHome: state => dispatch(disableHomePhone(state)),
    setSellInfo: info => dispatch(setSellInfoBusiness(info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmSell);