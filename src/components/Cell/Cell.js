import React from 'react';
import * as s from './style'

const Cell = ({handlePlayerMove, cellValue, isInWinningPosition}) => {
  return (
    <s.Cell onClick={handlePlayerMove} isInWinningPosition={isInWinningPosition}>{cellValue}</s.Cell>
  )
}

export default Cell;