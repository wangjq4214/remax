/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/facebook/create-react-app/blob/3f2037bb2ab33f7eebe95934625280f35d2dd5aa/packages/react-scripts/config/env.js#
import * as fs from 'fs';
import * as path from 'path';

export default function getEnvironment(cwd) {
  const envFilePath = path.join(cwd, '.evn');

  const NODE_ENV = process.env.NODE_ENV;

  if (!NODE_ENV) {
    throw new Error(
      'The NODE_ENV environment variable is required but was not specified.'
    );
  }

  // https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
  const dotenvFiles = [
    `${envFilePath}.${NODE_ENV}.local`,
    `${envFilePath}.${NODE_ENV}`,
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    NODE_ENV !== 'test' && `${envFilePath}.local`,
    envFilePath,
  ].filter(Boolean) as string[];

  // Load environment variables from .env* files. Suppress warnings using silent
  // if this file is missing. dotenv will never modify any environment variables
  // that have already been set.  Variable expansion is supported in .env files.
  // https://github.com/motdotla/dotenv
  // https://github.com/motdotla/dotenv-expand
  dotenvFiles.forEach(dotenvFile => {
    if (fs.existsSync(dotenvFile)) {
      require('dotenv-expand')(
        require('dotenv').config({
          path: dotenvFile,
        })
      );
    }
  });

  // Grab NODE_ENV and REMAX_APP_* environment variables and prepare them to be
  // injected into the application via DefinePlugin in Webpack configuration.
  const REMAX_APP = /^REMAX_APP_/i;

  const raw = Object.keys(process.env)
    .filter(key => REMAX_APP.test(key))
    .reduce(
      (env: Record<string, string>, key) => {
        env[key] = process.env[key] as string;
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'development',
      }
    );
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce(
      (env: Record<string, string>, key) => {
        env[key] = JSON.stringify(raw[key]);
        return env;
      },
      {}
    ),
  };

  return { raw, stringified };
}
