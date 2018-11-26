import styled from './styled-components';
import { CenteringDiv, BasicButton } from './components/common';


export const App = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const GreyScreen = styled(CenteringDiv)`
  background-color: rgba(23, 34, 45, 0.5);
  height: 100%;
  width: 100%;
  position: absolute;
`;

export const CloseButton = styled(BasicButton)`
  position: absolute;
  right: 10px;
  top: 10px;
  border-radius: 100%;
`