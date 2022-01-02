import { getCellElementList, getCurrentTurnElement } from './selectors.js';
import { TURN } from './constants.js';

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

function handleCellElementClick(cell, index) {
	const isClicked = cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);
	if (isClicked) return;

	cell.classList.add(currentTurn);

	toggleTurn();
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
