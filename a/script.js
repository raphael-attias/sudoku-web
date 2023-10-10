document.addEventListener("DOMContentLoaded", function () {
    const sudokuBoard = document.getElementById("sudokuBoard");
    const newGridButton = document.getElementById("newGridButton");
    const checkButton = document.getElementById("checkButton");
    const message = document.getElementById("message");
    let sudokuGrid = []; // 2D array to store the Sudoku grid

    // Function to create an empty Sudoku board
    function createEmptyBoard() {
        sudokuBoard.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement("div");
                cell.classList.add("sudoku-cell");
                cell.dataset.row = i;
                cell.dataset.col = j;
                sudokuBoard.appendChild(cell);
            }
        }
    }

    // Function to fill the Sudoku board with values
    function fillSudokuBoard() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = sudokuBoard.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                if (sudokuGrid[i][j] !== 0) {
                    cell.textContent = sudokuGrid[i][j];
                    cell.classList.add("sudoku-cell-filled");
                    cell.classList.remove("sudoku-cell");
                } else {
                    cell.textContent = "";
                    cell.classList.remove("sudoku-cell-filled");
                    cell.classList.add("sudoku-cell");
                    cell.addEventListener("click", () => handleCellClick(i, j));
                }
            }
        }
    }

    // Function to fetch a new Sudoku grid from the API
async function fetchNewGrid() {
    try {
        const response = await fetch('http://31.33.247.37:3000/api/sudoku'); // Utilize your API URL here
        if (!response.ok) {
            throw new Error('Failed to fetch Sudoku grid');
        }
        const data = await response.json();
        sudokuGrid = data;
        createEmptyBoard();
        fillSudokuBoard();
        message.textContent = "";
    } catch (error) {
        console.error("Error fetching Sudoku grid:", error);
    }
}
    // Function to handle cell click
    function handleCellClick(row, col) {
        // Implement logic to allow users to fill in empty cells
    }

    // Function to check if the Sudoku grid is correct
    function checkSudoku() {
        // Implement Sudoku validation logic
        // If correct, display a message
        // Otherwise, display an error message
    }

    newGridButton.addEventListener("click", fetchNewGrid);
    checkButton.addEventListener("click", checkSudoku);
    fetchNewGrid(); // Fetch a new Sudoku grid when the page loads
});
// Function to handle cell click
function handleCellClick(row, col) {
    const cell = sudokuBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    
    // Check if the clicked cell is empty (not filled)
    if (!cell.classList.contains("sudoku-cell-filled")) {
        const value = prompt("Entrez un chiffre de 1 à 9 :");

        // Check if the entered value is a valid number between 1 and 9
        if (/^[1-9]$/.test(value)) {
            sudokuGrid[row][col] = parseInt(value, 10);
            cell.textContent = value;

            // Optionally, add a class to style user-filled cells differently
            cell.classList.add("user-filled-cell");
        } else {
            alert("Veuillez entrer un chiffre valide de 1 à 9.");
        }
    }
}

