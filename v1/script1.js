function fillSudokuGrid() {
    const table = document.querySelector('.sudoku-grid');
    const newGridButton = document.getElementById('new-grid-button');


    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = table.rows[row].cells[col];
            const cellValue = sudokuData[row][col];

            if (cellValue !== 0) {
                // Remplissz la cellule avec la valeur de sudokuData.
                cell.textContent = cellValue;
            } else {
                // Laisse les cases vides avec une valeur nulle.
                cell.textContent = '';
            }
        }
    }
}

// Fonction pour résoudre automatiquement la grille.
function solveSudoku() {
    const emptyCell = findEmptyCell();
    if (!emptyCell) {
        // Toutes les cases sont remplies, la grille est déjà résolue.
        isSolved = true;
        alert("La grille est déjà résolue !");
        return;
    }

    const [row, col] = emptyCell;

    // Vérifie si l'API a été appelée pour obtenir une nouvelle grille de Sudoku.
    if (!sudokuData) {
        alert("Veuillez d'abord cliquer sur 'Nouvelle Grille' pour obtenir une grille de Sudoku.");
        return;
    }

    for (let num = 1; num <= 9; num++) {
        if (isValidMove(row, col, num)) {
            // Essaye le chiffre num dans la case vide.
            sudokuData[row][col] = num;
            const cell = document.querySelector(".sudoku-grid").rows[row].cells[col];
            cell.textContent = num;

            // Si le chiffre num ne conduit pas à une solution, annule le mouvement.
            sudokuData[row][col] = 0;
            cell.textContent = "";
        }
    }
}

// fonction clic pour le bouton "Nouvelle Grille".
newGridButton.addEventListener('click', function () {
    // Appel à l'API pour récupérer une grille de Sudoku.
    fetch('http://31.33.247.37:3000/api/sudoku')
        .then(response => response.json())
        .then(data => {
            sudokuData = data; // Stocke les données de la grille dans sudokuData.
            isSolved = false; // Réinitialise l'état de la grille résolue.
            fillSudokuGrid(); // Remplis la grille avec les nouvelles données.
        })
        .catch(err => {
            console.log(err);
        });
});
