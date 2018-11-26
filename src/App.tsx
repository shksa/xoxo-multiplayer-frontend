import React from 'react';
import * as s from './AppStyle'
import Game from './components/Game/Game';
import Multiplayer from './components/Multiplayer/Multiplayer';
import StartScreen from './components/StartScreen/StartScreen';
import { stat } from 'fs';

export type GameMode = "SinglePlayer" | "MultiPlayer" | null
interface State {
  errorObj: Error | null,
  gameMode: GameMode
}

class App extends React.Component<{}, State> {
  constructor() {
    super({});
    this.state = {
      errorObj: null, gameMode: null
    }
  }

  showErrorPopup = (errorObj: Error) => {this.setState({errorObj})}

  closeErrorPopup = () => this.setState({errorObj: null})

  gameModeSelectionButtonHandler = (mode: GameMode) => {
    this.setState({gameMode: mode})
  }

  showViewBasedOnGameMode = (gameMode: GameMode) => {
    switch (gameMode) {
      case "SinglePlayer":
        return (
          <Game />
        )

      case "MultiPlayer":
        return (
          <Multiplayer showErrorPopup={this.showErrorPopup}  />
        )

      case null:
        return (
          <StartScreen gameModeSelectionButtonHandler={this.gameModeSelectionButtonHandler} />
        )
    
      default:
        break;
    }
  }

  render() {
    const {errorObj, gameMode} = this.state
    return (
      <s.App>
        {errorObj 
          && 
          <s.GreyScreen>
            <s.ErrorPopUp>
              <s.CloseButton onClick={this.closeErrorPopup}>X</s.CloseButton>
              {errorObj.message}
            </s.ErrorPopUp>
          </s.GreyScreen>
        }
        {this.showViewBasedOnGameMode(gameMode)}
      </s.App>
    );
  }
}

export default (App);