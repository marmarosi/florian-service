"use strict";

const fetch = require('node-fetch');
const msg = require('./messages.js');
const SwException = require('./swexception');

const rootUrl = 'https://swapi.co/api/';

const getCharacterUrls = title => {

  return fetch( rootUrl + 'films?search=' + encodeURI( title ) )
    .then( res => {
      return res.json();
    } )
    .then( data => {
      if (data.count === 0) {
        throw new SwException( msg.noMovie( title ) );
      }
      return data.count ? data.results[ 0 ].characters : [];
    } );
};

const getCharacterName = url => {

  return fetch( url )
    .then( res => {
      return res.json();
    } )
    .then( data => {
      return data.name;
    } );
};

const promiseWhile = (
  data,
  condition,
  action
) => {

  var whilst = data => {
    return condition( data ) ?
      action( data ).then( whilst ) :
      Promise.resolve( data );
  };
  return whilst( data );
};

const getCharacters = collection => {

  return fetch( collection.next )
    .then( res => {
      return res.json();
    } )
    .then( data => {
      collection.next = data.next;
      collection.names = collection.names.concat( data.results
        .filter( char => +char.height >= collection.height )
        .map( char => char.name )
      );
      return collection;
    } );
};

const swapi = {

  getMovieCharacters: (
    title
  ) => {

    return new Promise((resolve, reject) => {

      getCharacterUrls( title )
        .then( urls => {

          Promise.all( urls.map( url => getCharacterName( url ) ) )
            .then( names => {
              resolve( names.sort() );
            } );
        } )
        .catch( err => {
          reject( err );
        } );
    } );
  },

  getMatchingCharacters: (
    title1,
    title2
  ) => {

    return new Promise((resolve, reject) => {

      Promise.all([
        getCharacterUrls( title1 ),
        getCharacterUrls( title2 )
      ])
        .then(urlMatrix => {

          const urls = urlMatrix[0].filter( url => urlMatrix[1].includes( url ) );

          Promise.all( urls.map( url => getCharacterName( url ) ) )
            .then(names => {
              resolve( names.sort() );
            } );
        } )
        .catch( err => {
          reject( err );
        } );
    } );
  },

  getTallCharacters: (
    height
  ) => {

    const characterCollector = {
      height: +height,
      next: rootUrl + 'people',
      names: []
    };

    return new Promise((resolve, reject) => {

      promiseWhile( characterCollector, coll => coll.next, getCharacters )
        .then( data => {
          resolve( data.names.sort() );
        } )
        .catch( err => {
          reject( err );
        } );
    } );
  }
};

module.exports = swapi;
