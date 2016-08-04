import expect = require('./expect');
import describeModule from '../src/describe_module';

describe('Describe Module', () => {

    it('should pass a test ;-)', () => {
        expect(describeModule('some-module')).to.deep.equal({});
    });
});
