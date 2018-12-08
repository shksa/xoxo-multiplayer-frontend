import styled, {css} from '../../styled-components';
import * as cs from '../common'

export const MultiPlayer = styled(cs.CenteringDiv).attrs({
  transitionProp: "background-color"
})`
  flex-grow: 1;
`;


export const AvailablePlayersAndRequestsContainer = styled(cs.FlexRowDiv)`
  align-items: center;
  ${cs.media.phone`
  flex-direction: column;
  `};
`

export const JoiningForm = styled(cs.FlexRowDiv)`
  margin: 0 10px 0 10px;
`

export const NameInput = styled(cs.BasicInputField).attrs({
  levitate: true,
  placeholderColor: "black",
  transitionProp: "background-color",
})`
  margin-right: 10px;
`;




