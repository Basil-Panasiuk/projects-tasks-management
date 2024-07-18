import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);
