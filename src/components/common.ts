import styled, {keyframes, css} from '../styled-components'
import { PlayerType } from './Game/Game';

export const ContinousTransition = (transitionProp : string) => css`
  transition-property: ${transitionProp};
  transition-duration: 1s;
  transition-delay: 0s;
  transition-timing-function: ease-in-out;
`

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

export const LowShadow = `box-shadow: 3px 4px 7px gray;`
export const HighShadow = `box-shadow: 8px 10px 20px gray;`

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

export const RotateAnimation = css`
  animation-name: ${rotate};
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
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

const CSS_whiteTextAndBlackBackground = css`
  background-color: black;
  color: white;
`

const CSS_blackTextAndWhiteBackground = css`
  background-color: white;
  color: black;
`

export const BasicButton = styled<{whiteTextAndBlackBackground?: boolean, blackTextAndWhiteBackground?: boolean, transitionProp?:string, levitate?: boolean, isClicked?: boolean}, "button">("button")`
  padding: 10px;
  font-size: 1em;
  font-weight: bold;
  border: 2px solid black;
  border-radius: 1em;
  box-sizing: border-box;
  cursor: pointer;
  outline: none;
  ${({blackTextAndWhiteBackground}) => blackTextAndWhiteBackground && `
    ${CSS_blackTextAndWhiteBackground};  
    :active {
      ${CSS_whiteTextAndBlackBackground};
    }
  `};
  ${({whiteTextAndBlackBackground}) => whiteTextAndBlackBackground && `
    ${CSS_whiteTextAndBlackBackground};
    :active {
      ${CSS_blackTextAndWhiteBackground}
    }
  `};
  ${({levitate}) => levitate && LevitateBoxAnimation};
  ${({isClicked}) => isClicked && CSS_whiteTextAndBlackBackground};
  ${({transitionProp}) => transitionProp && ContinousTransition(transitionProp)};
`

export const BasicInputField = styled<{blackTextAndWhiteBackground?: boolean, whiteTextAndBlackBackground?: boolean, transitionProp?:string, levitate?: boolean, placeholderColor?: string}, "input">("input")`
  padding: 5px;
  font-size: 1em;
  font-weight: bold;
  border-radius: 10px;
  border: 2px solid black;
  ${({whiteTextAndBlackBackground}) => whiteTextAndBlackBackground && CSS_whiteTextAndBlackBackground};
  ${({blackTextAndWhiteBackground}) => blackTextAndWhiteBackground && CSS_blackTextAndWhiteBackground};
  outline: none;
  ${({levitate}) => levitate && LevitateBoxAnimation};
  ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${({placeholderColor}) => placeholderColor};
    opacity: 1; /* Firefox */
  };
  :-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: ${({placeholderColor}) => placeholderColor};
  };

  ::-ms-input-placeholder { /* Microsoft Edge */
      color: ${({placeholderColor}) => placeholderColor};
  };
  ${({transitionProp}) => transitionProp && ContinousTransition(transitionProp)};
`;

const FlexDiv = styled<{levitate?: boolean, fitContainer?: boolean, transitionProp?: string, height?: string, width?: string, cssStyle?: string}, "div">("div")`
  display: flex;
  box-sizing: border-box;
  ${({height}) => height && `height: ${height}`};
  ${({width}) => width && `width: ${width}`};
  ${({cssStyle}) => cssStyle && `${cssStyle}`};
  ${({fitContainer}) => fitContainer && `
  width: 100%;
  height: 100%;
  `};
  ${({levitate}) => levitate && LevitateBoxAnimation};
  ${({transitionProp}) => transitionProp && ContinousTransition(transitionProp)};
`

export const FlexColumnDiv = styled(FlexDiv)<{Hcenter?: boolean, Vcenter?: boolean}>`
  flex-direction: column;
  ${({Hcenter}) => Hcenter && `align-items: center`};
  ${({Vcenter}) => Vcenter && `justify-content: center`};
`

export const FlexRowDiv = styled(FlexDiv)<{Hcenter?: boolean, Vcenter?: boolean}>`
  flex-direction: row;
  ${({Hcenter}) => Hcenter && `justify-content: center`};
  ${({Vcenter}) => Vcenter && `align-items: center`};
`

export const FlexColumnContainer = styled(FlexColumnDiv)`
  padding: 15px;
  border-radius: 10px;
  border: 2px solid black;
`;


export const FlexRowContainer = styled(FlexRowDiv)`
  padding: 15px;
  border-radius: 10px;
  border: 2px solid black;
`;

export const CenteringDiv = styled(FlexRowDiv).attrs({
  Hcenter: true,
  Vcenter: true,
})`
`

export const ColoredText = styled<{levitateText?: boolean, block?: boolean, size?: string, color?: string, bold?: boolean}, "span">("span")`
  text-align: center;
  color: ${({color}) => color ? color : "white"};
  display: ${({block}) => block && "block"};
  font-weight: ${({bold}) => bold && "bold"};
  font-size: ${({size}) => size ? `${size}` : "1.5em"};
  ${({levitateText}) => levitateText && LevitateTextAnimation};
`;

type DeviceType = "desktop" | "tablet" | "phone"
type Media = {[device in DeviceType]: Function}

const deviceSizes: {[device in DeviceType]: number} = {
  desktop: 992,
  tablet: 768,
  phone: 576,
}

const devices: Array<DeviceType> = ["desktop", "phone", "tablet"]

// Iterate through the sizes and create a media template
export const media = devices.reduce((acc, label) => {
  acc[label] = (templateStrings: TemplateStringsArray) => css`
    @media (max-width: ${deviceSizes[label] / 16}em) {
      ${css(templateStrings)}
    }
  `

  return acc
}, {} as Media)