import styled from './styled-components';
import { FlexColumnContainer } from './components/common';


export const App = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const ErrorPopUp = styled(FlexColumnContainer)`
  width: 30%;
  height: 30%;
  position: absolute;
  left: 35%;
  top: 35%;
`