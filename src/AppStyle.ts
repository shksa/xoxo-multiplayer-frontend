import styled from './styled-components';
import * as cs from './components/common';


export const App = styled(cs.FlexRowDiv)`
  height: 100vh;
  width: 100vw;
`;

export const GreyScreen = styled(cs.CenteringDiv)`
  background-color: rgba(23, 34, 45, 0.5);
  height: 100%;
  width: 100%;
  position: absolute;
`;

export const CloseButton = styled(cs.BasicButton)`
  position: absolute;
  right: 10px;
  top: 10px;
  border-radius: 100%;
`

export const ErrorPopUp = styled(cs.CenteringDiv)`
  width: 30%;
  height: 30%;
  background-color: black;
  color: white;
  font-size: 30px;
  position: relative;
`