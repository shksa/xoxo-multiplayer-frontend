import styled from '../../styled-components';
import * as cs from '../common'

export const Board = styled.div`
  position: relative;
`;

export const WaitingOverlay = styled(cs.CenteringDiv)<{waitForOpponentMove: boolean}>`
  display: none;
  ${({waitForOpponentMove}) => waitForOpponentMove && `
  display: flex;
  background-color: rgba(0, 0, 0, 0.15);
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  `};
`

export const ThreeDotLoader = styled(cs.ThreeDotLoader)`
  margin-left: 50px;
`

export const Row = styled.div`
  display: flex;
`;