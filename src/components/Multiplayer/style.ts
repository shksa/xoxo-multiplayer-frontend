import styled, {css} from '../../styled-components';
import * as cs from '../common'

export const MultiPlayer = styled(cs.FlexColumnDiv).attrs({
  Hcenter: true
})<{showJoiningForm: boolean}>`
  height: 100%;
  width: 100%;
  ${cs.EverChanging("background-color")};
  ${({showJoiningForm}) => showJoiningForm ? `
    justify-content: center;  
  `:`
  `
  };
`;

export const MultiPlayerWrapper = styled(cs.CenteringDiv)`
  height: 100%;
  width: 100%;
`

export const JoiningForm = styled(cs.FlexRowDiv)``

export const NameInput = styled(cs.BasicInputField).attrs({
  levitate: true,
  placeholderColor: "black",
  transitionProp: "background-color",
})`
  margin: 0 10px 0 10px;
`;




