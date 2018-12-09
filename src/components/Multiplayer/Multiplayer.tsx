import React from 'react';
import * as s from './style'
import * as cs from '../common'
import io from 'socket.io-client';
import AvailablePlayersRoom from './AvailablePlayersRoom/AvailablePlayersRoom';
import Chatbox from './ChatBox/Chatbox';
import Game from '../Game/Game';
import { GameMode } from '../../App';
import * as utils from '../../utils/util'
import {ReactComponent as BarsLoader} from '../../assets/BarsLoader.svg'
import defaultAvatarImg from '../../assets/defaultAvatar.jpeg'

export interface AvailablePlayer {
  name: string
  avatar: string
  socketID: socketID
}

export type socketID = string

export interface SelectedOpponent {
  name: string
  socketID: socketID
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
  socketID: socketID
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

export interface RestartSignal {
  type: "RestartGame"
}

// Payload is the type of an object which is sent over the WebRTC connection. The object can be of type TextMessage or PlayerMoveSymbol
export type Payload = TextMessage | PlayerMoveCellID | RestartSignal

type SendQueue = Array<Payload>

export type AllTextMessages = Array<TextMessage>

export type RequestsFromPlayers = Map<socketID, PeerSignal>

type AvailablePlayers = Array<AvailablePlayer>

export interface ConnnectionInfo {
  socketID: socketID
  status: "connecting" | "rejected" | "open"
}

interface State {
  selfName: string
  currentOutgoingTextMessage: string
  placeholderForPlayerNameEle: string
  allTextMessages: AllTextMessages
  availablePlayers: AvailablePlayers
  requestsFromPlayers: RequestsFromPlayers
  isInAvailablePlayersRoom: boolean
  avatarImage: string
  connectionStatus: ConnnectionInfo | null
}

interface Props {
  showPopUp: (popUpValue: any) => void
}


class Multiplayer extends React.Component<Props, State> {

  basicButtonRef = React.createRef<any>()
  nameInputRef = React.createRef<any>()
  multiPlayerRef = React.createRef<any>()
  gameComponentChild = React.createRef<any>()
  defaultPlaceholder = "Enter player name"
  onErrorPlaceholder = "Name cannot be empty"
  opponentName =  ""
  isInitiator = false 
  sendQueue: SendQueue = []
  socket: SocketIOClient.Socket // Not initializing this member beacuse it doesnt need to be initialized.
  peerConn: RTCPeerConnection
  webRTCConfig: RTCConfiguration
  dataChannel: RTCDataChannel | null = null
  selectedOpponent: SelectedOpponent | null = null
  socketServerAddress: string
  avatarServerAddress: string
  setIntervalIds: Array<NodeJS.Timeout> 
  defaultAvatarImage = defaultAvatarImg

  constructor(props: Props) {
    super(props)
    this.state = {
      selfName: "", currentOutgoingTextMessage: "", placeholderForPlayerNameEle: this.defaultPlaceholder, allTextMessages: [],
      availablePlayers: [], requestsFromPlayers: new Map(), isInAvailablePlayersRoom: false, avatarImage: "",
      connectionStatus: null
    }

    if (process.env.NODE_ENV === "development") {
      this.socketServerAddress = process.env.REACT_APP_DEV_SOCKET_SERVER_ADDRESS as string
      this.avatarServerAddress = process.env.REACT_APP_DEV_AVATAR_SERVER as string
    } else {
      this.socketServerAddress = process.env.REACT_APP_PROD_SOCKET_SERVER_ADDRESS as string
      this.avatarServerAddress = process.env.REACT_APP_PROD_AVATAR_SERVER as string
    }
    console.log("Using socketServerAddress: ", this.socketServerAddress)
    console.log("Using avatarServerAddress: ", this.avatarServerAddress)
  }

