'use strict';

const dao = require('../src/dao');

describe('dao', () => {
    it('dao.projects', () => {
        return expect(dao.projects().then(d => typeof d)).resolves.toBe('object');
    });
    it('dao.tweet', () => {
        return dao.project(1)
            .then(p => {
                expect(p).toMatchSnapshot();
            });
    });
});
