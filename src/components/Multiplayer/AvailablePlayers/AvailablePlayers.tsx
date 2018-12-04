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
    <cs.FlexColumnDiv Hcenter>
      {
        availablePlayers.length ? 
        <cs.FlexRowDiv Vcenter>
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
        :
        <ThreeBallsLoader width="100" height="100"/>
      }
      <cs.ColoredText>
        {selectedAvailablePlayer ? null : availablePlayers.length ? "Select a player to play with!!!" : "There are no free players right now, please wait for some time..."}
      </cs.ColoredText>
    </cs.FlexColumnDiv>
  )
}

export default AvailablePlayers