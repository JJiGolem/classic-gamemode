import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {addAppDisplay, closeAppDisplay, setAppsDisplay} from "../../actions/action.apps";
import Success from "./Success";
import MainDisplay from '../MainDisplay';
import Error from "./Error";

class AnsSell extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.getAnsPage = this.getAnsPage.bind(this);
    }

    getAnsPage(status) {
        const { addApp, closeApp, setApps, business } = this.props;

        if (status === 0) {
            closeApp();
            closeApp();
            addApp({ name: 'Error', form: <Error status='Ошибка'/> });
        }
        else if (status === 1) {
            let name = business.name;
            let area = business.area;
            setApps([
                { name: 'MainDisplay', form: <MainDisplay /> },
                { name: 'SuccessSell', form: <Success name={name} area={area}  status='Бизнес успешно продан'/> }
            ]);
        }
        else if (status === 2) {
            closeApp();
            closeApp();
            addApp({ name: 'Error', form: <Error status='Покупатель не принял условия сделки'/> });
        }

        else if (status === 3) {
            closeApp();
            closeApp();
            addApp({ name: 'Error', form: <Error status='Вы находитесь не рядом с бизнесом'/> });
        }

        else if (status === 4) {
            closeApp();
            closeApp();
            addApp({ name: 'Error', form: <Error status='Нельзя продать бизнес дешевле гос.стоимости'/> });
        }

        else if (status === 5) {
            closeApp();
            closeApp();
            addApp({ name: 'Error', form: <Error status='У покупателя недостаточно денег'/> });
        }

        else if (status === 6) {
            closeApp();
            closeApp();
            addApp({ name: 'Error', form: <Error status='У покупателя уже есть бизнес'/> });
        }
    }

    render() {
        const { info } = this.props;

        return (
            <div className='back_page-phone-react'>
                {
                    info.biz[0].sellStatus != null
                        ? <Fragment>{this.getAnsPage(info.biz[0].sellStatus)}</Fragment>
                        : <div className="loader01" style={{ margin: '10% 5%' }}></div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    info: state.info,
    business: state.info.biz[0]
});

const mapDispatchToProps = dispatch => ({
    addApp: app => dispatch(addAppDisplay(app)),
    setApps: apps => dispatch(setAppsDisplay(apps)),
    closeApp: () => dispatch(closeAppDisplay()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnsSell);