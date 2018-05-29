const compatData = require('mdn-browser-compat-data');
const Koa = require('koa');
const json = require('koa-json')

const app = new Koa();

app.use(json());
app.use(async ctx => {
  const path = ctx.request.path;

  if (path.includes('.')) {
    ctx.body = {};
    return;
  }

  const compatPath = path.replace('/', '').replace(/\//g, '.');
  ctx.body = get(compatData, compatPath);
});

const port = process.env.PORT || 3000;

console.log(`Listening on ${port}...`);
app.listen(port);

function get(object, path) {
  const pathParts = path.split('.');
  
  let pathThatGrows = object;
  
  for (let part of pathParts) {
    const value = pathThatGrows[part];
    
    if (!value) {
      return undefined;
    }
    pathThatGrows = pathThatGrows[part];
  }
  
  return pathThatGrows;
}
