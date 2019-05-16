"use strict";

const express = require('express');
const api = require('./api.js');
const msg = require('./messages.js');

const app = express();
const port = 3000;

const COMMAND = {
  CHARS: 'characters',
  MATCH: 'matchingCharacters',
  TALL: 'tall='
};

const finish = () => {
  server.close();
};

const display = message => {
  console.log( message );
  finish();
};

const server = app.listen( port, () => {

  if (process.argv.length < 3) {
    console.log( msg.startup( port ) );
  }
} );

if (process.argv.length > 2) {

  const cmd = process.argv[2];
  switch (cmd) {

    case COMMAND.CHARS:
      if (process.argv.length < 4) {
        display( msg.chars.arg );
      } else {
        api.getMovieCharacters( process.argv[3], finish );
      }
      break;

    case COMMAND.MATCH:
      if (process.argv.length < 4) {
        display( msg.chars.args );
      } else if (process.argv.length < 5) {
        display( msg.chars.arg );
    } else {
      api.getMatchingCharacters( process.argv[3], process.argv[4], finish );
      }
      break;

    default:
      if (cmd.startsWith( COMMAND.TALL )) {
        if (cmd.length > 5) {
          api.getTallCharacters( cmd.substring(5), finish );
        } else {
          display( msg.tall.arg );
        }

      } else {
        display( msg.help );
      }
  }
}

app.get('/', (req, res) => res.send( msg.hello ) );
