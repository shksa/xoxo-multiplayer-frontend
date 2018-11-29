import styled, {css} from '../../styled-components';
import * as cs from '../common'

export const MultiPlayer = styled(cs.FlexColumnDiv).attrs({
  Hcenter: true
})<{showJoiningForm: boolean}>`
  height: 100%;
  width: 100%;
  ${({showJoiningForm}) => showJoiningForm ? `
    justify-content: center;  
  `:`
  `
  };
`;

export const MultiPlayerWrapper = styled(cs.FlexColumnDiv).attrs({
  Vcenter: true,
  Hcenter: true
})`
  height: 100%;
  width: 100%;
`

export const JoiningForm = styled(cs.FlexRowDiv)``

export const NameInput = styled(cs.BasicInputField)`
  margin: 0 10px 0 10px;
`;




