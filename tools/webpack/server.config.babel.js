/* @flow */

import webpackConfigFactory from './configFactory';

<<<<<<< HEAD
type Options = { mode?: 'production'|'development' };

export default function serverConfigFactory(options : Options = {}) {
=======
export default function serverConfigFactory(options = {}) {
>>>>>>> next
  const { mode = 'production' } = options;
  return webpackConfigFactory({ target: 'server', mode });
}
