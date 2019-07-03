import React from 'react';
import Menu from './Menu.jsx';
import Loader from '../LoaderBank.jsx';
import { money, account } from '../../source/bank.js';
import { connect } from 'react-redux';
import { setPageBank } from '../../actions/bankPages.js';
import { addForm } from '../../actions/forms.js'

class Check extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: undefined
        }
    }

    clickNext(event) {
        const { addForm } = this.props;
        event.preventDefault();
        addForm(<Loader position='42% 35%' size='small' />)
        mp.trigger('transferBank.client', money[0], account[0]);
    }

    back(event) {
        event.preventDefault();
        this.props.setPage(<Menu />)
    }

    focusInput(event) {
        event.target.style.borderRight = '1.5px solid #3d3d3d'
    }

    render() {
        const { ans } = this.props;
        return (
            <div className='pageBank'>
                <div className='titlePageBank'>Подтверждение перевода</div>
                <div className='blockPayBank'>
                    <div>
                        <div>Получатель: {ans}</div>
                        <div>Номер счета: {String('00000000' + account[0]).slice(-8)}</div>
                        <div>Сумма перевода: {money[0]}</div>
                    </div>
                    <div>
                        <button onClick={this.clickNext.bind(this)} id='buttonPayBank'>Перевести</button>
                        <button onClick={this.back.bind(this)} id='buttonBackBank'>Отмена</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    forms: state.forms,
    bank: state.bank,
    pages: state.bankPages
});

const mapDispatchToProps = dispatch => ({
    addForm: form => dispatch(addForm(form)),
    setPage: page => dispatch(setPageBank(page))
})

export default connect(mapStateToProps, mapDispatchToProps)(Check)