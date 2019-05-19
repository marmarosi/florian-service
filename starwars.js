"use strict";

const express = require('express');
const cli = require('./cli.js');
const html = require('./html.js');
const msg = require('./messages.js');

const app = express();
const port = process.env.PORT || 8080;

const COMMAND = {
  CHARS: 'characters',
  MATCH: 'matchingCharacters',
  TALL: 'tall='
};

const finish = () => {
  server.close();
};

const args = process.argv.slice(2);

const server = app.listen( port, () => {

  if (args.length === 0) {
    console.log( msg.startup( port ) );
  }
} );

if (args.length > 0) {

  const cmd = args[0];
  switch (cmd) {

    case COMMAND.CHARS:
      cli.movieCharacters( args, finish );
      break;

    case COMMAND.MATCH:
      cli.matchingCharacters( args, finish );
      break;

    default:
      if (cmd.startsWith( COMMAND.TALL )) {
        cli.tallCharacters( args, finish );

      } else {
        console.log( msg.help );
        finish();
      }
  }
}

app.get( '/', (req, res) => html.home( req, res ) );

app.get( `/${ COMMAND.CHARS }/:title`, (req, res) => html.movieCharacters( req, res ) );

app.get( `/${ COMMAND.MATCH }/:title1/:title2`, (req, res) => html.matchingCharacters( req, res ) );

app.get( '*', (req, res) => {

  if (req.originalUrl.startsWith( '/' + COMMAND.TALL )) {
    html.tallCharacters( req, res );
  } else {
    html.show404( req, res );
  }
} );
