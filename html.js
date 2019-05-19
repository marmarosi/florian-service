"use strict";

const fs = require('fs');
const swapi = require('./swapi.js');
const msg = require('./messages.js');

const getPage = name => {

  return fs.readFileSync(`pages/${ name }.html`, 'utf8');
};

const pageHome = getPage( 'home' );
const pageChars = getPage( 'chars' );
const pageMatch = getPage( 'match' );
const pageTall = getPage( 'tall' );
const page404 = getPage( '404' );
const pageError = getPage( 'error' );

const createList = names => {

  let list = '';
  names.forEach( name => {
    list += `<li>${ name }</li>`;
  } );
  return list;
};

const handleError = (res, err, page) => {

  if (err.name === 'SwException') {
    res.send(
      page
        .replace( '$title', err.message )
        .replace( '$list', '' )
    );

  } else {
    console.log( err );
    res.status( 500 ).send( pageError );
  }
};

const html = {

  home: ( req, res ) => {
    res.send( pageHome );
  },

  movieCharacters: ( req, res ) => {

    const title = req.params.title;

    swapi.getMovieCharacters( title )
      .then ( names => {

        res.send(
          pageChars
            .replace( '$title', msg.chars.header( title ) )
            .replace( '$list', createList( names ) )
        );
      } )
      .catch(err => {
        handleError( res, err, pageChars );
      } );
  },

  matchingCharacters: ( req, res ) => {

    const title1 = req.params.title1;
    const title2 = req.params.title2;

    swapi.getMatchingCharacters( title1, title2 )
      .then( names => {

        res.send(
          pageMatch
            .replace( '$title', msg.match.header )
            .replace( '$list', createList( names ) )
        );
      } )
      .catch(err => {
        handleError( res, err, pageMatch );
      } );
  },

  tallCharacters: ( req, res ) => {

    const height = req.params[0].substring(6);

    swapi.getTallCharacters( height )
      .then( names => {

        res.send(
          pageTall
            .replace( '$title', msg.tall.header( height ) )
            .replace( '$list', createList( names ) )
        );
      } )
      .catch(err => {
        handleError( res, err, pageTall );
      } );
  },

  show404: ( req, res ) => {
    res.send( page404 );
  }
};

module.exports = html;
