import React from 'react';
import Board from './Board/Board';
import * as s from './style'
import * as cs from '../common';
import { GameMode } from '../../App';
import {withTheme} from '../../styled-components'
import ThemeInterface from '../../theme';

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
export enum PlayerType {
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
  
  nextPlayer: PlayerType
  boardState: BoardState
  moveInHistory: number | null
  history: GameHistory
  gameResult: GameResult
}

interface Props {
  gameMode: GameMode
  isSelfPlayer1: boolean
  selfName: string
  selfAvatar: string
  opponentName: string
  opponentAvatar: string
  sendPlayerMoveCellIDToOpponent?: (cellID: number) => void
  sendRestartSignalToOpponent?: () => void
  theme: ThemeInterface
}

class Game extends React.Component<Props, State> {

  gameMode: GameMode
  selfName: string
  opponentName: string
  selfPlayerType: PlayerType
  opponentPlayerType: PlayerType
  selfAvatar: string
  opponentAvatar: string
  symbolOfSelf: PlayerSymbol
  symbolOfOpponent: PlayerSymbol
  Player1: PlayerInfo
  Player2: PlayerInfo
  colorForSelf: string
  colorForOpponent: string

  constructor(props: Props) {
    super(props)
    this.gameMode = props.gameMode
    this.selfName = props.selfName
    this.opponentName = props.opponentName
    this.selfAvatar = props.selfAvatar
    this.opponentAvatar = props.opponentAvatar
    const player1Name = props.isSelfPlayer1 ? props.selfName : props.opponentName
    this.symbolOfSelf = props.isSelfPlayer1 ? PlayerSymbol.X : PlayerSymbol.O
    this.symbolOfOpponent =  this.symbolOfSelf === PlayerSymbol.X ? PlayerSymbol.O : PlayerSymbol.X
    const player2Name = player1Name === props.selfName ? props.opponentName : props.selfName
    this.Player1 = {name: player1Name, symbol: PlayerSymbol.X}
    this.Player2 = {name: player2Name, symbol: PlayerSymbol.O}
    this.selfPlayerType = props.isSelfPlayer1 ? PlayerType.Player1 : PlayerType.Player2
    this.opponentPlayerType = this.selfPlayerType === PlayerType.Player1 ? PlayerType.Player2 : PlayerType.Player1
    const gameResult: NeitherResult = {resultType: "neither"}
    this.state = {
      nextPlayer: PlayerType.Player1,
      boardState: Array(9).fill(null),
      moveInHistory: null,
      history: new Map(),
      gameResult,
    }
    this.colorForSelf = props.isSelfPlayer1 ? props.theme.playerOneColor : props.theme.playerTwoColor
    this.colorForOpponent =  this.colorForSelf === props.theme.playerOneColor ? props.theme.playerTwoColor : props.theme.playerOneColor
  }

  togglePlayer = (player: PlayerType) : PlayerType => {
    if (player === PlayerType.Player1) {
      return PlayerType.Player2
    }
    return PlayerType.Player1
  }

  getSymbolOfPlayer = (player: PlayerType) : PlayerSymbol => {
    const symbolOfPlayer = this[player].symbol
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

    const currentPlayer = this.state.nextPlayer
    
    const {boardState, gameResult} = this.state
    
    const symbolOfCurrPlayer = this.getSymbolOfPlayer(currentPlayer)
    
    if (boardState[cellID] !== null || gameResult.resultType === "win") {
      return
    }

    if (moveBySelf && this.gameMode === GameMode.MultiPlayer) {
      this.props.sendPlayerMoveCellIDToOpponent!(cellID)
    }
    
    const newBoardState = boardState.slice()
    
    newBoardState[cellID] = symbolOfCurrPlayer

    const result = this.checkForWinDrawNeither(newBoardState, currentPlayer)

    const nextPlayer = this.togglePlayer(currentPlayer)

    this.setState({boardState: newBoardState, nextPlayer, gameResult: result})

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

  goBackToMove = (moveNum: number, playBySelf: boolean) => {
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
        nextPlayer: PlayerType.Player1, gameResult
      })
      if (playBySelf && this.gameMode === GameMode.MultiPlayer) {
        this.props.sendRestartSignalToOpponent!()
      }
    }
  }

  render() {
    // nextPlayer is the player that is gonna play now.
    const {nextPlayer, boardState, history, moveInHistory, gameResult} = this.state
    const {
      selfPlayerType, opponentPlayerType, colorForSelf, symbolOfSelf, symbolOfOpponent,
      colorForOpponent, selfName, selfAvatar, opponentAvatar, opponentName
    } = this
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
          gameStatusMessage = <cs.ColoredText bold>Waiting for <cs.ColoredText color={this.colorForOpponent} bold>{opponentName}</cs.ColoredText> to make a move...</cs.ColoredText> 
        } else {
          gameStatusMessage = <cs.ColoredText bold>Make a move!!</cs.ColoredText>
        }
        break;
    
      default:
        break;
    }
    return (
      <s.Game>
        <cs.FlexRowDiv>
          <cs.FlexColumnDiv Hcenter>
            <s.Avatar src={selfAvatar} />
            <cs.ColoredText bold color={colorForSelf}>You - {symbolOfSelf}</cs.ColoredText>
          </cs.FlexColumnDiv>
          <cs.FlexColumnDiv cssStyle={`margin: 0em 1.5em; padding-top: 2.5em;`}>
            <cs.ColoredText bold>VS</cs.ColoredText>
          </cs.FlexColumnDiv>
          <cs.FlexColumnDiv Hcenter>
            <s.Avatar src={opponentAvatar} />
            <cs.ColoredText bold color={colorForOpponent}>{opponentName} - {symbolOfOpponent}</cs.ColoredText>
          </cs.FlexColumnDiv>
        </cs.FlexRowDiv>
        <cs.FlexColumnDiv Hcenter>
          <cs.CenteringDiv height="6em">
            {gameStatusMessage}
          </cs.CenteringDiv>
          <Board
            gameResult={gameResult}
            waitForOpponentMove={waitForOpponentMove}
            boardState={boardState} 
            handlePlayerMove={this.handlePlayerMove}
          />
        </cs.FlexColumnDiv>
        <s.History>
          <s.Move>
            <cs.BasicButton levitate onClick={() => this.goBackToMove(0, true)}>
              Go to Game start
            </cs.BasicButton>
          </s.Move>
          {
          Array.from(history.keys()).map((moveNum) => (
            <s.Move key={moveNum} 
              levitate isClicked={moveInHistory===moveNum} 
              onClick={() => this.goBackToMove(moveNum, true)}
              >
              Go to move #{moveNum}
            </s.Move>
          ))
          }
        </s.History>      
      </s.Game>
    );
  }
}

export default withTheme(Game);