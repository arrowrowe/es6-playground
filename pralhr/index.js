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
    for (let ele of s1) { if (s2.has(ele)) ret.add(ele); }
    return ret;
  };
  _.intersection = (...args) => args.reduce(intersectionTwo);
  _.differenceSet = (s1, s2) => {
    let ret = new Set();
    for (let ele of s1) { if (!s2.has(ele)) ret.add(ele); }
    return ret;
  };

  _.first = arr => { for (let ele of arr) return ele; };

}

/*********************
 * Utility tests
 *********************/

{
  console.assert(true === _.all([1, 2, 3], x => x > 0), '`all` return true');
  console.assert(false === _.all([1, 2, 3], x => x > 1), '`all` return false');
  console.assert(2 === _.differenceSet(new Set([0, 1, 2, 3, 4]), new Set([2, 3, 4, 5])).size, '`differenceSet` works');
  console.assert(7 === _.first(new Set([7])), '`first` works');
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

  let Trans = function (su, pos, fnIn, fnOut) {
    this.fnIn = fnIn;
    this.fnOut = fnOut;
    this.data = mapAll(() => null);
    this.su = su;
    this.pos = pos;
    this.forEach = (fn) => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          let [iOut, jOut] = fnOut(i, j);
          fn(this.data[i][j], i, j, this.su[iOut, jOut], iOut, jOut);
        }
      }
    };
    this.forEach((xIn, iIn, jIn, xOut, iOut, jOut) => {
      this.data[iIn][jIn] = this.su[iOut][jOut];
    });
    this.think = () => this.forEach((xIn, iIn, jIn, xOut, iOut, jOut) => {
      if (this.pos[iOut][jOut] === null) {
        return;
      }
      this.pos[iOut][jOut] = _.differenceSet(this.pos[iOut][jOut], new Set(this.data[iIn]));
    });
  };

  // Detect if arr is an array with 9 elements satisfying fn
  let a9a = (arr, fn) => arr instanceof Array && arr.length === 9 && _.all(arr, fn);
  // Detect if su is an 9x9 matrix of one-digit integers
  pralhr.check = su => a9a(su, row => a9a(row, x => typeof x === 'number' && _.has(a09, x)));

  let simplify = (su, pos) => {
    let simplified = false;
    forAll((i, j) => {
      let p = pos[i][j];
      if (p !== null && p.size === 1) {
        su[i][j] = _.first(p);
        console.log('Found: (%d, %d) is %d.', i, j, su[i][j]);
        pos[i][j] = null;
        simplified = true;
      }
    });
    return simplified;
  };

  // Detect if the sudoku can still be processed
  let think = (su, pos, tSu, tUs, tKu) => {
    tSu.think();
    tUs.think();
    tKu.think();
    console.log(mapAll((i, j) => {
      if (su[i][j] > 0) {
        return 0;
      } else {
        return pos[i][j].size;
      }
    }));
    return simplify(su, pos);
  };

  let _solve = su => {
    // Possible values for each unknown
    let pos = mapAll((i, j) => su[i][j] === 0 ? new Set(a19) : null);
    // Rows
    let tSu = new Trans(su, pos, (i, j) => [i, j], (i, j) => [i, j]);
    // Columns
    let tUs = new Trans(su, pos, (i, j) => [j, i], (j, i) => [i, j]);
    // 3x3 squares
    let tKu = new Trans(
      su,
      pos,
      (i, j) => {
        let iMod = i % 3, iDiv = (i - iMod) / 3;
        let jMod = j % 3, jDiv = (j - jMod) / 3;
        return [iDiv * 3 + jDiv, iMod * 3 + jMod];
      },
      (u, v) => {
        let jDiv = u % 3, iDiv = (u - jDiv) / 3;
        let jMod = v % 3, iMod = (v - jMod) / 3;
        return [iDiv * 3 + iMod, jDiv * 3 + jMod];
      }
    );
    while (think(su, pos, tSu, tUs, tKu)) {}
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

