# What is wrong with REST

  ## REST backends expose one resource per endpoint. So the mobile app must send multiple requests to several endpoints.

  ## [Batch endpoint] (https://developers.facebook.com/docs/graph-api/making-multiple-requests)

  ## Frontend and Backend Development Have No Contract

# What GraphQL Is Not

  ## Not NEXT REST
  ## Not an architecture
  ## Not a query language for graph database
  ## Not a transport protocol
  ## Not a JS library
  ## Not about JSON on HTTP

# What GraphQL is About

  ## A Specification For RPC
  ## NEXT SOAP 
  ## API gateway or proxy service to all backend services including database
  ## declarative query language
  ## Support read, write, and subscription
  ## Protocol agonistic: http, smtp, websocket and etc.
  ## Support aggregations and combinations out of box
  ## Support API evolution out of box 

# GraphQL Sample

```
----------------------------------- request
POST / HTTP 1.1
Host: http://graphql.acme.com/
Content-Type: application/graphql
{
    Project(id: 123) {
        id
        body
        date
    }
}
----------------------------------- response
HTTP/1.1 200 OK
Content-Type: application/json
{
    "data": {
        "project": {
            "id:" "123",
            "body": "Lorem Ipsum dolor sit amet",
            "date": "2017-07-14T12:44:17.449Z"
        }
    }
}
```

# GraphQL schema language

  ## Definition of Object and fields

  ## Scalar types are the leaves of the query
    ### build-in types: Int, Float, String, Boolean, ID

  ## Interfaces

  ```
    type User {
      id: ID!
      name: String!
      addresses: [Address]!
      age(unit: AgeUnit = YEAR): Int
    }

    enum AgeUnit {
      YEAR
      MONTH
      DAY
    }

    type Address {
      line1: String!
      country: String!
    }

    type Query {
      user(id: ID!): User
      users(sort: String): [User]
    }

    #query and mutation are the entry points to the schema

    schema {
      query: Query!
      mutation: Mutation
    }

    union WorkflowAction = Create | Update | Transfer | Renew


    {
  searchWorkflow(lei: "ADFD5567SDS") {
    ... on Create {
      legalName
    }
    ... on Update {
      lei
    }
    ... on Transfer {
      lei
      originalLOU
    }
  }
  }
  ```

# Interface type


If a field is Union or Interface type, you need a ```__resolveType``` field in the resolver map. 

```
User: {
    // default resolver: Returns a property from obj with the relevant field name
    // don't need it for every field
    // just for demo purpose
    id: user => user.id,
    // custome resolver on any field
    anotherId: user => user.id,
    // Abstract type User must resolve to an Object type at runtime
    __resolveType (data) {
      if (data.category) {
        return 'Author'
      }

      if (data.role) {
        return 'Developer'
      }

      return 'Author'
    }
  }
```

If you are querying a field that returns an interface or a union type, you will need to use inline fragments to access data on the underlying concrete type. It's easiest to see with an example:

```
query {
  Users {
    id
    ... on Developer {
      role
    }
    ... on Author {
      category
    }
  }
}
```

```
{
  "data": {
    "Users": [
      {
        "id": "12",
        "role": "FRONTEND"
      },
      {
        "id": "13",
        "role": "BACKEND"
      },
      {
        "id": "10",
        "category": "children"
      },
      {
        "id": "11",
        "category": "sci-fi"
      }
    ]
  }
}
```

# resolver function

Every type or field has a default resolver to fall back on.

```
    fieldName(obj, args, context, info) { result }
```

obj: passed down from the parent field
args: query argument object
context: the shared objecct by all resolvers
info: execution state of the query

```
query {
  Tweet(id: 1) {
    id,
    body
  }
}
```

```
{
  "data": {
    "Tweet": {
      "id": "1",
      "body": "Lorem Ipsum"
    }
  }
}
```


# Query 

## return exactly what you ask for 
## query argument
## strong typing using variables

```
query {
  Project(id: 1) {
    id,
    body,
    user {
      id
       ... on Developer {
        role
      }
      ... on Administrator {
        category
      }
    }
  }
}

```

```
{
  "data": {
    "Project": {
      "id": "1",
      "body": "Lorem Ipsum",
      "user": {
        "id": "10",
        "category": "business"
      }
    }
  }
}
```

```
operationName: "getUser"

query:

query getUser($role: Role) {
  User(role: $role) {
    id,
   

       ... on Developer {
        role
      }
      ... on Administrator {
        category
      }
    }

}

variables: 

{
  "role": "FRONTEND"
}

```

#Pagination 
 ##cusor-based pagination

 ```
 type ProjectPage {
    totalCount: Int
    edges: [ProjectEdge]
    pageInfo: PageInfo
}

type PageInfo {
    start: String
    end: String
    hasNext: Boolean
}

type ProjectEdge {
    node: Project
    cursor: String
}
 ```

 ```
   query {
    ProjectPaging(first: 2, after: "Mg==") {
      edges {
        node {
          id
        }
        cursor
      }
      pageInfo {
        start
        end
        hasNext
      }
      totalCount
    }
  }
 ```

 ```
 {
  "data": {
    "ProjectPaging": {
      "edges": [
        {
          "node": {
            "id": "3"
          },
          "cursor": "Mw=="
        },
        {
          "node": {
            "id": "4"
          },
          "cursor": "NA=="
        }
      ],
      "pageInfo": {
        "start": "Mw==",
        "end": "NA==",
        "hasNext": true
      },
      "totalCount": 10
    }
  }
}
 ```

#Mutation

```
mutation {
	AddProject(body: "fdsf", userId: 1) {
    id
	}
}
```

```
{
  "data": {
    "AddProject": {
      "id": "4"
    }
  }
}
```

#Subscription

Type Definition
```
type Subscription {
    projectAdded: Project    # subscription operation.
}
```

Resolver

```
   Subscription: {
        projectAdded: {  // create a projectAdded subscription resolver function.
          subscribe: () => pubsub.asyncIterator(CHANNEL_ADDED_TOPIC)  // subscribe to changes in a topic
        }
    }
```


```
subscription subTest {
  projectAdded {
    id
    body
  }
}
```

Response:
```
"Your subscription data will appear here after server publication!"
```


# GraphQL client

```
var dice = 3;
var sides = 6;
var xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open("POST", "/graphql");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Accept", "application/json");
xhr.onload = function () {
  console.log('data returned:', xhr.response);
}
var query = `query RollDice($dice: Int!, $sides: Int) {
  rollDice(numDice: $dice, numSides: $sides)
}`;
xhr.send(JSON.stringify({
  query: query,
  variables: { dice: dice, sides: sides },
}));
```

# GraphQL libraries and tools

 1. Facebook's Relay
 2. Apollo graphql libraris
 3. graphiql developer tool
 4. graph.cool - backend server framework
