// test-fetch.js
fetch("https://registry.npmjs.org/")
  .then((res) => res.text())
  .then(console.log)
  .catch(console.error);
