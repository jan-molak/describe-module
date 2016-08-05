import fs = require('fs');
import { Description, describeUsing } from './describe_module';

const pathToGlobalModules = require('global-modules'); // tslint:disable-line:no-var-requires

export { Description };
export default describeUsing(process.cwd(), pathToGlobalModules, fs);
