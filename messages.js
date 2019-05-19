"use strict";

const messages = {

  startup: port => `Example app listening on port ${port}!`,

  chars: {
    arg: 'The movie title is missing.',
    header: title => `The characters of the movie "${title}":`,
  },

  match: {
    args: 'The movie titles are missing.',
    arg2: 'The second movie title is missing.',
    header: 'The characters that play in both movies:'
  },

  tall: {
    arg: 'The required height of the characters is missing.',
    header: height => `The characters that are at least ${height} cm tall:`
  },

  noMovie: title => `The movie "${title}" has not ben found.`,
  underline: () => '='.repeat(40),

  help: `
Usage: node startwars.js <command> [...arguments]

Where valid conmmands are the following:

    characters <movie-title>
        Returns all the characters of the movie.

    matchingCharacters <movie-title-1> <movie-title-2>
        Returns all characters that pay in both movies.

    tall=<height-in-cm>
        Returns all characters of all movies that have the given height at least.

    help
        Displays this list.`,
};

module.exports = messages;
