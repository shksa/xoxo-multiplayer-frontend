import React from 'react';
import * as s from './AppStyle'
import Multiplayer from './components/Multiplayer/Multiplayer';
import Game from './components/Game/Game';
import { ThemeProvider, css } from "./styled-components";
import * as cs from './components/common'

// GameMode is a union of SinglePlayer and MultiPlayer type
export enum GameMode {
  SinglePlayer = "SinglePlayer", // The enum member SinglePlayer can be used as a type, and the only value of that type is the string "SinglePlayer"
  MultiPlayer = "MultiPlayer"
}
interface State {
  popUpValue: any,
  gameMode: GameMode | null
}

class App extends React.Component<{}, State> {
  constructor() {
    super({});
    this.state = {
      popUpValue: null, gameMode: GameMode.MultiPlayer
    }
  }

  showPopUp = (popUpValue: any) => this.setState({popUpValue})

  closePopUp = () => this.setState({popUpValue: null})

  gameModeSelectionButtonHandler = (mode: GameMode) => this.setState({gameMode: mode})

  showViewBasedOnGameMode = (gameMode: GameMode | null) => { // GameMode is a union of SinglePlayer and MultiPlayer type
    switch (gameMode) {

      case GameMode.MultiPlayer:
        return (
          <Multiplayer showPopUp={this.showPopUp}  />
        )
    
      default:
        break;
    }
  }

  popUpView = () => {
    let {popUpValue} = this.state
    if (popUpValue instanceof Error) {
      popUpValue = popUpValue.message
    } else if(typeof popUpValue !== "string") {
      popUpValue = JSON.stringify(popUpValue)
    }
    return (
      <s.PopUpContainer>
        <s.PopUp>
          <s.CloseButton onClick={this.closePopUp}>X</s.CloseButton>
          <cs.ColoredText color="white">{popUpValue}</cs.ColoredText>
        </s.PopUp>
      </s.PopUpContainer>
    )
  }

  render() {
    const {popUpValue, gameMode} = this.state
    return (
      <ThemeProvider theme={s.Theme}>
        <React.Fragment>
          <s.GlobalStyle />
          <s.AppWrapper>
            {popUpValue && this.popUpView()}
            {this.showViewBasedOnGameMode(gameMode)}
          </s.AppWrapper>
        </React.Fragment>
      </ThemeProvider>
    );
  }
}

export default (App);