  handleInputChange : React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const {name, value} = event.currentTarget
    switch (name) {
      case "playerName":
        this.setState({selfName: value})
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

  getAvatarBasedOnUserName = async(userID: string) => {
    const response = await fetch(`${this.avatarServerAddress}/getRandomAvatarBasedOnUniqueUserID?userID=${userID}`)
    if (!response.ok) {
      throw Error("could not connect to the server.");
    }
    if (response.status !== 200) {
      throw Error(`status code: ${response.clone}, status message: ${response.statusText}`)
    }
    const blob = await response.blob()
    const base64img = URL.createObjectURL(blob)
    return base64img
  }

  handleJoinRoomClick = async() => {
    if (this.state.selfName === "") {
      this.setState({placeholderForPlayerNameEle: this.onErrorPlaceholder})
      return
    }

    const {selfName} = this.state
    let avatar: string
    try {
      avatar = await this.getAvatarBasedOnUserName(selfName)
      console.log("base64img: ", avatar)
    } catch (error) {
      avatar = this.defaultAvatarImage
      this.props.showPopUp(JSON.stringify(error))
    }
    this.setState({avatarImage: avatar})

    this.socket = io(this.socketServerAddress, {
      path: '/xoxo-multiplayer-socketConnectionNamespace'
    })

    this.socket.on('connect', () => {

      console.log("Client socket is connected ?: ", this.socket.connected); // true
      
      this.registerToSocketEvents()
      
      this.socket.emit("registerNameAndAvatarWithSocket", selfName, avatar, (response: SocketResponse) => {
        console.log(response)
        
        this.socket.emit('joinAvailablePlayersRoom', (resp: SocketResponse) => {
          if (resp.code !== 200) {
            this.props.showPopUp(new Error(resp.message))
            return
          }
          console.log(resp)
          this.setState({isInAvailablePlayersRoom: true})
        });
        
        // TODO: Socket disconnect on window unload or whatever.
      })
    });
  }
  

  registerToSocketEvents = () => {

    this.socket.on('playersInAvailableRoom', (availablePlayers: AvailablePlayers) => {
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
    
    this.socket.on('offerFromRemotePlayer', (offer: OfferSignal, remotePlayerName: string, remotePlayerSocketID: socketID) => {
      console.log(`${remotePlayerName} has sent a offer ${JSON.stringify(offer)}`)
      const peerSignal: PeerSignal = {name: remotePlayerName, socketID: remotePlayerSocketID, offer: offer, candidate: null}
      this.setState((prevState) => ({
        requestsFromPlayers: new Map(prevState.requestsFromPlayers).set(remotePlayerSocketID, peerSignal)
      }))
    });

    this.socket.on('candidateFromRemotePlayer', (candidate: CandidateSignal, remotePlayerName: string, remotePlayerSocketID: socketID) => {
      console.log(`${remotePlayerName} (${remotePlayerSocketID}) has sent an ICE candidate ${JSON.stringify(candidate)}`)
      if (this.isInitiator) {
        this.processSignalFromRemotePeer(candidate)
        return
      }
      this.setState((prevState) => {
        const requestsFromPlayers = new Map(prevState.requestsFromPlayers)
        const signal = requestsFromPlayers.get(remotePlayerSocketID) as PeerSignal
        signal.candidate = candidate
        requestsFromPlayers.set(remotePlayerSocketID, signal)
        return {requestsFromPlayers}
      })
    });

    this.socket.on('answerFromRemotePlayer', (answer: AnswerSignal, remotePlayerName: string, remotePlayerSocketID: socketID) => {
      console.log(`${remotePlayerName} (${remotePlayerSocketID}) has sent an answer ${JSON.stringify(answer)}`)
      this.processSignalFromRemotePeer(answer)
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log(`Disconnected from signaling Node server: ${reason}.`);
      // this.setState({canSendMessages: false})
    });
  }

  sendOfferToRemotePeerViaSignallingServer = (offer: OfferSignal) => {
    console.log(`${this.state.selfName} sending an offer to remote player ${this.selectedOpponent!.name}: ${offer}`);
    this.socket.emit('signalOfferToRemotePlayer', offer, this.selectedOpponent!.socketID);
  }

  sendCandidateToRemotePeerViaSignallingServer = (candidate: CandidateSignal) => {
    console.log(`${this.state.selfName} sending a candidate message to remote player ${this.selectedOpponent!.name}: ${candidate}`);
    this.socket.emit('signalCandidateToRemotePlayer', candidate, this.selectedOpponent!.socketID);
  }

  sendAnswerToRemotePeerViaSignallingServer = (answer: AnswerSignal) => {
    console.log(`${this.state.selfName} sending a answer to remote player ${this.selectedOpponent!.name}: ${answer}`);
    this.socket.emit('signalAnswerToRemotePlayer', answer, this.selectedOpponent!.socketID);
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
          this.props.showPopUp(err)
        }
        break;
    
      case 'answer':
        console.log('Got answer.');
        try {
          const calleeSessionDescription = new RTCSessionDescription(signal)
          await this.peerConn.setRemoteDescription(calleeSessionDescription);
        } catch(err) {
          this.props.showPopUp(err)
        }
        break;

      case 'candidate':
        console.log('Got ice candidate');
        try {
          const iceCandidate = new RTCIceCandidate(signal.candidate)
          await this.peerConn.addIceCandidate(iceCandidate)
        } catch(err) {
          this.props.showPopUp(err)
        }
        break;
      
      default:
        this.props.showPopUp(new Error("Got unexpected signal from remote peer."))
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
      this.props.showPopUp(err)
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
      this.setState({connectionStatus: {socketID: this.selectedOpponent!.socketID,status: "connecting"}})
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
          this.props.showPopUp(new Error(resp.message))
          return
        }
        console.log(resp)
        this.setState({
          isInAvailablePlayersRoom: false, availablePlayers: [], requestsFromPlayers: new Map(),
          connectionStatus: {socketID: this.selectedOpponent!.name, status: "open"}
        })
      })
    };

