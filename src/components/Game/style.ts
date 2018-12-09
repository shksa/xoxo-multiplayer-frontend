import styled, {css} from 'styled-components';
import * as cs from '../common'

export const Game = styled(cs.FlexRowDiv)`
  align-items: center;
  ${cs.media.phone`
    flex-direction: column;
    max-width: 100%;
  `}
  /* max-width: 100%; */
`;

export const History = styled(cs.FlexColumnDiv)`
  margin-left: 30px;
  max-height: 50%;
  overflow: scroll;
  ${cs.media.phone`
    flex-direction: row;
    max-width: 100%;
    margin-left: 0px;
  `}
`;

export const Move = styled(cs.BasicButton)`
  margin: 20px;
  background-color: white;
`;

export const Avatar = styled.img`
  border-radius: 100%;
  border: 2px solid black;
  box-sizing: border-box;
  width: 6em;
  height: 6em;
`;