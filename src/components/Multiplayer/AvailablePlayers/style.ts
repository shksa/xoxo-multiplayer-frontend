import styled, {css} from "../../../styled-components";
import * as cs from '../../common'

export const AvailablePlayersContainer = styled(cs.FlexRowDiv).attrs({
  Vcenter: true
})`
  flex-wrap: wrap;
  margin: 10px;
`;

export const AvailablePlayer = styled(cs.BasicButton).attrs({
  whiteTextBlackBg: true,
  levitate: (props: any) => props.isSelected === null ? true : props.isSelected === true ? true : false
})<{isSelected: boolean | null}> `
  margin: 7px;
  align-self: flex-start;
  ${({isSelected}) => isSelected === null ? `` : isSelected === true ? `
    box-shadow: 8px 10px 20px gray;
    font-size: 1.5em;
    // padding: 20px;
  `
  : `
    box-shadow: 3px 4px 7px gray;
    cursor: not-allowed;
  `
  };
`;