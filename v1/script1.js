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

            // Récursivement, essayez de résoudre le reste de la grille.
            if (solveSudoku()) {
                return true;
            }

            // Si le chiffre num ne conduit pas à une solution, annulez le mouvement.
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