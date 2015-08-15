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

  let Trans = function (su, pos, fnIn, fnOut, name) {
    let data = mapAll(() => null);
    let hold;
    let forEach = (fn) => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          let [iOut, jOut] = fnOut(i, j);
          fn(data[i][j], i, j, su[iOut][jOut], iOut, jOut);
        }
      }
    };
    this.load = () => {
      forEach((xIn, iIn, jIn, xOut, iOut, jOut) => {
        data[iIn][jIn] = su[iOut][jOut];
      });
      forEach((xIn, iIn, jIn, xOut, iOut, jOut) => {
        if (pos[iOut][jOut] === null) {
          return;
        }
        pos[iOut][jOut] = _.differenceSet(pos[iOut][jOut], new Set(data[iIn]));
      });
    };
    this.loop = () => {
      hold = mapAll(() => []);
      forEach((xIn, iIn, jIn, xOut, iOut, jOut) => {
        if (pos[iOut][jOut] === null) {
          return;
        }
        for (let maybe of pos[iOut][jOut]) {
          hold[iIn][maybe - 1].push(jIn);
        }
      });
    };
    let fill = (i, j, x) => {
      console.log('    (%d, %d) = %d    // %s', i + 1, j + 1, x, name);
      su[i][j] = x;
      pos[i][j] = null;
      su.got++;
      su.left--;
    };
    this.think = () => {
      let simplified = false;
      forEach((xIn, iIn, jIn, xOut, iOut, jOut) => {
        if (pos[iOut][jOut] === null) {
          return;
        }
        let p = pos[iOut][jOut];
        if (p.size === 1) {
          fill(iOut, jOut, _.first(p));
          simplified = true;
          return;
        }
        for (let x of p) {
          if (hold[iIn][x - 1].length === 1 && hold[iIn][x - 1][0] === jIn) {
            fill(iOut, jOut, x);
            simplified = true;
            return;
          }
        }
      });
      return simplified;
    };
    this.load();
  };

  // Detect if arr is an array with 9 elements satisfying fn
  let a9a = (arr, fn) => arr instanceof Array && arr.length === 9 && _.all(arr, fn);
  // Detect if su is an 9x9 matrix of one-digit integers
  pralhr.check = su => a9a(su, row => a9a(row, x => typeof x === 'number' && _.has(a09, x)));

  // Detect if the sudoku can still be processed
  let think = (su, pos, tSu, tUs, tKu) => {
    if (tSu.think() || tUs.think() || tKu.think()) {
      tSu.load(); tUs.load(); tKu.load();
      tSu.loop(); tUs.loop(); tKu.loop();
      return true;
    } else {
      return false;
    }
  };

  let _solve = su => {
    // Possible values for each unknown
    su.beginKnown = 0;
    su.left = 0;
    su.got = 0;
    let pos = mapAll((i, j) => su[i][j] === 0 ? (su.left++, new Set(a19)) : (su.beginKnown++, null));
    // Rows
    let tSu = new Trans(su, pos, (i, j) => [i, j], (i, j) => [i, j], 'Row');
    // Columns
    let tUs = new Trans(su, pos, (i, j) => [j, i], (j, i) => [i, j], 'Column');
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
      },
      'Square'
    );
    tSu.loop(); tUs.loop(); tKu.loop();
    while (think(su, pos, tSu, tUs, tKu)) {}
    return su;
  };
  pralhr.solve = (...args) => pralhr.check(...args) && _solve(...args);
}

/*********************
 * Tests
 *********************/

