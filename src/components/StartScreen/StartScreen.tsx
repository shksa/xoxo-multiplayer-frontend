import React, { Component } from 'react'
import * as cs from '../common'
import { GameMode } from '../../App';
import * as utils from '../../utils/util'

interface Props {
  gameModeSelectionButtonHandler: (mode: GameMode) => void
}

export default class StartScreen extends Component<Props> {

  centeringDivRef = React.createRef<any>()
  basicButtonARef = React.createRef<any>()
  basicButtonBRef = React.createRef<any>()
  setIntervalIds: Array<NodeJS.Timeout>

  componentDidMount() {
    this.setIntervalIds = utils.ChangeColors(1000, this.centeringDivRef, this.basicButtonARef, this.basicButtonBRef)
  }

  componentWillUnmount() {
    console.log("clearing the setIntervals ", this.setIntervalIds)
    this.setIntervalIds.forEach(intervalID => clearInterval(intervalID))
  }

  render() {
    const {gameModeSelectionButtonHandler} = this.props
    return (
      <cs.CenteringDiv fitContainer ref={this.centeringDivRef} transitionProp="background-color">
        <cs.FlexColumnDiv height="40%" cssStyle = {`justify-content: space-evenly;`}>
          <cs.BasicButton 
            ref={this.basicButtonARef} transitionProp="background-color"
            onClick={() => gameModeSelectionButtonHandler(GameMode.SinglePlayer)} 
            levitate
          >
          Single Player
          </cs.BasicButton>

          <cs.BasicButton 
            ref={this.basicButtonBRef} transitionProp="background-color"
            onClick={() => gameModeSelectionButtonHandler(GameMode.MultiPlayer)} 
            levitate
          >
          Multi Player
          </cs.BasicButton>
        </cs.FlexColumnDiv>
      </cs.CenteringDiv>
    )
  }
}
