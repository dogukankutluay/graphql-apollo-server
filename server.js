const express = require('express');
const { configureApollo } = require('./configApollo');
const app = express();

configureApollo(app)
  .then(res => console.log('a'))
  .catch(e => console.log(e));
app.listen(4000, () => {
  console.log(`****server started ****`);
});
