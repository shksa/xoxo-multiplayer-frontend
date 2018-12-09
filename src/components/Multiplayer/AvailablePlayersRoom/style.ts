import styled, {css} from "../../../styled-components";
import * as cs from '../../common'

export const Player = styled(cs.FlexRowDiv).attrs({
})<{backgroundColor: string}>`
  background-color: ${({backgroundColor}) => backgroundColor};
  color: white;
  font-size: 1.3em;
  padding: 0.3em 0.4em;
  border-radius: 0.5em;
  margin-right: 0.3em;
  ${cs.LowShadow};
`;

export const AvailablePlayerAvatar = styled.img`
  height: 2.3em;
  width: 2.3em;
  box-sizing: border-box;
  border-radius: 100%;
  border: 2px solid black;
  margin-right: 1em;
  ${cs.LowShadow};
  ${cs.RotateAnimation};
`

export const PlayerLine = styled(cs.FlexRowDiv).attrs({
  Vcenter: true
})`
  margin: 0.5em 0; 
  justify-self: flex-start;
  justify-content: space-between;
`

export const InviteOrAcceptorRejectButton = styled(cs.BasicButton).attrs({
  levitate: true
})<{actionType: "disabled" | "accept" | "invite" | "reject"}>`
  background-color: ${({actionType}) => {
    switch (actionType) {
      case "disabled":
        return "grey"

      case "accept":
        return "#33cc66"

      case "invite":
        return "#6c5ce7"

      case "reject":
        return "#FC4445"
    }
  }} ;
  color: white;
  font-size: 1.1em;
  padding: 0.3em 0.4em;
  border-radius: 0.5em;
  border: none;
  ${({actionType}) => actionType === "disabled" && `
  cursor: not-allowed;
  `};
`;

export const BarsLoaderWrapper = styled(cs.FlexRowDiv)`
  margin-right: 0.6em;
  height: 2.2em;
  width: 2.2em;
`