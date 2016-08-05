import fs = require('fs');
import { describeUsing } from './describe_module';

const pathToGlobalModules = require('global-modules'); // tslint:disable-line:no-var-requires

export = describeUsing(process.cwd(), pathToGlobalModules, fs);
