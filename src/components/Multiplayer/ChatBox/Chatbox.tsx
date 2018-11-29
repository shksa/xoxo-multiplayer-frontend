import React from 'react'
import * as cs from '../../common'
import * as s from './style'
import { PeerSignal, TextMessage, AvailablePlayer } from '../Multiplayer';

interface Props {
  allMessages: TextMessage[]
  handleEnter: (event: React.KeyboardEvent<HTMLInputElement>) => void
  sendDataToRemotePeer: () => void
  currentOutgoingMessage: string
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Chatbox = ({handleInputChange, currentOutgoingMessage, allMessages, handleEnter, sendDataToRemotePeer}: Props) => {
  return (
    <s.ChatBox>
      <s.MessageBox>
      {allMessages.map(({type, value}, idx) => <s.Message incoming={type === "incoming"} key={`${type}:${idx}`}>{value}</s.Message>)}
      </s.MessageBox>
      <s.ChatBoxFooter>
        <s.MessageInput placeholder="write a new message here..." autoFocus name="currentOutgoingMessage" onKeyUp={handleEnter} onChange={handleInputChange} value={currentOutgoingMessage} />
        <cs.BasicButton levitate onClick={sendDataToRemotePeer}>Send</cs.BasicButton>
      </s.ChatBoxFooter>
    </s.ChatBox>
  )
}

export default Chatbox