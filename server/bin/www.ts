#!/usr/bin/env node

/**
 * Module dependencies.
 */

import * as http from "http";
import { app } from "../app";
import { serverPort } from "../config";
import * as socketIo from "socket.io";
import * as _ from "lodash";
import { Position, Player, ClientPlayer, GameState } from "../models/game-sync-models";
import { Color, Vector, Input } from 'excalibur';

import { createTimeline } from '@gamestdio/timeline';
// import { Engine, Actor, Color, Input, Vector } from 'excalibur';

/**
 * Get port from environment and store in Express.
 */
// const port = normalizePort(process.env.PORT || serverPort);
const port = normalizePort(4300);
// app.set("port", port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
var io: SocketIO.Server = socketIo(server);




server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

var timeline = createTimeline()


var state: GameState= { players: [], lastUpdated: 0 };

// first game state snapshot
timeline.takeSnapshot(state, 0);

// var allPlayers: ClientPlayer[] = [];


var startingPositions: Position[] = [{x: -100, y: 0}, {x: 100, y: 0}, {x: 0, y: -100},{x: 0, y: 100}];
var startingColors: Color[] = [Color.Red, Color.Blue, Color.Green, Color.Yellow];
var availableStarts: {position: Position, color: Color}[] = [];

for (let i = 0; i < 4; i++) {
  availableStarts.push({position: startingPositions[i], color: startingColors[i]});
}

console.log("Available starts: " + availableStarts);


io.on('connect', (socket: SocketIO.Socket | any) => {
  // allClients[socket.id].socket = socket;
  // console.log('Connected client on port %s.', this.port);
  socket.on('newplayer', () => {
    if (state.players.length == 4) {
      socket.emit('newplayer', null);
      // socket.disconnect();
    }
    var newPlayer = createPlayer(socket);
    state.players.push(newPlayer);
    // io.sockets.connected[socket.id].player = socket.player;
    console.log("Player Created: " + newPlayer);
    // console.log('[server](message): %s', JSON.stringify(m));
    socket.emit('newplayer', newPlayer);
    socket.emit("player-joined", getAllEnemyPlayers(socket));
    socket.broadcast.emit("player-joined", [newPlayer]);
    // console.log("!!!Emitting Game State --someone joined!!!");
    emitGameState();
    console.log("Player Joined: " + newPlayer.playerid + ", Players Remaining: " + state.players.length);
    console.log("Available starts: " + availableStarts);
  });

  var movementSpeed = 200;

  socket.on('move', (playerInputs: Input.Keys[]) => {
    let movingPlayer = getPlayer(socket.id);
    if (movingPlayer != null) {
      let timeNow = Date.now();
      let timeSinceLastUpdate = timeNow - movingPlayer.lastUpdated;
      movingPlayer.position.x = movingPlayer.position.x + (movingPlayer.velocity.x * (timeSinceLastUpdate/1000));
      movingPlayer.position.y = movingPlayer.position.y + (movingPlayer.velocity.y * (timeSinceLastUpdate/1000));
      HandleMovement(movingPlayer, playerInputs);
      console.log("The new x,y: " + movingPlayer.position.x + "," + movingPlayer.position.y);
      // console.log('[server](message): %s', JSON.stringify(m));
      // socket.emit('newplayer', "Your Player ID: " + newPlayerID);
      console.log("SENDING MOVE SYNC");
      // state.players[]
      movingPlayer.lastUpdated = timeNow;
      let filteredState: GameState = { players: [movingPlayer], lastUpdated: movingPlayer.lastUpdated }
      io.emit('game-state-sync', filteredState);
    }
    // newPlayerID++;
  });

  function HandleMovement(player: ClientPlayer, inputs: Input.Keys[]) {
		player.velocity.setTo(0, 0);
		if (_.find(inputs,  input => input === Input.Keys.W ) != null) {
			player.velocity = player.velocity.add(Vector.Up.scale(movementSpeed));
		}
		if (_.find(inputs, input => input === Input.Keys.A) != null) {
			player.velocity = player.velocity.add(Vector.Left.scale(movementSpeed));
		}
		if (_.find(inputs, input => input === Input.Keys.S) != null) {
			player.velocity = player.velocity.add(Vector.Down.scale(movementSpeed));
		}
		if (_.find(inputs, input => input === Input.Keys.D) != null) {
			player.velocity = player.velocity.add(Vector.Right.scale(movementSpeed));
		}
		if (!player.velocity.equals(Vector.Zero)) {
			player.velocity = player.velocity.normalize().scale(movementSpeed);
    }
  }


  socket.on('disconnect', function () {
    console.log("DISCONNECT START");
    console.log("NUMBER OF PLAYERS BEFORE: " + state.players.length);



    // delete allClients[socket.id];
    
    console.log("WTF: " + socket.id);



    var disconnectedPlayer = getPlayer(socket.id);
    if (disconnectedPlayer != null) {
      removePlayer(disconnectedPlayer.playerid);
      socket.broadcast.emit('player-left', disconnectedPlayer.playerid);
      emitGameState();
      console.log("Player Left: " + disconnectedPlayer.playerid + ", Players Remaining: " + state.players.length);
      
      availableStarts.push({position: disconnectedPlayer.position, color: disconnectedPlayer.color});
      console.log("Available starts: " + availableStarts);
    } else {
      console.log("INVALID DISCONNECTED!!!!!!!!!!!!!!!!!");
    }
    
    

    
    console.log("NUMBER OF PLAYERS AFTER: " + state.players.length);
    console.log("DISCONNECT END");
  });
});


