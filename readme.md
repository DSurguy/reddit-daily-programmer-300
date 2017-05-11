# reddit-daily-programmer-300
Solutions to https://www.reddit.com/r/dailyprogrammer challenges, starting at 300

# Scripts
## `npm run clean [-- [-o challenges...] ]`

This script will delete the node_modules dir from any subdirectory under challenge numbers that are not specifically omitted.

### Options

##### `[-o challenges...]`

###### Description
Omit the listed challenge directories from deletion. Ususally used to omit the current WIP.

###### Sample Usage
Removes node_modules from all challenge folders except 313 and 314: `npm run clean -- -o 313 314` 