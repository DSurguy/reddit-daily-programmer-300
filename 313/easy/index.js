const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

/** 
 * Enum to provide some more readability when the simple check 
 * completes and returns a value.
 **/
const RESULT = {
    FAILURE: 0,
    SUCCESS: 1,
    INCONCLUSIVE: 2
};

var lines = [];

/** Capture input and start processing */
rl.on('line', function(line) {
    if( line[0] !== '#' ){
        lines.push(line);
    }
}).on('close', function (){
    var timer = process.hrtime();
    lines.forEach(function (line){
        var result = compute(JSON.parse(line));
        console.log(`${line} -> ${result.toString()}`);
    });
    var diffTime = process.hrtime(timer);
    console.log(`Completed in ${diffTime[0]}s${parseInt(diffTime[1]/1e6)}ms${parseInt((diffTime[1]%1e6)/1e3)}μs${parseInt(diffTime[1]%1e3)}ns`);
});

/** Run through all computation logic until complete **/
function compute(input){
    var simpleResult = computeSimple(input);
    if( simpleResult !== RESULT.INCONCLUSIVE ){
        return !!simpleResult;
    }
    else{
        return !!(computeSets(trimOutliers(input)));
    }
    
}

/**
 * Check to see if we satisfy the simple rules:
 *  - Simple complements: e.g. 5 & -5
 *  - Contains zero
 *  - All positive or all negative
 **/
function computeSimple(input){
    var hash = {
        pos: {},
        neg: {}
    },
        hasPos = false,
        hasNeg = false;
        
    for( var i=0; i<input.length; i++ ){
        if( input[i] === 0 ){
            return RESULT.SUCCESS;
        }
        
        var key = Math.abs(input[i]);
        if( input[i] < 0 ){
            hasNeg = true;
            if( hash.pos[key] ){
                return RESULT.SUCCESS;
            }
            else{
                hash.neg[key] = true;
            }
        }
        else{
            hasPos = true;
            if( hash.neg[key] ){
                return RESULT.SUCCESS;
            }
            else{
                hash.pos[key] = true;
            }
        }
    }
    if( !hasPos || !hasNeg ){
        return RESULT.FAILURE;
    }
    return RESULT.INCONCLUSIVE;
}

/**
 * If any values are so large that they cannot be 
 *  canceled out by any sum of opposite signed numbers, remove them.
 *  
 * e.g. a list contains [125, 9, -6, -8]. 125 is removed because 
 *  negatives can only ever sum to -14.
 **/
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

function computeSets(input){
    //compute all positive sums and negative sums
    var pos = {}, neg = {};
    input.forEach(function (inputValue){
        //select the correct hash
        var temp = (inputValue > 0 ? pos : neg);
        var absInput = Math.abs(inputValue);
        //add each new possible combination
        Object.keys(temp).map((v)=>{return parseInt(v,10)}).forEach(function (v){
            temp[v+absInput] = true;
        });
        //add this value by itself
        temp[absInput] = true;
    });
    
    //hash the longer list
    var long = pos.length < neg.length ? neg : pos;
    //now check every value in the shorter list to see if it's in the longer list
    return (pos.length < neg.length ? Object.keys(pos) : Object.keys(neg)).reduce(function (out,val){
        return out || !!(long[val]);
    },false);
}