import React from 'react';
import * as s from './style'
import * as cs from '../common'
import { randomToken, logError } from '../../utils';
import io from 'socket.io-client';


class ChatBox extends React.Component {

  normalMessagePlaceholder = "Enter player name"
  errorMsgPlaceholder = "Name cannot be empty"

  state = {
    playerName: "", isInAvailableRoom: false, currentOutgoingMessage: "",
    nameInputElementPlaceholder: this.normalMessagePlaceholder, incomingMessages: [], 
    outgoingMessages : [], allMessages: [], 
    isDataChannelOpen: false, availablePlayers: null, gotRequestFromRemotePlayer: false,
  }

  handleInputChange = (event) => {
    const {name, value} = event.target
    this.setState({[name]: value})
  }

  handleEnter = (event) => {
    if (event.key === "Enter") {
      switch (event.target.name) {
        case "currentOutgoingMessage":
          this.sendDataToRemotePeer()
          break;
      
        case "playerName":
          this.handleJoinRoomClick()
          break;
        default:
          break;
      }
    }
  }

  handleJoinRoomClick = () => {
    if (this.state.playerName === "") {
      this.setState({nameInputElementPlaceholder: this.errorMsgPlaceholder})
      return
    }
    this.socket = io("http://localhost:8000")

    this.socket.on('connect', () => {
      console.log("Client socket is connected ?: ", this.socket.connected); // true
      this.registerToSocketEvents()
      
      this.socket.emit("registerNameWithSocket", this.state.playerName, (msg) => {
        console.log(msg)
        this.socket.emit('joinAvailablePlayersRoom', (result) => {
          if (result !== "joined!") {
            console.log(result)
            return
          }
          console.log(result)
          this.setState({isInAvailableRoom: true})
        });
        window.onunload = function(playerName) {
          this.dataChannel.close()
          this.socket.close()
        }.bind(this, this.state.playerName)
      })
      
      if (window.location.hostname.match(/localhost|127\.0\.0/)) {
        this.socket.emit('ipaddr');
      }
    });
  }

  configuration = null
  isInitiator = false
  peerConn = null
  dataChannel = null
  remotePlayer = null
  sendQueue = []

