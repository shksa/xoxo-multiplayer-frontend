import React from 'react';
import * as s from './style'
import { randomToken, logError } from '../../utils';
import io from 'socket.io-client';


class ChatBox extends React.Component {

  nameInputPlaceholder = "Enter player name"
  errorMsgPlaceholder = "Name cannot be empty"

  state = {
    isMultiPlayerEnabled: false,
    localPlayerName: "", remotePlayerName: "", 
    inputPlaceholder: this.nameInputPlaceholder, 
    canSendMessages: false, incomingMessages: [],
    currentOutgoingMessage: "", outgoingMessages : [],
    allMessages: [], room: null
  }

  enableChatBox = () => {
    this.socket = io("http://localhost:8000")
    this.socket.on('connect', () => {
      console.log("Client socket is connected ?: ", this.socket.connected); // true
      this.setState({isMultiPlayerEnabled: true})
    });
    this.registerToSocketEvents()
  }

  handleInputChange = (event) => {
    const {name, value} = event.target
    if (event.keyCode === 13) {
      switch (name) {
        case "currentOutgoingMessage":
          this.sendMessageToRemotePeer()
          break;
        case "localPlayerName":
          this.handleJoinRoomClick()
          break;
        default:
          console.log("should not happen")
          break;
      }
      return
    }
    this.setState({[name]: value})
  }

  handleJoinRoomClick = () => {
    if (this.state.localPlayerName === "") {
      this.setState({inputPlaceholder: this.errorMsgPlaceholder})
      return
    }
    if (this.state.room) {
      this.socket.emit("leaveRoom")
      return
    }
    this.joinRoom()
  }

  configuration = null
  isInitiator = false
  peerConn = null
  dataChannel = null

