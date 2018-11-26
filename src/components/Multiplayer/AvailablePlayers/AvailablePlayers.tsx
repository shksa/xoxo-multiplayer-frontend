import React from 'react'
import * as cs from '../../common'
import * as s from './style'
import { AvailablePlayer, PeerSignal } from '../Multiplayer';

interface Props {
  playerName: string
  availablePlayers: AvailablePlayer[]
  socketID: string
  handleAvailablePlayerClick: (availablePlayer: AvailablePlayer) => void
}

const AvailablePlayers = ({playerName, availablePlayers, socketID, handleAvailablePlayerClick}: Props) => {
  return (
    <cs.FlexColumnContainer>
      <cs.ColoredText bold>You are playing as <cs.ColoredText bold color="red">{playerName}</cs.ColoredText></cs.ColoredText>
      <cs.ColoredText margin="10px 0 5px 0" block bold>Available players:</cs.ColoredText>
      <s.AvailablePlayersContainer>
      {
        availablePlayers.map(player => player.socketID !== socketID && <s.AvailablePlayer onClick={() => handleAvailablePlayerClick(player)} key={player.socketID}>{player.name}</s.AvailablePlayer>)
      }
      </s.AvailablePlayersContainer>
    </cs.FlexColumnContainer>
  )
}

export default AvailablePlayers