let getPromise = (isGood, message) => new Promise((resolve, reject) => {
    (isGood ? resolve : reject)(message);
});

getPromise(true, 0).then(response => {
    console.log(response);
    return 1;
}).then(response => {
    console.log(response);
});

getPromise(false, 2).catch(error => {
    console.log(error);
    // Error must be handled.
    return 3;
}).then(response => {
    console.log(response);
}, error => {
    // Dead code
});
