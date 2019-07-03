import React from 'react';
import {connect} from 'react-redux';
import { setApp } from '../../actions/phone.js';
import MainDisplay from './MainDisplay.jsx';

class Phone extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isCall: false,
            
        }

        this.refsForm = []
    }

    componentDidUpdate(prevState, prevProps) {
        const { phone } = this.props;
        const leng = phone.length;
        for(let i = 0; i < this.refsForm.length; i++) {
            if(this.refsForm[i] == null) {
                this.refsForm.splice(i,1);
            }
        }

        if(phone[leng - 1].type.name !== 'Loader') {
            if(phone[leng - 1].type.WrappedComponent.name == 'InCall' || phone[leng - 1].type.WrappedComponent.name == 'ActiveCall') {
                if(!this.state.isCall) {
                    this.setState({isCall: true});
                } 
            } else {
                if(this.state.isCall) {
                    this.setState({isCall: false});
                }
            } 
        } else {

        }
    }

    getApp() {
        const { phone } = this.props;
        return(
            phone.map((app, index) => 
                <div key={index} className='displayPhone' ref={(form) => {this.refsForm[index] = form}}>
                    {app}
                </div>
            )
        )
    }

    backHome(event) {
        event.preventDefault();
        if(!this.state.isCall) {  
            this.props.setApp(<MainDisplay />);
        }
    }

    render() {
        return(
            <form className='formPhone'>
                <img className='backPhone' src={require('../../source_icons/phone/back3.png')}></img>
                {this.getApp()}
                <button id='buttonHomePhone' onClick={this.backHome.bind(this)}></button>
            </form>
        )
    }
}

const mapStateToProps = state => ({
    ...state
})

const mapDispathToProps = dispatch => ({
    setApp: app => dispatch(setApp(app))
})

export default connect(mapStateToProps, mapDispathToProps)(Phone)