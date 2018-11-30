import styled, {createGlobalStyle} from './styled-components';
import * as cs from './components/common';
import ThemeInterface from './theme';

export const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css?family=Montserrat:400,900|Roboto");

  body {
    padding: 0;
    margin: 0;
    font-family: Roboto, sans-serif;
  }
`;

export const Theme: ThemeInterface = {primaryColor: "white", primaryColorInverted: "black", bgColor: "white"}

export const AppWrapper = styled(cs.FlexRowDiv)`
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