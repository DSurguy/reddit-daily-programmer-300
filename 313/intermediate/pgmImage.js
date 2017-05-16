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
 * 0->2 | (0,0)->(0,2)
 * 1->5 | (0,1)->(1,2)
 * 2->1 | (1,0)->()
 * 3->4 | (1,1)
 * 4->0 | (2,0)
 * 5->3 | (2,1)
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

PgmImage.prototype.out = function (outStream, options){
    var opts = options || {
        group: false
    };
    return new Promise((resolve, reject) => {
        try{
            outStream.write(`${this.type} ${this.width} ${this.height} ${this.max}${EOL}`);
            for( var i=0; i<this.data.length; ){
                if( opts.group === 'w' ){
                    outStream.write(this.data.slice(i,i+this.width).join(' ')+EOL);
                    i+= this.width;
                }
                else if( opts.group === 'h' ){
                    outStream.write(this.data.slice(i,i+this.height).join(' ')+EOL);
                    i+= this.height;
                }
                else{
                    outStream.write(this.data[i]+EOL);
                    i++;
                }
            }
            outStream.on('finish', resolve);
        } catch (e){
            reject(e);
        }
    });
};