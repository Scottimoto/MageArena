#!/usr/bin/env node

/**
 * Module dependencies.
 */

import * as http from "http";
import { app } from "../app";
import { serverPort } from "../config";
import * as socketIo from "socket.io";
import * as _ from "lodash";
import { Position, Player, ClientPlayer } from "../models/game-sync-models";
import { Color } from 'excalibur';

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

var allPlayers: ClientPlayer[] = [];


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
    if (allPlayers.length == 4) {
      socket.emit('newplayer', null);
      // socket.disconnect();
    }
    var newPlayer = createPlayer(socket);
    allPlayers.push(newPlayer);
    // io.sockets.connected[socket.id].player = socket.player;
    console.log("Player Created: " + newPlayer);
    // console.log('[server](message): %s', JSON.stringify(m));
    socket.emit('newplayer', newPlayer);
    socket.emit("player-joined", getAllEnemyPlayers(socket));
    socket.broadcast.emit("player-joined", [newPlayer]);
    console.log("Player Joined: " + newPlayer.playerid + ", Players Remaining: " + allPlayers.length);
    console.log("Available starts: " + availableStarts);
  });

  

  socket.on('click', () => {
    // console.log('[server](message): %s', JSON.stringify(m));
    // socket.emit('newplayer', "Your Player ID: " + newPlayerID);
    socket.broadcast.emit("click");
    // newPlayerID++;
  });

  socket.on('disconnect', function () {
    console.log("DISCONNECT START");
    console.log("NUMBER OF PLAYERS BEFORE: " + allPlayers.length);



    // delete allClients[socket.id];
    
    console.log("WTF: " + socket.id);



    var disconnectedPlayer = getPlayer(socket.id);
    if (disconnectedPlayer != null) {
      socket.broadcast.emit('player-left', disconnectedPlayer.playerid);
      removePlayer(disconnectedPlayer.playerid);
      console.log("Player Left: " + disconnectedPlayer.playerid + ", Players Remaining: " + allPlayers.length);
      
      availableStarts.push({position: disconnectedPlayer.position, color: disconnectedPlayer.color});
      console.log("Available starts: " + availableStarts);
    } else {
      console.log("INVALID DISCONNECTED!!!!!!!!!!!!!!!!!");
    }
    
    

    
    console.log("NUMBER OF PLAYERS AFTER: " + allPlayers.length);
    console.log("DISCONNECT END");
  });
});

function removePlayer(id: string) {
  _.remove(allPlayers, (player) => { return player.playerid == id; });
}

function getPlayer(id: string): ClientPlayer {
  return _.find(allPlayers, {playerid: id});
}

function getAllEnemyPlayers(socket: SocketIO.Socket) {
  return _.filter(allPlayers, (player) => { return player.playerid != socket.id});
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
    color: nextAvailableStart.color
  };
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
