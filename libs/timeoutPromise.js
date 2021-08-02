module.exports = (dalay) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, dalay);
  });
