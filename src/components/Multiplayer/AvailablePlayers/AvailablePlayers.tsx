import React from 'react'
import * as cs from '../../common'
import * as s from './style'
import { AvailablePlayer, PeerSignal } from '../Multiplayer';

interface Props {
  playerName: string
  availablePlayers: AvailablePlayer[]
  peerSignal: PeerSignal | null
  socketID: string
  handleAvailablePlayerClick: (availablePlayer: AvailablePlayer) => void
  handleRemotePlayerRequest: (decison: string) => void
}

const AvailablePlayers = ({playerName, availablePlayers, peerSignal, socketID, handleAvailablePlayerClick, handleRemotePlayerRequest}: Props) => {
  return (
    <cs.FlexColumnContainer>
      <cs.ColoredText bold>You are playing as <cs.ColoredText bold color="red">{playerName}</cs.ColoredText></cs.ColoredText>
      <cs.ColoredText margin="10px 0 5px 0" block bold>Available players:</cs.ColoredText>
      <s.AvailablePlayersContainer>
      {
        availablePlayers.map(player => player.socketID !== socketID && <s.AvailablePlayer onClick={() => handleAvailablePlayerClick(player)} key={player.socketID}>{player.name}</s.AvailablePlayer>)
      }
      </s.AvailablePlayersContainer>
      {
      peerSignal && peerSignal.offer && peerSignal.candidate &&
      <cs.FlexRowContainer>
        <cs.ColoredText>Got request from <cs.ColoredText bold color="red">{peerSignal.name}</cs.ColoredText></cs.ColoredText>
        <cs.BasicButton levitate onClick={() => handleRemotePlayerRequest("yes")}>Accept</cs.BasicButton>
        <cs.BasicButton levitate onClick={() => handleRemotePlayerRequest("no")}>Reject</cs.BasicButton>
      </cs.FlexRowContainer>
      }
    </cs.FlexColumnContainer>
  )
}

export default AvailablePlayers