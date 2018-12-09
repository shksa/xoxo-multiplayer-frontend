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

export const Theme: ThemeInterface = {
  primaryColor: "white", 
  primaryColorInverted: "black", 
  bgColor: "white",
  playerOneColor: "#eb4d4b",
  playerTwoColor: "#0984e3"
}

export const AppWrapper = styled(cs.FlexRowDiv)`
  height: 100vh;
  width: 100vw;
  position: relative;
  ${cs.media.phone`
  flex-direction: column;
  `};
`;

export const CloseButton = styled(cs.BasicButton)`
  position: absolute;
  right: 10px;
  top: 10px;
  border-radius: 100%;
`

export const PopUpContainer = styled(cs.CenteringDiv).attrs({
  fitContainer: true,
})`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.3);
`

export const PopUp = styled(cs.CenteringDiv)`
  text-align: center;
  width: 30%;
  height: 30%;
  border-radius: 20px;
  background-color: black;
  position: relative;
  padding: 10px;
  ${cs.media.phone`
  width: 70%;
  height: 40%;
  `};
`