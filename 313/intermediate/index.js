const readline = require('readline');

var io = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

var lines = [];

io.on('line', function (line){
    lines = lines.concat(line.split(/[\s\n\r]/g).filter(function (item){
        return !!(item.trim());
    }));
}).on('close', function (err){
    console.log(new pgmImage(lines[0], lines[1], lines[2], lines[3], lines.slice(4)));
});

function pgmImage(type, width, height, max, data){
    this.type = type;
    this.width = width;
    this.height = height;
    this.max = max;
    this.data = data;
};