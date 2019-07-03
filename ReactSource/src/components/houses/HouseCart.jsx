import React from 'react';
import {connect} from 'react-redux';
import { setForm, closeForm, addForm } from '../../actions/forms.js';
import Loader from '../Loader.jsx';

class HouseCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBuy: undefined,
            check: false,
            dialog: this.props.dialog,
            colorMoney: 'gold',
            colorMag: 'gold',
            colorAct: 'gold',
            colorEnt: 'gold',
            colorEntH: 'gold',
            colorEntG: 'gold',
            enterList: false,
            actionsList: false
        }

        this.getForm = this.getForm.bind(this)
    }

    componentDidMount() {
        const { house } = this.props;

        if(house.price) {
            this.setState({isBuy: false});
        } else {
            this.setState({isBuy: true});
        }
    }

    componentDidUpdate(prevState, prevProps) {
        if(this.props.forms.length == 1 && this.state.check) {
            this.setState({check: false, isBuy: this.props.isBuy})
            this.refForm.style.filter = `none`
            if(this.state.enterList && this.props.forms.length == 1) {
                this.refEnter.style.filter = `none`
            }
        }
    }

    mouseOver(event) {
        event.preventDefault();
        let name = event.target.name;

        switch(name) {
            case 'money':
                this.setState({colorMoney: 'black'})
                break;
            case 'mag':
                this.setState({colorMag: 'black'})
                break;
            case 'act':
                this.setState({colorAct: 'black'})
                break;
            case 'ent':
                this.setState({colorEnt: 'black'})
                break;
            case 'entH':
                this.setState({colorEntH: 'black'})
                break;
            case 'entG':
                this.setState({colorEntG: 'black'})
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
            case 'mag':
                this.setState({colorMag: 'gold'})
                break;
            case 'act':
                this.setState({colorAct: 'gold'})
                break;
            case 'ent':
                this.setState({colorEnt: 'gold'})
                break;
            case 'entH':
                this.setState({colorEntH: 'gold'})
                break;
            case 'entG':
                this.setState({colorEntG: 'gold'})
                break;
        }
    }

    getEnterList() {
        if(this.state.enterList) {
            this.refForm.style.filter = `blur(2px)`
            return(
                <div className='dialogHouse' style={{height: '200px', width: '330px', paddingTop: '50px'}} ref={(enter)=> this.refEnter = enter}>
                    <div className='exitEnterHouse' name='exit' onClick={this.exit.bind(this)}></div>
                    {this.getButton('enterHouse')}
                    {this.props.house.garage && this.getButton('enterGarage')}
                </div>
            )
        }
    }

    getActionsList() {
        if(this.state.actionsList) {
            this.refForm.style.filter = `blur(2px)`
            return(
                <div className='dialogHouse' style={{height: '200px', width: '330px', paddingTop: '50px'}}>
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
            console.log(name)
            switch(name) {
                case 'money':
                    this.setState({check: true, dialog: true})
                    this.refForm.style.filter = `blur(2px)`
                    this.props.addForm(<Loader position='center' size='small' />)
                    mp.trigger('buyHouse.client');
                    break;
                case 'mag':
                    mp.trigger('enterHouse.client');
                    this.props.closeForm();
                    break;
                case 'act':
                    this.setState({actionsList: true})
                    break;
                case 'ent':
                    this.setState({enterList: true})
                    break;
                case 'entH':
                    mp.trigger('enterHouse.client');
                    this.setState({check: true, dialog: true})
                    this.refEnter.style.filter = `blur(2px)`
                    this.props.addForm(<Loader position='center' size='small' />)
                    break;
                case 'entG':
                    mp.trigger('enterGarage.client');
                    this.setState({check: true, dialog: true})
                    this.refEnter.style.filter = `blur(2px)`
                    this.props.addForm(<Loader position='center' size='small' />)
                break;
            }
        }
    }

    getItems(item) {
        const { house } = this.props;

        switch(item) {
            case 'area':
                return(
                    <span style={{color: 'white', marginLeft: '5px'}}>{house.area}</span>
                )
            case 'class':
                return(
                    <span style={{color: 'white', marginLeft: '5px'}}>{house.class}</span>
                )
            case 'numR':
                return(
                    <span style={{color: 'white', marginLeft: '5px'}}>{house.numRooms}</span>
                )
            case 'gar':
                if(house.garage) {
                    return(
                        <span style={{color: 'green', marginLeft: '5px'}}>есть</span>
                    )
                } else {
                    return(
                        <span style={{color: 'red', marginLeft: '5px'}}>нет</span>
                    )
                }
            case 'numG':
                return(
                    <span style={{color: 'white', marginLeft: '5px'}}>{house.carPlaces}</span>
                )
            case 'rent':
                return(
                    <span style={{color: 'white', marginLeft: '5px'}}><span style={{color: 'green'}}>{house.rent}$</span> в день</span>
                )
            case 'owner':
                return(
                    <span style={{color: 'white', marginLeft: '5px'}}>{house.owner}</span>
                )
        }
    }

    clickDialog(event) {
        event.preventDefault();
        this.setState({dialog: false, check: false, isBuy: this.props.isBuy})
    }

    exit(event) {
        event.preventDefault();
        if(this.state.enterList) {
            this.setState({enterList: false})
            this.refForm.style.filter = `none`
        } else if(this.state.actionsList) {
            this.setState({actionsList: false})
            this.refForm.style.filter = `none`
        } else {
            //trigger выхода
            this.props.closeForm();
        }
    }

    getButton(name) {
        const { house } = this.props;

        var im;

        switch(name) {
            case 'buy':
                im = require(`../../source_icons/houses/money_${this.state.coloeMoney}.png`)
                return(
                    <button 
                        name='money'
                        id='buttonHouse' 
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
            case 'look':
                im = require(`../../source_icons/houses/money_${this.state.coloeMoney}.png`)
                return(
                    <button 
                        name='mag'
                        id='buttonHouse' 
                        onMouseOver={this.mouseOver.bind(this)}
                        onMouseOut={this.mouseOut.bind(this)}
                        onClick={this.click.bind(this)}
                    >
                        <img 
                            className='imgHouse' 
                            src={im}
                            name='mag'
                        >
                        </img>
                        Осмотреть
                    </button>
                )
            case 'actions':
                im = require(`../../source_icons/houses/money_${this.state.coloeMoney}.png`)
                return(
                    <button 
                        name='act'
                        id='buttonHouse' 
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
            case 'enterHouse':
                im = require(`../../source_icons/houses/money_${this.state.coloeMoney}.png`)
                return(
                    <button 
                        name='entH'
                        id='buttonHouse' 
                        onMouseOver={this.mouseOver.bind(this)}
                        onMouseOut={this.mouseOut.bind(this)}
                        onClick={this.click.bind(this)}
                    >
                        <img 
                            className='imgHouse' 
                            src={im}
                            name='entH'
                        >
                        </img>
                        Войти в<br></br>дом
                    </button>
                )
            case 'enterGarage':
                im = require(`../../source_icons/houses/money_${this.state.coloeMoney}.png`)
                return(
                    <button 
                        name='entG'
                        id='buttonHouse' 
                        onMouseOver={this.mouseOver.bind(this)}
                        onMouseOut={this.mouseOut.bind(this)}
                        onClick={this.click.bind(this)}
                    >
                        <img 
                            className='imgHouse' 
                            src={im}
                            name='entG'
                        >
                        </img>
                        Войти в<br></br>гараж
                    </button>
                )
            case 'enter':
                im = require(`../../source_icons/houses/money_${this.state.coloeMoney}.png`)
                return(
                    <button 
                        name='ent'
                        id='buttonHouse' 
                        onMouseOver={this.mouseOver.bind(this)}
                        onMouseOut={this.mouseOut.bind(this)}
                        onClick={this.click.bind(this)}
                    >
                        <img 
                            className='imgHouse' 
                            src={im}
                            name='ent'
                        >
                        </img>
                        Войти
                    </button>
                )
        }
    }

    getNotBuyForm() {
        const { house } = this.props;
        return(
            <form className='formCart' ref={(form) => {this.refForm = form}}>
                
                <div className='headHouse'>
                    <div className='headSpanHouse'><span>Дом №{house.name}</span></div>
                    <div className='exitHouse' name='exit' onClick={this.exit.bind(this)}></div>
                </div>

                <div className='priceHouse'>
                    <span style={{marginRight: '15px'}}>Цена:</span>
                    <span style={{color: 'green'}}>{house.price}$</span>
                </div>
                
                <ul className='listInfo'>
                    <div style={{fontSize: '26px', marginBottom: '30px'}}>Общая информация</div>
                    <li className='elList'>Район: {this.getItems('area')}</li>
                    <li className='elList'>Класс: {this.getItems('class')}</li>
                    <li className='elList'>Количество комнат: {this.getItems('numR')}</li>
                    <li className='elList'>Гараж: {this.getItems('gar')}</li>
                    <li className='elList'>Мест в гараже: {this.getItems('numG')}</li>
                    <li className='elList'>Аренда: {this.getItems('rent')}</li>
                </ul>
                
                <div className='buttonsHouse'>
                    {this.getButton('buy')}
                    {this.getButton('look')}
                </div>

            </form>
        )
    }

    getIsBuyForm() {
        const { house } = this.props;
        return(
            <form className='formCart' style={{height: '370px'}} ref={(form) => {this.refForm = form}}>
                <div className='headHouse'>
                    <div className='headSpanHouse'><span>Дом №{house.name}</span></div>
                    <div className='exitHouse' name='exit' onClick={this.exit.bind(this)}></div>
                </div>
                
                <ul className='listInfo'>
                    <div style={{fontSize: '26px', marginBottom: '30px'}}>Общая информация</div>
                    <li className='elList'>Район: {this.getItems('area')}</li>
                    <li className='elList'>Класс: {this.getItems('class')}</li>
                    <li className='elList'>Количество комнат: {this.getItems('numR')}</li>
                    <li className='elList'>Гараж: {this.getItems('gar')}</li>
                    <li className='elList'>Мест в гараже: {this.getItems('numG')}</li>
                    <li className='elList'>Аренда: {this.getItems('rent')}</li>
                    <li className='elList'>Владелец: {this.getItems('owner')}</li>
                </ul>
                
                <div className='buttonsHouse'>
                    {this.getButton('enter')}
                    {this.getButton('actions')}
                </div>

            </form>
        )
    }

    getForm() {
        const { house } = this.props;

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
                {this.getEnterList()}
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
    closeForm: () => dispatch(closeForm())
})

export default connect(mapStateToProps, mapDispatchToProps)(HouseCart)