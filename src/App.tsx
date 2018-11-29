import React from 'react';
import * as s from './AppStyle'

import Multiplayer from './components/Multiplayer/Multiplayer';
import StartScreen from './components/StartScreen/StartScreen';
import Game from './components/Game/Game';

// GameMode is a union of SinglePlayer and MultiPlayer type
export enum GameMode {
  SinglePlayer = "SinglePlayer", // The enum member SinglePlayer can be used as a type, and the only value of that type is the string "SinglePlayer"
  MultiPlayer = "MultiPlayer"
}
interface State {
  errorObj: Error | null,
  gameMode: GameMode | null
}

class App extends React.Component<{}, State> {
  constructor() {
    super({});
    this.state = {
      errorObj: null, gameMode: null
    }
  }

  showErrorPopup = (errorObj: Error) => this.setState({errorObj})

  closeErrorPopup = () => this.setState({errorObj: null})

  gameModeSelectionButtonHandler = (mode: GameMode) => this.setState({gameMode: mode})

  showViewBasedOnGameMode = (gameMode: GameMode | null) => { // GameMode is a union of SinglePlayer and MultiPlayer type
    switch (gameMode) {
      case GameMode.SinglePlayer: // Here, the enum member is used as value
        return (
          <Game gameMode={GameMode.SinglePlayer} opponentName="Vegana" playerName="Bob" player1Name="Bob" player2Name="Vegana" />
        )

      case GameMode.MultiPlayer:
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