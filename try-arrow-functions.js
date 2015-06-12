{
    // Use anonymous lambda functions
    console.log([2, 3, 5, 7, 14].filter(x => x % 2 === 0).map(x => x / 2));
}

{
    // Name lambda functions
    let isEven = (x => x % 2 === 0),
        half = (x => x / 2);
    let halfEvens = [2, 3, 5, 7, 14].filter(isEven).map(half);
    console.log(halfEvens);
    // Declare complicated arrow functions
    halfEvens.forEach((value, key) => {
        console.log(key.toString() + ': ' + value.toString());
    });
}
