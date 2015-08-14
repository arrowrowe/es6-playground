'use strict';

/*********************
 * Utility functions
 *********************/

let _ = {};

{
  let arrCheck = (arr, fn, selectEarly, retEarly, retLate) => {
    for (let ele of arr) {
      if (fn(ele) === selectEarly) return retEarly;
    }
    return retLate;
  };
  _.all = _.every = (arr, fn) => arrCheck(arr, fn, false, false, true);
  _.any = _.some = (arr, fn) => arrCheck(arr, fn, true, true, false);
  _.none = (arr, fn) => arrCheck(arr, fn, true, false, true);
}

/*********************
 * Pralhr
 *********************/

let pralhr = {};

{
  // Detect if arr is an array with 9 elements satisfying fn
  let a9a = (arr, fn) => arr instanceof Array && arr.length === 9 && _.all(arr, fn);
  // Detect if su is an 9x9 matrix of one-digit integers
  pralhr.check = su => a9a(su, line => a9a(line, x => typeof x === 'number' && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
}

/*********************
 * Tests
 *********************/

console.log(pralhr.check([
  [5, 0, 4, 6, 0, 0, 0, 0, 2],
  [2, 0, 1, 0, 3, 5, 0, 0, 9],
  [7, 6, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 2, 6, 4, 0, 0],
  [0, 0, 5, 0, 8, 0, 2, 0, 0],
  [0, 0, 8, 1, 4, 0, 0, 6, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 4],
  [8, 0, 0, 4, 5, 0, 9, 0, 7],
  [4, 0, 0, 0, 0, 1, 8, 0, 6]
]));

