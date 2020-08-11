'use strict'
const express = require('express')
const {getGraphQLParams, graphqlHTTP} = require('express-graphql')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const { makeExecutableSchema } = require('graphql-tools')
const schema = makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers })

const { execute, subscribe } = require('graphql');
const {createServer} = require('http');
const  { SubscriptionServer } = require('subscriptions-transport-ws');

const PORT = 4000;
const subscriptionEndpoint = `ws://localhost:${PORT}/subscriptions`;
// a dummy context here
const myContext = {'t': 1}

var app = express()
app.use('/graphql', (req, res, next) => {
    //logging
    getGraphQLParams(req).then(params => {
      console.log(params);
    })
  
    graphqlHTTP({
      schema: schema,
      graphiql: {subscriptionEndpoint : subscriptionEndpoint},
      // context can be passed to resolver function
      context: {myContext, req}
    })(req, res, next)
})

const ws = createServer(app);

ws.listen(PORT, () => {
  console.log(`GraphQL is now running on http://localhost:${PORT}`);
  // Set up the WebSocket for handling GraphQL subscriptions.
  new SubscriptionServer({
    execute,
    subscribe,
    schema,
    onConnect,
    onOperation,
    onDisconnect
  }, {
    server: ws,
    path: '/subscriptions',
    });
  
})

//logging
var onOperation = function (message, params, WebSocket) {
  console.log('subscription' + message.payload, params);
  return Promise.resolve(Object.assign({}, params, { context: message.payload.context }))
}
//logging
var onConnect = function (connectionParams, WebSocket) {
  console.log('connecting ....')
}
//loggging
var onDisconnect = function (WebSocket) {
  console.log('disconnecting ...')
}