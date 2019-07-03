import React from 'react';
import {connect} from 'react-redux';
import { setApp, closeApp } from '../../actions/phone.js';

class ActiveCall extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            number: '',
            isEnd: false,
            isStart: false,
            time: ''
        }
    }

    startCall() {
        setInterval(() => {!this.state.isEnd && this.increment()}, 1000)
    }

    increment() {
        const { time } = this.state;
        if(time.length === 5) {
            var min = String(time).split(':')[0];
            var sec = String(time).split(':')[1];

            sec = Number(sec);
            sec += 1;

        if(sec >= 60) {
            sec %= 60;
            min = Number(min);
            min += 1;
            if(min < 10) {
                min = '0' + min;
            }
        }
        
        if(sec < 10) {
            sec = '0' + sec;
        }

        let newTime;

        if(min == 60) {
            newTime = '01:00' + ':' + sec;
        } else {
            newTime = min + ':' + sec;
        }
            this.setState({time: newTime})
        } else {
            var hour = String(time).split(':')[0];
            var min = String(time).split(':')[1];
            var sec = String(time).split(':')[2];

            sec = Number(sec);
            sec += 1;

            if(min >= 60) {
                min %= 60;
                hour = Number(hour);
                hour += 1;
                if(hour < 10) {
                    hour = '0' + hour;
                }
            } 

            if(sec >= 60) {
                sec %= 60;
                min = Number(min);
                min += 1;
                if(min < 10) {
                    min = '0' + min;
                }
            }
        
            if(sec < 10) {
                sec = '0' + sec;
            }

            let newTime = hour + ':' + min + ':' + sec;
            this.setState({time: newTime})
        }     
    }

    componentDidMount() {
        const { status } = this.props;
        if(status === 'Звонок идет') {
            if(!this.state.isStart) {
                this.setState({time: '00:00'})
                this.startCall();
                this.setState({isStart: true})
            }
        }
    }

    componentDidUpdate() {
        const { status } = this.props;
        if(status == 'Нет номера' || status == 'Абонент занят') {
            this.state.time !== '00:00' && this.setState({time: '00:00'})
            !this.state.isEnd && this.setState({isEnd: true})
            setTimeout(() => {
                this.props.closeApp()
            }, 1500)
        }

        if(status == 'Звонок завершен') {
            !this.state.isEnd && this.setState({isEnd: true})
            setTimeout(() => {
                this.props.closeApp()
            }, 1500)
        }

        if(status === 'Звонок идет') {
            if(!this.state.isStart) {
                this.setState({time: '00:00'})
                this.startCall();
                this.setState({isStart: true})
            }
        }
    }

    endCall(event) {
        event.preventDefault();
        mp.trigger('endCall.client')
        this.props.closeApp();
    }

    render() {
        return(
            <div className='inCallForm'>
                <div style={{color: 'white', margin: '30px auto 20px auto', textAlign: 'center', fontSize: '13px'}}>{this.props.status}</div>
                <div className='contactIcon' style={{width: '100px', height: '100px', marginLeft: '60px'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="36.19" viewBox="0 0 38 36.19" style={{transform: 'scale(2.5)', margin: '40px 29px'}}>
                        <path id="_4F" data-name="4F" d="M17.877,37.19A32.219,32.219,0,0,1,4.442,34.554c-3.589-1.7-5.565-3.96-5.565-6.364s1.976-4.664,5.565-6.364A32.219,32.219,0,0,1,17.877,19.19a32.219,32.219,0,0,1,13.435,2.636c3.588,1.7,5.565,3.96,5.565,6.364s-1.976,4.664-5.565,6.364A32.219,32.219,0,0,1,17.877,37.19Zm.29-19.537A8.892,8.892,0,0,1,9.23,8.826a8.939,8.939,0,0,1,17.876,0A8.893,8.893,0,0,1,18.167,17.653Z" transform="translate(1.123 0)" fill="#cacaca"/>                    
                    </svg>
                </div>
                <div className='numberPanel' style={{fontSize: '20px', color: 'white', textAlign: 'center'}}>
                    {this.props.number}
                </div>       

                <div style={{color: 'gray', fontSize: '20px', textAlign: 'center'}}>{this.state.time}</div>     

                {!this.state.isEnd && <button id='butEndCall' onClick={this.endCall.bind(this)} style={{left: '66px'}}> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="45.327" height="45.748" viewBox="0 0 45.327 45.748" style={{transform: 'scale(.4)', marginTop: '-5.5px'}}>
                        <g id="Group_2" data-name="Group 2" transform="translate(-191.727 -94.812)">
                            <path id="_2J" data-name="2J" d="M36.868,0c-2.248,0-6.229,1.263-10.649,3.379-3.88,1.854-9.34,6.414-14.606,12.2S2.607,26.9,1.6,30.41C.33,33.72-.2,36.32.068,37.929c.083.5.254,1.537,6.459,6.92l.082.06a4.4,4.4,0,0,0,2.524.838,3.545,3.545,0,0,0,2.367-.9c1.423-1.217,4.575-5.987,5.507-7.42.2-.329,1.931-3.277.635-5.47-.6-1-1.7-3.194-2.306-4.41A54.382,54.382,0,0,1,26.981,15.41l3.954,2.14a5.894,5.894,0,0,0,2.262.432,6.485,6.485,0,0,0,2.212-.392l.337-.17,8.03-5.449a4.574,4.574,0,0,0,1.544-2.911A3.674,3.674,0,0,0,44.311,6.31c-.306-.339-.7-.817-1.087-1.28C41.057,2.441,39.416.576,38.028.149A4.009,4.009,0,0,0,36.868,0ZM9.082,42.742a1.26,1.26,0,0,1-.652-.223,50.407,50.407,0,0,1-5.421-5.24c-.04-.551.019-2.227,1.417-5.86l.045-.13C6.343,24.563,19.911,9.72,27.514,6.079c5.113-2.446,8.264-3.1,9.321-3.1a1.267,1.267,0,0,1,.308.029c.725.287,2.845,2.824,3.75,3.908l.027.033.1.118c.411.493.765.918,1.058,1.242.263.3.255.465.252.529a1.494,1.494,0,0,1-.454.8l-7.64,5.179a3.584,3.584,0,0,1-1.046.157,3.238,3.238,0,0,1-.984-.147l-5.44-2.959L26,12.41A56.145,56.145,0,0,0,12.336,26.63l-.448.709.37.76.1.206c1.272,2.561,2.18,4.3,2.7,5.184.228.391-.132,1.579-.594,2.34a53.2,53.2,0,0,1-4.918,6.74A.694.694,0,0,1,9.082,42.742Z" transform="translate(191.727 94.812)" fill="#fff"/>
                            <path id="Path_1" data-name="Path 1" d="M354.175,1708.405l27.1,28.016" transform="translate(-156.999 -1608.864)" fill="none" stroke="#fff" stroke-width="3"/>
                        </g>
                    </svg>
                </button>}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state
})

const mapDispathToProps = dispatch => ({
    setApp: app => dispatch(setApp(app)),
    closeApp: () => dispatch(closeApp())
})

export default connect(mapStateToProps, mapDispathToProps)(ActiveCall)