import React from 'react'
import * as cs from '../../common'
import * as s from './style'
import { PeerSignal, TextMessage, AvailablePlayer } from '../Multiplayer';

interface Props {
  playerName: string
  allMessages: TextMessage[]
  handleEnter: (event: React.KeyboardEvent<HTMLInputElement>) => void
  sendDataToRemotePeer: () => void
  handleQuitMatchAndGoBackToAvailablePool: () => void
  currentOutgoingMessage: string
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  selectedAvailablePlayer: AvailablePlayer
}

const Chatbox = ({selectedAvailablePlayer, handleInputChange, currentOutgoingMessage, playerName, allMessages, handleEnter, sendDataToRemotePeer, handleQuitMatchAndGoBackToAvailablePool}: Props) => {
  return (
    <s.ChatBoxWrapper>
      <cs.ColoredText block bold>You are playing as <cs.ColoredText bold color="red">{playerName}</cs.ColoredText></cs.ColoredText>
      <cs.ColoredText block bold color="blue">Connected with {selectedAvailablePlayer.name}</cs.ColoredText>
      <s.ChatBox>
        <s.MessageBox>
        {allMessages.map(({type, value}, idx) => <s.Message incoming={type === "incoming"} key={`${type}:${idx}`}>{value}</s.Message>)}
        </s.MessageBox>
        <s.ChatBoxFooter>
          <s.MessageInput placeholder="write a new message here..." autoFocus name="currentOutgoingMessage" onKeyUp={handleEnter} onChange={handleInputChange} value={currentOutgoingMessage} />
          <cs.BasicButton levitate onClick={sendDataToRemotePeer}>Send</cs.BasicButton>
        </s.ChatBoxFooter>
      </s.ChatBox>
      <cs.FlexRowContainer>
        <cs.ColoredText>Quit match and join the available pool again?</cs.ColoredText>
        <cs.BasicButton onClick={handleQuitMatchAndGoBackToAvailablePool}>Yes</cs.BasicButton>
      </cs.FlexRowContainer>
    </s.ChatBoxWrapper>
  )
}

export default Chatbox