{
    // Default
    let inc = (x, delta = 1) => x + delta;
    console.log(inc(2));
    console.log(inc(3, 7));

    // Rest
    let sum = (...numbers) => numbers.reduce(inc);
    console.log(sum(2));
    console.log(sum(2, 4, 8, 9));

    let divide = (dividend, ...divisors) => {
        divisors.forEach(x => dividend /= x);
        return dividend;
    }
    console.log(divide(24, 3, 2));

    // Spread
    let sampleNumbers = [5, 7, 23];
    console.log(sum(...sampleNumbers));
    console.log(sum(1, ...sampleNumbers, 2));
}

{
    // Default value is evaluated from left to right every time the function is called
    let intro = (name, fav = {'sheep': 'grass', 'boy': 'code'}[name]) => {
        console.log(`Hey, ${name} likes ${fav}!`);
    };
    intro('sheep');
    intro('boy');
    intro('boy', 'you');
}

