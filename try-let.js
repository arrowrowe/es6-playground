/*
try {
    for (let prime of [2, 3, 5, 7]) {
        console.log(prime);
    }
    console.log('Last prime:', prime);
} catch (err) {
    console.log('Run into error', err);
}
 */

/*
 * It is very strange...
 * In the code above, the try-catch is necessary.
 * Remove line 2, 7, 8, 9, error occurs.
 * However, the code following is correct as well!
 */

{
    for (let prime of [2, 3, 5, 7]) {
        console.log(prime);
    }
    console.log('Last prime:', prime);
}

