# Flow

This is a feature branch of `react-universally` that is currently built against `v11.0.1`.

It provides you with a [Flow](https://flowtype.org/) implementation.  Flow is a static type checker for javascript that uses a lot of type inference, so you don't need to declare types throughout your code.

Most modern IDEs have a Flow plugin available which will report errors and use the Flow data to provide you with things like autocomplete w/ type information.

## Additional `package.json` Scripts

The following commands are added to the `package.json` scripts.

## `npm run flow`

Executes `flow-bin`, performing flow based type checking on the source.  If you really like flow I would recommend getting a plugin for your IDE.  For Atom I recommend `flow-ide`.

## `npm run flow:defs`

Installs the flow type definitions for the projects dependencies from the official "flow-typed" repository.

## `npm run flow:coverage`

Executes `flow-coverage-report`, generating a report on your type check coverage.  It returns with an error if your coverage is below 80%.  After you have run it I recommend clicking into the generated flow-coverage directory and opening the HTML report.  You can click through into files to see where your coverage is lacking.
