let sudokuData = null;
let isSolved = false;

function fillSudokuGrid() {
    const table = document.querySelector('.sudoku-grid');

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = table.rows[row].cells[col];
            const cellValue = sudokuData[row][col];

            if (cellValue !== 0) {
                // Remplissez la cellule avec la valeur de sudokuData.
                cell.textContent = cellValue;
            } else {
                // Laissez les cases vides avec une valeur nulle.
                cell.textContent = '';
            }
        }
    }
}

const sudokuGrid = document.querySelector('.sudoku-grid');

sudokuGrid.addEventListener('click', function (e) {
    // Vérifiez si la case cliquée est vide et que la grille n'est pas résolue.
    if (!isSolved && e.target.classList.contains('initial-empty-cell')) {
        const row = e.target.parentElement.rowIndex; // L'index de ligne de la case cliquée.
        const col = e.target.cellIndex; // L'index de colonne de la case cliquée.

        // Assurez-vous que la case est vide avant de permettre la saisie.
        if (sudokuData[row][col] === 0) {
            // Utilisez une boîte de dialogue pour permettre à l'utilisateur de saisir un chiffre.
            const inputValue = prompt("Entrez un chiffre de 1 à 9 :", "");
            const number = parseInt(inputValue, 10);

            // Assurez-vous que l'entrée est un chiffre valide de 1 à 9.
            if (!isNaN(number) && number >= 1 && number <= 9) {
                // Mettez à jour la grille avec le chiffre saisi.
                sudokuData[row][col] = number;
                e.target.textContent = number;
            } else {
                alert("Veuillez entrer un chiffre valide de 1 à 9.");
            }
        }
    }
});


// Fonction pour résoudre automatiquement la grille.
function solveSudoku() {
    const emptyCell = findEmptyCell();
    if (!emptyCell) {
        // Toutes les cases sont remplies, la grille est déjà résolue.
        isSolved = true;
        alert("La grille est déjà résolue !");
        return true; // Ajoutez un return true lorsque la grille est résolue.
    }

    const [row, col] = emptyCell;

    // Vérifie si l'API a été appelée pour obtenir une nouvelle grille de Sudoku.
    if (!sudokuData) {
        alert("Veuillez d'abord cliquer sur 'Nouvelle Grille' pour obtenir une grille de Sudoku.");
        return false; // Ajoutez un return false lorsque la grille n'est pas disponible.
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

    // Aucune solution trouvée pour cette cellule.
    return false;
}

const newGridButton = document.getElementById('new-grid-button');
const solveButton = document.getElementById('solve-button');
const verifyButton = document.getElementById('verify-button');

// fonction clic pour le bouton "Nouvelle Grille".
newGridButton.addEventListener('click', function () {
    // Appel à l'API pour récupérer une grille de Sudoku.
    fetch('http://31.33.247.37:3000/api/sudoku')
        .then(response => response.json())
        .then(data => {
            sudokuData = data; // Stockez les données de la grille dans sudokuData.
            isSolved = false; // Réinitialisez l'état de la grille résolue.
            fillSudokuGrid(); // Remplissez la grille avec les nouvelles données.
        })
        .catch(err => {
            console.log(err);
        });
});

// fonction clic pour le bouton "Résoudre la Grille".
solveButton.addEventListener('click', function () {
    if (isSolved) {
        alert("La grille est déjà résolue !");
    } else {
        if (!sudokuData) {
            alert("Veuillez d'abord cliquer sur 'Nouvelle Grille' pour obtenir une grille de Sudoku.");
        } else {
            solveSudoku();
        }
    }
});

// fonction clic pour le bouton "Vérifier la Grille".
verifyButton.addEventListener('click', function () {
    if (isSolved) {
        alert("La grille est déjà résolue !");
    } else {
        const isCorrect = checkSudoku(); // Mettez ici votre fonction de vérification.
        if (isCorrect) {
            alert("La grille est correcte !");
        } else {
            alert("La grille contient des erreurs.");
        }
    }
});

// Ajoutez ici votre fonction de vérification du Sudoku (checkSudoku).
function checkSudoku() {
    // À implémenter : vérifiez si la grille actuelle est correcte.
    // Renvoyez true si la grille est correcte, sinon renvoyez false.
    // Vous devrez comparer les valeurs dans sudokuData par rapport aux règles du Sudoku.
    // Cette fonction dépendra de la structure de données que vous utilisez pour sudokuData.
    // Vous pouvez utiliser la logique que j'ai fournie précédemment pour la vérification.
}
