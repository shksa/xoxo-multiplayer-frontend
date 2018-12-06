import styled, {css} from '../../styled-components';
import * as cs from '../common'

export const MultiPlayer = styled(cs.CenteringDiv).attrs({
  fitContainer: true,
  transitionProp: "background-color"
})`
`;

export const MultiPlayerWrapper = styled(cs.FlexColumnDiv).attrs({
  Hcenter: true,
})`
  max-width: 100%;
`;

export const AvailablePlayersAndRequestsContainer = styled(cs.FlexRowDiv)`
  align-items: center;
  ${cs.media.phone`
  flex-direction: column;
  `};
`

export const JoiningForm = styled(cs.FlexRowDiv)``

export const NameInput = styled(cs.BasicInputField).attrs({
  levitate: true,
  placeholderColor: "black",
  transitionProp: "background-color",
})`
  margin: 0 10px 0 10px;
`;




