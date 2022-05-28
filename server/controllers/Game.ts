import { Request, Response } from 'express';
import EventData, { createEventData } from '../models/events/EventData.js';

import gameManager from '../models/game/GameManager.js';

const errorResponse = (res: Response, message?: string, next?: any) => {
  if (message) {
    res.json({ error: message });
  }
  res.status(500);
  res.send();
  if (next) {
    next();
  }
};

export const postCreateGame = {
  method: 'post',
  path: '/create-game',
  callback: (req: Request, res: Response, next?: Function) => {
    console.log(`[POST] create-game: ip ${req.ip}`); // is this the user's ip? could use it to try to prevent user from flooding games

    const game = gameManager.createGame();

    if (!game) {
      console.log('[POST] create-game: ERROR creating game');
      const message = 'Could not create new game due to server limit. Please wait and try again.';
      errorResponse(res, message, next);
      return;
    }
    console.log(`[POST] create-game: New game created with id ${game.id}`);

    const player = gameManager.addPlayerToGame(game);
    if (!player) {
      console.log('[POST] create-game: ERROR creating player');
      const message = 'Could not create new player.';
      errorResponse(res, message, next);
      return;
    }
    console.log(`[POST] create-game: New player created with id ${player.id}`);

    res.json({
      gameId: game.id,
      playerId: player.id
    });
    res.status(200);
    res.send();

    if (next) {
      next();
    }
  }
}

export const postJoinGame = {
  method: 'post',
  path: '/join/:gameId',
  callback: (req: Request, res: Response, next?: Function) => {
    console.log(`[POST] join: gameId: ${req.params.gameId}`);

    const gameId = req.params.gameId.replace(/[^a-zA-Z0-9]/, '');
    const game = gameManager.findGame(gameId);
    if (!game) {
      console.log('[POST] join: ERROR joining game');
      const message = `Game ${gameId} not found.`;
      errorResponse(res, message, next);
      return;
    }

    const player = gameManager.addPlayerToGame(game);
    if (!player) {
      console.log('[POST] join: ERROR adding player to game');
      const message = 'Game is at max players.';
      errorResponse(res, message, next);
      return;
    }

    console.log(`[POST] join: New player ${player.id} joined game ${game.id}!`);

    res.status(200);
    res.json({
      gameId: game.id,
      playerId: player.id
    });
    res.send();
  }
};

export const event = {
  method: 'post',
  path: '/event',
  callback: (req: Request, res: Response, next?: Function) => {
    const gameId = req.params.gameId.replace(/[^a-zA-Z0-9]/, '');
    const { name, data } = req.body;

    let eventData: EventData;
    try {
      // validates data shape (has string name, object data)
      eventData = createEventData({ gameId, name, data });
    } catch (error) {
      console.log(`[POST] event: ${error.message}`);
      errorResponse(res, error.message, next);
      return;
    }

    console.log(`[POST] event: gameId: ${gameId}`);
    console.log(`[POST] event: name: ${name}`);
    console.log('[POST] event: data:');
    console.log(data);

    try {
      gameManager.throwEvent(eventData);
    } catch (error) {
      console.log(`[POST] event: ${error.message}`);
      errorResponse(res, error.message, next);
      return;
    }

    res.status(200);
    res.send();
    next();
  }
};
