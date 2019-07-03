import React from 'react';
import { connect } from 'react-redux';
import HouseMenager from './HouseMenager.jsx';
import { setApp, buyImprovement} from '../../../actions/phone.js';
import MainDisplay from '../MainDisplay.jsx';

class Improvements extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colorSign: '#313539',
            colorShk: '#313539'
        }
        this.mouseOut = this.mouseOut.bind(this)
        this.mouseOver = this.mouseOver.bind(this)
    }

    buyImpr(imp, event) {
        event.preventDefault();
        if(!imp.isBuyed) {
            this.props.buyImprovement(this.props.house.name, imp.name)
            console.log(this.props.house.name, imp.name)
        }
    }

    mouseOut(event) {
        event.preventDefault();
        let id = event.target.id;

        switch(id) {
            case 'Сигнализация':
                this.setState({colorSign: '#313539'})
                break;
            case 'Шкаф':
                this.setState({colorShk: '#313539'})
                break;
        }
    }

    mouseOver(event) {
        event.preventDefault();
        let id = event.target.id;

        switch(id) {
            case 'Сигнализация':
                this.setState({colorSign: 'white'})
                break;
            case 'Шкаф':
                this.setState({colorShk: 'white'})
                break;
        }
    }

    getIcon(name) {
        switch(name) {
            case 'Сигнализация':
                return (
                    <svg id="Сигнализация" xmlns="http://www.w3.org/2000/svg" width="55.733" height="55.735" viewBox="0 0 55.733 55.735" fill={this.state.colorSign}>
                        <g id="Сигнализация" data-name="Group 102" transform="translate(-0.007)">
                            <path id="Сигнализация" data-name="Path 148" d="M229.267,337.005a3.266,3.266,0,1,0,3.266,3.266A3.269,3.269,0,0,0,229.267,337.005Zm0,4.354a1.089,1.089,0,1,1,1.089-1.089A1.09,1.09,0,0,1,229.267,341.359Z" transform="translate(-200.393 -300.319)"/>
                            <path id="Сигнализация" data-name="Path 149" d="M229.267,209.008A3.269,3.269,0,0,0,226,212.274V217.5a3.266,3.266,0,0,0,6.531,0v-5.225A3.269,3.269,0,0,0,229.267,209.008Zm1.089,8.491a1.089,1.089,0,1,1-2.177,0v-5.225a1.089,1.089,0,1,1,2.177,0Z" transform="translate(-200.393 -186.256)"/>
                            <path id="Сигнализация" data-name="Path 150" d="M436.5,178.211a1.089,1.089,0,0,0-1.422-.589l-3.562,1.475a1.089,1.089,0,1,0,.833,2.011l3.562-1.475A1.089,1.089,0,0,0,436.5,178.211Z" transform="translate(-383.935 -158.212)"/>
                            <path id="Сигнализация" data-name="Path 151" d="M325.542,50.177a1.089,1.089,0,0,0-1.422.589l-1.475,3.562a1.089,1.089,0,1,0,2.011.833l1.475-3.562A1.089,1.089,0,0,0,325.542,50.177Z" transform="translate(-287.442 -44.641)"/>
                            <path id="Сигнализация" data-name="Path 152" d="M62.536,82.658,57.18,77.3a1.089,1.089,0,0,0-1.54,1.54L61,84.2a1.089,1.089,0,0,0,1.539-1.54Z" transform="translate(-49.293 -68.603)"/>
                            <path id="Сигнализация" data-name="Path 153" d="M394.688,77.3a1.089,1.089,0,0,0-1.54,0l-5.356,5.356a1.089,1.089,0,0,0,1.54,1.54l5.356-5.356A1.089,1.089,0,0,0,394.688,77.3Z" transform="translate(-345.287 -68.601)"/>
                            <path id="Сигнализация" data-name="Path 154" d="M493.851,267.979a1.088,1.088,0,1,0,.319.77A1.1,1.1,0,0,0,493.851,267.979Z" transform="translate(-438.43 -238.523)"/>
                            <path id="Сигнализация" data-name="Path 155" d="M416.749,267.66h-5a1.089,1.089,0,0,0,0,2.177h5a1.089,1.089,0,0,0,0-2.177Z" transform="translate(-365.952 -238.523)"/>
                            <path id="Сигнализация" data-name="Path 156" d="M33.5,179.1l-3.562-1.475a1.089,1.089,0,0,0-.833,2.011l3.562,1.475A1.089,1.089,0,0,0,33.5,179.1Z" transform="translate(-25.329 -158.213)"/>
                            <path id="Сигнализация" data-name="Path 157" d="M159.447,54.327l-1.475-3.562a1.089,1.089,0,0,0-2.011.833l1.475,3.562a1.089,1.089,0,1,0,2.011-.833Z" transform="translate(-138.903 -44.64)"/>
                            <path id="Сигнализация" data-name="Path 158" d="M1.865,267.979a1.088,1.088,0,0,0-1.539,0,1.089,1.089,0,0,0,.77,1.858,1.088,1.088,0,0,0,.77-1.858Z" transform="translate(0 -238.523)"/>
                            <path id="Сигнализация" data-name="Path 159" d="M45.674,267.66h-5a1.089,1.089,0,1,0,0,2.177h5a1.089,1.089,0,1,0,0-2.177Z" transform="translate(-35.271 -238.523)"/>
                            <path id="Сигнализация" data-name="Path 160" d="M247.858,99.282a1.089,1.089,0,1,0,.319.771A1.1,1.1,0,0,0,247.858,99.282Z" transform="translate(-219.215 -88.191)"/>
                            <path id="Сигнализация" data-name="Path 161" d="M247.089,0A1.089,1.089,0,0,0,246,1.089V7.62a1.089,1.089,0,1,0,2.177,0V1.089A1.089,1.089,0,0,0,247.089,0Z" transform="translate(-219.215)"/>
                            <path id="Сигнализация" data-name="Path 162" d="M128.018,184.4l-2.73-8.055a1.088,1.088,0,0,0-1.031-.739H124.1V159.82a13.825,13.825,0,0,0-27.649,0v15.785h-.158a1.088,1.088,0,0,0-1.031.739l-2.73,8.055a1.089,1.089,0,0,0,1.031,1.438h33.425a1.089,1.089,0,0,0,1.031-1.438ZM98.627,159.82a11.647,11.647,0,0,1,23.295,0v15.785H98.627ZM95.081,183.66l1.992-5.878h26.4l1.992,5.878Z" transform="translate(-82.401 -130.102)"/>
                        </g>
                    </svg>
                )
            case 'Шкаф':
                return(
                    <svg id="Шкаф" xmlns="http://www.w3.org/2000/svg" width="53.267" height="55.733" viewBox="0 0 53.267 55.733" fill={this.state.colorShk}>
                        <g id="Шкаф" data-name="Group 103" transform="translate(0 0)">
                            <path id="Шкаф" data-name="Path 163" d="M.866,55.733H52.4a.816.816,0,0,0,.866-.8V49.095a.882.882,0,0,0-.866-.883H50.554V7.522H52.4a.882.882,0,0,0,.866-.883V.8A.816.816,0,0,0,52.4,0H.866A.816.816,0,0,0,0,.8V6.639a.882.882,0,0,0,.866.883H2.713v40.69H.866A.882.882,0,0,0,0,49.095V54.93A.816.816,0,0,0,.866,55.733ZM27.5,48.212V35.635H48.828V48.212Zm21.331-14.3H27.5V22.071H48.828Zm0-13.563H27.5V7.522H48.828ZM1.726,1.726H51.541V5.8H1.726Zm2.713,5.8H25.77v40.69H4.439ZM1.726,49.938H51.541v4.069H1.726Zm0,0" transform="translate(0 0)"/>
                            <path id="Шкаф" data-name="Path 164" d="M161.686,181.863a.863.863,0,0,0-.863-.863h-2.959a.863.863,0,0,0-.863.863v9.371a.863.863,0,0,0,.863.863h2.959a.863.863,0,0,0,.863-.863Zm-1.726,8.508h-1.233v-7.645h1.233Zm0,0" transform="translate(-137.641 -158.682)"/>
                        </g>
                    </svg>
                )
        }
    }

    getImprovBlock(imp, index) {
        return(
            <div 
                key={index*50} 
                className='blockImprovement'
                onClick={this.buyImpr.bind(this, imp)}
                onMouseOver={this.mouseOver}
                onMouseOut={this.mouseOut}
                id={imp.name}
            > 
                <div className='icoImprovements' id={imp.name}>{this.getIcon(imp.name)}</div>
                <div id={imp.name} style={{width: '100px', display: 'inline-block', marginTop: '10px'}}>
                    <span id={imp.name} style={{fontSize: '14px', fontWeight: 'bold'}}>{imp.name}</span>
                    <br id={imp.name}/>
                    {
                        imp.isBuyed 
                        ? <span id={imp.name} style={{fontSize: '12px', color: 'green'}}>Улучшение куплено</span>
                        : <span id={imp.name} style={{fontSize: '12px', color: 'red'}}>Купить за  ${imp.price}</span>
                    }
                </div>
            </div>
        )
    }

    getContent() {
        const { improvements } = this.props;
        return(
            improvements.map((imp, index) => (
                this.getImprovBlock(imp, index)
            ))
        )
    }

    back(event) {
        event.preventDefault();
        this.props.setApp(<HouseMenager />);
    }

    exit(event) {
        event.preventDefault();
        this.props.setApp(<MainDisplay />);
    }

    render() {
        const { house } = this.props;
        return(
            <div style={{height: '365px', background: 'white'}}>
                <div className='headHousePhone'>
                    <span className='headSpanHouseApp'>Дом {house.name}</span><br></br>
                    <span style={{color: 'yellow'}}>{house.area}</span>
                </div>

                <div style={{width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', margin: '5px 0 5px 0'}}>Улучшения дома</div>
                {house.improvements.length !== 0 
                    ? this.getContent()
                    : <div style={{textAlign: 'center', fontSize: '16px', fontWeight: 'bold'}}>Список улучений пуст</div>
                }

                <button id='idButHouseApp' onClick={this.back.bind(this)} style={{marginTop: '10px'}}>Управление домом</button>
                <button id='idButHouseApp' onClick={this.exit.bind(this)} style={{marginTop: '10px'}}>Закрыть меню</button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    house: state.phoneInfo.houses[0],
    improvements: state.phoneInfo.houses[0].improvements
});

const mapDispatchToProps = dispatch => ({
    setApp: app => dispatch(setApp(app)),
    buyImprovement: (index, name) => dispatch(buyImprovement(index, name))
})

export default connect(mapStateToProps, mapDispatchToProps)(Improvements)