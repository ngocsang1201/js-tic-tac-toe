import {
	getCellElementAtIdx,
	getCellElementList,
	getCurrentTurnElement,
	getGameStatusElement,
	getReplayButtonElement,
} from './selectors.js';
import { CELL_VALUE, GAME_STATUS, TURN } from './constants.js';
import { checkGameStatus } from './utils.js';

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill('');

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

function toggleTurn() {
	currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

	const currentTurnElement = getCurrentTurnElement();
	if (currentTurnElement) {
		currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
		currentTurnElement.classList.add(currentTurn);
	}
}

function handleGameEnded(status) {
	isGameEnded = true;

	const gameStatus = getGameStatusElement();
	if (gameStatus) gameStatus.textContent = status;
}

function showReplayButton() {
	const replayButton = getReplayButtonElement();
	if (replayButton) replayButton.classList.add('show');
}

function highlightWinCells(winPositions) {
	if (!Array.isArray(winPositions) || winPositions.length !== 3) {
		throw new Error('highlightWinCells: Invalid win positions');
	}

	for (const position of winPositions) {
		const winCellElement = getCellElementAtIdx(position);
		winCellElement.classList.add('win');
	}
}

function handleCellElementClick(cell, index) {
	const isClicked = cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);
	if (isClicked || isGameEnded) return;

	cell.classList.add(currentTurn);

	const currentValue = currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;
	cellValues[index] = currentValue;

	toggleTurn();

	const game = checkGameStatus(cellValues);
	switch (game.status) {
		case GAME_STATUS.DRAW: {
			handleGameEnded(game.status);
			showReplayButton();
			break;
		}

		case GAME_STATUS.X_WIN:
		case GAME_STATUS.O_WIN: {
			handleGameEnded(game.status);
			showReplayButton();
			highlightWinCells(game.winPositions);
			break;
		}

		default:
		// playing
	}
}

function initCellElementList() {
	const cellElementList = getCellElementList();

	cellElementList.forEach((cell, index) => {
		cell.addEventListener('click', () => {
			handleCellElementClick(cell, index);
		});
	});
}

(() => {
	initCellElementList();
})();
