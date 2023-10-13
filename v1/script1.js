// Déclaration des variables globales.
let sudokuData = null;
let isSolved = false;

// Fonction pour remplir la grille Sudoku.
function fillSudokuGrid() {
    const table = document.querySelector('.sudoku-grid');

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = table.rows[row].cells[col];
            const cellValue = sudokuData[row][col];

            // Utilise le texte vide au lieu de la valeur 0 pour les cases vides.
            cell.textContent = cellValue !== 0 ? cellValue : '';
        }
    }
}

// Gestionnaire d'événement pour les clics sur la grille.
const sudokuGrid = document.querySelector('.sudoku-grid');

sudokuGrid.addEventListener('click', function (e) {
    // Si la case cliquée est vide et que la grille n'est pas résolue.
    if (!isSolved && e.target.classList.contains('initial-empty-cell')) {
        const row = e.target.parentElement.rowIndex;
        const col = e.target.cellIndex;

        // La case est vide avant de permettre la saisie.
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
            const cell = sudokuGrid.rows[row].cells[col];
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

// Gestionnaire d'événement pour le bouton "Nouvelle Grille".
const newGridButton = document.getElementById('new-grid-button');

newGridButton.addEventListener('click', function () {
    // Appel à l'API pour récupérer une grille de Sudoku.
    fetch('http://31.33.247.37:3000/api/sudoku')
        .then(response => response.json())
        .then(data => {
            sudokuData = data; // Stocke les données de la grille dans sudokuData.
            isSolved = false; // Réinitialise l'état de la grille résolue.
            fillSudokuGrid(); // Remplisse la grille avec les nouvelles données.
            solveSudoku(); // Ajout de cet appel pour résoudre la grille automatiquement.
        })
        .catch(err => {
            console.log(err);
        });
});

// Gestionnaire d'événement pour le bouton "Résoudre la Grille".
const solveButton = document.getElementById('solve-button');

solveButton.addEventListener('click', async function () {
    if (isSolved) {
        alert("La grille est déjà résolue !");
    } else {
        if (!sudokuData) {
            alert("Veuillez d'abord cliquer sur 'Nouvelle Grille' pour obtenir une grille de Sudoku.");
        } else {
            //active le bouton "Résoudre la Grille" pendant la résolution.
            solveButton.disabled = false;

            // Appel à la fonction pour résoudre la grille de manière asynchrone.
            await solveSudoku();

            // Réactive le bouton après la résolution.
            solveButton.disabled = false;
        }
    }
});

// Fonction pour résoudre automatiquement la grille de manière asynchrone.
async function solveSudoku() {
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
            // Essayez le chiffre num dans la case vide.
            sudokuData[row][col] = num;
            const cell = sudokuGrid.rows[row].cells[col];
            cell.textContent = num;

            // Utilisez setTimeout pour donner à l'interface utilisateur une chance de se mettre à jour.
            await new Promise(resolve => setTimeout(resolve, 0));

            // Récursivement, essayez de résoudre le reste de la grille.
            if (await solveSudoku()) {
                return true;
            }

            // Si le chiffre num ne conduit pas à une solution, annulez le mouvement.
            sudokuData[row][col] = 0;
            cell.textContent = "";

            // Utilisez setTimeout pour donner à l'interface utilisateur une chance de se mettre à jour.
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }

    // Aucune solution trouvée pour cette cellule.
    return false;
}

// Gestionnaire d'événement pour le bouton "Vérifier la Grille".
const verifyButton = document.getElementById('verify-button');

verifyButton.addEventListener('click', function () {
    if (isSolved) {
        alert("La grille est déjà résolue !");
    } else {
        const isCorrect = checkSudoku(sudokuData);
        if (isCorrect) {
            alert("La grille est correcte !");
        } else {
            alert("La grille contient des erreurs.");
        }
    }
});

// Fonction pour trouver une case vide.
function findEmptyCell() {
    // fonction pour trouver et retourner les coordonnées de la première case vide.
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuData[row][col] === 0) {
                return [row, col];
            }
        }
    }
    return null; // Aucune case vide n'a été trouvée.
}


