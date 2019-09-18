import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import '../styles/players.css';

import PlayerRow from './PlayerRow';

class PlayersList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: 'name',
            sortedBy: 'id',
            search: ''
        }

        this.getPlayers = this.getPlayers.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
    }

    getLoader() {
        return (
            <div className='block_loader-house-react'>
                <div className='loader-house'></div>
            </div>
        )
    }

    handleChangeInput(e) {
        this.setState({ search: e.target.value });
    }

    handleChangeSelect(e) {
        this.setState({ type: e.target.value });
    }

    getPlayers(players) {
        const { search, type, sortedBy } = this.state;

        return (
            players
                .sort((a, b) => a[sortedBy].toString().localeCompare(b[sortedBy].toString()))
                .filter(player => player[type]
                    .toString()
                    .toLowerCase()
                    .startsWith(search.toString().toLowerCase()))
                .map((player, index) => <PlayerRow player={player}/>)
        )
    }

    render() {
        const { players } = this.props;
        const { search, type } = this.state;

        return (
            <Fragment>
                <div id="playersList">
                    <div class="players_list-head">
                        <table rules="all">
                            <colgroup>
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '40%' }} />
                                <col style={{ width: '40%' }} />
                                <col style={{ width: '10%' }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th onClick={() => { this.setState({ sortedBy: 'id' }) }}>id</th>
                                    <th onClick={() => { this.setState({ sortedBy: 'name' }) }}>Имя</th>
                                    <th onClick={() => { this.setState({ sortedBy: 'faction' }) }}>Организация</th>
                                    <th>ping</th>
                                </tr>
                            </thead>
                        </table>
                        <div class="players_list-navigate_panel">
                            <input onChange={this.handleChangeInput} value={search}/>
                            <button 
                                onClick={() => this.setState({ type: 'id' })}
                                style={{ borderColor: type === 'id' && 'yellow' }}
                            >
                                id
                            </button>
                            <button 
                                onClick={() => this.setState({ type: 'name' })}
                                style={{ borderColor: type === 'name' && 'yellow' }}
                            >
                                Имя
                            </button>
                            <button 
                                onClick={() => this.setState({ type: 'faction' })}
                                style={{ borderColor: type === 'faction' && 'yellow' }}
                            >
                                Организация
                            </button>
                        </div>
                    </div>
                    <div class="players_list-body">
                        <table rules="all">
                            <colgroup>
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '40%' }} />
                                <col style={{ width: '40%' }} />
                                <col style={{ width: '10%' }} />
                            </colgroup>
                            <Fragment>
                                { players.length !== 0 ? this.getPlayers(players) : this.getLoader() }
                            </Fragment>
                        </table>
                    </div>
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    players: state.players
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(PlayersList);