    channel.onerror = (err) => {
      console.log("Data channel error", err)
    }
  
    channel.onclose = () => {
      console.log('Data channel closed.');
      if (this.state.isInAvailablePlayersRoom) {
        // This block is executed when the player's request is rejected
        this.props.showPopUp(`Player rejected your invite`)
        this.selectedOpponent = null
        this.dataChannel = null
        this.setState({connectionStatus: null})
        return
      }
      // The below code is executed when the player quits the match to join avaiable players pool.
      this.socket = this.socket as SocketIOClient.Socket
      this.socket.emit('joinAvailablePlayersRoom', (resp: SocketResponse) => {
        if (resp.code !== 200) {
          this.props.showPopUp(new Error(resp.message))
          return
        }
        console.log(resp)
        this.setState({allTextMessages: [], isInAvailablePlayersRoom: true})
        this.selectedOpponent = null
      });
    }
  
    channel.onmessage = (evt: MessageEvent) => {
      console.log("Got payload from data channel!!!")
      const payload: Payload = JSON.parse(evt.data)
      switch (payload.type) {
        case "PlayerMoveCellID":
          console.log("got PlayerMoveCellID: ", payload.value)
          // make handlePlayerMove execute in Game component which is a child of this component.
          // so make a method in child comp execute from the parent comp.
          // Using a reference to the child comp and trigerring the method.
          this.gameComponentChild.current!.handlePlayerMove(payload.value, false)
          break;

        case "RestartGame":
          console.log("Got restart game signal: ", payload)
          this.props.showPopUp(`Game has been restarted by ${this.selectedOpponent!.name}`)
          this.gameComponentChild.current!.goBackToMove(0, false)
          break;

        case TextMessageTypes.IncomingTextMessage:
          this.setState((prevState) => ({
            allTextMessages: prevState.allTextMessages.concat(payload)
          }))
          break;
      
        default:
          break;
      }
    }
  }

  invitePlayer = (availablePlayer: AvailablePlayer) => {
    this.selectedOpponent = availablePlayer
    console.log(this.selectedOpponent)
    this.isInitiator = true
    this.createPeerConnection(this.isInitiator);
  }

  sendRejectionResponseToPeers = (peersToReject: Array<socketID>) => {
    this.socket.emit("sendRejectionResponseToPeers", peersToReject, (resp: SocketResponse) => {
      if (resp.code !== 200) {
        this.props.showPopUp(new Error(resp.message))
      }
      console.log(resp.message)
      this.setState((prevState) => {
        const updatedRequests = new Map(prevState.requestsFromPlayers)
        peersToReject.forEach((peerSocketID) => updatedRequests.delete(peerSocketID))
        return {requestsFromPlayers: updatedRequests}
      })
    })
  }

  rejectPeerRequest = (peerSocketID: socketID) => {
    this.sendRejectionResponseToPeers([peerSocketID])
  }

  acceptPeerRequest = (peerSocketID: socketID) => {
    const peerSignal = this.state.requestsFromPlayers.get(peerSocketID) as PeerSignal
    const peersToReject = Array.from(this.state.requestsFromPlayers.keys()).filter((socketID) => socketID !== peerSocketID)
    this.sendRejectionResponseToPeers(peersToReject)
    this.selectedOpponent = {name: peerSignal.name, socketID: peerSignal.socketID}
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

  sendRestartSignalToOpponent = () => {
    const restartSignal: RestartSignal = {type: "RestartGame"}
    this.sendDataToRemotePeer(restartSignal)
  }

  handleQuitMatchAndGoBackToAvailablePool = () => {
    this.dataChannel!.close()
  }

  // showViewBasedOnDataChannelState = () => {
  //   if (this.dataChannel === null) {
  //     return
  //   }

  //   const {readyState} = this.dataChannel

  //   switch (readyState) {
  //     case "closed":
  //       if (this.state.isInAvailablePlayersRoom) {
  //         return (
  //           <cs.ColoredText>
  //             <cs.ColoredText color="red">{this.selectedOpponent!.name}</cs.ColoredText> has <cs.ColoredText color="red">REJECTED</cs.ColoredText> your request to play. Choose another player.
  //           </cs.ColoredText>
  //         )
  //       }
  //       break;  
  

  //     case "connecting":
  //       return (
  //         <s.RequestsAndWaitAndRejectionWrapper>
  //           <cs.FlexColumnDiv Hcenter>
  //             <BarsLoader width="100" height="100" fill="white"/>
  //             <cs.ColoredText bold>
  //               Waiting to hear back from <cs.ColoredText bold color="blue">{this.selectedOpponent!.name}</cs.ColoredText> 
  //             </cs.ColoredText>
  //           </cs.FlexColumnDiv>
  //         </s.RequestsAndWaitAndRejectionWrapper>
  //       )

  //     default:
  //       break;
  //   }
  // }

  showGameAndChat = () => {
    return (
      <React.Fragment>
        <Game
          gameMode={GameMode.MultiPlayer}
          ref={this.gameComponentChild}
          sendPlayerMoveCellIDToOpponent={this.sendPlayerMoveCellIDToOpponent}
          sendRestartSignalToOpponent={this.sendRestartSignalToOpponent}
          selfName={this.state.selfName}
          opponentName={this.selectedOpponent!.name}
          isSelfPlayer1={this.isInitiator}
        />
        <cs.ColoredText bold>
          Quit match and join the available pool again? <cs.BasicButton 
            onClick={this.handleQuitMatchAndGoBackToAvailablePool}>Yes</cs.BasicButton>
        </cs.ColoredText>
        {/* <Chatbox
          allTextMessages={allTextMessages} 
          handleEnter={this.handleEnter}
          handleSendTextMessageButton={this.handleSendTextMessageButton}
          currentOutgoingMessage={currentOutgoingTextMessage}
          handleInputChange={this.handleInputChange}
        /> */}
      </React.Fragment>
    )
  }

  showAvailablePlayersRoom = () => {
    const {availablePlayers, requestsFromPlayers, connectionStatus} = this.state
    if (availablePlayers.length === 0) {
      return null
    }
    const availablePlayersExceptSelf = availablePlayers.filter((player) => player.socketID !== this.socket.id)
    const requestsArray = Array.from(requestsFromPlayers.entries()).filter(([_, peerSignal]) => peerSignal.candidate !== null)
    const requestsMap = new Map(requestsArray)
    return (
      <AvailablePlayersRoom 
        invitePlayer={this.invitePlayer} 
        availablePlayers={availablePlayersExceptSelf}
        connectionStatus={connectionStatus}
        requests={requestsMap}
        acceptPeerConnection={this.acceptPeerRequest}
        rejectPeerConnection={this.rejectPeerRequest}
      />
    )
  }

  componentDidMount() {
    this.setIntervalIds = utils.ChangeColors(1000, this.multiPlayerRef, this.nameInputRef, this.basicButtonRef)
  }

  componentWillUnmount() {
    console.log("clearing the setIntervals ", this.setIntervalIds)
    this.setIntervalIds.forEach(intervalID => clearInterval(intervalID))
  }

  render() {
    console.log("state in render: ", this.state)
    const {selfName, connectionStatus, avatarImage, placeholderForPlayerNameEle, isInAvailablePlayersRoom}= this.state
    const showJoiningForm = isInAvailablePlayersRoom === false && this.dataChannel === null ? true : false
    const isConnectedWithOpponent = connectionStatus !== null && connectionStatus.status === "open"
    console.log("showJoiningForm: ", showJoiningForm)
    return (
      <s.MultiPlayer ref={this.multiPlayerRef}>
        {
        showJoiningForm
        ?
        <s.JoiningForm>
          <s.NameInput 
            name="playerName" autoFocus placeholder={placeholderForPlayerNameEle} 
            onKeyUp={this.handleEnter} onChange={this.handleInputChange} value={selfName} 
          />
          <cs.BasicButton 
            levitate onClick={this.handleJoinRoomClick} whiteTextAndBlackBackground
          >
          Join room
          </cs.BasicButton>
        </s.JoiningForm>
        :
        <React.Fragment>
          {
          isConnectedWithOpponent ? this.showGameAndChat() :
          <React.Fragment>
            <s.AvatarAndTextContainer>
              <s.Avatar src={avatarImage} />
              <cs.ColoredText bold>
                  You are playing as <cs.ColoredText levitateText bold color="black">{selfName}</cs.ColoredText>
              </cs.ColoredText>
            </s.AvatarAndTextContainer>
            <s.AvailablePlayersAndWaitingAndRequestsContainer>
              {this.showAvailablePlayersRoom()}
            </s.AvailablePlayersAndWaitingAndRequestsContainer>
          </React.Fragment>
          }
        </React.Fragment>
        }
      </s.MultiPlayer>
    );
  }
}

export default Multiplayer;