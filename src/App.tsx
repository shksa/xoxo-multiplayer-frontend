import React from 'react';
import * as s from './style'
import Game from './components/Game/Game';
import Multiplayer from './components/Multiplayer/Multiplayer';
import * as cs from './components/common'

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

  closeErrorPopup = () => this.setState({errorObj: null})

  render() {
    return (
      <s.App>
        {this.state.errorObj 
          && 
          <s.GreyScreen>
            <cs.ErrorPopUp>
              <s.CloseButton onClick={this.closeErrorPopup}>X</s.CloseButton>
              {this.state.errorObj.message}
            </cs.ErrorPopUp>
          </s.GreyScreen>
        }
        <Game />
        <Multiplayer showErrorPopup={this.showErrorPopup}  />
      </s.App>
    );
  }
}

export default (App);