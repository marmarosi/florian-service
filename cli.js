"use strict";

const swapi = require('./swapi.js');
const msg = require('./messages.js');

const display = (title, names) => {

  console.log( title );
  console.log( '='.repeat( title.length ) );
  names
    .forEach( name => {
      console.log( name );
    } );
};

const handleError = (err, finish) => {

  if (err.name === 'SwException') {
    console.log( err.message );
  } else {
    console.log( err );
  }
  finish();
};

const cli = {

  movieCharacters: (
    args,
    finish
  ) => {

    if (args.length < 2) {
      handleError( msg.chars.arg, finish );

    } else {
      const title = args[1];

      swapi.getMovieCharacters( title )
        .then ( names => {

          display( msg.chars.header( title ), names );
          finish();
        } )
        .catch(err => {
          handleError( err, finish );
        } );
    }
  },

  matchingCharacters: (
    args,
    finish
  ) => {

    if (args.length < 2) {
      handleError( msg.match.args, finish );

    } else if (args.length < 3) {
      handleError( msg.match.arg2, finish );

    } else {
      const title1 = args[1];
      const title2 = args[2];

      swapi.getMatchingCharacters( title1, title2 )
        .then( names => {

          display( msg.match.header, names );
          finish();
        } )
        .catch(err => {
          handleError( err, finish );
        } );
    }
  },

  tallCharacters: (
    args,
    finish
  ) => {

    const height = args[0].substring(5);

    if (height.length === 0) {
      handleError( msg.tall.arg, finish );

    } else {
      swapi.getTallCharacters( height )
        .then( names => {

          display( msg.tall.header( height ), names );
          finish();
        } )
        .catch(err => {
          handleError( err, finish );
        } );
    }
  }
};

module.exports = cli;
