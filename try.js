require('/usr/local/lib/node_modules/traceur/bin/traceur-runtime');

for (var i = 2, length = process.argv.length; i < length; i++) {
    require('./' + process.argv[i]);
}

