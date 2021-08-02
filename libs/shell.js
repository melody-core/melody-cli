const { exec } = require("child_process");

exports.shell = function (shell, options = {}) {
  return new Promise((resolve, reject) => {
    exec(
      shell,
      {
        timeout: 40000,
        ...options,
      },
      (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      }
    );
  });
};
