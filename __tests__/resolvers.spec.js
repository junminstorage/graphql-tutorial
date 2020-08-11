'use strict';

const promise = require('bluebird');

beforeEach(() => {
    jest.resetModules();
});

test('query Projects resolver with mock', function () {
    const mock = jest.fn(() => { console.log('mocking'); return promise.resolve(); });
    jest.doMock('../src/dao', () => {
        return {
            projects: mock
        };
    });
    const resolvers = require('../src/resolvers');
    return resolvers.Query.Projects()
        .then(e => {
            expect(mock).toHaveBeenCalledTimes(1);
        });
});

test('query Projects resolver without mock', function () {
    jest.dontMock('../src/dao');
    const resolvers = require('../src/resolvers');
    return expect(resolvers.Query.Projects().then(t => Array.isArray(t))).resolves.toEqual(true);
});
