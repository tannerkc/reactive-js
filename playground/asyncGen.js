async function* numberChannel() {
    for (let i = 0; i < 5; i++) {
        yield await new Promise(resolve => setTimeout(() => resolve(i), 1000));
    }
}

async function main() {
    for await (const num of numberChannel()) {
        console.log(num);
    }
}

main();