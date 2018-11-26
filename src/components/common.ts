import styled, {keyframes, css} from '../styled-components';

const levitateText = keyframes`
  0% {
    text-shadow: 1px 5px 10px black;
  }
  50% {
    text-shadow: 1px 2px 5px black;
  }
  100% {
    text-shadow: 1px 5px 10px black;
  }
`

const levitateBox = keyframes`
  0% {
    box-shadow: 8px 10px 20px gray;
  }
  50% {
    box-shadow: 3px 4px 7px gray;
  }
  100% {
    box-shadow: 8px 10px 20px gray;
  }
`

export const LevitateBoxAnimation = css`
  animation-name: ${levitateBox};
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`

export const LevitateTextAnimation = css`
  animation-name: ${levitateText};
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`

export const BasicButton = styled<{levitate?: boolean, isClicked?: boolean}, "button">("button")`
  padding: 10px;
  font-size: 1em;
  font-weight: bold;
  background-color: white;
  border: 2px solid black;
  border-radius: 20px;
  cursor: pointer;
  outline: none;  
  :active {
    background-color: black;
    color: white;
  }
  ${({levitate}) => levitate && LevitateBoxAnimation}
  ${({isClicked}) => isClicked && `
    background-color: black;
    color: white;
  `
  }
`

export const BasicInputField = styled<{levitate?: boolean}, "input">("input")`
  padding: 5px;
  font-size: 1em;
  border-radius: 10px;
  border: 2px solid black;
  outline: none;
  ${({levitate}) => levitate && LevitateBoxAnimation}
`;

export const FlexColumnContainer = styled<{Hcenter?: boolean, Vcenter?: boolean}, "div">("div")`
  padding: 15px;
  border-radius: 10px;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  ${({Hcenter}) => Hcenter && css`
    align-items: center;
  `};
  ${({Vcenter}) => Vcenter && css`
    justify-content: center;
  `};
`;

export const ErrorPopUp = styled(FlexColumnContainer).attrs({
  Hcenter: true,
  Vcenter: true
})`
  width: 30%;
  height: 30%;
  background-color: black;
  color: white;
  font-size: 30px;
  position: relative;
`

export const FlexRowContainer = styled.div`
  padding: 15px;
  border-radius: 10px;
  border: 2px solid black;
  display: flex;
  flex-direction: row;
`;

export const CenteringDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ColoredText = styled<{block?: boolean, color?: string, bold?: boolean, margin?: string}, "span">("span")`
  display: ${({block}) => block ? "block" : "inline"};
  color: ${({color}) =>  color};
  font-weight: ${({bold}) => bold && "bold"};
  font-size: 1.5em;
  margin: ${({margin}) => margin}
`