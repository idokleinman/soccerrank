const fs = require('fs');

class SoccerRank {
	constructor() {
		this.rankings = {};
		this.inputFilename = null;
		this.outputFilename = null;
	}

	terminate(message) {
		console.error(message);
		process.exit(-1);
	}

	start() {
		this._validateArguments(process);
		console.log('Processing games rankings...');
		this._processGamesData(this._readInputFile());
		this._writeOutputFile(this._generateOutput(this._sortTeams()));
		console.log('Done.');
	}

	_validateArguments(process) {
		let inputPath = process.argv[2];
		let outputPath = process.argv[3];
		if (!outputPath) {
			this.terminate('- Usage: soccerrank <inputfile> <outputfile>\nOutput file path must be specified.');
		}
		if (!inputPath) {
			this.terminate('- Usage: soccerrank <inputfile> <outputfile>\nInput file path must be specified.');
		} else {
			if (!fs.existsSync(inputPath)) {
				this.terminate('Input file specified does not exist');
			}
		}
		if (fs.existsSync(outputPath)) {
			console.warn('Output file already exists - it will be overwritten.')
		}
		this.inputFilename = inputPath;
		this.outputFilename = outputPath;
	}

	_readInputFile() {
		// TODO: improvement - read & process file line by line, in order to not load entire file to memory
		return fs.readFileSync(this.inputFilename, 'utf-8');
	}

	_processGameData(gameData) {
		// break each line data into its components
		let teamsData = gameData.split(', ');
		let firstTeamData = teamsData[0].split(' ');
		let secondTeamData = teamsData[1].split(' ');
		// team score is the last array item after splitting string by whitespace
		let firstTeamScore = firstTeamData[firstTeamData.length-1];
		// team name is the rest of the string, minus the score - this is a gotcha, as team name might contain spaces
		let firstTeamName = teamsData[0].substring(0,teamsData[0].length-firstTeamScore.length-1);
		// and same deal for the second team
		let secondTeamScore = secondTeamData[secondTeamData.length-1];
		let secondTeamName = teamsData[1].substring(0,teamsData[1].length-secondTeamScore.length-1);

		// calculate points
		let firstTeamPoints = 0, secondTeamPoints = 0;
		if (firstTeamScore > secondTeamScore) {
			// first team won
			firstTeamPoints = 3;
		} else if (secondTeamScore > firstTeamScore) {
			// second team won
			secondTeamPoints = 3;
		} else {
			// tie
			firstTeamPoints = 1;
			secondTeamPoints = 1;
		}
		// update the rankings
		this._updateRankings(firstTeamName, firstTeamPoints, secondTeamName, secondTeamPoints);
	}

	_processGamesData(data) {
		// process lines
		let games = data.split('\n');
		for (let game of games) {
			this._processGameData(game);
		}
	}

	_updateRankings(firstTeamName, firstTeamPoints, secondTeamName, secondTeamPoints) {
		this.rankings[firstTeamName] ? this.rankings[firstTeamName] += firstTeamPoints : this.rankings[firstTeamName] = firstTeamPoints;
		this.rankings[secondTeamName] ? this.rankings[secondTeamName] += secondTeamPoints : this.rankings[secondTeamName] = secondTeamPoints;
	}

	_sortTeams() {
		return Object.keys(this.rankings).sort((first, second) => this.rankings[first] === this.rankings[second] ? (first > second ? 1 : -1) : this.rankings[second] - this.rankings[first]);
	}

	_generateOutput(sortedTeams) {
		let order, lastPts = -1;
		let output = '';
		for (let i=0; i<sortedTeams.length; i++) {
			let pts = this.rankings[sortedTeams[i]];
			if (pts !== lastPts) {
				order = i+1;
			}
			let line = `${order}. ${sortedTeams[i]}, ${pts} pt`;
			line += (pts !== 1) ? 's\n' : '\n';
			lastPts = pts;

			output += line;
		}
		return output;
	}

	_writeOutputFile(data) {
		fs.writeFileSync(this.outputFilename, data);
	}
}

module.exports = SoccerRank;

