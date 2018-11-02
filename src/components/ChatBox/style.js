import styled, {css} from 'styled-components';
import * as cs from '../common'

export const EnableMultiplayerButton = styled(cs.BasicButton)`
  ${cs.LevitateAnimation};
`;

export const ChatBoxContainer = styled.div`
  /* background-color: lightblue; */
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ChatBoxWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ChatBoxHeader = styled.div`
  display: flex;
`


export const NameInput = styled(cs.BasicInputField)`
  margin: 0 10px 0 10px;
  ${cs.LevitateAnimation};
`;

export const JoinRoomButton = styled(cs.BasicButton)`
  ${cs.LevitateAnimation};
`;

export const ChatBox = styled.div`
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border: 2px solid black;
  padding: 15px;
`

export const MessageBox = styled.div`
  height: 80%;
  border: 2px solid black;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
  padding: 15px;
`;

export const Message = styled.div`
  margin: 5px;
  color: black;
  font-size: 1em;
  ${({incoming}) => incoming ? 
  css`
  align-self: flex-end;
  `
  :
  css`
  align-self: flex-start;
  `
  };
`

export const ChatBoxFooter = styled.div`
  display: flex;
  flex-direction: row;
`

export const MessageInput = styled(cs.BasicInputField)`
  flex: 1;
  margin-right: 10px;
`

export const SendMessageButton = styled(cs.BasicButton)`
  ${({isDisabled}) => isDisabled ?
  css`
  background-color: lightgray;
  color: white;
  `
  :
  css`
  ${cs.LevitateAnimation};
  `
  };
`;