var stdin = process.openStdin();

var data = "";

stdin.on('data', function(chunk) {
    var lines = chunk.toString().split(/[\r\n]+/g);
    
    if( lines.length == 1 ){
        data += chunk;
    }
    else{
        for( var i=0; i<lines.length-1; i++ ){
            data += lines[i];
            process.stdout.write(data+' -> '+compute(JSON.parse(data)).toString()+'\n');
            data = '';
        }
        data += lines.slice(-1)[0];
    }
});

stdin.on('end', function() {
    process.stdout.write(data+' -> '+compute(JSON.parse(data)).toString()+'\n');
});

function compute(input){
    var hash = {};
    for( var i=0; i<input.length; i++ ){
        var key = Math.abs(input[i]);
        hash[key] = (hash[key]||0) + 1;
        if( hash[key] == 2 ){
            return true;
        }
    }
    return false;
}