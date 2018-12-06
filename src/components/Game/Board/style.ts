import styled from '../../../styled-components';
import * as cs from '../../common'

export const Board = styled(cs.FlexColumnDiv)`
  position: relative;
  margin: 15px;
`;

export const Overlay = styled(cs.CenteringDiv).attrs({
  fitContainer: true
})<{waitForOpponentMove: boolean}>`
  display: none;
  ${({waitForOpponentMove}) => waitForOpponentMove && `
  display: flex;
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0px;
  left: 0px;
  `};
`

export const Row = styled.div`
  display: flex;
`;