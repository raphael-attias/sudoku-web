// Déclarez les variables globales.
let sudokuData = null;
let isSolved = false;

// Séparez la logique de remplissage de la grille dans une fonction à part.
function fillSudokuGrid() {
    const table = document.querySelector('.sudoku-grid');

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = table.rows[row].cells[col];
            const cellValue = sudokuData[row][col];

            // Utilisez le texte vide au lieu de la valeur 0 pour les cases vides.
            cell.textContent = cellValue !== 0 ? cellValue : '';
        }
    }
}

// Écoutez les clics sur la grille pour permettre à l'utilisateur de remplir les cases vides.
const sudokuGrid = document.querySelector('.sudoku-grid');

sudokuGrid.addEventListener('click', function (e) {
    // Vérifiez si la case cliquée est vide et que la grille n'est pas résolue.
    if (!isSolved && e.target.classList.contains('initial-empty-cell')) {
        const row = e.target.parentElement.rowIndex;
        const col = e.target.cellIndex;

        // Assurez-vous que la case est vide avant de permettre la saisie.
        if (sudokuData[row][col] === 0) {
            const inputValue = prompt("Entrez un chiffre de 1 à 9 :", "");
            const number = parseInt(inputValue, 10);

            if (!isNaN(number) && number >= 1 && number <= 9) {
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
        return true;
    }

    const [row, col] = emptyCell;

    // Vérifie si l'API a été appelée pour obtenir une nouvelle grille de Sudoku.
    if (!sudokuData) {
        alert("Veuillez d'abord cliquer sur 'Nouvelle Grille' pour obtenir une grille de Sudoku.");
        return false;
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

// Écoutez les clics sur le bouton "Nouvelle Grille" pour charger une nouvelle grille.
const newGridButton = document.getElementById('new-grid-button');

newGridButton.addEventListener('click', function () {
    // Appel à l'API pour récupérer une grille de Sudoku.
    fetch('http://31.33.247.37:3000/api/sudoku')
        .then(response => response.json())
        .then(data => {
            sudokuData = data; // Stockez les données de la grille dans sudokuData.
            isSolved = false; // Réinitialisez l'état de la grille résolue.
            fillSudokuGrid(); // Remplissez la grille avec les nouvelles données.
            solveSudoku(); // Ajout de cet appel pour résoudre la grille automatiquement.
        })
        .catch(err => {
            console.log(err);
        });
});

// Écoutez les clics sur le bouton "Résoudre la Grille" pour résoudre la grille manuellement.
const solveButton = document.getElementById('solve-button');

solveButton.addEventListener('click', function () {
    if (isSolved) {
        alert("La grille est déjà résolue !");
    } else {
        if (!sudokuData) {
            alert("Veuillez d'abord cliquer sur 'Nouvelle Grille' pour obtenir une grille de Sudoku.");
        } else {
            solveSudoku(); // Appel à la fonction pour résoudre la grille.
        }
    }
});

// Écoutez les clics sur le bouton "Vérifier la Grille" pour vérifier la grille.
const verifyButton = document.getElementById('verify-button');

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

// Initialisez la grille avec des données initiales si nécessaire.
// Remplissez la grille avec les données initiales.
// fillSudokuGrid();
