import React from 'react';
import * as s from './style'
import * as cs from '../common'
import io from 'socket.io-client';
import AvailablePlayers from './AvailablePlayers/AvailablePlayers';
import Chatbox from './ChatBox/Chatbox';
import Game from '../Game/Game';
import { GameMode } from '../../App';
import * as utils from '../../utils/util'
import {ReactComponent as BarsLoader} from '../../assets/BarsLoader.svg'

export interface AvailablePlayer {
  name: string
  socketID: string
}

interface SocketResponse {
  message: string
  code: number
}

interface AnswerSignal extends RTCSessionDescription {}
interface OfferSignal extends RTCSessionDescription {}

interface CandidateSignal {
  type: 'candidate'
  candidate: RTCIceCandidateInit
}

export interface PeerSignal {
  name: string
  socketID: string
  offer:  OfferSignal
  candidate: CandidateSignal | null
}

export enum TextMessageTypes {
  IncomingTextMessage = "IncomingTextMessage",
  OutgoingTextMessage = "OutgoingTextMessage"
}

export interface IncomingTextMessage {
  type: TextMessageTypes.IncomingTextMessage
  value: string
}

export interface OutgoingTextMessage {
  type: TextMessageTypes.OutgoingTextMessage
  value: string
}

// TextMessage is the type of an object that contains text messages which are sent over the WebRTC connection.
export type TextMessage = IncomingTextMessage | OutgoingTextMessage

// PlayerMoveCellID is the type of an object that contains the player move symbol which is sent over the WebRTC connection.
export interface PlayerMoveCellID {
  type: "PlayerMoveCellID"
  value: number
}

// Payload is the type of an object which is sent over the WebRTC connection. The object can be of type TextMessage or PlayerMoveSymbol
export type Payload = TextMessage | PlayerMoveCellID

type SendQueue = Array<Payload>

export type AllTextMessages = Array<TextMessage>

type RequestsFromPlayers = Map<string, PeerSignal>

type AvailablePlayers = Array<AvailablePlayer>

interface State {
  playerName: string
  currentOutgoingTextMessage: string
  placeholderForPlayerNameEle: string
  allTextMessages: AllTextMessages
  availablePlayers: AvailablePlayers
  requestsFromPlayers: RequestsFromPlayers
  isInAvailablePlayersRoom: boolean
  colorName: string
}

interface Props {
  showErrorPopup: (errorObj: Error) => void
}


class Multiplayer extends React.Component<Props, State> {

