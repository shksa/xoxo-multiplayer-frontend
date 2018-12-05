import styled, {css} from '../../../styled-components';
import { LevitateTextAnimation } from '../../common';

// You will need to define both the custom props and the type of tag which will be used.
export const Cell = styled<{ isInWinningPosition: boolean }, "button">("button")`
  cursor: pointer;
  width: 100px;
  height: 100px;
  border: 2px solid black;
  outline: none;
  font-size: 3em;
  ${LevitateTextAnimation};
  ${({isInWinningPosition}) => isInWinningPosition && css`
    background-color: red;
    color: white;
  `
  };
`;