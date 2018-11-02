import React from 'react';
import { hot } from 'react-hot-loader'
import * as s from './style'
import Game from './components/Game/Game';
import ChatBox from './components/ChatBox/ChatBox';


const App = (props) => (
  <s.App>
    <Game />
    <ChatBox />
  </s.App>
);

export default hot(module)(App);