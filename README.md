# Linoleum-Electron

Electron build infrastructure for Linoleum projects.

## Usage

Within `Gulpfile.js`:

```
// Init global state
var Linoleum = require('linoleum');

// Include optional linoleum tasks
require('linoleum-electron');
```

Defines:
- `webpack:electron` task which builds the permutations of `{main, renderer} x {production, test}` configurations for this project.
- `cover:electron` task which runs electron coverage tests.

## Common issues
### Electron

Electron tests need a similar setup to run under Travis:

```
before_script:
  - export DISPLAY=:99.0
  - sh -e /etc/init.d/xvfb start
  - sleep 3 # give xvfb some time to start
```

If not set this will generally result in a exit with error code 1 and no additional information.
