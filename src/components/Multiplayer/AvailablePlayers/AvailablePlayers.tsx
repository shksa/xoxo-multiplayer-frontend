import React from 'react'
import * as cs from '../../common'
import * as s from './style'
import { AvailablePlayer, PeerSignal } from '../Multiplayer';

interface Props {
  availablePlayers: Array<AvailablePlayer>
  selectedAvailablePlayer: AvailablePlayer | null
  handleAvailablePlayerClick: (availablePlayer: AvailablePlayer) => void
}

const AvailablePlayers = ({availablePlayers, handleAvailablePlayerClick, selectedAvailablePlayer}: Props) => {
  const JSXofAvailablePlayers = availablePlayers.map(player => 
    <s.AvailablePlayer 
      onClick={() => handleAvailablePlayerClick(player)} 
      key={player.socketID}
      isSelected={selectedAvailablePlayer && selectedAvailablePlayer.socketID === player.socketID}
      disabled={selectedAvailablePlayer ? selectedAvailablePlayer.socketID !== player.socketID : false}
    >
    {player.name}
    </s.AvailablePlayer>
  )
  return (
    <cs.FlexColumnDiv Hcenter>
      {
        JSXofAvailablePlayers.length ? 
        <cs.FlexColumnDiv>
          <cs.ColoredText margin="10px 0 5px 0" block bold>Available players:</cs.ColoredText>
          <s.AvailablePlayersContainer>{JSXofAvailablePlayers}</s.AvailablePlayersContainer>
        </cs.FlexColumnDiv>
        :
        <cs.FlexRowDiv>
          <cs.ThreeDotLoader />
        </cs.FlexRowDiv>
      }
      <cs.ColoredText>
        {availablePlayers.length ? "Select a player to play with!!!" : "There are no free players right now, please wait for some time..."}
      </cs.ColoredText>
    </cs.FlexColumnDiv>
  )
}

export default AvailablePlayers