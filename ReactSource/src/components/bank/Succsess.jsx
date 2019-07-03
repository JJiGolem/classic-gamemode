import React from 'react';
import { connect } from 'react-redux';
import { pushBank, popBank, pushPhoneBank, pushCashBoxBiz, extendBizBank, extendHouseBank, transferBank, popCashBoxBiz } from '../../actions/bank.js';
import { closeForm } from '../../actions/forms.js';
import { days, money, account, index } from '../../source/bank.js';

class Succsess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    clickNext(event) {
        event.preventDefault();
        const { type, pushBank, popBank, popCashBoxBiz, pushCashBoxBiz, pushPhoneBank, transferBank, extendBizBank, extendHouseBank } = this.props;
        switch (type) {
            case 'push':
                pushBank(money[0])
                break;
            case 'pop':
                popBank(money[0])
                break;
            case 'transfer':
                transferBank(money[0]);
                break;
            case 'phone':
                pushPhoneBank(money[0]);
                break;
            case 'cashbox_push':
                pushCashBoxBiz(index[0], money[0])
                break;
            case 'cashbox_pop':
                popCashBoxBiz(index[0], money[0]);
                break;
            case 'house':
                extendHouseBank(index[0], days[0], money[0]);
                break;
            case 'biz':
                extendBizBank(index[0], days[0], money[0]);
                break;
            default:
                break;
        }

        this.props.closeForm()
    }

    back(event) {
        event.preventDefault();
        this.props.closeForm()
    }

    render() {
        return (
            <div className='formBank' style={{background: 'rgb(0,0,0,0.8)', color: 'white'}} onClick={this.clickNext.bind(this)}>
                <div className='exitBankErr'></div>
                <div className='blockPayBank'>
                    <div className='successIcon'>
                        <svg id="Group_52" data-name="Group 52" xmlns="http://www.w3.org/2000/svg" width="129.122" height="129.122" viewBox="0 0 129.122 129.122" fill='white'>
                            <path id="Path_97" data-name="Path 97" d="M64.561,0a64.561,64.561,0,1,0,64.561,64.561A64.634,64.634,0,0,0,64.561,0Zm0,124.156a59.595,59.595,0,1,1,59.595-59.595A59.664,59.664,0,0,1,64.561,124.156Z"/>
                            <path id="Path_98" data-name="Path 98" d="M77.187,15.835,39.024,58.768,16.033,40.376a2.483,2.483,0,0,0-3.1,3.879L37.763,64.119a2.485,2.485,0,0,0,3.409-.291l39.73-44.7a2.484,2.484,0,0,0-3.715-3.3Z" transform="translate(17.797 22.246)"/>
                        </svg>
                    </div>
                    <div className='sucTextBank'>
                        <span style={{fontSize: '44px', fontWeight: 'bold'}}>Удачно</span>
                        <br></br>
                        <span>Операция прошла успешно</span>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    pushBank: money => dispatch(pushBank(money)),
    pushPhoneBank: money => dispatch(pushPhoneBank(money)),
    popBank: money => dispatch(popBank(money)),
    transferBank: money => dispatch(transferBank(money)),
    extendBizBank: (index, days, money) => dispatch(extendBizBank(index, days, money)),
    extendHouseBank: (index, days, money) => dispatch(extendHouseBank(index, days, money)),
    pushCashBoxBiz: (index, money) => dispatch(pushCashBoxBiz(index, money)),
    popCashBoxBiz: (index, money) => dispatch(popCashBoxBiz(index, money)),
    closeForm: () => dispatch(closeForm())
})

export default connect(null, mapDispatchToProps)(Succsess)