  registerToSocketEvents = () => {

    this.socket.on('playersInAvailableRoom', (availablePlayers) => {
      console.log("playersInAvailableRoom: ", availablePlayers)
      this.setState({availablePlayers})
    })

    this.socket.on('ipaddr', (ipaddr) => {
      console.log('Server IP address is: ' + ipaddr);
    });
    
    this.socket.on('full', (room) => {
      alert('Room ' + room + ' is full. We will create a new room for you.');
      window.location.hash = '';
      window.location.reload();
    });
    
    this.socket.on('log', (...msg) => console.log(...msg))
    
    this.socket.on('offerFromRemotePlayer', (offerMessage, remotePlayerName, remotePlayerSocketID) => {
      console.log(`${remotePlayerName} has sent a offering message ${offerMessage} for RTC connection`)
      this.remotePlayer = {offerMessage, name: remotePlayerName, socketID: remotePlayerSocketID}
      this.setState({gotRequestFromRemotePlayer: true})
    });

    this.socket.on('candidateFromRemotePlayer', (candidateMessage) => {
      console.log(`${this.remotePlayer.name} has sent candidate message ${candidateMessage}`)
      if (this.isInitiator) {
        this.processSignalFromRemotePeer(candidateMessage)
        return
      }
      this.remotePlayer.candidateMessage = candidateMessage
    });

    this.socket.on('answerFromRemotePlayer', (answerMessage) => {
      console.log(`${this.remotePlayer.name} has sent answer message ${answerMessage}`)
      this.processSignalFromRemotePeer(answerMessage)
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Disconnected from signaling Node server: ${reason}.`);
      // this.setState({canSendMessages: false})
    });
  }

  sendOfferMessageToRemotePeerViaSignallingServer = (message) => {
    console.log(`${this.state.playerName} sending an offer message to remote player ${this.remotePlayer.name}: ${message}`);
    this.socket.emit('signalOfferToRemotePlayer', message, this.remotePlayer.socketID);
  }

  sendCandidateToRemotePeerViaSignallingServer = (message) => {
    console.log(`${this.state.playerName} sending a candidate message to remote player ${this.remotePlayer.name}: ${message}`);
    this.socket.emit('signalCandidateToRemotePlayer', message, this.remotePlayer.socketID);
  }

  sendAnswerMessageToRemotePeerViaSignallingServer = (message) => {
    console.log(`${this.state.playerName} sending a answer message to remote player ${this.remotePlayer.name}: ${message}`);
    this.socket.emit('signalAnswerToRemotePlayer', message, this.remotePlayer.socketID);
  }


  processSignalFromRemotePeer = (message) => {
    if (message.type === 'offer') {
      console.log('Got offer. Sending answer to peer.');
      this.peerConn.setRemoteDescription(new RTCSessionDescription(message), () => {}, logError);
      this.peerConn.createAnswer((desc) => this.onLocalSessionCreated(desc, "answer"), logError);

    } else if (message.type === 'answer') {
      console.log('Got answer.');
      this.peerConn.setRemoteDescription(new RTCSessionDescription(message), () => {}, logError);

    } else if (message.type === 'candidate') {
      console.log('Got ice candidate');
      this.peerConn.addIceCandidate(
        new RTCIceCandidate(
          {candidate: message.candidate})
        ); // triggers onicecandidate handler
    }
  }

  createPeerConnection = (isInitiator, config) => {
    console.log('Creating Peer connection as initiator?', isInitiator, 'config:', config);
    this.peerConn = new RTCPeerConnection(config);
  
    // send any ice candidates to the other peer
    this.peerConn.onicecandidate = (event) => {
      console.log('icecandidate event:', event);
      if (event.candidate) {
        this.sendCandidateToRemotePeerViaSignallingServer({
          type: 'candidate',
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate,
        });
      } else {
        console.log('End of candidates.');
      }
    };
  
    if (isInitiator) {
      console.log('Creating Data Channel');
      this.dataChannel = this.peerConn.createDataChannel('textMessages'); // takes options as second parameter
      this.onDataChannelCreated(this.dataChannel);
  
      console.log('Creating an offer');
      this.peerConn.createOffer((desc) => this.onLocalSessionCreated(desc, "offer"), logError);
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

  onLocalSessionCreated = (desc, msgType) => {
    console.log('local session created:', desc);
    this.peerConn.setLocalDescription(desc, () => {
      console.log('sending local desc to remote peer:', this.peerConn.localDescription);
      if (msgType === "offer") {
        this.sendOfferMessageToRemotePeerViaSignallingServer(this.peerConn.localDescription);
      } else if(msgType === "answer") {
        this.sendAnswerMessageToRemotePeerViaSignallingServer(this.peerConn.localDescription)
      } else {
        console.log("In onLocalSessionCreated, this else clause should not happen")
      }
    }, logError);
  }

  onDataChannelCreated = (channel) => {
    console.log('onDataChannelCreated:', channel);
  
    channel.onopen = () => {
      console.log('Data channel opened!!!');
      this.socket.emit("exitFromAvailablePlayersRoom", (msg) => {
        if (msg !== "left!") {
          console.log(msg)
        }
        console.log(msg)
        this.setState({isInAvailableRoom: false})
      })
      this.setState({isDataChannelOpen: true})
    };

    channel.onerror = (err) => {
      console.log("Data channel error", err)
    }
  
    channel.onclose = () => {
      console.log('Data channel closed.');
      this.socket.emit('joinAvailablePlayersRoom', (result) => {
        if (result !== "joined!") {
          console.log(result)
          return
        }
        console.log(result)
        this.setState({isInAvailableRoom: true, allMessages: [], incomingMessages: [], outgoingMessages: []})
      });
      this.setState({isDataChannelOpen: false})
    }
  
    channel.onmessage = ({data}) => {
      console.log("Got message from data channel!!!")
      this.setState((prevState) => ({
        incomingMessages: prevState.incomingMessages.concat(data),
        allMessages: prevState.allMessages.concat({type: "incoming", value: data})
      }))
    }
  }

  handleAvailablePlayerClick = (remotePlayer) => {
    this.isInitiator = true
    this.remotePlayer = remotePlayer
    this.createPeerConnection(this.isInitiator, this.configuration);
  }

  handleRemotePlayerRequest = (decision) => {
    if (decision === "no") {
      this.setState({gotRequestFromRemotePlayer: false})
      return
    }
    this.isInitiator = false
    this.createPeerConnection(this.isInitiator, this.configuration); // because this client needs to also open RTCPeerConnection to receive the data channel.
    this.processSignalFromRemotePeer(this.remotePlayer.offerMessage)
    if (this.remotePlayer.candidateMessage) {
      this.processSignalFromRemotePeer(this.remotePlayer.candidateMessage)
    }
    this.setState({gotRequestFromRemotePlayer: false})
  }

  sendDataToRemotePeer = () => {
    const message = this.state.currentOutgoingMessage
    console.log("Sending message: ", message)
    switch(this.dataChannel.readyState) {
      case "connecting":
        console.log("Connection not open; queueing: " + message);
        this.sendQueue.push(message);
        break;
      case "open":
        this.sendQueue.forEach((message) => this.dataChannel.send(message));
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
        break;
    }
    this.dataChannel.send(message);
  }

  handleQuitMatchAndGoBackToAvailablePool = () => {
    this.dataChannel.close()
    if (this.dataChannel.readyState !== "closed") {
      console.log("could not close the connection, try again")
      return
    }
  }

  render() {
    const {playerName, availablePlayers, nameInputElementPlaceholder, isDataChannelOpen, gotRequestFromRemotePlayer, allMessages, currentOutgoingMessage}= this.state 
    return (
      <s.ChatBoxContainer>
        {
        !availablePlayers 
        ?
        <s.JoiningForm>
          <s.NameInput name="playerName" placeholder={nameInputElementPlaceholder} onKeyUp={this.handleEnter} onChange={this.handleInputChange} value={playerName} />
          <s.JoinRoomButton onClick={this.handleJoinRoomClick}>Join room</s.JoinRoomButton> 
        </s.JoiningForm>
        :
        !isDataChannelOpen
        ?
        <cs.FlexColumnContainer>
          <cs.ColoredText bold>You are playing as <cs.ColoredText bold color="red">{playerName}</cs.ColoredText></cs.ColoredText>
          <cs.ColoredText margin="10px 0 5px 0" block bold>Available players:</cs.ColoredText>
          <s.AvailablePlayersContainer>
          {
            availablePlayers.map(player => player.socketID !== this.socket.id ? <s.AvailablePlayer onClick={() => this.handleAvailablePlayerClick(player)} key={player.socketID}>{player.name}</s.AvailablePlayer> : null)
          }
          </s.AvailablePlayersContainer>
          {
          gotRequestFromRemotePlayer
          &&
          <cs.FlexRowContainer>
            <cs.ColoredText>Got request from <cs.ColoredText bold color="red">{this.remotePlayer.name}</cs.ColoredText></cs.ColoredText>
            <cs.BasicButton levitate onClick={() => this.handleRemotePlayerRequest("yes")}>Accept</cs.BasicButton>
            <cs.BasicButton levitate onClick={() => this.handleRemotePlayerRequest("no")}>Reject</cs.BasicButton>
          </cs.FlexRowContainer>
          }
        </cs.FlexColumnContainer>
        :
        <s.ChatBoxWrapper>
          <cs.ColoredText block bold>You are playing as <cs.ColoredText bold color="red">{playerName}</cs.ColoredText></cs.ColoredText>
          <cs.ColoredText block bold color="blue">Connected with {this.remotePlayer.name}</cs.ColoredText>
          <s.ChatBox>
            <s.MessageBox>
            {allMessages.map(({type, value}, idx) => <s.Message incoming={type === "incoming"} key={`${type}:${idx}`}>{value}</s.Message>)}
            </s.MessageBox>
            <s.ChatBoxFooter>
              <s.MessageInput placeholder="write a new message here..." name="currentOutgoingMessage" onKeyUp={this.handleEnter} onChange={this.handleInputChange} value={currentOutgoingMessage} />
              <cs.BasicButton levitate onClick={this.sendDataToRemotePeer}>Send</cs.BasicButton>
            </s.ChatBoxFooter>
          </s.ChatBox>
          <cs.FlexRowContainer>
            <cs.ColoredText>Quit match and join the available pool again?</cs.ColoredText>
            <cs.BasicButton onClick={this.handleQuitMatchAndGoBackToAvailablePool}>Yes</cs.BasicButton>
          </cs.FlexRowContainer>
        </s.ChatBoxWrapper>
        }
      </s.ChatBoxContainer>
    );
  }
}

export default ChatBox;