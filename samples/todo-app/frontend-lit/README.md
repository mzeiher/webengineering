# Prerequisites
1. installed nodejs (at least version 16)

# how to start
1. clone repository
1. execute `npm install` in this directory
1. change `host` variable in `src/store.ts` to ip/port where the backend is running (probably `//127.0.0.1:3000` if you're not using docker/wsl2)
1. build and start server with `npm run start`. (to close webserver type `ctrl + c`)
1. navigate to `127.0.0.1:8081/dist` in you browser to start frontend
