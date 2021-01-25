const http = require('http');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { execute, subscribe } = require('graphql');
const ws = require('ws'); // yarn add ws
const { useServer } = require('graphql-ws/lib/use/ws');

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const { makeExecutableSchema } = require('graphql-tools');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const subscriptionEndpoint = `ws://localhost:3000/subscriptions`;

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: {subscriptionEndpoint : subscriptionEndpoint, websocketClient: "v1"},
  })
);

const server = http.createServer(app);

const wsServer = new ws.Server({
  server,
  path: '/subscriptions',
});

server.listen(3000, () => {
  useServer(
    {
      schema,
      execute,
      subscribe,
    },
    wsServer,
  );
  console.info('Listening on http://localhost:3000/graphql');
});