// const jest = require('jest');
// import {Jest as jest} from "@jest/environment";
const fs = require('fs');
const SoccerRank = require('./soccer-rank');

jest.mock('fs');
let soccerRank;

beforeEach(() => {
	soccerRank = new SoccerRank();
	jest.clearAllMocks();
});

describe('validateArguments', () => {
	test('No output file specified', () => {
		let mockProcess = {argv: []};
		mockProcess.argv[2] = 'in';

		const terminateMock = jest.fn();
		soccerRank.terminate = terminateMock;
		soccerRank._validateArguments(mockProcess);
		expect(terminateMock).toHaveBeenCalledWith('- Usage: soccerrank <inputfile> <outputfile>\nOutput file path must be specified.');
	});

	test('No input file specified', () => {
		let mockProcess = {argv: []};
		mockProcess.argv[3] = 'out';

		const terminateMock = jest.fn();
		soccerRank.terminate = terminateMock;
		soccerRank._validateArguments(mockProcess);
		expect(terminateMock).toHaveBeenCalledWith('- Usage: soccerrank <inputfile> <outputfile>\nInput file path must be specified.');
	});

	test('Valid arguments', () => {
		let mockProcess = {argv: []};
		mockProcess.argv[2] = 'in';
		mockProcess.argv[3] = 'out';

		const terminateMock = jest.fn();
		fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);
		soccerRank.terminate = terminateMock;
		soccerRank._validateArguments(mockProcess);
		expect(terminateMock).toHaveBeenCalledTimes(0);
	});

});

describe('_readInputFile', () => {
	test('Correctly calls readFileSync', () => {
		soccerRank.inputFilename = 'test';
		soccerRank._readInputFile();
		expect(fs.readFileSync).toHaveBeenCalledWith('test','utf-8');
	});
});

describe('_processGamesData', () => {
	test('Correctly calls _processGameData for each line of data', () => {
		const _processGameDataMock = jest.fn();
		soccerRank._processGameData = _processGameDataMock;
		soccerRank._processGamesData('0\n1\n2\n3');
		expect(_processGameDataMock).toHaveBeenCalledTimes(4);
		for (let i=0; i<4; i++)
			expect(_processGameDataMock.mock.calls[i]).toEqual([i.toString()]);

	});
});

describe('_processGameData', () => {
	test('Correctly calls _updateRankings for first team win', () => {
		const _updateRankingsMock = jest.fn();
		soccerRank._updateRankings = _updateRankingsMock;
		soccerRank._processGameData('Team A 4, TeamB 2');
		expect(_updateRankingsMock).toHaveBeenCalledWith('Team A',3,'TeamB',0);
	});

	test('Correctly calls _updateRankings for second team win', () => {
		const _updateRankingsMock = jest.fn();
		soccerRank._updateRankings = _updateRankingsMock;
		soccerRank._processGameData('Team A 0, TeamB 5');
		expect(_updateRankingsMock).toHaveBeenCalledWith('Team A',0,'TeamB',3);
	});

	test('Correctly calls _updateRankings for tie', () => {
		const _updateRankingsMock = jest.fn();
		soccerRank._updateRankings = _updateRankingsMock;
		soccerRank._processGameData('Team A 2, TeamB 2');
		expect(_updateRankingsMock).toHaveBeenCalledWith('Team A',1,'TeamB',1);
	});
});

describe('_updateRankings', () => {
	test('Correctly updates rankings when _updateRankings is called', () => {
		soccerRank._updateRankings('a',3,'b',1);
		expect(soccerRank.rankings).toEqual({a:3,b:1});
		soccerRank._updateRankings('a',2,'c',1);
		expect(soccerRank.rankings).toEqual({a:5,b:1,c:1});
	});
});



describe('_sortTeams', () => {
	test('Correctly sorts rankings per team points descending and alphabetically ascending for tied teams by names', () => {
		soccerRank.rankings = {
			'aaa' : 0,
			'bbbb' : 5,
			'ccc' : 1,
			'abd' : 4,
			'abc' : 4,
			'ab' : 4,
			'zzzz' : 5,
			'mmm' : 6
		};
		let result = soccerRank._sortTeams();
		expect(result).toStrictEqual(['mmm',  'bbbb', 'zzzz', 'ab', 'abc',  'abd', 'ccc',  'aaa' ]);
	});

});

describe('_generateOutput', () => {
	test('Correctly generates the output format from sorted teams', () => {
		soccerRank.rankings = {
			'aaa' : 0,
			'bbbb' : 5,
			'ccc' : 1,
			'abd' : 4,
			'abc' : 4,
			'ab' : 4,
			'zzzz' : 5,
			'mmm' : 6
		};
		let sortedTeams = ['mmm',  'bbbb', 'zzzz', 'ab', 'abc',  'abd', 'ccc',  'aaa' ];
		let result = soccerRank._generateOutput(sortedTeams);
		expect(result).toBe('1. mmm, 6 pts\n2. bbbb, 5 pts\n2. zzzz, 5 pts\n4. ab, 4 pts\n4. abc, 4 pts\n4. abd, 4 pts\n7. ccc, 1 pt\n8. aaa, 0 pts\n');
	});
});


describe('_writeOutputFile', () => {
	test('Correctly calls writeFileSync to write file to disk', () => {
		soccerRank.outputFilename = 'test';
		soccerRank._writeOutputFile('testdata');
		expect(fs.writeFileSync).toHaveBeenCalledWith('test','testdata');
	});
});

describe('start', () => {
	test('Correctly calls the sequence of functions to complete task', () => {
		const _validateArgumentsMock = jest.fn();
		const _processGamesDataMock = jest.fn();
		const _readInputFileMock = jest.fn();
		const _writeOutputFileMock = jest.fn();
		const _generateOutputMock = jest.fn();
		const _sortTeamsMock = jest.fn();

		soccerRank._validateArguments = _validateArgumentsMock;
		soccerRank._processGamesData = _processGamesDataMock;
		soccerRank._readInputFile = _readInputFileMock;
		soccerRank._writeOutputFile = _writeOutputFileMock;
		soccerRank._generateOutput = _generateOutputMock;
		soccerRank._sortTeams = _sortTeamsMock;

		_readInputFileMock.mockReturnValue('test');
		_sortTeamsMock.mockReturnValue('sorted_test');
		_generateOutputMock.mockReturnValue('out_test');

		soccerRank.start();

		expect(_validateArgumentsMock).toHaveBeenCalledTimes(1);
		expect(_processGamesDataMock).toHaveBeenCalledTimes(1);
		expect(_readInputFileMock).toHaveBeenCalledTimes(1);
		expect(_writeOutputFileMock).toHaveBeenCalledTimes(1);
		expect(_generateOutputMock).toHaveBeenCalledTimes(1);
		expect(_sortTeamsMock).toHaveBeenCalledTimes(1);


		expect(_processGamesDataMock).toHaveBeenCalledWith('test');
		expect(_writeOutputFileMock).toHaveBeenCalledWith('out_test');
		expect(_generateOutputMock).toHaveBeenCalledWith('sorted_test');
	});
});
