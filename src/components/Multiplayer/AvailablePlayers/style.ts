import styled, {css} from "../../../styled-components";
import * as cs from '../../common'

export const AvailablePlayersContainer = styled(cs.FlexRowContainer)`
  flex-wrap: wrap;
  padding: 10px;
  height: 40%;
  border-radius: 20px;
`;

export const AvailablePlayer = styled(cs.BasicButton).attrs({
  whiteTextBlackBg: true,
  levitate: true
}) `
  margin: 7px;
  align-self: flex-start;
`;