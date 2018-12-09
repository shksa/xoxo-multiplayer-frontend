import React from 'react'
import * as cs from '../../common'
import * as s from './style'
import { AvailablePlayer, SelectedOpponent, PeerSignal, RequestsFromPlayers, ConnnectionInfo } from '../Multiplayer';
import {ReactComponent as ThreeBallsLoader} from '../../../assets/ThreeBallsLoader.svg'
import {ReactComponent as BarsLoader} from '../../../assets/BarsLoader.svg'
import * as utils from '../../../utils/util'

interface Props {
  availablePlayers: Array<AvailablePlayer>
  invitePlayer: (availablePlayer: AvailablePlayer) => void
  connectionStatus: ConnnectionInfo | null
  requests: RequestsFromPlayers
  acceptPeerConnection: (peerSocketID: string) => void
  rejectPeerConnection: (peerScocketID: string) => void
}

class AvailablePlayersRoom extends React.Component<Props, {}> {

  render() {
    const {availablePlayers, rejectPeerConnection, acceptPeerConnection, connectionStatus, invitePlayer, requests} = this.props
    return (
      <React.Fragment>
        {
          availablePlayers.length ?
          <React.Fragment>
            {
            availablePlayers.map(player => 
              <s.PlayerLine key={player.socketID}>
                <cs.FlexRowDiv  Vcenter>
                  <s.AvailablePlayerAvatar src={player.avatar} />
                  <s.Player
                    backgroundColor={utils.getNewColor()}
                  >
                  {player.name}
                  </s.Player>
                  <cs.ColoredText size="1.3em" color="white" bold>joined</cs.ColoredText>
                </cs.FlexRowDiv>
                {
                  connectionStatus ?
                  connectionStatus.socketID === player.socketID && connectionStatus.status === "connecting" ?
                  <s.BarsLoaderWrapper>
                    <BarsLoader width="100%" height="100%"/>
                  </s.BarsLoaderWrapper>
                  :
                  <s.InviteOrAcceptorRejectButton 
                    actionType="disabled"
                  >Invite</s.InviteOrAcceptorRejectButton> :
                  requests.has(player.socketID) ?
                  <cs.FlexRowDiv>
                    <s.InviteOrAcceptorRejectButton 
                    actionType="accept" 
                    onClick={() => acceptPeerConnection(player.socketID)}
                  >Accept</s.InviteOrAcceptorRejectButton> 
                  <s.InviteOrAcceptorRejectButton 
                    actionType="reject" 
                    onClick={() => rejectPeerConnection(player.socketID)}
                  >Reject</s.InviteOrAcceptorRejectButton>
                  </cs.FlexRowDiv> :
                  <s.InviteOrAcceptorRejectButton 
                    actionType="invite" 
                    onClick={() => invitePlayer(player)}
                  >Invite</s.InviteOrAcceptorRejectButton>
                }
              </s.PlayerLine>
            )
            }
          </React.Fragment>
          :
          <cs.FlexColumnDiv Hcenter>
            <ThreeBallsLoader width="100" height="100"/>
            <cs.ColoredText bold>There are no free players right now, please wait for some time...</cs.ColoredText>
          </cs.FlexColumnDiv>
        }
      </React.Fragment>
    )
  }
}

export default AvailablePlayersRoom