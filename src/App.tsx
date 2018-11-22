import React from 'react';
import * as s from './style'
import Game from './components/Game/Game';
import Multiplayer from './components/Multiplayer/Multiplayer';

interface State {
  errorObj: Error | null
}


class App extends React.Component<{}, State> {
  constructor() {
    super({});
    this.state = {
      errorObj: null
    }
  }

  showErrorPopup = (errorObj: Error) => {this.setState({errorObj})}

  render() {
    return (
      <s.App>
        {this.state.errorObj && <s.ErrorPopUp>{this.state.errorObj.message}</s.ErrorPopUp>}
        <Game />
        <Multiplayer showErrorPopup={this.showErrorPopup}  />
      </s.App>
    );
  }
}

export default (App);