import React from 'react'
import Cell from '../Cell/Cell'
import * as s from './style'
import { BoardState } from '../Game';
import {ReactComponent as ThreeBallsLoader} from '../../../assets/ThreeBallsLoader.svg';

interface Props {
  waitForOpponentMove: boolean
  boardState: BoardState
  winningPositions: Array<number> | null
  handlePlayerMove: (cellID: number, moveBySelf: boolean) => void
}

class Board extends React.Component<Props, {}> {

  renderCell = (cellID: number) => {
    const cellValue = this.props.boardState[cellID]
    const isInWinningPosition = this.props.winningPositions ? this.props.winningPositions.includes(cellID) : false
    return (
    <Cell 
      handlePlayerMove={() => this.props.handlePlayerMove(cellID, true)} 
      cellValue={cellValue} 
      isInWinningPosition={isInWinningPosition}
    />)
  }

  render() {
    const {waitForOpponentMove} = this.props
    return (
      <s.Board>
        <s.WaitingOverlay waitForOpponentMove={waitForOpponentMove}>
          <ThreeBallsLoader fill="white"/>
        </s.WaitingOverlay>
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