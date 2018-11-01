import styled, {css} from 'styled-components';
export const Game = styled.div`
  display: flex;
  align-items: center;
`;

export const History = styled.div`
  margin-left: 30px;
`;

export const ListOfMoves = styled.ol`

`;

export const Move = styled.li`
  border: 1px solid black;
  cursor: pointer;
  border-radius: 5px;
  padding: 5px;
  box-shadow: 3px 3px 20px #888888;
  transition: box-shadow 0.5s;
  text-align: center;
  margin-bottom: 10px;
  :hover {
    box-shadow: 2px 2px 4px #888888;
  }
  ${({isClicked}) => isClicked && 
  css`
    box-shadow: 2px 2px 4px #888888;
  `
  };
`;