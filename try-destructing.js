{
    /*
     * This sample is copied from
     * [ES6 — destructuring](https://medium.com/ecmascript-2015/es6-destructuring-13ca399f993a);.
     */
    let mixed = {
        one: 1,
        two: 2,
        values: [3, 4, 5]
    };
    // Destructing the object and array!
    let {one: a, two: b, values: [c, , e]} = mixed;
    console.log(a, b, c, e);
}
