if (typeof setImmediate === 'undefined') {
  global.setImmediate = (callback, ...args) => {
    return setTimeout(callback, 0, ...args);
  };
}

if (typeof clearImmediate === 'undefined') {
  global.clearImmediate = (id) => {
    clearTimeout(id);
  };
}

// 其他可能需要的polyfills
if (typeof process === 'undefined') {
  global.process = {
    env: {
      NODE_ENV: 'development'
    }
  };
}