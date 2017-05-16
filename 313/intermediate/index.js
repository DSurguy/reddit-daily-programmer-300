const readline = require('readline');
const EOL = require('os').EOL;
const exec = require('child_process').exec;
const PgmImage = require('pgmImage.js');

var io = readline.createInterface({
    input: require('fs').createReadStream('313/intermediate/input/simple-input.tpgm'),
    output: process.stdout,
    terminal: false
});

var lines = [];
io.on('line', function (line){
    console.log(line);
    lines = lines.concat(line.split(/[\s\n\r]/g).filter(function (item){
        return !!(item.trim());
    }));
}).on('close', function (err){
    
    var image = new PgmImage(lines[0], lines[1], lines[2], lines[3], lines.slice(4));
    image.r();
    image.out(process.stdout, {
        group: 'w'
    })
    .then(function (){
        console.log('Output Complete!');
    })
    .catch(console.error);
});