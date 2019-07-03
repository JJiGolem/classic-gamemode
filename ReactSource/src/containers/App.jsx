import React from 'react';
import {connect} from 'react-redux';

import UIconstructor from '../UIconstructor';

class App extends React.Component {
  render() {
    return(
      <div>
        <UIconstructor />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(App)