import React, { Component } from 'react'
import * as s from './style'
import * as cs from '../common'
import { GameMode } from '../../App';

interface Props {
  gameModeSelectionButtonHandler: (mode: GameMode) => void
}

export default class StartScreen extends Component<Props> {
  render() {
    const {gameModeSelectionButtonHandler} = this.props
    return (
      <s.StartScreen>
        <s.Pane id="0">
          <cs.BasicButton onClick={() => gameModeSelectionButtonHandler(GameMode.SinglePlayer)} whiteTextBlackBg levitate>Single Player</cs.BasicButton>
        </s.Pane>
        <s.Pane id="1">
          <cs.BasicButton onClick={() => gameModeSelectionButtonHandler(GameMode.MultiPlayer)} levitate>Multi Player</cs.BasicButton>
        </s.Pane>
      </s.StartScreen>
    )
  }
}
