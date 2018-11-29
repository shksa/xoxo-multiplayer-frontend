import styled, {css} from "../../../styled-components";
import * as cs from '../../common'

export const ChatBox = styled(cs.FlexColumnContainer)`
  height: 40%;
  position: absolute;
  right: 0px;
  bottom: 0px;
  justify-content: space-around;
`

export const MessageBox = styled(cs.FlexColumnContainer)`
  height: 80%;
  overflow: scroll;
  justify-content: flex-end;
  box-sizing: border-box;
`;

export const ChatBoxFooter = styled(cs.FlexRowDiv)``

export const MessageInput = styled(cs.BasicInputField)`
  flex: 1;
  margin-right: 10px;
`

export const Message = styled<{incoming: boolean}, "div">("div")`
  margin: 5px;
  color: black;
  font-size: 1em;
  ${({incoming}) => incoming ? css`
  align-self: flex-end;
  `
  : css`
  align-self: flex-start;
  `
  };
`
