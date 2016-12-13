/* @flow */

import type { TaskRouteLocals } from '../types/react-router';
import * as PostActions from '../actions/posts';

/**
 * Creates the task routes.  The routes follow a similar structure as defined
 * within react-router-addons-routes.
 *
 * Task routes allow us to execute various tasks based on the current location.
 * This is handy for things like prefetching of data on the server.  Please
 * see the README.md for more information.
 *
 * @see README.md local to this file for more information.
 *
 * Note: if your route tasks collection starts to get large consider using
 * a memoize function, such as the one available from lodash to avoid
 * unneccesary creation of the collection.
 */
function taskRoutes({ dispatch } : TaskRouteLocals) {
  return [
    {
      pattern: '/posts/:id',
      prefetchData: ({ id } : { id: number }) => dispatch(PostActions.fetch(id)),
      // deferredData: () => new Promise(resolve => setTimeout(resolve, 2000)),
    },
  ];
}

export default taskRoutes;
