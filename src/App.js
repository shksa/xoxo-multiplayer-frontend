import React from 'react';
import { hot } from 'react-hot-loader'
import * as s from './style'
import Game from './components/Game/Game';


const App = (props) => (
  <s.App>
    <Game />
  </s.App>
);

export default hot(module)(App);