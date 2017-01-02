/* @flow */

import webpackConfigFactory from './configFactory';

type Options = { mode?: 'production'|'development' };

export default function serverConfigFactory(options : Options = {}) {
  const { mode = 'development' } = options;
  return webpackConfigFactory({ target: 'server', mode });
}
