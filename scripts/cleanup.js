const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

let omit = [],
    dirs;

//notify beginning of script
console.log(colors.green('Starting cleanup of node_modules'));

//build list of omitted challenges (challenge numbers)
if( process.argv.indexOf('-o') !== -1 ){
    omit = process.argv.slice(process.argv.indexOf('-o')+1).reduce(function (o,v){
        o[parseInt(v)] = true;
        return o;
    }, {});
}

fs.readdir(path.resolve(), function (err, dirs){
    if( err ){
        throw err;
    }
    deleteDirectories(dirs, function (err){
        if( err ){
            throw err;
        }
        console.log(colors.green('Completed cleanup of node_modules!\n'));
    });
});

function deleteDirectories(dirs, cb){
    if( !dirs.length ){
        cb();
        return;
    }
    fs.stat(path.resolve(dirs[0]), function(err, stats){
        if( err ){
            cb(err);
            return;
        }
        
        if( stats.isDirectory() && !isNaN(parseInt(dirs[0])) && parseInt(dirs[0]) >= 300 && parseInt(dirs[0]) <= 399 ){
            
            var dirPath = path.resolve(dirs[0], '**', 'node_modules');
            if( !omit[parseInt(dirs[0])] ){
                console.log('deleting '+dirPath);
                rimraf(dirPath, function (err){
                    if( err ){
                        cb(err);
                        return;
                    }
                    
                    dirs.splice(0,1);
                    deleteDirectories(dirs,cb);
                });
            }
            else{
                console.log('omitting '+colors.cyan(dirPath));
                dirs.splice(0,1);
                deleteDirectories(dirs,cb);
            }
        }
        else{
            dirs.splice(0,1);
            deleteDirectories(dirs,cb);
        }
    });
}