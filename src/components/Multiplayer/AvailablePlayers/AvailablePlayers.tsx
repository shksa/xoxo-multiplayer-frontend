import React from 'react'
import * as cs from '../../common'
import * as s from './style'
import { AvailablePlayer, PeerSignal } from '../Multiplayer';

interface Props {
  availablePlayers: Array<AvailablePlayer>
  socketID: string
  selectedAvailablePlayer: AvailablePlayer | null
  handleAvailablePlayerClick: (availablePlayer: AvailablePlayer) => void
}

const AvailablePlayers = ({availablePlayers, socketID, handleAvailablePlayerClick, selectedAvailablePlayer}: Props) => {
  return (
    <cs.FlexColumnContainer>
      <cs.ColoredText margin="10px 0 5px 0" block bold>Available players:</cs.ColoredText>
      <s.AvailablePlayersContainer>
      {
        availablePlayers.map(player => 
          player.socketID !== socketID && 
            <s.AvailablePlayer 
              onClick={() => handleAvailablePlayerClick(player)} 
              key={player.socketID}
              isSelected={selectedAvailablePlayer && selectedAvailablePlayer.socketID === player.socketID}
              disabled={selectedAvailablePlayer ? selectedAvailablePlayer.socketID !== player.socketID : false}
            >
            {player.name}
            </s.AvailablePlayer>
        )
      }
      </s.AvailablePlayersContainer>
      <cs.ColoredText>
        {availablePlayers.length >=2 ? "Select a player to play with!!!" : "There are no free players right now, please wait for some time..."}
      </cs.ColoredText>
    </cs.FlexColumnContainer>
  )
}

export default AvailablePlayers