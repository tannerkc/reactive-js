// In your main script (e.g., main.js)
const worker = new Worker('./workers/worker.ts');

worker.onmessage = function(event) {
    console.log('Received from worker:', event.data);
};

worker.postMessage('Start working');
