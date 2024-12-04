getting started

```bash
# install dependencies
npm install

# compile typescript to javascript
npm run build

# run server
node ./dist/index.js
```

With bundling

```bash
# bundle
npm run bundle

# run server bundle
node ./dist/bundle.cjs
```

Package container

```bash
# build image
docker build -t todo-htmx:latest .

# run docker image
docker run -it -p 3000:3000 todo-htmx:latest
```
