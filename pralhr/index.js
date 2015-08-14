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

  _.has = (arr, ele) => arr.indexOf(ele) !== -1;

  let intersectionTwo = (s1, s2) => {
    let ret = new Set();
    for (let ele of s1) {
      if (s2.has(ele)) {
        ret.add(ele);
      }
    }
    return ret;
  };
  _.intersection = (...args) => args.reduce(intersectionTwo);
}

/*********************
 * Pralhr
 *********************/

let pralhr = {};

{
  let a18 = [1, 2, 3, 4, 5, 6, 7, 8];
  let a08 = [0].concat(a18);
  let a19 = a18.concat(9);
  let a09 = [0].concat(a19);

  let forAll = fn => {
    for (let i = 0; i < 9; i++)
      for (let j = 0; j < 9; j++)
        fn(i, j);
  };

  let mapAll = fn => {
    let arr = [];
    forAll((i, j) => {
      if (j === 0) {
        arr[i] = [fn(i, j)];
      } else {
        arr[i].push(fn(i, j));
      }
    });
    return arr;
  };

  // Detect if arr is an array with 9 elements satisfying fn
  let a9a = (arr, fn) => arr instanceof Array && arr.length === 9 && _.all(arr, fn);
  // Detect if su is an 9x9 matrix of one-digit integers
  pralhr.check = su => a9a(su, row => a9a(row, x => typeof x === 'number' && _.has(a09, x)));

  // Detect if the sudoku(su, us, ku, the same thing) can still be processed
  let think = (pos, su, us, ku) => {
    console.log('========= su =========');
    console.log(su);
    console.log('========= us =========');
    console.log(us);
    console.log('========= ku =========');
    console.log(ku);
    // Just return false to debug
    return false;
  };

  let _solve = su => {
    // Possible values for each unknown
    let pos = mapAll((i, j) => su[i][j] === 0 ? Array.from(a19) : null);
    // Columns
    let us = a08.map(j => su.map(row => row[j]));
    // 3x3 squares
    let ku = a08.map(kuIndex => {
      let jS = kuIndex % 3;
      let iS = (kuIndex - jS) / 3;
      iS *= 3;
      jS *= 3;
      return [
        su[iS    ][jS], su[iS    ][jS + 1], su[iS    ][jS + 2],
        su[iS + 1][jS], su[iS + 1][jS + 1], su[iS + 1][jS + 2],
        su[iS + 2][jS], su[iS + 2][jS + 1], su[iS + 2][jS + 2]
      ];
    });
    while (think(pos, su, us, ku)) {}
    return 'Debug';
  };
  pralhr.solve = (...args) => pralhr.check(...args) && _solve(...args);
}

/*********************
 * Tests
 *********************/

console.log(pralhr.solve([
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

