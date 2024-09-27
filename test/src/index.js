const env = require('env');

console.log('node_env: ' + env.NODE_ENV);
console.log('test: ' + env.TEST_VAR);
console.log('esb_test: ' + env.ESB_TEST_VAR);
console.log('all: ' + JSON.stringify(env));
