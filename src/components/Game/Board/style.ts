import styled from '../../../styled-components';
import * as cs from '../../common'

export const Board = styled.div`
  position: relative;
`;

export const WaitingOverlay = styled(cs.CenteringDiv).attrs({
  fitContainer: true
})<{waitForOpponentMove: boolean}>`
  display: none;
  ${({waitForOpponentMove}) => waitForOpponentMove && `
  display: flex;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0px;
  left: 0px;
  `};
`

export const Row = styled.div`
  display: flex;
`;