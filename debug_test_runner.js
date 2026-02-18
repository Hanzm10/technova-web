const { spawn } = require('child_process');
const fs = require('fs');

console.log('Starting test runner...');
const child = spawn('npx.cmd', ['jest', 'src/app/api/webhooks/clerk/__tests__/route.test.ts', '--no-color'], { shell: true });

const logStream = fs.createWriteStream('test_debug.log');

child.stdout.pipe(logStream);
child.stderr.pipe(logStream);

child.stdout.on('data', (data) => console.log(data.toString()));
child.stderr.on('data', (data) => console.error(data.toString()));

child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
