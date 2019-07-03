import React from 'react';
import {connect} from 'react-redux';
import Chat from './components/chat/Chat.jsx';


class UIconstructor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    getChat() {
        return (
            <Chat />
        )
    }

    // getForms(){
    //     const { forms } = this.props;
    //     return(
    //         forms.map((block, index) => <div key={index*10}>{block}</div>)
    //     )
    // }

    render() {

        return(  
            <div>
                <Chat />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state
  });
  
const mapDispatchToProps = dispatch => ({

  });

export default connect(
    mapStateToProps, mapDispatchToProps
  )(UIconstructor)
