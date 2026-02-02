const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.resolve(__dirname, 'server', 'index.js');
const server = spawn('node', [serverPath], { stdio: 'inherit', shell: true });

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});
