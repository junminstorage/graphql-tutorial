'use strict';

const projects = [
    { id: 1, body: 'Lorem Ipsum', date: new Date('2018-01-01'), author_id: 10 },
    { id: 2, body: 'Sic dolor amet', date: new Date('2018-02-01'), author_id: 11 },
    { id: 3, body: 'Ghe sdf Ydf', date: new Date('2018-03-01'), author_id: 11 },
    { id: 4, body: 'Ghe sdf Ydf', date: new Date('2018-03-01'), author_id: 12 },
    { id: 5, body: 'Ghe sdf Ydf', date: new Date('2018-03-01'), author_id: 10 },
    { id: 6, body: 'Ghe sdf Ydf', date: new Date('2018-03-01'), author_id: 13 },
    { id: 7, body: 'Ghe sdf Ydf', date: new Date('2018-03-01'), author_id: 12 },
    { id: 8, body: 'Ghe sdf Ydf', date: new Date('2018-03-01'), author_id: 11 },
    { id: 9, body: 'Ghe sdf Ydf', date: new Date('2018-03-01'), author_id: 10 },
    { id: 10, body: 'Ghe sdf Ydf', date: new Date('2018-03-01'), author_id: 12 }
];
const admins = [
    { id: 10, username: 'johndoe', first_name: 'John', last_name: 'Doe', avatar_url: 'acme.com/avatars/10', category: 'business' },
    { id: 11, username: 'janedoe', first_name: 'Jane', last_name: 'Doe', avatar_url: 'acme.com/avatars/11', category: 'infrastructure' }
];

const developers = [
    { id: 12, username: 'peterjoe', first_name: 'peter', last_name: 'Doe', avatar_url: 'acme.com/avatars/12', role: 'front-end' },
    { id: 13, username: 'mikejoe', first_name: 'mike', last_name: 'Doe', avatar_url: 'acme.com/avatars/13', role: 'back-end' }
];

const stats = [
    { project_id: 1, views: 123, likes: 4, reprojects: 1, responses: 0 },
    { project_id: 2, views: 567, likes: 45, reprojects: 63, responses: 6 }
];

module.exports = {
    projects () {
        return Promise.resolve(projects);
    },
    project (id) {
        return Promise.resolve(projects.filter(t => t.id == id)[0]);
    },
    addProject (p) {
        let max = 0;
        projects.forEach(p => {
            max = Math.max(p.id, max);
        });
        p.id = ++max;
        p.date = new Date();
        projects.push(p);
        return Promise.resolve(p);
    },
    users () {
        return Promise.resolve([...developers, ...admins]);
    },
    projectsByAuthorId (t_id) {
        return Promise.resolve(admins.filter(t => t.author_id == id));
    },
    user (id) {
        return Promise.resolve(admins.filter(a => a.id == id)[0]);
    },
    developer (role) {
        console.log(role);
        return Promise.resolve(developers.filter(a => a.role == role)[0]);
    },
    stats (t_id) {
        return Promise.resolve(stats.filter(t => t.project_id == t_id));
    }
};
