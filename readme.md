# SoccerRank

![Soccer ball](https://www.stockillustrations.com/Image.aspx?src=medres&name=BIGR1007.jpg&sz=100)

Command line tool to calculate soccer game rankings from text files 

## Usage

soccerrank inputfile outputfile

Input file must contain one or more lines with the following format:
> Team one 3, Team two 2<br/>

Where 3,2 represent teams game scores respectively
Notice that `outputfile` will be overwritten if it exists. 
  
  
## Installation

1. Make sure you have [node](https://nodejs.org/en/) v12 (and up) and [npm](https://www.npmjs.com/get-npm) v6 (and up) installed on your machine.
1. Clone repo into folder
1. Run `npm install` to install dependencies 
1. Run `npm install -g .` to install the soccerrank CLI tool globally (optional)
1. Run `soccerrank sample-input.txt outfile.txt`. Alternatively you can run `node index.js sample-input.txt outfile.txt` if you do not wish to install soccerrank globally (skip step 4)
 
## Testing 

Run `npm test` - Jest is used to unit test code and provide code coverage report. 

## Time spent

- ~35 mins for main code
- ~1:30 hrs for writing tests
- ~15 mins to set up tooling, package.json, Jest, git, etc, documentation  

## Potential improvements

- Code currently loads entire inputfile to memory before processing, if file is big this can cause high memory usage. Potential improvement is to process inputfile line by line.
- Same for output - write output file line by line to once sorted results were generated (although gain is marginal since we must hold rankings in memory anyways).
- Split code into additional classes, for example - business logic / file handler class. Since use case is rather simple and file operations are straightforward one liners it didn't make much sense at this time.
- Input validity checking.
- Prompt user on output file overwrite
- _Comment: I've used Jest testing for the first time here for the sake of learning something new. My previous experience was with Chai and Sinon._ 
   