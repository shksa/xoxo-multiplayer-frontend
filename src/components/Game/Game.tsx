import React from 'react';
import Board from '../Board/Board';
import * as s from './style'
import { BasicButton } from '../common';

enum PlayerSymbol {
  X = "X",
  O = "O",
}
interface PlayerInfo {
  name: string
  symbol: PlayerSymbol
}

// When all members in an enum have literal values, special semantics come into play.
// 1. First is that enum members become types as well.
// 2. Second is that the enum type effectively becomes the union of each enum member.
enum PlayerType {
  Player1 = "Player1", // Player1 is an enum member which has a constant value "Player1" associated with it, a constant enum member.
  Player2 = "Player2",
}

export type BoardState = Array<PlayerSymbol>

interface GameState {
  nextPlayer: PlayerType
  boardState: BoardState
}

type GameHistory = Map<number, GameState>

interface GameResult {
  winningPlayer: PlayerType
  winningSymbol: PlayerSymbol
  winningCellPositions: Array<number>
}

interface State {
  Player1: PlayerInfo
  Player2: PlayerInfo
  nextPlayer: PlayerType
  boardState: BoardState
  moveInHistory: number | null
  history: GameHistory
  winner: GameResult | null
}

interface Props {
  Player1Name: string
  Player2Name: string
}

class Game extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      Player1: {name: props.Player1Name, symbol: PlayerSymbol.X}, 
      Player2: {name: props.Player2Name, symbol: PlayerSymbol.O},
      nextPlayer: PlayerType.Player1,
      boardState: Array(9).fill(null),
      moveInHistory: null,
      history: new Map(),
      winner: null
    }
  }

  togglePlayer = (player: PlayerType) => {
    if (player === PlayerType.Player1) {
      return PlayerType.Player2
    }
    return PlayerType.Player1
  }

  getSymbolOfPlayer = (player: PlayerType) => {
    const symbolOfPlayer = this.state[player].symbol
    return symbolOfPlayer
  }

  recordMoveInHistory = (newBoardState: BoardState, nextPlayer: PlayerType) => {
    const {history, moveInHistory} = this.state
    const historyTillNow = new Map(history)
    if (moveInHistory !== null) {
      
      // for (let move = 1; move <= moveInHistory; move++) {
      //   const boardState = history.get(move)
      //   newHistory.set(move, boardState)
      // }
      const currMoveNo = moveInHistory + 1
      const newHistory = historyTillNow.set(currMoveNo, {nextPlayer, boardState: newBoardState})
      this.setState({
        history: newHistory,
        moveInHistory: null
      })
      return
    }
  
    const currMoveNo = historyTillNow.size + 1
    const newHistory = historyTillNow.set(currMoveNo, {nextPlayer, boardState: newBoardState})
    this.setState({
      history: newHistory
    })
  }


  handlePlayerMove = (cellID: number) => {
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

  checkForWin = (boardState: BoardState, currentPlayer: PlayerType) => {
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
        const gameResult: GameResult = {winningPlayer: currentPlayer, winningSymbol: boardState[cellA], winningCellPositions: lines[i]}
        return gameResult
      }
    }
    return null
  }

  goBackToMove = (moveNum: number) => {
    if (moveNum !== 0) {
      const prevGameState = this.state.history.get(moveNum) as GameState
      const {boardState, nextPlayer} = prevGameState
      const currentPlayer = this.togglePlayer(nextPlayer)
      const winner = this.checkForWin(boardState, currentPlayer)
      this.setState({boardState, nextPlayer, moveInHistory: moveNum, winner})
    } else {
      this.setState({boardState: Array(9).fill(null), history: new Map(), moveInHistory: null, nextPlayer: PlayerType.Player1, winner:null})
    }
  }

  render() {
    const {nextPlayer, boardState, history, moveInHistory, winner} = this.state
    const symbolOfNextPlayer = this.getSymbolOfPlayer(nextPlayer)
    return (
      <s.Game>
        <Board boardState={boardState} handlePlayerMove={this.handlePlayerMove} winningPositions={winner && winner.winningCellPositions}/>
        <s.History>
          {
          winner ? <h3>{winner.winningPlayer} has won!</h3> : <h3>Next Player: {nextPlayer}, Symbol: {symbolOfNextPlayer}</h3>
          }
          <s.ListOfMoves>
            <s.Move><BasicButton levitate onClick={() => this.goBackToMove(0)}>Go to Game start</BasicButton></s.Move>
            {
            Array.from(history.keys()).map((moveNum) => {
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