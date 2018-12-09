import styled, {css} from '../../styled-components';
import * as cs from '../common'

export const MultiPlayer = styled(cs.CenteringDiv).attrs({
  transitionProp: "background-color",
  fitContainer: true,
})`
  position: relative;
  padding: 0.9em;
  ${cs.media.phone`
  flex-direction: column;
  `};
`;

export const Avatar = styled.img`
  box-sizing: border-box;
  height: 200px;
  width: 200px;
  border: 5px solid black;
  border-radius: 100%;
  ${cs.RotateAnimation};
`;

export const AvatarAndTextContainer = styled(cs.FlexColumnDiv).attrs({
  Hcenter: true
})`
`

export const JoiningForm = styled(cs.FlexRowDiv)`
`

export const NameInput = styled(cs.BasicInputField).attrs({
  levitate: true,
  placeholderColor: "white",
  whiteTextAndBlackBackground: true
})`
  margin-right: 10px;
`;

export const AvailablePlayersAndWaitingAndRequestsContainer = styled(cs.FlexColumnDiv)`
  position: relative;
  overflow: scroll;
  padding: 1em;
  width: 40%;
  max-height: 50%;
  ${cs.media.phone`
  width: 100%;
  `};
`

export const RequestsAndWaitAndRejectionWrapper= styled(cs.CenteringDiv).attrs({
  fitContainer: true
})`
  position: absolute;
  background-color: light
`


