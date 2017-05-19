const EOL = require('os').EOL;

function PgmImage(type, width, height, max, data){
    this.type = type;
    this.width = parseInt(width);
    this.height = parseInt(height);
    this.max = parseInt(max);
    this.data = data.map((v)=>{return parseInt(v)});
};

PgmImage.prototype.process = function (commands){
    var properCommands = commands.toLowerCase();
    for( var i=0; i<properCommands.length; i++ ){
        this[properCommands[i]]();
    }
};

/**
 * Rotate image 90 degrees clockwise
 * [1,2,3]    [7,4,1]
 * [4,5,6] -> [8,5,2]
 * [7,8,9]    [9,6,3]
 * 
 * [a,b]
 * [c,d] -> [e,c,a]
 * [e,f]    [f,d,b]
 * 
 **/
PgmImage.prototype.r = function (){
    var newData = [];
    for( var row=0; row<this.height; row++ ){
        for( var col=0; col<this.width; col++ ){
            newData[(col*this.height)+(this.height-1-row)] = this.data[col+row*this.width];
        }
    }
    this.data = newData;
    
    //width and height swap
    var preWidth = this.width;
    this.width = this.height;
    this.height = preWidth;
};

/**
 * Rotate image 90 degrees counter-clockwise
 * [3,6,9]    [1,2,3]
 * [2,5,8] <- [4,5,6]
 * [1,4,7]    [7,8,9]
 * 
 *            [a,b]
 * [b,d,f] <- [c,d]
 * [a,c,e]    [e,f]
 * 
 **/
PgmImage.prototype.l = function (){
    var newData = [];
    for( var row=0; row<this.height; row++ ){
        for( var col=0; col<this.width; col++ ){
            newData[(this.width-1-col)*this.height + row] = this.data[col+row*this.width];
        }
    }
    this.data = newData;
    
    //width and height swap
    var preWidth = this.width;
    this.width = this.height;
    this.height = preWidth;
};

/** Flip Horizontal
 *  
 *  [1,2,3]    [3,2,1]
 *  [4,5,6] -> [6,5,4]
 *  [7,8,9]    [9,8,7]
 * 
 */
PgmImage.prototype.h = function (){
    var newData = [];
    for( var row=0; row<this.height; row++ ){
        for( var col=0; col<this.width; col++ ){
            newData[row*this.width+(this.width-1-col)] = this.data[row*this.width+col];
        }
    }
    this.data = newData;
};

/** Flip Vertical
 *  
 *  [1,2,3]    [7,8,9]
 *  [4,5,6] -> [4,5,6]
 *  [7,8,9]    [1,2,3]
 * 
 */
PgmImage.prototype.v = function (){
    var newData = [];
    for( var row=0; row<this.height; row++ ){
        for( var col=0; col<this.width; col++ ){
            newData[(this.height-1-row)*this.width + col] = this.data[row*this.width+col];
        }
    }
    this.data = newData;
};

PgmImage.prototype.out = function (outStream, options){
    var opts = options || {
        group: false
    };
    return new Promise((resolve, reject) => {
        try{
            var outStr = `${this.type} ${this.width} ${this.height} ${this.max}${EOL}`;
            for( var i=0; i<this.data.length; ){
                if( opts.group === 'w' ){
                    outStr += this.data.slice(i,i+this.width).join(' ')+EOL;
                    i+= this.width;
                }
                else if( opts.group === 'h' ){
                    outStr += this.data.slice(i,i+this.height).join(' ')+EOL;
                    i+= this.height;
                }
                else{
                    outStr += this.data[i]+EOL;
                    i++;
                }
            }
            outStream.write(outStr, resolve);
        } catch (e){
            reject(e);
        }
    });
};

module.exports = PgmImage;