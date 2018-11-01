import React from 'react';
import Cell from '../Cell/Cell';
import * as s from './style'

class Board extends React.Component {

  renderCell = (cellID) => {
    const cellValue = this.props.boardState[cellID]
    const isInWinningPosition = this.props.winningPositions && this.props.winningPositions.includes(cellID)
    return (
    <Cell 
      handlePlayerMove={() => this.props.handlePlayerMove(cellID)} 
      cellValue={cellValue} 
      isInWinningPosition={isInWinningPosition} 
    />)
  }

  render() {
    return (
      <s.Board>
        <s.Row>
          {this.renderCell(0)}
          {this.renderCell(1)}
          {this.renderCell(2)}
        </s.Row>
        <s.Row>
          {this.renderCell(3)}
          {this.renderCell(4)}
          {this.renderCell(5)}
        </s.Row>
        <s.Row>
          {this.renderCell(6)}
          {this.renderCell(7)}
          {this.renderCell(8)}
        </s.Row>
      </s.Board>
    );
  }
}

export default Board;