import React from 'react';
import * as s from './style'
import * as cs from '../common'
import io from 'socket.io-client';
import AvailablePlayers from './AvailablePlayers/AvailablePlayers';
import Chatbox from './ChatBox/Chatbox';

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

export interface TextMessage {
  type: "incoming" | "outgoing"
  value: any
}

interface State {
  playerName: string
  currentOutgoingMessage: string
  placeholderForPlayerNameEle: string
  allMessages: TextMessage[]
  availablePlayers: AvailablePlayer[] | null
  peerSignal: PeerSignal | null
}

interface Props {
  showErrorPopup: (errorObj: Error) => void
}


class Multiplayer extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      playerName: "", currentOutgoingMessage: "", placeholderForPlayerNameEle: this.defaultPlaceholder, allMessages: [],
      availablePlayers: null, peerSignal: null
    }
  }

  defaultPlaceholder = "Enter player name"
  onErrorPlaceholder = "Name cannot be empty"
  opponentName =  ""
  isInitiator = false 
  sendQueue: string[] = []
  socket: SocketIOClient.Socket
  peerConn: RTCPeerConnection
  webRTCConfig: RTCConfiguration
  dataChannel: RTCDataChannel
  selectedAvailablePlayer: AvailablePlayer | null = null

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.currentTarget
    switch (name) {
      case "playerName":
        this.setState({playerName: value})
        break
    
      case "currentOutgoingMessage":
        this.setState({currentOutgoingMessage: value})
        break
    }
  }

  handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const {name} = event.currentTarget
    if (event.key === "Enter") {
      switch (name) {
        case "currentOutgoingMessage":
          this.sendDataToRemotePeer()
          break;
      
        case "playerName":
          this.handleJoinRoomClick()
          break;
      }
    }
  }

  handleJoinRoomClick = () => {
    if (this.state.playerName === "") {
      this.setState({placeholderForPlayerNameEle: this.onErrorPlaceholder})
      return
    }

    this.socket = io("http://localhost:8000")

    this.socket.on('connect', () => {

      console.log("Client socket is connected ?: ", this.socket.connected); // true
      
      this.registerToSocketEvents()
      
      this.socket.emit("registerNameWithSocket", this.state.playerName, (response: SocketResponse) => {
        console.log(response)
        
        this.socket.emit('joinAvailablePlayersRoom', (response: SocketResponse) => {
          console.log(response)
          if (response.code !== 200) {
            this.props.showErrorPopup(new Error(response.message))
            return
          }
          // this.setState({isInAvailablePlayersRoom: true})
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
      console.log("playersInAvailableRoom before: ", availablePlayers)
      this.setState({availablePlayers})
      console.log("playersInAvailableRoom after: ", availablePlayers)
    })

    this.socket.on('ipaddr', (ipaddr: string) => {
      console.log('Server IP address is: ' + ipaddr);
    });
    
    this.socket.on('log', (msg: object) => console.log(msg))
    
    this.socket.on('offerFromRemotePlayer', (offer: object, remotePlayerName: string, remotePlayerSocketID: string) => {
      console.log(`${remotePlayerName} has sent a offer ${offer}`)
      const peerSignal: PeerSignal = {name: remotePlayerName, socketID: remotePlayerSocketID, offer: offer as OfferSignal, candidate: null}
      this.setState({peerSignal})
    });

    this.socket.on('candidateFromRemotePlayer', (candidate: object, remotePlayerName: string, remotePlayerSocketID: string) => {
      console.log(`${remotePlayerName} (${remotePlayerSocketID}) has sent an ICE candidate ${candidate}`)
      if (this.isInitiator) {
        this.processSignalFromRemotePeer(candidate as CandidateSignal)
        return
      }
      this.setState(prevState => {
        const peerSignal = Object.assign({}, prevState.peerSignal)
        peerSignal.candidate = candidate as CandidateSignal
        return {peerSignal}
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
      this.sendCandidateToRemotePeerViaSignallingServer(candidateSignal);
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
        this.setState(this.state)
      })
    };

    channel.onerror = (err) => {
      console.log("Data channel error", err)
    }
  
    channel.onclose = () => {
      console.log('Data channel closed.');
      this.socket = this.socket as SocketIOClient.Socket
      this.socket.emit('joinAvailablePlayersRoom', (resp: SocketResponse) => {
        if (resp.code !== 200) {
          this.props.showErrorPopup(new Error(resp.message))
          return
        }
        console.log(resp)
        this.setState({allMessages: [], peerSignal: null})
        this.selectedAvailablePlayer = null
      });
    }
  
    channel.onmessage = (evt: MessageEvent) => {
      console.log("Got message from data channel!!!")
      this.setState((prevState) => ({
        allMessages: prevState.allMessages.concat({type: "incoming", value: evt.data})
      }))
    }
  }

  invitePlayer = () => {
    this.isInitiator = true
    this.createPeerConnection(this.isInitiator);
  }

  handleAvailablePlayerClick = (availablePlayer: AvailablePlayer) => {
    console.log(this.invitePlayer)
    this.selectedAvailablePlayer = availablePlayer
    console.log(this.selectedAvailablePlayer)
    this.invitePlayer()
  }

  handleRemotePlayerRequest = (decision: string) => {
    if (decision === "no") {
      return
    }
    this.isInitiator = false
    this.selectedAvailablePlayer = {name: this.state.peerSignal!.name, socketID: this.state.peerSignal!.socketID}
    this.createPeerConnection(this.isInitiator); // because this client needs to also open RTCPeerConnection to receive the data channel.
    this.processSignalFromRemotePeer((this.state.peerSignal as PeerSignal).offer)
    this.processSignalFromRemotePeer((this.state.peerSignal as PeerSignal).candidate as CandidateSignal)
  }

  sendDataToRemotePeer = () => {
    const message = this.state.currentOutgoingMessage
    switch(this.dataChannel.readyState) {
      case "connecting":
        console.log("Connection not open; queueing: " + message);
        this.sendQueue.push(message);
        break;
      case "open":
        console.log("Sending message: ", message)
        this.sendQueue.push(message);
        while (this.sendQueue.length) {
          this.dataChannel.send(this.sendQueue.shift() as string)
        }
        this.setState((prevState) => ({
          currentOutgoingMessage: "",
          allMessages: prevState.allMessages.concat({type: "outgoing", value: message})
        }))
        break;
      case "closing":
        console.log("Attempted to send message while closing: " + message);
        break;
      case "closed":
        console.log("Error! Attempt to send while connection closed.");
        break;
      default:
        console.log("should not happen")
        break;
    }
  }

  handleQuitMatchAndGoBackToAvailablePool = () => {
    this.dataChannel.close()
  }

  handleViewsBasedOnDataChannelState = () => {
    const {readyState} = this.dataChannel

    switch (readyState) {
      case "closed":
        return (
          <AvailablePlayers 
            handleRemotePlayerRequest={this.handleRemotePlayerRequest} 
            handleAvailablePlayerClick={this.handleAvailablePlayerClick} 
            playerName={this.state.playerName} 
            availablePlayers={this.state.availablePlayers as AvailablePlayer[]} 
            peerSignal={this.state.peerSignal} 
            socketID={this.socket.id} 
          />
        )
    
      case "open":
        return (
          <Chatbox 
          selectedAvailablePlayer={this.selectedAvailablePlayer as AvailablePlayer}
          playerName={this.state.playerName} 
          allMessages={this.state.allMessages} 
          handleEnter={this.handleEnter} 
          sendDataToRemotePeer={this.sendDataToRemotePeer} 
          handleQuitMatchAndGoBackToAvailablePool={this.handleQuitMatchAndGoBackToAvailablePool}
          currentOutgoingMessage={this.state.currentOutgoingMessage}
          handleInputChange={this.handleInputChange}
        />
        )

      case "connecting":
          return (
            <div>Loading...</div>
          )

      default:
        break;
    }
  }

  render() {
    console.log("state in render: ", this.state)
    const {playerName, peerSignal, availablePlayers, placeholderForPlayerNameEle}= this.state 
    
    return (
      <s.ChatBoxContainer>
        {
        !availablePlayers
        ?
        <s.JoiningForm>
          <s.NameInput levitate name="playerName" autoFocus placeholder={placeholderForPlayerNameEle} onKeyUp={this.handleEnter} onChange={this.handleInputChange} value={playerName} />
          <cs.BasicButton levitate onClick={this.handleJoinRoomClick}>Join room</cs.BasicButton> 
        </s.JoiningForm>
        :
        this.dataChannel
        ?
        this.handleViewsBasedOnDataChannelState()
        :
        <AvailablePlayers 
          handleRemotePlayerRequest={this.handleRemotePlayerRequest} 
          handleAvailablePlayerClick={this.handleAvailablePlayerClick} 
          playerName={playerName} 
          availablePlayers={availablePlayers} 
          peerSignal={peerSignal} 
          socketID={this.socket.id} 
        />
        }
      </s.ChatBoxContainer>
    );
  }
}

export default Multiplayer;