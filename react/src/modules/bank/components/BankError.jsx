import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import { setAnswerBank } from "../actions/action.bank";

class BankError extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    exit() {
        const { setAnswer } = this.props;

        setAnswer({ answer: null, type: null });
    }

    render() {
        const { text } = this.props;

        return (
            <Fragment>
                <div className='answer_form-bank-react' onClick={this.exit.bind(this)}>
                    <div className='exitHouse' name='exit'></div>
                    <div className='answer_ico-bank-react'>
                        <svg id="Group_53" data-name="Group 53" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 129.122 129.122" fill='white'>
                            <path id="Path_99" data-name="Path 99" d="M64.561,0a64.561,64.561,0,1,0,64.561,64.561A64.634,64.634,0,0,0,64.561,0Zm0,124.156a59.595,59.595,0,1,1,59.595-59.595A59.664,59.664,0,0,1,64.561,124.156Z"/>
                            <path id="Path_100" data-name="Path 100" d="M64.935,16.728a2.48,2.48,0,0,0-3.511,0L40.832,37.32,20.239,16.728a2.483,2.483,0,1,0-3.511,3.511L37.32,40.832,16.728,61.424a2.483,2.483,0,1,0,3.511,3.511L40.832,44.343,61.424,64.935a2.483,2.483,0,0,0,3.511-3.511L44.343,40.832,64.935,20.239A2.48,2.48,0,0,0,64.935,16.728Z" transform="translate(23.729 23.729)"/>
                        </svg>
                    </div>
                    <div className='answer_text-bank-react'>{ text }</div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    bank: state.bank
});

const mapDispatchToProps = dispatch => ({
    setAnswer: answer => dispatch(setAnswerBank(answer))
});

export default connect(mapStateToProps, mapDispatchToProps)(BankError);