import React from 'react';

class Loader extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            position: undefined,
            size: undefined
        }
    }

    setLoader(posit, sizeLoader){
        const {position, size} = this.state;
        const small = '40px';
        const medium = '60px';
        const large = '80px';
        const top = '0%';
        const left = '0%';
        const bottom = '70%';
        const right = '85%';
        const center = '45%'
        
        switch(posit){
            case 'top':
                if(top + ' ' + center != position){
                    this.setState({position: top + ' ' + center})
                }
                break;
            case 'left':
                if(top + ' ' + center != position){
                    this.setState({position: top + ' ' + center})
                }
                break;
            case 'right':
                if(center + ' ' + right != position){
                    this.setState({position: center + ' ' + right})
                }
                break;
            case 'bottom':
                if(bottom + ' ' + center != position){
                    this.setState({position: bottom + ' ' + center})
                }
                break;
            case 'center':
                if(center + ' ' + center != position){
                    this.setState({position: center + ' ' + center})
                }
                break;
            case 'top-left':
                if(top + ' ' + left != position){
                    this.setState({position: top + ' ' + left})
                }
                break;
            case 'top-right':
                if(top + ' ' + right != position){
                    this.setState({position: top + ' ' + right})
                }
                break;
            case 'bottom-right':
                if(bottom + ' ' + right != position){
                    this.setState({position: bottom + ' ' + right})
                }
                break;
            case 'bottom-left':
                if(bottom + ' ' + left != position){
                    this.setState({position: bottom + ' ' + left})
                }
                break;
            default:
                if(posit != position){
                    this.setState({position: posit})
                }
                break;
        }

        switch(sizeLoader){
            case 'small':
                if(size != small){
                    this.setState({size: small})
                }
                break;
            case 'medium':
                if(size != medium){
                    this.setState({size: medium})
                }
                break;
            case 'large':
                if(size != large){
                    this.setState({size: large})
                }
                break;
        }
    }

    render(){
        const {position, size} = this.props;
        this.setLoader(position, size)
        let border = Number(String(this.state.size).substr(0,2)) / 4 + 'px';
        let top = String(this.state.position).split(' ')[0];
        let right = String(this.state.position).split(' ')[1];
        return(
            <div className="lds-css ng-scope">
                <div className="lds-rolling" style={{right: right, top: top}}>
                    <div style={{
                        width: this.state.size, 
                        height: this.state.size,
                        borderWidth: border
                        }}>
                    </div>
                </div>
            </div>
        );
    }
}

export default Loader;