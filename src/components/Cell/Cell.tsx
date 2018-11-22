import React from 'react';
import * as s from './style'

export interface Props {
  handlePlayerMove: () => void
  cellValue: string
  isInWinningPosition: boolean
}

function Cell(props: Props) {
  return (
    <s.Cell onClick={props.handlePlayerMove} isInWinningPosition={props.isInWinningPosition}>{props.cellValue}</s.Cell>
  )
}

export default Cell;