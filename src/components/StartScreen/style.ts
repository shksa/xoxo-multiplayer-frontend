import styled, {css} from '../../styled-components'
import * as cs from '../common'

export const StartScreen = styled(cs.FlexRowDiv)`
  height: 100%;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const Pane = styled(cs.CenteringDiv)<{id: "0" | "1"}>`
  width: 50%;
  ${({id}) => id === "0" ? `
    background-color: white;
  `
  : `
    background-color: black;
  `
  };
  @media (max-width: 768px) {
    height: 50%;
    width: unset;
  }
`