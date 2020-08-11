'use strict';

const { PubSub } = require('graphql-subscriptions');

const {convertNodeToCursor, convertCursorToNodeId} = require('./utils');
const dao = require('./dao');

const pubsub = new PubSub(); //create a PubSub instance
const CHANNEL_ADDED_TOPIC = 'newProject';
const date = require('./date');

const resolvers = {
    Query: {
        Users: () => {
            return dao.users();
        },
        Projects: () => {
            return dao.projects();
        },
        Project: (_, {id}) => {
            return dao.project(id);
        },
        User: (root, {role}, context, info) => {
            return dao.developer(role);
        },
        ProjectPaging: (_, {first = 10, after}) => {
            let afterIndex = 0;
            // Get ID from after argument or default to first item.
            if (typeof after === 'string') {
                const  id = convertCursorToNodeId(after);
                if (typeof id === 'number') {
                    const matchingIndex = id;// hard-coded here, in real example, search db
                    afterIndex = matchingIndex;
                }
            }
            return dao.projects()
                .then(projects => {
                    const total = projects.length;
                    if (total == afterIndex)
                        afterIndex = 0;
                    const projectList = projects.slice(afterIndex, afterIndex + first);
                    return {
                        totalCount: total,
                        edges: projectList,
                        pageInfo: {
                            start: convertNodeToCursor(projectList[0]),
                            end: convertNodeToCursor(projectList[projectList.length - 1]),
                            hasNext: total > afterIndex + first
                        }
                    };
                });

        }
    },
    Mutation: {
        AddProject: (_, {body, userId}) => {
            return dao.addProject({
                body: body,
                author_id: userId,
            })
            .then(project => {
                pubsub.publish(CHANNEL_ADDED_TOPIC, { projectAdded: project })
                return project;
            });
        }
    },
    Subscription: {
        projectAdded: {  // create a projectAdded subscription resolver function.
          subscribe: () => pubsub.asyncIterator(CHANNEL_ADDED_TOPIC)  // subscribe to changes in a topic
        }
    },
    Date: date,

    // you can customerize the ENUM value here
    // not this doesnt affect output
    // this is just for interval value mapping
    Role: {
        FRONTEND: 'front-end',
        BACKEND: 'back-end'
    },

    Project: {
    // custom resolver on any field
    // the input is the parent obj, e.g. tweet
        user: (project) => dao.user(project.author_id)
    },
    User: {
    // default resolver: Returns a property from obj with the relevant field name
    // don't need it for every field
    // just for demo purpose
        id: user => user.id,
        // Abstract type User must resolve to an Object type at runtime
        __resolveType (data) {
            console.log(data);
            if (data.category) {
                return 'Administrator';
            }

            if (data.role) {
                return 'Developer';
            }

            return 'Administrator';
        },
        projects: user => {
            console.log('user => projects ...');
            return dao.projects();
        }
    },
    Developer : {
        // must define the field resolver in class level not at interface
        anotherId: user => {
            console.log(user);
            return user.id;
        },
        projects: user => {
            console.log('user => projects ...');
            return dao.projects();
        }
    },

    ProjectEdge: {
        node: project => project,
        cursor: project => convertNodeToCursor(project)
    }
};

module.exports = resolvers;