function emitGameState() {
  io.emit('game-state-sync', state);
}

function removePlayer(id: string) {
  _.remove(state.players, (player) => { return player.playerid == id; });
}

function getPlayer(id: string): ClientPlayer {
  return _.find(state.players, {playerid: id});
}

function getAllEnemyPlayers(socket: SocketIO.Socket) {
  return _.filter(state.players, (player) => { return player.playerid != socket.id});
}

// function getAllPlayers(){
//   var players = [];
//   Object.keys(io.sockets.connected).forEach(function(socketID){
//       var player = io.sockets.connected[socketID].player;
//       if(player) players.push(player);
//   });
//   return players;
// }

function createPlayer(socket: SocketIO.Socket): ClientPlayer {
  var nextAvailableStart = availableStarts[0];
  availableStarts.splice(0, 1);
  var newPlayer: ClientPlayer = {
    playerid: socket.id,
    order: Object.keys(io.sockets.connected).length,
    health: 100,
    position: nextAvailableStart.position,
    color: nextAvailableStart.color,
    velocity: new Vector(0, 0),
    lastUpdated: Date.now()
  };
  state.lastUpdated = newPlayer.lastUpdated;
  return newPlayer;
}


// server.lastPlayderID = 0; // Keep track of the last id assigned to a new player

// io.on('connection',function(socket){
//     socket.on('newplayer',function(){
//         socket.player = {
//             id: server.lastPlayderID++,
//             x: randomInt(100,400),
//             y: randomInt(100,400)
//         };
//         socket.emit('allplayers',getAllPlayers());
//         socket.broadcast.emit('newplayer',socket.player);
//     });
// });

// function getAllPlayers(){
//     var players = [];
//     Object.keys(io.sockets.connected).forEach(function(socketID){
//         var player = io.sockets.connected[socketID].player;
//         if(player) players.push(player);
//     });
//     return players;
// }

// function randomInt (low, high) {
//     return Math.floor(Math.random() * (high - low) + low);
// }
























/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val): boolean | number {

  const normalizedPort = parseInt(val, 10);

  if (isNaN(normalizedPort)) {
    // named pipe
    return val;
  }

  if (normalizedPort >= 0) {
    // port number
    return normalizedPort;
  }

  return false;
}

/**
 * Event listener for HTTP server 'error' event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */

function onListening() {
  // const addr = server.address();
  // const bind = typeof addr === "string"
  //   ? "pipe " + addr
  //   : "port " + addr.port;
}
