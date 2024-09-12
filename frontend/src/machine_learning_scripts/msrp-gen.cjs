const {spawn} = require('child_process');

export default function runPython(){
    const childPython = spawn('python', ['check.py',"sdf"]);

childPython.stdout.on('data', (data) =>{
    console.log(`stdout: ${data}`);
});
childPython.stderr.on('data', (data) =>{
    console.err(`stderr: ${data}`);
});
childPython.on('close', (code) =>{
    console.log(`child process exit with ${code}`);
});
}