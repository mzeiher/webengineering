# Prerequisites
1. installed nodejs (at least version 16)

# how to start
1. clone repository
1. execute `npm install` in this directory
1. build `npm run build`.
    1. for incremental build during development start in "watch mode" with `npm run build -- -w`. This way you just need to restart the server and you don't need to build manually.
1. run server with `DEBUG=1 node ./dist/app.js` (in linux/bash), close with `ctrl+x`

To debug just build your project and run "Launch Program" target in the built-in vs code debugger

If you change something you have to close the server, build it and reopen.
