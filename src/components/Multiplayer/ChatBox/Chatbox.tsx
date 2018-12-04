import React from 'react'
import * as cs from '../../common'
import * as s from './style'
import { AllTextMessages, TextMessageTypes } from '../Multiplayer';

interface Props {
  currentOutgoingMessage: string
  allTextMessages: AllTextMessages
  handleEnter: React.KeyboardEventHandler<HTMLInputElement>
  handleSendTextMessageButton: React.MouseEventHandler<HTMLButtonElement>
  handleInputChange: React.ChangeEventHandler<HTMLInputElement>
}

const Chatbox = ({handleInputChange, currentOutgoingMessage, allTextMessages, handleEnter, handleSendTextMessageButton}: Props) => {
  return (
    <s.ChatBox>
      <s.MessageBox>
      {allTextMessages.map(({type, value}, idx) => <s.Message incoming={type === TextMessageTypes.IncomingTextMessage} key={`${type}:${idx}`}>{value}</s.Message>)}
      </s.MessageBox>
      <s.ChatBoxFooter>
        <s.MessageInput placeholder="write a new message here..." autoFocus name="currentOutgoingMessage" onKeyUp={handleEnter} onChange={handleInputChange} value={currentOutgoingMessage} />
        <cs.BasicButton levitate onClick={handleSendTextMessageButton}>Send</cs.BasicButton>
      </s.ChatBoxFooter>
    </s.ChatBox>
  )
}

export default Chatbox