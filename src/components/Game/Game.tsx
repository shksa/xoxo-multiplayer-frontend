import React from 'react';
import Board from './Board/Board';
import * as s from './style'
import * as cs from '../common';
import { GameMode } from '../../App';

export enum PlayerSymbol {
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

export type GameResult = WinningResult | DrawResult | NeitherResult
interface DrawResult {
  resultType: "draw"
}

interface NeitherResult {
  resultType: "neither"
}

interface WinningResult {
  resultType: "win"
  winningPlayer: PlayerType
  winningSymbol: PlayerSymbol
  winningCellPositions: Array<number>
}

interface State {
  selfName: string
  opponentName: string
  selfPlayerType: PlayerType
  opponentPlayerType: PlayerType
  Player1: PlayerInfo
  Player2: PlayerInfo
  nextPlayer: PlayerType
  boardState: BoardState
  moveInHistory: number | null
  history: GameHistory
  gameResult: GameResult
  isGameEnded: boolean
  gameMode: GameMode
}

interface Props {
  gameMode: GameMode
  isSelfPlayer1: boolean
  selfName: string
  opponentName: string
  sendPlayerMoveCellIDToOpponent?: (cellID: number) => void
}

class Game extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    const player1Name = props.isSelfPlayer1 ? props.selfName : props.opponentName
    const player2Name = player1Name === props.selfName ? props.opponentName : props.selfName
    const selfPlayerType = props.isSelfPlayer1 ? PlayerType.Player1 : PlayerType.Player2
    const opponentPlayerType = selfPlayerType === PlayerType.Player1 ? PlayerType.Player2 : PlayerType.Player1
    const gameResult: NeitherResult = {resultType: "neither"}
    this.state = {
      gameMode: props.gameMode,
      selfName: props.selfName,
      opponentName: props.opponentName,
      selfPlayerType,
      opponentPlayerType,
      Player1: {name: player1Name, symbol: PlayerSymbol.X}, 
      Player2: {name: player2Name, symbol: PlayerSymbol.O},
      nextPlayer: PlayerType.Player1,
      boardState: Array(9).fill(null),
      moveInHistory: null,
      history: new Map(),
      gameResult,
      isGameEnded: false
    }
  }

  togglePlayer = (player: PlayerType) : PlayerType => {
    if (player === PlayerType.Player1) {
      return PlayerType.Player2
    }
    return PlayerType.Player1
  }

  getSymbolOfPlayer = (player: PlayerType) : PlayerSymbol => {
    const symbolOfPlayer = this.state[player].symbol
    return symbolOfPlayer
  }

  recordMoveInHistory = (newBoardState: BoardState, nextPlayer: PlayerType) => {
    const {history, moveInHistory} = this.state
    const historyTillNow = new Map(history)
    if (moveInHistory !== null) {
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


  handlePlayerMove = (cellID: number, moveBySelf: boolean) => {

    if (moveBySelf && this.state.gameMode === GameMode.MultiPlayer) {
      this.props.sendPlayerMoveCellIDToOpponent!(cellID)
    }

    const currentPlayer = this.state.nextPlayer
    
    const {boardState, gameResult} = this.state
    
    const symbolOfCurrPlayer = this.getSymbolOfPlayer(currentPlayer)
    
    if (boardState[cellID] !== null) {
      return
    }
    
    const newBoardState = boardState.slice()
    
    newBoardState[cellID] = symbolOfCurrPlayer

    const result = this.checkForWinDrawNeither(newBoardState, currentPlayer)

    const isGameEnded = result.resultType === "neither" ? false : true

    const nextPlayer = this.togglePlayer(currentPlayer)

    this.setState({boardState: newBoardState, nextPlayer, gameResult: result, isGameEnded})

    this.recordMoveInHistory(newBoardState, nextPlayer)
  }

  checkForWinDrawNeither = (boardState: BoardState, currentPlayer: PlayerType) : GameResult => {
    const lines = [
      [0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [cellA, cellB, cellC] = lines[i]
      if (boardState[cellA] && boardState[cellA] === boardState[cellB] && boardState[cellA] === boardState[cellC]) {
        const gameResult: WinningResult = {
          resultType: "win",
          winningPlayer: currentPlayer, 
          winningSymbol: boardState[cellA], 
          winningCellPositions: lines[i]
        }
        return gameResult
      }
    }
    const gameIsADraw = this.checkForDraw(boardState)
    if (gameIsADraw) {
      const drawResult: DrawResult = {resultType: "draw"} 
      return drawResult
    } else {
      const neitherResult: NeitherResult = {resultType: "neither"}
      return neitherResult
    }
  }

  checkForDraw = (boardState: BoardState): boolean => {
    let gameIsADraw: boolean
    for (const cellValue of boardState) {
      if (cellValue === null) {
        gameIsADraw = false
        return gameIsADraw
      }
    }
    gameIsADraw = true
    return gameIsADraw
  }

  goBackToMove = (moveNum: number) => {
    if (moveNum !== 0) {
      const prevGameState = this.state.history.get(moveNum) as GameState
      const {boardState, nextPlayer} = prevGameState
      const currentPlayer = this.togglePlayer(nextPlayer)
      const gameResult = this.checkForWinDrawNeither(boardState, currentPlayer)
      this.setState({
        boardState, nextPlayer, moveInHistory: moveNum, gameResult
      })
    } else {
      const gameResult: NeitherResult = {resultType: "neither"}
      this.setState({
        boardState: Array(9).fill(null), history: new Map(), moveInHistory: null, 
        nextPlayer: PlayerType.Player1, gameResult, isGameEnded: false
      })
    }
  }

  render() {
    // nextPlayer is the player that is gonna play now.
    const {selfName, nextPlayer, boardState, history, moveInHistory, gameResult, opponentName, selfPlayerType, opponentPlayerType} = this.state
    let gameStatusMessage;
    let waitForOpponentMove = false;
    switch (gameResult.resultType) {
      case "draw":
        gameStatusMessage = <cs.ColoredText>This game a mothafucking draw!</cs.ColoredText>
        break;

      case "win":
        const didSelfWin = gameResult.winningPlayer === selfPlayerType
        if (didSelfWin) {
          gameStatusMessage = <cs.ColoredText bold>You <cs.ColoredText bold>won</cs.ColoredText> the match!</cs.ColoredText>
        } else {
          gameStatusMessage = <cs.ColoredText bold>You <cs.ColoredText bold>lost</cs.ColoredText> the match!</cs.ColoredText>
        }
        break;

      case "neither":
        waitForOpponentMove = nextPlayer === opponentPlayerType
        if (waitForOpponentMove) {
          gameStatusMessage = <cs.ColoredText bold>Waiting for <cs.ColoredText color="blue" bold>{opponentName}</cs.ColoredText> to make a move...</cs.ColoredText> 
        } else {
          gameStatusMessage = <cs.ColoredText bold>Make a move!!</cs.ColoredText>
        }
        break;
    
      default:
        break;
    }
    return (
      <s.Game>
        <cs.FlexColumnDiv Hcenter>
          <cs.ColoredText bold>
            You are playing as <cs.ColoredText bold color="red">{selfName}</cs.ColoredText>
          </cs.ColoredText>
          <cs.ColoredText bold>
            Against <cs.ColoredText bold>{opponentName}</cs.ColoredText>
          </cs.ColoredText>
          <cs.ColoredText bold>
            Your symbol: <cs.ColoredText bold>{this.getSymbolOfPlayer(selfPlayerType)} </cs.ColoredText>
          </cs.ColoredText>
        </cs.FlexColumnDiv>
        <cs.FlexColumnDiv Hcenter>
          {gameStatusMessage}
          <Board
            gameResult={gameResult}
            waitForOpponentMove={waitForOpponentMove}
            boardState={boardState} 
            handlePlayerMove={this.handlePlayerMove}
          />
        </cs.FlexColumnDiv>
        <s.History>
          <s.Move>
            <cs.BasicButton levitate onClick={() => this.goBackToMove(0)}>
              Go to Game start
            </cs.BasicButton>
          </s.Move>
          {
          Array.from(history.keys()).map((moveNum) => (
            <s.Move key={moveNum}>
              <cs.BasicButton 
                levitate isClicked={moveInHistory===moveNum} 
                onClick={() => this.goBackToMove(moveNum)}
              >
              Go to move #{moveNum}
              </cs.BasicButton>
            </s.Move>
          ))
          }
        </s.History>      
      </s.Game>
    );
  }
}

export default Game;