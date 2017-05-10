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

/*
* Improvements: Pass sums by reference, trim as we recurse back up
* Assumptions: Simple check and trim have already been performed
*/
function computeTree(input, sums){
    //next value is input[0]
    //add to all the sums and see if any are zero
    var nextSums = (sums || []).slice(0);
    var i;
    for( i=0; i<nextSums.length; i++ ){
        nextSums[i] += input[0];
        if( nextSums[i] === 0 ){
            return true;
        }
    }
    //add the new value to the sums
    nextSums.push(input[0]);
    //recurse onto all other possible children
    for( i=1; i<input.length; i++ ){
        var nextInput = input.slice(1);
        nextInput.splice(0,1,nextInput.splice(i-1,1)[0]);
        if( computeTree(nextInput, nextSums) ){
            return true;
        }
    }
    return false;
}