self.onmessage = function(event) {
    console.log('Received in worker:', event.data);
    // Do some heavy computation
    const result = heavyComputation();
    self.postMessage(result);
};

function heavyComputation() {
    // Simulate a time-consuming task
    let result = 0;
    for (let i = 0; i < 1000000000; i++) {
        result += i;
    }
    return result;
}