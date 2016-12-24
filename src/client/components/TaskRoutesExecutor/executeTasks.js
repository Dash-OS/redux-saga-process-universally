/* @flow */
/* eslint-disable no-underscore-dangle */

import type { Location } from '../../../shared/types/react-router';
import type { Dispatch, ThunkAction } from '../../../shared/types/redux';
import runTasksForLocation from '../../../shared/routeTasks/runTasksForLocation';

function executeTasks(location: Location, dispatch: Dispatch<ThunkAction>) {
  const tasksToExecute = window && window.__APP_STATE__
    // We have an __APP_STATE__ available, which will contain the state from the
    // server populated by any 'prefetchData' tasks, therefore we only need to
    // call the 'deferredData' tasks.
    ? ['deferredData']
    // No data is available so we will execute both the 'prefetchData' and
    // 'deferredData' tasks.
    : ['prefetchData', 'deferredData'];

  if (window) {
    // We now remove the __APP_STATE__ as it has been safely merged into the redux
    // store at this stage, and by deleting it we can make sure that we will
    // execute both the 'prefetchData' and 'deferredData' tasks for every route
    // change that happens on the client side.
    delete window.__APP_STATE__;
  }

  // The location has changed so we will attempt to run any route tasks
  // that are matched for the new location.
  const executingTasks = runTasksForLocation(
    location,
    tasksToExecute,
    { dispatch },
  );

  if (executingTasks) {
    // Tasks are being executed...
    executingTasks.then(({ routes }) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Finished route tasks', routes); // eslint-disable-line no-console,max-len
      }
    });
  }
}

export default executeTasks;
