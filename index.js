var fs = require('fs');
var os = require('os');
const convertTime = require('microseconds');
const crypto = require('crypto');
const dns = require('dns');

const moment = require('moment/moment');

//internal functions
function fibonacci(n){
    if(n < 1){return 0;}
    else if(n == 1 || n == 2){return 1;}
    else if(n > 2){return fibonacci(n - 1) + fibonacci(n-2);}
}

function add (id) {
    const res = id / 8;
    const arr = []
    arr.length = res;
    for (let i = 0; i < res; i++) {
        arr[i] = i;
    }
    return arr;
  };

let objects = [];

//functions
exports.cpu = function(cycles) {
    fibonacci(cycles);
    return({ 
        cpu_user: convertTime.parse(process.cpuUsage().user), //return the system and user cpu time in microseconds
        cpu_system: convertTime.parse(process.cpuUsage().system),
        cpu_raw: process.cpuUsage(),
        load_average: os.loadavg()
    });
};

exports.memory = function(bytes) {
    let megabytes = bytes * 1024;
    const memory = add(megabytes);
    objects.push(memory);
    var currentMemory = process.memoryUsage();
    return( {
        rss: `${Math.round(currentMemory['rss'] / 1024 / 1024 * 100) / 100} MB`, //Resident set size (RSS) is the portion of memory occupied by a process that is held in main memory (RAM)
        heapTotal:`${Math.round(currentMemory['heapTotal'] / 1024 / 1024 * 100) / 100} MB`, //Total Size of the Heap
        heapUsed:`${Math.round(currentMemory['heapUsed'] / 1024 / 1024 * 100) / 100} MB`, //Heap actually Used
        external:`${Math.round(currentMemory['external'] / 1024 / 1024 * 100) / 100} MB`,
        memory_raw: process.memoryUsage()
    });
};

//IO intensive
exports.crypto = function(secret) {
    const { salt } = "Superman";
    const encryptHash = crypto.pbkdf2Sync(secret, salt, 10000, 512, 'sha512');
    return encryptHash.toString('hex');
}

//https://nodejs.org/en/docs/guides/dont-block-the-event-loop/
exports.jsonblock = function(cycles){
    var result = [];
    var obj = { a: 1 };
    var niter = cycles;

    var before, str, pos, res, took;

    for (var i = 0; i < niter; i++) {
        obj = { obj1: obj, obj2: obj }; // Doubles in size each iter
    }

    before = process.hrtime();
    str = JSON.stringify(obj);
    took = process.hrtime(before);
    result.push('JSON.stringify took ' + took);

    before = process.hrtime();
    pos = str.indexOf('nomatch');
    took = process.hrtime(before);
    result.push('Pure indexof took ' + took);

    before = process.hrtime();
    res = JSON.parse(str);
    took = process.hrtime(before);
    result.push('JSON.parse took ' + took);

    return result;
}

exports.kill = function(){
    process.exit(0);
}

exports.createFiles = function(extension, sizeInMb, numFiles){
    var result = [];
    var filePath = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + `.${extension}`;
    for (i = 0; i < numFiles.length; i++) { 
        fs.writeFile(filePath, Buffer.alloc(1024*1024*sizeInMb), (err) => {  
            if (err) throw err;
            result.push('File ['+ i +'] with' + sizeInMb + ' MegaBytes !');
        });
    }
    return result;
}

exports.dnsLookup = function(address,cycles){
    var result = [];

    let i = 0;
    for (i; i < cycles; i++) { 
        dns.lookup(address, (err, value) => {
            if(err) throw err;
            result.push({ cycle: i, ip: value, ms: moment().millisecond()});
        });
    }

    return result;
}