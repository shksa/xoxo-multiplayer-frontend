import styled, {css} from 'styled-components';

export const Cell = styled.button`
  cursor: pointer;
  width: 100px;
  height: 100px;
  border: 2px solid black;
  outline: none;
  font-size: 25px;
  ${({isInWinningPosition}) => isInWinningPosition && 
  css`
    background-color: red;
    color: white;
  `
  };
`;