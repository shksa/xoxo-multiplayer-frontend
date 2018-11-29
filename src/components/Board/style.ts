import styled from '../../styled-components';
import * as cs from '../common'
import hourglassSVG from '../../assets/hourglass.svg'

export const Board = styled.div`
  position: relative;
`;

export const WaitingOverlay = styled(cs.CenteringDiv)<{waitForOpponentMove: boolean}>`
  display: none;
  ${({waitForOpponentMove}) => waitForOpponentMove && `
  display: flex;
  background-color: rgba(23, 34, 45, 0.5);
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  `};
`

export const Hourglass = styled.img.attrs({
  src: hourglassSVG
})`
  margin-left: 90px;
`

export const Row = styled.div`
  display: flex;
`;