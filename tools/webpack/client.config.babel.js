/* @flow */

import webpackConfigFactory from './configFactory';

type Options = { mode?: 'production'|'development' };

export default function clientConfigFactory(options : Options = {}) {
  const { mode = 'development' } = options;

  return webpackConfigFactory({ target: 'client', mode });
}
