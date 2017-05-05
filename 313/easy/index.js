if( process.argv.indexOf('-i') !== -1 ){
    
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
                if( data[0] !== '#' ){
                    process.stdout.write(data+' -> '+compute(JSON.parse(data)).toString()+'\n');
                }
                data = '';
            }
            data += lines.slice(-1)[0];
        }
    });
    
    stdin.on('end', function() {
        if( data[0] !== '#' ){
            process.stdout.write(data+' -> '+compute(JSON.parse(data)).toString()+'\n');
        }
    });
}
else{
    var data = '[-97162, -95761, -94672, -87254, -57207, -22163, -20207, -1753, 11646, 13652, 14572, 30580, 52502, 64282, 74896, 83730, 89889, 92200]';
    process.stdout.write(data+' -> '+compute(JSON.parse(data)).toString()+'\n');
}

function compute(input){
    if( computeSimple(input) ){
        return true;
    }
    else{
        return computeTree(trimOutliers(input));
    }
    
}

function computeSimple(input){
    var hash = {
        pos: {},
        neg: {}
    };
    for( var i=0; i<input.length; i++ ){
        if( input[i] === 0 ){
            return true;
        }
        
        var key = Math.abs(input[i]);
        if( input[i] < 0 ){
            if( hash.pos[key] ){
                return true;
            }
            else{
                hash.neg[key] = true;
            }
        }
        else{
            if( hash.neg[key] ){
                return true;
            }
            else{
                hash.pos[key] = true;
            }
        }
    }
    return false;
}

function trimOutliers(input){
    var totals = input.reduce(function (o, val){
        if( val < 0 ){ o.neg -= val; }
        else{ o.pos -= val; }
        return o;
    },{pos:0,neg:0});
    
    return input.sort(function (a,b){
        var absA = Math.abs(a), absB = Math.absB;
        if( absA > absB ){
            return -1;
        }
        else if( absB > absA ){
            return 1;
        }
        return 0;
    }).filter(function (val){
        if( val > 0 && totals.neg < val ){
            totals.pos += val;
            return false;
        }
        else if( val < 0 && totals.pos > val ){
            totals.neg += val;
            return false;
        }
        return true;
    });
}

function computeTree(input){
    //console.log('After Trim: ',input);
    return computeSubTree(input);
}

function computeSubTree(input, downSum){
    downSum = (downSum||0)+input[0];
    if( downSum == 0 ){
        return true;
    }
    var upSum = input[0];
    for( var i=1; i<input.length; i++ ){
        var childResult = (function (input, downSum){
            var inputClone = input.slice(1);
            var front = inputClone.splice(i-1,1);
            return computeSubTree(front.concat(inputClone), downSum);
        })(input, downSum);
        
        if( childResult === true ){
            return true;
        }
        else{
            upSum += childResult;
        }
    }
    if( upSum === 0 ){
        return true;
    }
    return upSum;
}