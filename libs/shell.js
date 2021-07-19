const { exec } = require('child_process');

exports.shell = function (shell, options={}){
    return new Promise((resolve)=>{
        exec(shell, {
            timeout: 40000,
            ...options,
        }, (err, stdout) => {
            if(err){
                throw err;
            }else{
                resolve(stdout);
            }
        })
    })
}