  colorNameGenerator: Generator
  buttonRef: React.RefObject<any>
  nameInputChild: React.RefObject<any>
  multiPlayerChild: React.RefObject<any>
  gameComponentChild: React.RefObject<Game>
  defaultPlaceholder = "Enter player name"
  onErrorPlaceholder = "Name cannot be empty"
  opponentName =  ""
  isInitiator = false 
  sendQueue: SendQueue = []
  socket: SocketIOClient.Socket // Not initializing this member beacuse it doesnt need to be initialized.
  peerConn: RTCPeerConnection
  webRTCConfig: RTCConfiguration
  dataChannel: RTCDataChannel | null = null
  selectedAvailablePlayer: AvailablePlayer | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      playerName: "", currentOutgoingTextMessage: "", placeholderForPlayerNameEle: this.defaultPlaceholder, allTextMessages: [],
      availablePlayers: [], requestsFromPlayers: new Map(), isInAvailablePlayersRoom: false, colorName: "white"
    }
    this.gameComponentChild = React.createRef<Game>()
    this.multiPlayerChild = React.createRef<any>()
    this.nameInputChild = React.createRef<any>()
    this.buttonRef = React.createRef<any>()
    this.colorNameGenerator = this.getColorNameGenerator()
  }

  *getColorNameGenerator() {
    let i = 0
    while (i < utils.StandardHTMLColorNames.length){
      yield utils.StandardHTMLColorNames[i]
      i += 1
      if (i === utils.StandardHTMLColorNames.length) {
        i = 0
      }
    }
  }

  setNewColor = () => {
    this.multiPlayerChild.current ? this.multiPlayerChild.current.style.backgroundColor = this.colorNameGenerator.next().value : ""
    this.nameInputChild.current ? this.nameInputChild.current.style.backgroundColor = this.colorNameGenerator.next().value : ""
    this.buttonRef.current ? this.buttonRef.current.style.backgroundColor = this.colorNameGenerator.next().value : ""
  }

  handleInputChange : React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const {name, value} = event.currentTarget
    switch (name) {
      case "playerName":
        this.setState({playerName: value})
        break
    
      case "currentOutgoingMessage":
        this.setState({currentOutgoingTextMessage: value})
        break
    }
  }

  handleEnter : React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    const {name} = event.currentTarget
    if (event.key === "Enter") {
      switch (name) {
        case "currentOutgoingMessage":
          const outgoingTextMessage: OutgoingTextMessage = {
            type: TextMessageTypes.OutgoingTextMessage, 
            value: this.state.currentOutgoingTextMessage
          }
          this.sendDataToRemotePeer(outgoingTextMessage)
          break;
      
        case "playerName":
          this.handleJoinRoomClick()
          break;
      }
    }
  }

  handleSendTextMessageButton : React.MouseEventHandler<HTMLButtonElement> = () => {
    const outgoingTextMessage: OutgoingTextMessage = {
      type: TextMessageTypes.OutgoingTextMessage, 
      value: this.state.currentOutgoingTextMessage
    }
    this.sendDataToRemotePeer(outgoingTextMessage)
  }

  handleJoinRoomClick = () => {
    if (this.state.playerName === "") {
      this.setState({placeholderForPlayerNameEle: this.onErrorPlaceholder})
      return
    }

    this.socket = io({
      path: "/socketConnectionNamespace"
    })

    this.socket.on('connect', () => {

      console.log("Client socket is connected ?: ", this.socket.connected); // true
      
      this.registerToSocketEvents()
      
      this.socket.emit("registerNameWithSocket", this.state.playerName, (response: SocketResponse) => {
        console.log(response)
        
        this.socket.emit('joinAvailablePlayersRoom', (resp: SocketResponse) => {
          if (resp.code !== 200) {
            this.props.showErrorPopup(new Error(resp.message))
            return
          }
          console.log(resp)
          this.setState({isInAvailablePlayersRoom: true})
        });
        
        // window.onunload = function(playerName) {
        //   this.dataChannel.close()
        //   this.socket.close()
        // }.bind(this, this.state.playerName)
      })
      
      if (window.location.hostname.match(/localhost|127\.0\.0/)) {
        this.socket.emit('ipaddr');
      }
    });
  }
  

  registerToSocketEvents = () => {

    this.socket.on('playersInAvailableRoom', (availablePlayers: []) => {
      console.log("Got playersInAvailableRoom : ", availablePlayers)
      this.setState({availablePlayers})
    })

    this.socket.on('rejectionFromRequestedPlayer', (playerThatRejected: string) => {
      console.log(`${playerThatRejected} rejected the request to play`)
      this.peerConn.close()
      this.dataChannel!.close()
    })

    this.socket.on('ipaddr', (ipaddr: string) => {
      console.log('Server IP address is: ' + ipaddr);
    });
    
    this.socket.on('log', (msg: object) => console.log(msg))
    
    this.socket.on('offerFromRemotePlayer', (offer: object, remotePlayerName: string, remotePlayerSocketID: string) => {
      console.log(`${remotePlayerName} has sent a offer ${offer}`)
      const peerSignal: PeerSignal = {name: remotePlayerName, socketID: remotePlayerSocketID, offer: offer as OfferSignal, candidate: null}
      this.setState((prevState) => ({
        requestsFromPlayers: new Map(prevState.requestsFromPlayers).set(remotePlayerSocketID, peerSignal)
      }))
    });

    this.socket.on('candidateFromRemotePlayer', (candidate: object, remotePlayerName: string, remotePlayerSocketID: string) => {
      console.log(`${remotePlayerName} (${remotePlayerSocketID}) has sent an ICE candidate ${candidate}`)
      if (this.isInitiator) {
        this.processSignalFromRemotePeer(candidate as CandidateSignal)
        return
      }
      this.setState((prevState) => {
        const requestsFromPlayers = new Map(prevState.requestsFromPlayers)
        const signal = requestsFromPlayers.get(remotePlayerSocketID) as PeerSignal
        signal.candidate = candidate as CandidateSignal
        requestsFromPlayers.set(remotePlayerSocketID, signal)
        return {requestsFromPlayers}
      })
    });

    this.socket.on('answerFromRemotePlayer', (answer: object, remotePlayerName: string, remotePlayerSocketID: string) => {
      console.log(`${remotePlayerName} (${remotePlayerSocketID}) has sent an answer ${answer}`)
      this.processSignalFromRemotePeer(answer as RTCSessionDescription)
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log(`Disconnected from signaling Node server: ${reason}.`);
      // this.setState({canSendMessages: false})
    });
  }

  sendOfferToRemotePeerViaSignallingServer = (offer: OfferSignal) => {
    console.log(`${this.state.playerName} sending an offer to remote player ${this.selectedAvailablePlayer!.name}: ${offer}`);
    this.socket.emit('signalOfferToRemotePlayer', offer, this.selectedAvailablePlayer!.socketID);
  }

  sendCandidateToRemotePeerViaSignallingServer = (candidate: CandidateSignal) => {
    console.log(`${this.state.playerName} sending a candidate message to remote player ${this.selectedAvailablePlayer!.name}: ${candidate}`);
    this.socket.emit('signalCandidateToRemotePlayer', candidate, this.selectedAvailablePlayer!.socketID);
  }

  sendAnswerToRemotePeerViaSignallingServer = (answer: AnswerSignal) => {
    console.log(`${this.state.playerName} sending a answer to remote player ${this.selectedAvailablePlayer!.name}: ${answer}`);
    this.socket.emit('signalAnswerToRemotePlayer', answer, this.selectedAvailablePlayer!.socketID);
  }


  processSignalFromRemotePeer = async(signal: OfferSignal | AnswerSignal | CandidateSignal) => {
    switch (signal.type) {
      case 'offer':
        console.log('Got offer');
        try {
          const callerSessionDescription = new RTCSessionDescription(signal) // represents the caller's session description.
          await this.peerConn.setRemoteDescription(callerSessionDescription) // This establishes the received offer as the description of the remote (caller's) end of the connection.
          const localSessionDesc = await this.peerConn.createAnswer()
          await this.peerConn.setLocalDescription(localSessionDesc) // Set's description of the local end of the connection
          this.sendAnswerToRemotePeerViaSignallingServer(this.peerConn.localDescription as AnswerSignal)
        } catch(err) {
          this.props.showErrorPopup(err)
        }
        break;
    
      case 'answer':
        console.log('Got answer.');
        try {
          const calleeSessionDescription = new RTCSessionDescription(signal)
          await this.peerConn.setRemoteDescription(calleeSessionDescription);
        } catch(err) {
          this.props.showErrorPopup(err)
        }
        break;

      case 'candidate':
        console.log('Got ice candidate');
        try {
          const iceCandidate = new RTCIceCandidate(signal.candidate)
          await this.peerConn.addIceCandidate(iceCandidate)
        } catch(err) {
          this.props.showErrorPopup(err)
        }
        break;
      
      default:
        this.props.showErrorPopup(new Error("Got unexpected signal from remote peer."))
        break;
    }
  }

  /*
  The local ICE layer calls your icecandidate event handler, when it needs you to transmit an ICE candidate to the 
  other peer, through your signaling server. 
  */
  handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    console.log('icecandidate event:', event);
    const iceCandidate = event.candidate
    if (iceCandidate) {
      const candidateSignal: CandidateSignal = {type: "candidate", candidate: iceCandidate.toJSON()}
      this.sendCandidateToRemotePeerViaSignallingServer(candidateSignal)
    } else {
      console.log('End of candidates.');
    }
  }

  /*
  This function is called whenever the WebRTC infrastructure needs you to start the session negotiation process anew.
  Its job is to create and send an offer, to the callee, asking it to connect with us.
  */
  handleNegotiationNeededEvent = async () => {
    try {
      console.log('Creating an offer');
      const localSessionDescription = await this.peerConn.createOffer()
      await this.peerConn.setLocalDescription(localSessionDescription)
      // We know the description is valid, and has been set, when the promise returned by setLocalDescription() is fulfilled.
      this.sendOfferToRemotePeerViaSignallingServer(this.peerConn.localDescription as RTCSessionDescription)
    } catch(err) {
      this.props.showErrorPopup(err)
    }
  }

  /*
  The createPeerConnection() function is used by both the caller and the callee to construct their 
  RTCPeerConnection objects, their respective ends of the WebRTC connection.
  */
  createPeerConnection = (isInitiator: boolean, config?: RTCConfiguration) => {
    console.log('Creating Peer connection as initiator?', isInitiator, 'config:', config);
    this.peerConn = new RTCPeerConnection(config);
  
    // send any ice candidates to the other peer
    this.peerConn.onicecandidate = this.handleICECandidateEvent
  
    if (isInitiator) {
      this.peerConn.onnegotiationneeded = this.handleNegotiationNeededEvent
      console.log('Creating Data Channel')
      this.dataChannel = this.peerConn.createDataChannel('textMessages')
      this.onDataChannelCreated(this.dataChannel)
      this.forceUpdate()
    } else {
      console.log("Registering ondatachannel handler")
      // registering a handler that fires when the peer gets a datachannel from the other remote peer.
      this.peerConn.ondatachannel = (event) => {
        console.log('Got data channel from remote peer : ', event.channel);
        this.dataChannel = event.channel;
        this.onDataChannelCreated(this.dataChannel);
      };
    }
  }

  onDataChannelCreated = (channel: RTCDataChannel) => {
    console.log('onDataChannelCreated:', channel);
  
    channel.onopen = () => {
      console.log('Data channel opened!!!');
      this.socket = this.socket as SocketIOClient.Socket
      this.socket.emit("exitFromAvailablePlayersRoom", (resp: SocketResponse) => {
        if (resp.code !== 200) {
          this.props.showErrorPopup(new Error(resp.message))
          return
        }
        console.log(resp)
        this.setState({isInAvailablePlayersRoom: false, availablePlayers: [], requestsFromPlayers: new Map()})
      })
    };

    channel.onerror = (err) => {
      console.log("Data channel error", err)
    }
  
    channel.onclose = () => {
      console.log('Data channel closed.');
      if (this.state.isInAvailablePlayersRoom) {
        // This block is executed when the player's request is rejected
        this.forceUpdate()
        return
      }
      // The below code is executed when the player quits the match to join avaiable players pool.
      this.socket = this.socket as SocketIOClient.Socket
      this.socket.emit('joinAvailablePlayersRoom', (resp: SocketResponse) => {
        if (resp.code !== 200) {
          this.props.showErrorPopup(new Error(resp.message))
          return
        }
        console.log(resp)
        this.setState({allTextMessages: [], isInAvailablePlayersRoom: true})
        this.selectedAvailablePlayer = null
        this.dataChannel = null
      });
    }
  
    channel.onmessage = (evt: MessageEvent) => {
      console.log("Got payload from data channel!!!")
      const payload: Payload = JSON.parse(evt.data)
      if (payload.type === "PlayerMoveCellID") {
        console.log("got PlayerMoveCellID: ", payload.value)
        // make handlePlayerMove execute in Game component which is a child of this component.
        // so make a method in child comp execute from the parent comp.
        // Using a reference to the child comp and trigerring the method.
        this.gameComponentChild.current!.handlePlayerMove(payload.value, false)
        return
      }
      const incomingTextMessage: IncomingTextMessage = {type: TextMessageTypes.IncomingTextMessage, value: payload.value}
      this.setState((prevState) => ({
        allTextMessages: prevState.allTextMessages.concat(incomingTextMessage)
      }))
    }
  }

  invitePlayer = () => {
    this.isInitiator = true
    this.createPeerConnection(this.isInitiator);
  }

  handleAvailablePlayerClick = (availablePlayer: AvailablePlayer) => {
    this.selectedAvailablePlayer = availablePlayer
    console.log(this.selectedAvailablePlayer)
    this.invitePlayer()
  }

  sendRejectionResponseToPeers = (peersToReject: Array<string>) => {
    this.socket.emit("sendRejectionResponseToPeers", peersToReject, (resp: SocketResponse) => {
      if (resp.code !== 200) {
        this.props.showErrorPopup(new Error(resp.message))
      }
      console.log(resp.message)
    })
  }

  acceptPeerRequest = (selectedPeerSocketID: string) => {
    const peerSignal = this.state.requestsFromPlayers.get(selectedPeerSocketID) as PeerSignal
    const peersToReject = Array.from(this.state.requestsFromPlayers.keys()).filter((socketID) => socketID !== selectedPeerSocketID)
    this.sendRejectionResponseToPeers(peersToReject)
    this.selectedAvailablePlayer = {name: peerSignal.name, socketID: peerSignal.socketID}
    this.isInitiator = false
    this.createPeerConnection(this.isInitiator); // because this client needs to also open RTCPeerConnection to receive the data channel.
    this.processSignalFromRemotePeer(peerSignal.offer)
    this.processSignalFromRemotePeer(peerSignal.candidate as CandidateSignal)
  }

  sendDataToRemotePeer = (payload: Payload) => {
    switch(this.dataChannel!.readyState) {
      case "connecting":
        console.log("Connection not open; queueing: " + payload);
        this.sendQueue.push(payload);
        break;
      case "open":
        console.log("Sending data: ", payload)
        this.sendQueue.push(payload);
        while (this.sendQueue.length) {
          this.dataChannel!.send(JSON.stringify(this.sendQueue.shift()))
        }
        if (payload.type === TextMessageTypes.OutgoingTextMessage) {
          this.setState((prevState) => ({
            currentOutgoingTextMessage: "",
            allTextMessages: prevState.allTextMessages.concat(payload)
          }))
        }
        break;
      case "closing":
        console.log("Attempted to send message while closing: " + payload);
        break;
      case "closed":
        console.log("Error! Attempt to send while connection closed.");
        break;
      default:
        console.log("should not happen")
        break;
    }
  }

  sendPlayerMoveCellIDToOpponent = (cellID: number) => {
    const playerMoveCellID: PlayerMoveCellID = {type: "PlayerMoveCellID", value: cellID}
    this.sendDataToRemotePeer(playerMoveCellID)
  }

  handleQuitMatchAndGoBackToAvailablePool = () => {
    this.dataChannel!.close()
  }

  showViewBasedOnDataChannelState = () => {
    const {playerName, allTextMessages, currentOutgoingTextMessage} = this.state
    if (this.dataChannel === null) {
      return
    }

    const {readyState} = this.dataChannel

    switch (readyState) {
      case "closed":
        if (this.state.isInAvailablePlayersRoom) {
          return (
            <cs.ColoredText>
              <cs.ColoredText color="red">{this.selectedAvailablePlayer!.name}</cs.ColoredText> has <cs.ColoredText color="red">REJECTED</cs.ColoredText> your request to play. Choose another player.
            </cs.ColoredText>
          )
        }

        
    
      case "open":
        return (
          <cs.FlexColumnDiv Hcenter>
            <cs.ColoredText block bold>Connected with <cs.ColoredText color="blue">{this.selectedAvailablePlayer!.name}</cs.ColoredText></cs.ColoredText>
            <Game
              gameMode={GameMode.MultiPlayer}
              ref={this.gameComponentChild}
              sendPlayerMoveCellIDToOpponent={this.sendPlayerMoveCellIDToOpponent}
              playerName={playerName}
              opponentName={this.selectedAvailablePlayer!.name}
              player1Name={this.isInitiator ? playerName : this.selectedAvailablePlayer!.name} 
              player2Name={this.isInitiator ? this.selectedAvailablePlayer!.name : playerName} 
            />
            <cs.FlexRowContainer>
              <cs.ColoredText>Quit match and join the available pool again?</cs.ColoredText>
              <cs.BasicButton onClick={this.handleQuitMatchAndGoBackToAvailablePool}>Yes</cs.BasicButton>
            </cs.FlexRowContainer>
            <Chatbox
              allTextMessages={allTextMessages} 
              handleEnter={this.handleEnter}
              handleSendTextMessageButton={this.handleSendTextMessageButton}
              currentOutgoingMessage={currentOutgoingTextMessage}
              handleInputChange={this.handleInputChange}
            />
          </cs.FlexColumnDiv>
        )

      case "connecting":
          return (
            <cs.FlexColumnDiv Hcenter>
              <BarsLoader width="100" height="100" fill="pink"/>
              <cs.ColoredText bold>Waiting to hear back from <cs.ColoredText bold color="blue">{this.selectedAvailablePlayer!.name}</cs.ColoredText> </cs.ColoredText>
            </cs.FlexColumnDiv>
          )

      default:
        break;
    }
  }

  showAvailablePlayers = () => {
    const {availablePlayers} = this.state
    if (availablePlayers.length === 0) {
      return null
    }
    const availablePlayersExceptSelf = availablePlayers.filter((player) => player.socketID !== this.socket.id)
    return (
      <AvailablePlayers 
        handleAvailablePlayerClick={this.handleAvailablePlayerClick} 
        availablePlayers={availablePlayersExceptSelf}
        selectedAvailablePlayer={this.selectedAvailablePlayer} 
      />
    )
  }

  showRequestsFromPlayers = () => {
    const {requestsFromPlayers} = this.state
    if (requestsFromPlayers.size === 0) {
      return
    }

    console.log("Got requests!!: ", requestsFromPlayers)
    return (
      <cs.FlexColumnContainer>
        {
          Array.from(requestsFromPlayers.values()).map((peerSignal) => {
            if (peerSignal.candidate === null) {
              return null
            }
            return (
              <cs.FlexRowDiv key={peerSignal.socketID}>
                <cs.ColoredText>Got request from <cs.ColoredText bold color="red">{peerSignal.name}</cs.ColoredText></cs.ColoredText>
                <cs.BasicButton levitate onClick={() => this.acceptPeerRequest(peerSignal.socketID)}>Accept</cs.BasicButton>
              </cs.FlexRowDiv>
            )
          })
        }
      </cs.FlexColumnContainer>
    )
  }

  componentDidMount = () => {
    setInterval(this.setNewColor, 1000)
  }

  render() {
    console.log("state in render: ", this.state)
    const {playerName, placeholderForPlayerNameEle, isInAvailablePlayersRoom, colorName}= this.state
    const showJoiningForm = isInAvailablePlayersRoom === false && this.dataChannel === null ? true : false
    console.log("showJoiningForm: ", showJoiningForm)
    return (
      <s.MultiPlayer showJoiningForm colorName={colorName} ref={this.multiPlayerChild}>
        {
        showJoiningForm
        ?
        <s.JoiningForm>
          <s.NameInput 
            ref={this.nameInputChild} name="playerName" autoFocus placeholder={placeholderForPlayerNameEle} 
            onKeyUp={this.handleEnter} onChange={this.handleInputChange} value={playerName} 
          />
          <cs.BasicButton transitionProp="background-color" ref={this.buttonRef} levitate onClick={this.handleJoinRoomClick}>Join room</cs.BasicButton>
        </s.JoiningForm>
        :
        <s.MultiPlayerWrapper>
          <cs.ColoredText block bold>You are playing as <cs.ColoredText bold color="red">{playerName}</cs.ColoredText></cs.ColoredText>
          <cs.FlexRowDiv>
            {this.showAvailablePlayers()}
            {this.showRequestsFromPlayers()}
          </cs.FlexRowDiv>
          {this.showViewBasedOnDataChannelState()}
        </s.MultiPlayerWrapper>
        }
      </s.MultiPlayer>
    );
  }
}

export default Multiplayer;