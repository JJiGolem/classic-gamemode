import React from 'react';
import {connect} from 'react-redux';
import { setForm, closeForm, addForm } from '../../actions/forms.js';

class MesHouse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: this.props.message
        }
    }

    click(event) {
        event.preventDefault();
        this.props.closeForm();
    }

    render() {
        if(this.props.mes == 'Покупка успешно совершена'){
            return(
                <div className='dialogHouse' style={{paddingTop: '40px'}}>
                    <div className='exitEnterHouse' name='exit' onClick={this.click.bind(this)}></div>
                    <div><span>{this.props.mes}</span></div>
                    <img src={require('../../source_icons/houses/suc.png')} style={{height: '40px', width: '40px', marginTop: '20px'}}></img>
                </div>
            )
        } else if(this.props.mes == 'Дверь заперта'){
            return(
                <div className='dialogHouse' style={{paddingTop: '40px', height: '140px'}}>
                    <div className='exitEnterHouse' name='exit' onClick={this.click.bind(this)}></div>
                    <div><span>{this.props.mes}</span></div>
                    <img src={require('../../source_icons/houses/err.png')} style={{height: '40px', width: '40px', marginTop: '20px'}}></img>
                </div>
            )
        } else {
            return(
                <div className='dialogHouse' style={{paddingTop: '40px', height: '160px'}}>
                    <div className='exitEnterHouse' name='exit' onClick={this.click.bind(this)}></div>
                    <div><span>{this.props.mes}</span></div>
                    <img src={require('../../source_icons/houses/err.png')} style={{height: '40px', width: '40px', marginTop: '20px'}}></img>
                </div>
            )
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(MesHouse)