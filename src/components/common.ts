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

const whiteTextAndBlackBackground = css`
  background-color: black;
  color: white;
`

const blackTextAndWhiteBackground = css`
  background-color: white;
  color: black;
`

export const BasicButton = styled<{whiteTextBlackBg?: boolean, levitate?: boolean, levitateText?:boolean, isClicked?: boolean}, "button">("button")`
  padding: 10px;
  font-size: 1em;
  font-weight: bold;
  border: 2px solid black;
  border-radius: 20px;
  cursor: pointer;
  outline: none;  
  ${blackTextAndWhiteBackground};
  :active {
    ${whiteTextAndBlackBackground};
  };
  ${({whiteTextBlackBg}) => whiteTextBlackBg && `
    ${whiteTextAndBlackBackground};
    :active {
      ${blackTextAndWhiteBackground}
    }
  `};
  ${({levitateText}) => levitateText && LevitateTextAnimation};
  ${({levitate}) => levitate && LevitateBoxAnimation};
  ${({isClicked}) => isClicked && whiteTextAndBlackBackground};
`

export const BasicInputField = styled<{levitate?: boolean}, "input">("input")`
  padding: 5px;
  font-size: 1em;
  border-radius: 10px;
  border: 2px solid black;
  outline: none;
  ${({levitate}) => levitate && LevitateBoxAnimation}
`;

export const FlexColumnDiv = styled<{Hcenter?: boolean, Vcenter?: boolean}, "div">("div")`
  display: flex;
  flex-direction: column;
  ${({Hcenter}) => Hcenter && css`
    align-items: center;
  `};
  ${({Vcenter}) => Vcenter && css`
    justify-content: center;
  `};
`

export const FlexColumnContainer = styled(FlexColumnDiv)`
  padding: 15px;
  border-radius: 10px;
  border: 2px solid black;
`;

export const FlexRowDiv = styled.div`
  display: flex;
  flex-direction: row;
`


export const FlexRowContainer = styled(FlexRowDiv)`
  padding: 15px;
  border-radius: 10px;
  border: 2px solid black;
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