  registerToSocketEvents = () => {

    this.socket.on('ipaddr', (ipaddr) => {
      console.log('Server IP address is: ' + ipaddr);
      // updateRoomURL(ipaddr);
    });
    
    this.socket.on('created', (room, clientId) => {
      console.log('Created room', room, '- my client ID is', clientId);
      this.isInitiator = true;
      this.setState({room})
    });
    
    this.socket.on('joined', (room, clientId) => {
      console.log('This peer has joined room', room, 'with client ID', clientId);
      this.isInitiator = false;
      this.setState({room})
      this.createPeerConnection(this.isInitiator, this.configuration);
    });

    this.socket.on('remotePeerName', (remotePeerName) => {
      console.log('Connected with remote peer ', remotePeerName, ' !!!')
      this.setState({remotePlayerName: remotePeerName})
    })
    
    this.socket.on('full', (room) => {
      alert('Room ' + room + ' is full. We will create a new room for you.');
      window.location.hash = '';
      window.location.reload();
    });
    
    this.socket.on('ready', () => {
      console.log('Socket is ready');
      this.createPeerConnection(this.isInitiator, this.configuration);
    });
    
    this.socket.on('log', (msg) => { console.log(msg) })
    
    this.socket.on('signaling2Client4mServer', (message, remotePeerName) => {
      console.log(`${remotePeerName} has signalled the message ${message}`)
      console.log(`${this.state.localPlayerName} received the message: ${message}`);
      this.signalingMessageCallback(message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Disconnected from signaling Node server: ${reason}.`);
      this.setState({canSendMessages: false})
    });

    this.socket.on('remotePeerLeftRoom', (msg) => {
      console.log("remotePeerLeftRoom evt fired: ", msg);
    })
    
    this.socket.on('leftRoom', (msg) => {
      console.log("leftRoom event fired: ", msg);
      this.setState({room: null})
      this.closeDataChannel()
      // If peer did not create the room, re-enter to be creator.
      // if (!this.isInitiator) {
      //   window.location.reload();
      // }
    })
    
    window.onunload = () => {
      console.log(`Unloading window. Notifying peers in ${this.state.room}.`);
      this.socket.emit('leaveRoom');
    };
  }

  sendMessageToSignalingServer = (message) => {
    console.log(`${this.state.localPlayerName} signalling the message: ${message}`);
    this.socket.emit('signaling2Server4mClient', message);
  }


  signalingMessageCallback = (message) => {
    if (message.type === 'offer') {
      console.log('Got offer. Sending answer to peer.');
      this.peerConn.setRemoteDescription(new RTCSessionDescription(message), () => {}, logError);
      this.peerConn.createAnswer(this.onLocalSessionCreated, logError);

    } else if (message.type === 'answer') {
      console.log('Got answer.');
      this.peerConn.setRemoteDescription(new RTCSessionDescription(message), () => {}, logError);

    } else if (message.type === 'candidate') {
      console.log('Got ice candidate');
      this.peerConn.addIceCandidate(new RTCIceCandidate({
        candidate: message.candidate
      }));
    }
  }

  createPeerConnection = (isInitiator, config) => {
    console.log('Creating Peer connection as initiator?', isInitiator, 'config:', config);
    this.peerConn = new RTCPeerConnection(config);
  
    // send any ice candidates to the other peer
    this.peerConn.onicecandidate = (event) => {
      console.log('icecandidate event:', event);
      if (event.candidate) {
        this.sendMessageToSignalingServer({
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
      this.dataChannel = this.peerConn.createDataChannel('textMessages');
      this.onDataChannelCreated(this.dataChannel);
  
      console.log('Creating an offer');
      this.peerConn.createOffer(this.onLocalSessionCreated, logError);
    } else {
      this.peerConn.ondatachannel = (event) => {
        console.log('ondatachannel:', event.channel);
        this.dataChannel = event.channel;
        this.onDataChannelCreated(this.dataChannel);
      };
    }
  }

  onLocalSessionCreated = (desc) => {
    console.log('local session created:', desc);
    this.peerConn.setLocalDescription(desc, () => {
      console.log('sending local desc:',this.peerConn.localDescription);
      this.sendMessageToSignalingServer(this.peerConn.localDescription);
    }, logError);
  }

  onDataChannelCreated = (channel) => {
    console.log('onDataChannelCreated:', channel);
  
    channel.onopen = () => {
      console.log('CHANNEL opened!!!');
      this.sendMyNameToRemotePeer()
      this.setState({canSendMessages: true})
    };
  
    channel.onclose = () => {
      console.log('Channel closed.');
      this.setState({canSendMessages: false, remotePlayerName: "", allMessages: [], incomingMessages: [], outgoingMessages: []})
    }
  
    channel.onmessage = ({data}) => {
      this.setState((prevState) => ({
        incomingMessages: prevState.incomingMessages.concat(data),
        allMessages: prevState.allMessages.concat({type: "incoming", value: data})
      }))
    }
  }

  sendMyNameToRemotePeer = () => {
    this.socket.emit('shareMyName')
  }

  sendMessageToRemotePeer = () => {
    const message = this.state.currentOutgoingMessage
    this.setState((prevState) => ({
      outgoingMessages: prevState.outgoingMessages.concat(message),
      allMessages: prevState.allMessages.concat({type: "outgoing", value: message})
    }))
    console.log("Sending message: ", message)
    this.dataChannel.send(message);
  }

  closeDataChannel = () => {
    this.dataChannel.close()
  }

  joinRoom = () => {
    let room = window.location.hash.substring(1); // location.hash returns "#xyz" <- with the hash symbol, therefore substring()
    if (!room) { // room is either xyz or "" (bcoz, hash will be "", and "".substring(1) is still be "")
      room = window.location.hash = randomToken() // No need of the "#" symbol when setting the hash.
    }

    this.socket.emit('create or join', room, this.state.localPlayerName);

    if (window.location.hostname.match(/localhost|127\.0\.0/)) {
      this.socket.emit('ipaddr');
    }
  }

  render() {
    const {localPlayerName, room, remotePlayerName, inputPlaceholder, canSendMessages, isMultiPlayerEnabled, allMessages, currentOutgoingMessage}= this.state
    return (
      <s.ChatBoxContainer>
        {
        isMultiPlayerEnabled 
        ?
        <s.ChatBoxWrapper>
          <s.ChatBoxHeader>
            <s.NameInput name="localPlayerName" placeholder={inputPlaceholder} onChange={this.handleInputChange} value={localPlayerName} />
            <s.JoinRoomButton onClick={this.handleJoinRoomClick}>{ room ? `Exit room ${room}` : "Join room" }</s.JoinRoomButton> 
          </s.ChatBoxHeader>
          {room && <strong>Connected to room {room}</strong>}
          {remotePlayerName !== "" && <strong>Connected with {remotePlayerName}</strong> }
          <s.ChatBox>
            <s.MessageBox>
            {allMessages.map(({type, value}, idx) => <s.Message incoming={type === "incoming"} key={`${type}:${idx}`}>{value}</s.Message>)}
            </s.MessageBox>
            
            <s.ChatBoxFooter>
              <s.MessageInput name="currentOutgoingMessage" onChange={this.handleInputChange} value={currentOutgoingMessage}/>
              <s.SendMessageButton onClick={this.sendMessageToRemotePeer} disabled={canSendMessages ? false : true} isDisabled={canSendMessages ? false : true}>Send</s.SendMessageButton>
            </s.ChatBoxFooter>
          </s.ChatBox>
        </s.ChatBoxWrapper>
        : 
        <s.EnableMultiplayerButton onClick={this.enableChatBox}>Enable Multiplayer</s.EnableMultiplayerButton>
        }
      </s.ChatBoxContainer>
    );
  }
}

export default ChatBox;