var fs = require('fs');
var util = require('util');
const moment = require('moment')

const date = moment().format('DDMMYYYY')
var logFile = fs.createWriteStream(`./logs/errors-${date}.log`, { flags: 'a' });
// Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;
var current = new Date()

console.log = function () {
    logFile.write(util.format.apply(null, arguments) + ' ' + current.toUTCString() + '\n' + '*************' + '\n');
    logStdout.write(util.format.apply(null, arguments) + ' ' + current.toUTCString() + '\n' + '*************' + '\n');
}
console.error = console.log;
