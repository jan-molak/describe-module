import expect = require('./expect');
import mock   = require('mock-fs');
import nodefs = require('fs');

import { describeUsing } from '../src/describe_module';
import integratedDescribe from '../src/index';

import { Config } from 'mock-fs';
import { Directory } from 'mock-fs';

describe ('Describe Module', () => {

    const Package_JSON: string       = '{ name: "some-module", version: "1.0.0", main: "index.js" }',
          Empty_Directory: Directory = <Directory> {},
          Global_Modules: string     = '/usr/local/lib/node_modules';

    afterEach(() => mock.restore());

    describe('Under development', () => {

        it ('should describe a module as "under development", when the module name is the same as the current working directory name', () => {

            let cwd = '/home/jan/some-module',
                fs  = files({ '/home/jan/some-module/package.json': Package_JSON });

            let describeModule = describeUsing(cwd, Global_Modules, fs);

            expect(describeModule('some-module')).to.deep.equal({
                name: 'some-module',
                path: '/home/jan/some-module',
                mode: 'dev',
            });
        });
    });

    describe ('Local', () => {
        it ('should describe a module as "local", when it is installed under node_modules in the current working directory', () => {

            let cwd = '/home/jan/some-project',
                fs  = files({ '/home/jan/some-project/node_modules/some-module/package.json': Package_JSON });

            let describeModule = describeUsing(cwd, Global_Modules, fs);

            expect(describeModule('some-module')).to.deep.equal({
                name: 'some-module',
                path: '/home/jan/some-project/node_modules/some-module',
                mode: 'local',
            });
        });
    });

    describe ('Global', () => {
        it ('should describe a module as "global", when it is installed globally', () => {
            let cwd     = '/home/jan/some-other-project',
                fs      = files({
                    '/usr/local/lib/node_modules/some-module/package.json': Package_JSON,
                    '/home/jan/some-other-project': Empty_Directory,
                });

            let describeModule = describeUsing(cwd, Global_Modules, fs);

            expect(describeModule('some-module')).to.deep.equal({
                name: 'some-module',
                path: '/usr/local/lib/node_modules/some-module',
                mode: 'global',
            });
        });
    });

    describe ('Order of priority', () => {
        it ('gives a module under development a priority over both local and global ones', () => {

            let cwd = '/home/jan/some-module',
                fs  = files({
                    '/home/jan/some-module/package.json': Package_JSON,
                    '/home/jan/some-module/node_modules/some-module/package.json': Package_JSON,
                    '/usr/local/lib/node_modules/some-module/package.json': Package_JSON,
                });

            let describeModule = describeUsing(cwd, Global_Modules, fs);

            expect(describeModule('some-module').mode).to.equal('dev');
        });

        it ('gives a local module a priority over a global one', () => {

            let cwd = '/home/jan/some-project',
                fs  = files({
                    '/home/jan/some-project/package.json': Package_JSON,
                    '/home/jan/some-project/node_modules/some-module/package.json': Package_JSON,
                    '/usr/local/lib/node_modules/some-module/package.json': Package_JSON,
                });

            let describeModule = describeUsing(cwd, Global_Modules, fs);

            expect(describeModule('some-module').mode).to.equal('local');
        });

        it ('attempts to discover a module as global only when dev and local versions could not be found', () => {

            let cwd = '/home/jan/some-project',
                fs  = files({
                    '/home/jan/some-project/package.json': Package_JSON,
                    '/home/jan/some-project/node_modules': Empty_Directory,
                    '/usr/local/lib/node_modules/some-module/package.json': Package_JSON,
                });

            let describeModule = describeUsing(cwd, Global_Modules, fs);

            expect(describeModule('some-module').mode).to.equal('global');
        });
    });

    describe ('Not Found', () => {
        it ('should not describe the module if it could not be found', () => {

            let cwd     = '/home/jan/project',
                fs      = files({
                    '/home/jan/project': Empty_Directory,
                });

            let describeModule = describeUsing(cwd, Global_Modules, fs);

            expect(describeModule('some-module')).to.be.undefined;
        });
    });

    describe ('Integrated version', () => {
        it ('should detect one of this project\'s dependencies', () => {

            expect(integratedDescribe('global-modules').mode).to.equal('local');
            expect(integratedDescribe('describe-module').mode).to.equal('dev');
        });

        it ('should detect itself', () => {

            expect(integratedDescribe('describe-module').mode).to.equal('dev');
        });
    });

    function files(files: Config): typeof nodefs {
        return <any> mock.fs(files, { createCwd: false });
    }
});
