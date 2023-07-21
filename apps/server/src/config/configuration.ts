import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const env = process.env.NODE_ENV || 'prod';
const YAML_CONFIG_FILENAME = `config.${env}.yaml`;

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
};
