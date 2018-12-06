import React from 'react'
import Cell from '../Cell/Cell'
import * as s from './style'
import { BoardState, GameResult } from '../Game';
import {ReactComponent as ThreeBallsLoader} from '../../../assets/ThreeBallsLoader.svg';

interface Props {
  gameResult: GameResult
  waitForOpponentMove: boolean
  boardState: BoardState
  handlePlayerMove: (cellID: number, moveBySelf: boolean) => void
}

class Board extends React.Component<Props, {}> {

  renderCell = (cellID: number) => {
    const cellValue = this.props.boardState[cellID]
    let isInWinningPosition = false
    if (this.props.gameResult.resultType === "win") {
      isInWinningPosition = this.props.gameResult.winningCellPositions.includes(cellID)
    }
    return (
      <Cell 
        handlePlayerMove={() => this.props.handlePlayerMove(cellID, true)} 
        cellValue={cellValue} 
        isInWinningPosition={isInWinningPosition}
      />
    )
  }

  render() {
    const {gameResult, waitForOpponentMove} = this.props
    return (
      <s.Board>
        <s.Overlay waitForOpponentMove={waitForOpponentMove}>
          <ThreeBallsLoader width="140" height="50" fill="white"/>
        </s.Overlay>
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