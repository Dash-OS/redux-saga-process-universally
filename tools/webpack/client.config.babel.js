/* @flow */

import webpackConfigFactory from './configFactory';

<<<<<<< HEAD
type Options = { mode?: 'production'|'development' };

export default function clientConfigFactory(options : Options = {}) {
=======
export default function clientConfigFactory(options = {}) {
>>>>>>> next
  const { mode = 'production' } = options;
  return webpackConfigFactory({ target: 'client', mode });
}
