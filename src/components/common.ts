import styled, {keyframes, css} from '../styled-components';

const levitate = keyframes`
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

export const LevitateAnimation = css`
  animation-name: ${levitate};
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
  ${({levitate}) => levitate && LevitateAnimation}
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
  ${({levitate}) => levitate && LevitateAnimation}
`;

export const FlexColumnContainer = styled.div`
  padding: 15px;
  border-radius: 10px;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
`;

export const FlexRowContainer = styled.div`
  padding: 15px;
  border-radius: 10px;
  border: 2px solid black;
  display: flex;
  flex-direction: row;
`;

export const ColoredText = styled<{block?: boolean, color?: string, bold?: boolean, margin?: string}, "span">("span")`
  display: ${({block}) => block ? "block" : "inline"};
  color: ${({color}) =>  color};
  font-weight: ${({bold}) => bold && "bold"};
  font-size: 1.5em;
  margin: ${({margin}) => margin}
`