{
  [
    [
      [5, 0, 4, 6, 0, 0, 0, 0, 2],
      [2, 0, 1, 0, 3, 5, 0, 0, 9],
      [7, 6, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 2, 6, 4, 0, 0],
      [0, 0, 5, 0, 8, 0, 2, 0, 0],
      [0, 0, 8, 1, 4, 0, 0, 6, 0],
      [0, 0, 0, 0, 0, 0, 0, 2, 4],
      [8, 0, 0, 4, 5, 0, 9, 0, 7],
      [4, 0, 0, 0, 0, 1, 8, 0, 6]
    ],
    [
      [3, 0, 0, 6, 0, 0, 0, 8, 0],
      [9, 8, 7, 0, 1, 4, 0, 0, 0],
      [2, 0, 0, 0, 3, 0, 1, 0, 0],
      [0, 7, 0, 0, 0, 6, 5, 0, 0],
      [5, 0, 0, 4, 0, 9, 0, 0, 6],
      [0, 0, 9, 3, 0, 0, 0, 2, 0],
      [0, 0, 8, 0, 4, 0, 0, 0, 5],
      [0, 0, 0, 7, 6, 0, 9, 1, 8],
      [0, 5, 0, 0, 0, 3, 0, 0, 2]
    ],
    [
      [0, 0, 5, 0, 2, 8, 0, 1, 0],
      [3, 0, 0, 1, 0, 7, 0, 0, 0],
      [0, 1, 0, 0, 9, 0, 8, 0, 0],
      [0, 0, 0, 6, 5, 0, 2, 4, 1],
      [0, 0, 4, 7, 0, 2, 9, 0, 0],
      [1, 6, 2, 0, 8, 4, 0, 0, 0],
      [0, 0, 8, 0, 6, 0, 0, 9, 0],
      [0, 0, 0, 2, 0, 9, 0, 0, 7],
      [0, 9, 0, 8, 7, 0, 6, 0, 0]
    ],
    [
      [0, 0, 1, 0, 0, 0, 0, 9, 3],
      [2, 9, 7, 6, 8, 0, 4, 0, 5],
      [0, 0, 0, 0, 0, 4, 0, 7, 0],
      [0, 0, 0, 5, 4, 0, 0, 8, 0],
      [0, 0, 0, 3, 9, 8, 0, 0, 0],
      [0, 3, 0, 0, 2, 6, 0, 0, 0],
      [0, 1, 0, 4, 0, 0, 0, 0, 0],
      [9, 0, 3, 0, 6, 5, 1, 4, 7],
      [5, 6, 0, 0, 0, 0, 9, 0, 0]
    ],
    [
      [4, 0, 0, 0, 0, 7, 0, 0, 0],
      [0, 7, 2, 5, 3, 0, 9, 0, 0],
      [0, 0, 1, 8, 0, 9, 0, 0, 0],
      [1, 0, 9, 0, 0, 2, 8, 0, 3],
      [0, 3, 0, 0, 0, 0, 0, 4, 0],
      [5, 0, 4, 3, 0, 0, 1, 0, 9],
      [0, 0, 0, 7, 0, 3, 5, 0, 0],
      [0, 0, 7, 0, 4, 5, 3, 6, 0],
      [0, 0, 0, 6, 0, 0, 0, 0, 4]
    ],
    [
      [0, 7, 0, 9, 0, 4, 0, 6, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0],
      [5, 3, 0, 0, 1, 2, 9, 0, 0],
      [8, 0, 0, 1, 0, 0, 6, 0, 4],
      [0, 4, 0, 8, 0, 5, 0, 7, 0],
      [3, 0, 9, 0, 0, 6, 0, 0, 8],
      [0, 0, 3, 2, 6, 0, 0, 8, 5],
      [0, 0, 2, 0, 0, 0, 0, 0, 0],
      [0, 8, 0, 3, 0, 1, 0, 2, 0]
    ],
    [
      [0, 3, 2, 9, 0, 0, 0, 6, 0],
      [0, 9, 0, 0, 0, 4, 0, 2, 1],
      [8, 0, 0, 0, 0, 6, 9, 0, 3],
      [3, 0, 6, 0, 0, 7, 0, 0, 0],
      [0, 0, 0, 6, 9, 8, 0, 0, 0],
      [0, 0, 0, 4, 0, 0, 6, 0, 7],
      [4, 0, 8, 7, 0, 0, 0, 0, 6],
      [1, 6, 0, 8, 0, 0, 0, 5, 0],
      [0, 7, 0, 0, 0, 3, 4, 1, 0]
    ]
  ].map(su => {
    pralhr.solve(su);
    console.log(su);
    console.assert(0 === su.left);
  });
}

