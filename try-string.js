{
    let x = 1,
        y = 2,
        tpl = `${x} + ${y} = ${x + y}`;     // Feel like PHP...
    console.log(tpl);
    x = 4;
    // Note that `tpl` IS STATIC!
    console.log(tpl);
}

{
    console.log(`We've got multi-line syntax as well.
                Though a bit strange...`);
    // Node do not have `String.raw` in the transpiled code by Babel.
    console.log(String.raw`And raw string without \n\r\t interpretion...`);
    // For other Unicode stuff, see
    // [ES6 — strings](https://github.com/arrowrowe/es6-playground).
}

{
    let chars = 'abc357';
    // Iterable!
    for (let char of chars) {
        console.log(char);
    }
    // Explode!
    console.log([...chars]);
}

/*
 * And we have
 *      repeat(n)
 *      startsWith(str, starts = 0)
 *      endsWith(str, ends = str.length)
 *      includes(str, starts = 0)
 * functions now...
 */

