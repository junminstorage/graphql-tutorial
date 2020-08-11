const date = require('../src/date');
const { GraphQLError } = require('graphql');

test('date test cases', function () {
    expect(date).toBeTruthy();
    expect(date.parseValue('2018-02-01')).toEqual(new Date('2018-02-01'));
    expect(date.parseValue.bind(date, 'dfdsf')).toThrowError(GraphQLError);
});
