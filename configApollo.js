const { ApolloServer, gql } = require('apollo-server-express');
const { directors, movies } = require('./data');
const _ = require('lodash');
const typeDefs = gql`
  type Query {
    movie(id: String!): Movie!
    movies: [Movie]
    director(id: String!): Director!
    directors: [Director]
  }
  type Mutation {
    createDirector(name: String!, birth: Int): Director!
    createMovie(
      title: String!
      year: Int
      description: String
      directorId: String
    ): Movie!
  }
  type Movie {
    id: String
    title: String
    description: String
    year: Int
    director: Director!
  }
  type Director {
    id: String
    name: String
    birth: String
    movies: [Movie]
  }
`;

const resolvers = {
  Query: {
    movie: (parent, args) => {
      return _.find(movies, { id: args.id });
    },
    movies: () => {
      return movies;
    },
    director: (parent, args) => {
      return _.find(directors, { id: args.id });
    },
    directors: (parent, args) => {
      return directors;
    },
  },
  Mutation: {
    createDirector: (parent, args) => {
      const item = { id: String(directors.length), ...args };
      directors.push(item);
      return item;
    },
    createMovie: (parent, args) => {
      const item = { id: String(movies.length), ...args };
      movies.push(item);
      return item;
    },
  },
  Movie: {
    director: parent => _.find(directors, { id: parent.directorId }),
  },
  Director: {
    movies: parent => _.filter(movies, { directorId: parent.id }),
  },
};

const configureApollo = async app => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ctx => ctx,
    debug: false,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });
};
module.exports = { configureApollo };
