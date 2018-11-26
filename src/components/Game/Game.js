import React from 'react';
import Board from '../Board/Board';
import * as s from './style'
import { BasicButton } from '../common';

class Game extends React.Component {

  state = {
    Player1: {symbol: "X"}, 
    Player2: {symbol: "O"},
    nextPlayer: "Player1",
    boardState: Array(9).fill(null),
    moveInHistory: null,
    history: {},
    winner: null
  }

  togglePlayer = (player) => {
    if (player === "Player1") {
      return "Player2"
    }
    return "Player1"
  }

  getSymbolOfPlayer = (player) => {
    const symbolOfPlayer = this.state[player].symbol
    return symbolOfPlayer
  }

  recordMoveInHistory = (newBoardState, nextPlayer) => {
    const {history, moveInHistory} = this.state
    if (moveInHistory !== null) {
      const newHistory = {}
      for (let move = 1; move <= moveInHistory; move++) {
        const boardState = history[move]
        newHistory[move] = boardState
      }
      const currMoveNo = Number(moveInHistory) + 1
      this.setState({
        history: {...newHistory, [currMoveNo]: {nextPlayer, boardState: newBoardState}},
        moveInHistory: null
      })
      return
    }
  
    const noOfMovesBefore = Object.keys(history).length
    const currMoveNo = noOfMovesBefore + 1
    this.setState({
      history: {...history,  [currMoveNo]: {nextPlayer, boardState: newBoardState}}
    })
  }


  handlePlayerMove = (cellID) => {
    const currentPlayer = this.state.nextPlayer
    const {boardState, winner} = this.state
    const symbolOfCurrPlayer = this.getSymbolOfPlayer(currentPlayer)
    if (boardState[cellID] !== null || winner !== null) {
      return
    }
    const newBoardState = boardState.slice()
    newBoardState[cellID] = symbolOfCurrPlayer

    const result = this.checkForWin(newBoardState, currentPlayer)

    const nextPlayer = this.togglePlayer(currentPlayer)

    this.setState({boardState: newBoardState, nextPlayer, winner: result})

    this.recordMoveInHistory(newBoardState, nextPlayer)
  }

  checkForWin = (boardState, currentPlayer) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [cellA, cellB, cellC] = lines[i]
      if (boardState[cellA] && boardState[cellA] === boardState[cellB] && boardState[cellA] === boardState[cellC]) {
        return {name: currentPlayer, winngingSymbol: boardState[cellA], cellPositions: lines[i]}
      }
    }
    return null
  }

  goBackToMove = (moveNum) => {
    this.setState((state) => {
      if (moveNum !== 0) {
        const prevGameState = state.history[moveNum]
        const {boardState, nextPlayer} = prevGameState
        const currentPlayer = this.togglePlayer(nextPlayer)
        const winner = this.checkForWin(boardState, currentPlayer)
        return {boardState, nextPlayer, moveInHistory: moveNum, winner}
      } else {
        return {boardState: Array(9).fill(null), history: {}, moveInHistory: null, nextPlayer: "Player1", winner:null}
      }
    })
  }

  render() {
    const {nextPlayer, boardState, history, moveInHistory, winner} = this.state
    const symbolOfNextPlayer = this.getSymbolOfPlayer(nextPlayer)
    return (
      <s.Game>
        <Board boardState={boardState} handlePlayerMove={this.handlePlayerMove} winningPositions={winner && winner.cellPositions}/>
        <s.History>
          {
          winner ? <h3>{winner.name} has won!</h3> : <h3>Next Player: {nextPlayer}, Symbol: {symbolOfNextPlayer}</h3>
          }
          <s.ListOfMoves>
            <s.Move><BasicButton levitate onClick={() => this.goBackToMove(0)}>Go to Game start</BasicButton></s.Move>
            {
            Object.keys(history).map((moveNum) => {
              return <s.Move><BasicButton levitate key={moveNum} isClicked={moveInHistory===moveNum} onClick={() => this.goBackToMove(moveNum)}>Go to move #{moveNum}</BasicButton></s.Move>
            })
            }
          </s.ListOfMoves>
        </s.History>      
      </s.Game>
    );
  }
}

export default Game;