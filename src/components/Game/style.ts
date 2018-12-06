import styled, {css} from 'styled-components';
import * as cs from '../common'

export const Game = styled(cs.FlexRowDiv)`
  max-width: 100%;
  align-items: center;
  ${cs.media.phone`
    flex-direction: column;
  `}
`;

export const History = styled(cs.FlexColumnDiv)`
  margin-left: 30px;
  ${cs.media.phone`
    flex-direction: row;
    max-width: 100%;
    overflow: scroll;
    margin-left: 0px;
  `}
`;

export const Move = styled.div`
  margin: 20px;
`;