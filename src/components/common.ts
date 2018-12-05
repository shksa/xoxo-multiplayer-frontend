import styled, {keyframes, css} from '../styled-components'

export const EverChanging = (transitionProp : string) => css`
  transition-property: ${transitionProp};
  transition-duration: 1s;
  transition-delay: 0s;
  transition-timing-function: ease-in-out;
`

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

export const BasicButton = styled<{transitionProp?:string, whiteTextBlackBg?: boolean, levitate?: boolean, isClicked?: boolean}, "button">("button")`
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
  ${({levitate}) => levitate && LevitateBoxAnimation};
  ${({isClicked}) => isClicked && whiteTextAndBlackBackground};
  ${({transitionProp}) => transitionProp && EverChanging(transitionProp)};
`

export const BasicInputField = styled<{transitionProp?:string, levitate?: boolean, placeholderColor?: string}, "input">("input")`
  padding: 5px;
  font-size: 1em;
  font-weight: bold;
  border-radius: 10px;
  border: 2px solid black;
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
  ${({transitionProp}) => transitionProp && EverChanging(transitionProp)};
`;

const FlexDiv = styled<{transitionProp?: string, height?: string, width?: string, cssStyle?: string}, "div">("div")`
  display: flex;
  ${({height}) => height && `height: ${height}`};
  ${({width}) => width && `width: ${width}`};
  ${({cssStyle}) => cssStyle && `${cssStyle}`};
  ${({transitionProp}) => transitionProp && EverChanging(transitionProp)};
`

export const FlexColumnDiv = styled(FlexDiv)<{Hcenter?: boolean, Vcenter?: boolean}>`
  flex-direction: column;
  ${({Hcenter}) => Hcenter && `align-items: center`};
  ${({Vcenter}) => Vcenter && `justify-content: center`};
`

export const FlexRowDiv = styled(FlexDiv)<{Hcenter?: boolean, Vcenter?: boolean}>`
  flex-direction: row;
  ${({Hcenter}) => Hcenter && css`justify-content: center`};
  ${({Vcenter}) => Vcenter && css`align-items: center`};
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

export const CenteringDiv = styled(FlexColumnDiv).attrs({
  Hcenter: true,
  Vcenter: true,
})<{fitContainer?: boolean}>`
  ${({fitContainer}) => fitContainer && `
  width: 100%;
  height: 100%;
  `}
`

export const ColoredText = styled<{block?: boolean, color?: string, bold?: boolean, margin?: string}, "span">("span")`
  display: ${({block}) => block ? "block" : "inline"};
  color: ${({color}) =>  color};
  font-weight: ${({bold}) => bold && "bold"};
  font-size: 1.5em;
  margin: ${({margin}) => margin}
`