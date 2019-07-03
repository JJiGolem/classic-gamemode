import React from 'react';
import {connect} from 'react-redux';
import { setForm, closeForm, addForm } from '../../actions/forms.js';
import Loader from '../Loader.jsx';

class BusinessCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBuy: undefined,
            check: false,
            dialog: this.props.dialog,
            colorMoney: 'gold',
            colorAct: 'gold',
            actionsList: false
        }

        this.getForm = this.getForm.bind(this)
    }

    componentDidMount() {
        const { biz } = this.props;

        if(biz.price) {
            this.setState({isBuy: false});
        } else {
            this.setState({isBuy: true});
        }
    }

    componentDidUpdate(prevState, prevProps) {
        if(this.props.forms.length == 1 && this.state.check) {
            this.setState({check: false, isBuy: this.props.isBuy})
            this.refForm.style.filter = `none`
        }
    }

    mouseOver(event) {
        event.preventDefault();
        let name = event.target.name;

        switch(name) {
            case 'money':
                this.setState({colorMoney: 'black'})
                break;
            case 'act':
                this.setState({colorAct: 'black'})
                break;
        }
    }

    mouseOut(event) {
        event.preventDefault();
        let name = event.target.name;

        switch(name) {
            case 'money':
                this.setState({colorMoney: 'gold'})
                break;
            case 'act':
                this.setState({colorAct: 'gold'})
                break;
        }
    }

    getActionsList() {
        if(this.state.actionsList) {
            this.refForm.style.filter = `blur(2px)`
            return(
                <div className='dialogHouse' style={{height: '110px', width: '330px', paddingTop: '50px'}}>
                    <div className='exitEnterHouse' name='exit' onClick={this.exit.bind(this)}></div>
                    Доступных действий нет
                </div>
            )
        }
    }

    click(event) {
        event.preventDefault();

        if(!this.state.check) { 
            let name = event.target.name;
            switch(name) {
                case 'money':
                    this.setState({check: true, dialog: true})
                    this.refForm.style.filter = `blur(2px)`
                    this.props.addForm(<Loader position='center' size='small' />)
                    mp.trigger('buyBiz.client');
                    break;
                case 'act':
                    this.setState({actionsList: true})
                    break;
            }
        }
    }

    getItems(item) {
        const { biz } = this.props;

        switch(item) {
            case 'type':
                return(
                    <span style={{color: 'white', marginLeft: '5px'}}>{biz.type}</span>
                )
            case 'rent':
                return(
                    <span style={{color: 'white', marginLeft: '5px'}}><span style={{color: 'green'}}>{biz.rent}$</span> в неделю</span>
                )
            case 'owner':
                return(
                    <span style={{color: 'white', marginLeft: '5px'}}>{biz.owner}</span>
                )
        }
    }

    clickDialog(event) {
        event.preventDefault();
        this.setState({dialog: false, check: false, isBuy: this.props.isBuy})
    }

    exit(event) {
        event.preventDefault();
        if(!this.state.check) {
            if(this.state.enterList) {
                this.setState({enterList: false})
                this.refForm.style.filter = `none`
            } else if(this.state.actionsList) {
                this.setState({actionsList: false})
                this.refForm.style.filter = `none`
            } else {
                this.props.closeForm();
            }
        }
    }

    getButton(name) {
        const { biz } = this.props;

        var im;

        switch(name) {
            case 'buy':
                im = require(`../../source_icons/houses/money_${this.state.coloeMoney}.png`)
                return(
                    <button 
                        name='money'
                        id='buttonBiz' 
                        onMouseOver={this.mouseOver.bind(this)}
                        onMouseOut={this.mouseOut.bind(this)}
                        onClick={this.click.bind(this)}
                    >
                        <img 
                            className='imgHouse' 
                            src={im}
                            name='money'
                        >
                        </img>
                        Купить
                    </button>
                )
            case 'actions':
                im = require(`../../source_icons/houses/money_${this.state.coloeMoney}.png`)
                return(
                    <button 
                        name='act'
                        id='buttonBiz' 
                        onMouseOver={this.mouseOver.bind(this)}
                        onMouseOut={this.mouseOut.bind(this)}
                        onClick={this.click.bind(this)}
                    >
                        <img 
                            className='imgHouse' 
                            src={im}
                            name='act'
                        >
                        </img>
                        Действия
                    </button>
                )
        }
    }

    getNotBuyForm() {
        const { biz } = this.props;
        return(
            <form className='formBiz' ref={(form) => {this.refForm = form}}>
                
                <div className='headHouse'>
                    <div className='headSpanHouse'><span>Бизнес "{biz.name}"</span></div>
                    <div className='exitHouse' name='exit' onClick={this.exit.bind(this)}></div>
                </div>

                <div className='priceHouse'>
                    <span style={{marginRight: '15px'}}>Цена:</span>
                    <span style={{color: 'green'}}>{biz.price}$</span>
                </div>
                
                <ul className='listInfo'>
                    <div style={{fontSize: '24px', marginBottom: '40px'}}>Общая информация</div>
                    <li className='elList'>Тип: {this.getItems('type')}</li>
                    <li className='elList'>Аренда: {this.getItems('rent')}</li>
                </ul>
                
                <div className='buttonsBiz'>
                    {this.getButton('buy')}
                </div>

            </form>
        )
    }

    getIsBuyForm() {
        const { biz } = this.props;
        return(
            <form className='formBiz' ref={(form) => {this.refForm = form}}>
                <div className='headHouse'>
                    <div className='headSpanHouse'><span>Бизнес "{biz.name}"</span></div>
                    <div className='exitHouse' name='exit' onClick={this.exit.bind(this)}></div>
                </div>
                
                <ul className='listInfo'>
                    <div style={{fontSize: '24px', marginBottom: '40px'}}>Общая информация</div>
                    <li className='elList'>Тип: {this.getItems('type')}</li>
                    <li className='elList'>Владелец: {this.getItems('owner')}</li>
                </ul>
                
                <div className='buttonsHouse'>
                    {this.getButton('actions')}
                </div>
            </form>
        )
    }

    getForm() {
        if(!this.state.isBuy) {
            return(
                this.getNotBuyForm()
            )  
        } else {
            return(
                this.getIsBuyForm()
            )
        }
    }

    render() {
        return(
            <div>
                {this.getForm()}
                {this.getActionsList()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    forms: state.forms
});

const mapDispatchToProps = dispatch => ({
    setForm: form => dispatch(setForm(form)),
    addForm: form => dispatch(addForm(form)),
    closeForm: () => dispatch(closeForm()),
})

export default connect(mapStateToProps, mapDispatchToProps)(BusinessCard)
