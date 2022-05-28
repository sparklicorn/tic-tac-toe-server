import { postJoinLobby } from './Lobby.js';
import {
  postCreateGame,
  postJoinGame
} from './Game.js';

// All the routing code indexed here will be loaded at startup.
export default [
  postJoinLobby,
  postCreateGame,
  postJoinGame
];
