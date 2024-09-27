var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// env-ns:env
var require_env = __commonJS({
  "env-ns:env"(exports, module2) {
    module2.exports = { NODE_ENV: "local", TEST_VAR: "Test Env Variable", ESB_TEST_VAR: "Test Env Variable with prefix" };
  }
});

// src/index.js
var env = require_env();
console.log("node_env: " + env.NODE_ENV);
console.log("test: " + env.TEST_VAR);
console.log("esb_test: " + env.ESB_TEST_VAR);
console.log("all: " + JSON.stringify(env));
