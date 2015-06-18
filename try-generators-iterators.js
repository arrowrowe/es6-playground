// Just don't know how to write a iterator sample...
// Let's enjoy generators...

let fib = function* (n = 10) {
    let a = 1, b = 1;
    yield a;
    yield b;
    for (n -= 2; n > 0; n--) {
        [a, b] = [b, a + b];
        yield b;
    }
};

for (let x of fib()) {
    console.log(x);
}

