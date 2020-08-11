'use strict';

const typeDefs = `
type Project {
    id: ID!
    # The project text. 
    body: String
    # When the projecct was published
    date: Date
    # Who work on the project
    user: User
    # Views, etc
    Stats: Stat
}

interface User {
    id: ID!
    # dynamically generated field
    anotherId: ID!,
    username: String
    first_name: String
    last_name: String
    full_name: String
    name: String @deprecated
    avatar_url: Url,
    projects: [Project]
}

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

# implementation must repeat all of the fields from interface
type Administrator implements User {
    id: ID!
    # dynamically generated field
    anotherId: ID!,
    username: String
    first_name: String
    last_name: String
    full_name: String
    name: String @deprecated
    avatar_url: Url
    category: String,
    projects: [Project]
}

type Developer implements User {
    id: ID!
    # dynamically generated field
    anotherId: ID!,
    username: String
    first_name: String
    last_name: String
    full_name: String
    name: String @deprecated
    avatar_url: Url
    role: Role,
    projects: [Project]
}

enum Role {
    FRONTEND
    BACKEND
}

type Stat {
    views: Int
    likes: Int
    reprojects: Int
    responses: Int
}

type Notification {
    id: ID
    date: Date
    type: String
}

type Meta {
    count: Int
}

scalar Url
scalar Date

type Query {
    ProjectPaging(first:Int, after: String) : ProjectPage
    Project(id: ID!): Project
    Projects(limit: Int, sortField: String, sortOrder: String): [Project]
    ProjectsMeta: Meta
    User(role: Role): User,
    Users: [User],
    Notifications(limit: Int): [Notification]
    NotificationsMeta: Meta
}

type Subscription {
    projectAdded: Project    # subscription operation.
}

type Mutation {
    AddProject(body: String, userId: ID!): Project
    DeleteProjecct(id: ID!): Project
}


schema {
	query: Query
	mutation: Mutation
	subscription: Subscription
}

`;

module.exports = typeDefs;
