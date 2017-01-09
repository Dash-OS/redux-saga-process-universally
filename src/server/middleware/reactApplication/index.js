/* @flow */

import type { $Request, $Response, Middleware } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerRouter, createServerRenderContext } from 'react-router';
import { Provider } from 'react-redux';
import { CodeSplitProvider, createRenderContext } from 'code-split-component';
import Helmet from 'react-helmet';
import { runJobs } from 'react-jobs/ssr';
import generateHTML from './generateHTML';
import DemoApp from '../../../shared/components/DemoApp';
import configureStore from '../../../shared/redux/configureStore';
import config from '../../../../config';

/**
 * An express middleware that is capabable of service our React application,
 * supporting server side rendering of the application.
 */
function reactApplicationMiddleware(request: $Request, response: $Response) {
  // We should have had a nonce provided to us.  See the server/index.js for
  // more information on what this is.
  if (typeof response.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response');
  }
  const nonce = response.locals.nonce;

  // It's possible to disable SSR, which can be useful in development mode.
  // In this case traditional client side only rendering will occur.
  if (config.disableSSR) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('==> Handling react route without SSR');
    }
    // SSR is disabled so we will just return an empty html page and will
    // rely on the client to initialize and render the react application.
    const html = generateHTML({
      // Nonce which allows us to safely declare inline scripts.
      nonce,
    });
    response.status(200).send(html);
    return;
  }

  // Create the redux store.
  const store = configureStore();
  const { getState } = store;

  // First create a context for <ServerRouter>, which will allow us to
  // query for the results of the render.
  const reactRouterContext = createServerRenderContext();

  // We also create a context for our <CodeSplitProvider> which will allow us
  // to query which chunks/modules were used during the render process.
  const codeSplitContext = createRenderContext();

  // Define our app to be server rendered.
  const app = (
    <CodeSplitProvider context={codeSplitContext}>
      <ServerRouter location={request.url} context={reactRouterContext}>
        <Provider store={store}>
          <DemoApp />
        </Provider>
      </ServerRouter>
    </CodeSplitProvider>
  );

  // Firstly we will use the "runJobs" helper to execute all the jobs
  // that have been attached to the components being rendered in our app.
  runJobs(app).then(({ appWithJobs, state, STATE_IDENTIFIER }) => {
    // runJobs returns a new version of our app with all the job data accessible
    // to it.  We will pass this to the renderToString function.  Additionally
    // we need to pass the returned state to our generateHTML function so
    // that the browser can rehdrate our application with the appropriate
    // job data.  This will then avoid react checksum issues and thereby
    // prevent our app from "double rendering" on the client.

    // Create our application and render it into a string.
    const reactAppString = renderToString(appWithJobs);

    // Generate the html response.
    const html = generateHTML({
      // Provide the rendered React applicaiton string.
      reactAppString,
      // Nonce which allows us to safely declare inline scripts.
      nonce,
      // Running this gets all the helmet properties (e.g. headers/scripts/title etc)
      // that need to be included within our html.  It's based on the rendered app.
      // @see https://github.com/nfl/react-helmet
      helmet: Helmet.rewind(),
      // We provide our code split state so that it can be included within the
      // html, and then the client bundle can use this data to know which chunks/
      // modules need to be rehydrated prior to the application being rendered.
      codeSplitState: codeSplitContext.getState(),
      // Provide the redux store state, this will be bound to the window.__APP_STATE__
      // so that we can rehydrate the state on the client.
      initialState: getState(),
      // Pass through the react-jobs provided state so that it can be serialized
      // into the HTML and then the browser can use the data to rehydrate the
      // application appropriately.
      jobsState: {
        state,
        STATE_IDENTIFIER,
      },
    });

    // Get the render result from the server render context.
    const renderResult = reactRouterContext.getResult();

    // Check if the render result contains a redirect, if so we need to set
    // the specific status and redirect header and end the response.
    if (renderResult.redirect) {
      response.status(301).setHeader('Location', renderResult.redirect.pathname);
      response.end();
      return;
    }

    response
      .status(
        renderResult.missed
          // If the renderResult contains a "missed" match then we set a 404 code.
          // Our App component will handle the rendering of an Error404 view.
          ? 404
          // Otherwise everything is all good and we send a 200 OK status.
          : 200,
      )
      .send(html);
  });
}

export default (reactApplicationMiddleware : Middleware);
