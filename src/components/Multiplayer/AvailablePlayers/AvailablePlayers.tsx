import React from 'react'
import * as cs from '../../common'
import * as s from './style'
import { AvailablePlayer } from '../Multiplayer';
import {ReactComponent as ThreeBallsLoader} from '../../../assets/ThreeBallsLoader.svg'

interface Props {
  availablePlayers: Array<AvailablePlayer>
  selectedAvailablePlayer: AvailablePlayer | null
  handleAvailablePlayerClick: (availablePlayer: AvailablePlayer) => void
}

const AvailablePlayers = ({availablePlayers, handleAvailablePlayerClick, selectedAvailablePlayer}: Props) => {
  return (
    <React.Fragment>
      {
        availablePlayers.length ?
        <cs.FlexColumnDiv Hcenter>
          <cs.FlexRowDiv Vcenter cssStyle="margin-left: 10px; margin-right: 10px;">
            <cs.ColoredText bold>Available players:</cs.ColoredText>
            <s.AvailablePlayersContainer>{
              availablePlayers.map(player => 
                <s.AvailablePlayer 
                  onClick={() => handleAvailablePlayerClick(player)} 
                  key={player.socketID}
                  isSelected={selectedAvailablePlayer && selectedAvailablePlayer.socketID === player.socketID}
                  disabled={selectedAvailablePlayer ? selectedAvailablePlayer.socketID !== player.socketID : false}
                >
                {player.name}
                </s.AvailablePlayer>
              )
            }</s.AvailablePlayersContainer>
          </cs.FlexRowDiv>
          {selectedAvailablePlayer ? null : <cs.ColoredText bold>Select a player to play with!!!</cs.ColoredText>}
        </cs.FlexColumnDiv> 
        :
        <cs.FlexColumnDiv Hcenter>
          <ThreeBallsLoader width="100" height="100"/>
          <cs.ColoredText bold>There are no free players right now, please wait for some time...</cs.ColoredText>
        </cs.FlexColumnDiv>
      }
    </React.Fragment>
  )
}

export default AvailablePlayers