const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const STATE = {
    SIMPLE: {},
    TRIM: {},
    COMPLEX: {}
};

STATE.SIMPLE.toString = function (){return 'simple';};
STATE.TRIM.toString = function (){return 'trim';};
STATE.COMPLEX.toString = function (){return 'complex';};

var globalCount = 0,
    globalState = STATE.SIMPLE,
    lines = [];

if( process.argv.indexOf('-i') !== -1 ){
    
    var data = "";
    
    rl.on('line', function(line) {
        if( line[0] !== '#' ){
            lines.push(line);
        }
    }).on('close', function (){
        lines.forEach(function (line){
            var result = compute(JSON.parse(line));
            console.log(`${line} -> ${result.toString()} \n  | after ${globalCount} function calls in state: ${globalState.toString()}.`);
        });
    });
}
else{
    var data = '[-3, 1, 2]';
    var result = compute(JSON.parse(data));
    console.log(`${data} -> ${result.toString()} \n  | after ${globalCount} function calls in state: ${globalState.toString()}.`);
}

function compute(input){
    globalCount = 0;
    if( computeSimple(input) ){
        return true;
    }
    else{
        return computeTree(trimOutliers(input));
    }
    
}

function computeSimple(input){
    globalState = STATE.SIMPLE;
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
    globalState = STATE.TRIM;
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

/**
* Improvements: 
*  - Pass sums by reference, trim as we recurse back up
*  - Pass input as reference as well?
* 
* Assumptions: Simple check and trim have already been performed
*/
function computeTree(input, sums){
    globalState = STATE.COMPLEX;
    globalCount++;
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
        //move the actual next child to the front of the array
        nextInput.splice(0,0,nextInput.splice(i-1,1)[0]);
        if( computeTree(nextInput, nextSums) ){
            return true;
        }
    }
    return false;
}