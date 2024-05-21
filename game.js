import readline from 'readline';
import chalk from 'chalk';

// Display game instructions
function displayInstructions() {
    console.log(chalk.green('Welcome to the Terminal Minesweeper Game!'));
    console.log(chalk.green('Controls:'));
    console.log(chalk.green('w - move up'));
    console.log(chalk.green('s - move down'));
    console.log(chalk.green('a - move left'));
    console.log(chalk.green('d - move right'));
    console.log(chalk.green('m - mark/unmark a mine'));
    console.log(chalk.green('r - reveal a cell'));
    console.log(chalk.green('Press Enter to start...'));
}

// Set up the readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const worldSize = 8;
const mineCount = 10;

// Define different block types and their display colors
const blockColors = {
    '.': chalk.gray('.'),
    'M': chalk.red('M'),
    'F': chalk.yellow('F'),
    ' ': chalk.white(' '),
    '0': chalk.white(' '), // Adding '0' to handle cells with no adjacent mines
    '1': chalk.blue('1'),
    '2': chalk.green('2'),
    '3': chalk.red('3'),
    '4': chalk.cyan('4'),
    '5': chalk.magenta('5'),
    '6': chalk.yellow('6'),
    '7': chalk.gray('7'),
    '8': chalk.black('8')
};

// Initialize the game world with hidden cells
const world = Array.from({ length: worldSize }, () => Array(worldSize).fill('.'));
const revealed = Array.from({ length: worldSize }, () => Array(worldSize).fill(false));

// Function to place mines randomly
function placeMines() {
    let placedMines = 0;
    while (placedMines < mineCount) {
        let x = Math.floor(Math.random() * worldSize);
        let y = Math.floor(Math.random() * worldSize);
        if (world[y][x] !== 'M') {
            world[y][x] = 'M';
            placedMines++;
        }
    }
}

// Function to count adjacent mines
function countAdjacentMines(x, y) {
    let mineCount = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            let nx = x + dx;
            let ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < worldSize && ny < worldSize && world[ny][nx] === 'M') {
                mineCount++;
            }
        }
    }
    return mineCount;
}

// Player starting position
let player = { x: 0, y: 0 };

function displayWorld() {
    console.clear();
    console.log(chalk.green('+') + '-'.repeat(worldSize) + chalk.green('+'));
    for (let y = 0; y < worldSize; y++) {
        let row = chalk.green('|');
        for (let x = 0; x < worldSize; x++) {
            if (player.x === x && player.y === y) {
                row += chalk.blue('@');
            } else if (revealed[y][x]) {
                row += blockColors[world[y][x]];
            } else if (world[y][x] === 'F') {
                row += blockColors['F'];
            } else {
                row += blockColors['.'];
            }
        }
        row += chalk.green('|');
        console.log(row);
    }
    console.log(chalk.green('+') + '-'.repeat(worldSize) + chalk.green('+'));
}

function revealCell(x, y) {
    if (!revealed[y][x] && (world[y][x] === '.' || world[y][x] === 'F')) {
        let mines = countAdjacentMines(x, y);
        world[y][x] = mines === 0 ? ' ' : mines.toString();
        revealed[y][x] = true;
        if (mines === 0) {
            // Reveal adjacent cells recursively if there are no adjacent mines
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    let nx = x + dx;
                    let ny = y + dy;
                    if (nx >= 0 && ny >= 0 && nx < worldSize && ny < worldSize && (dx !== 0 || dy !== 0)) {
                        revealCell(nx, ny);
                    }
                }
            }
        }
    }
}

function handleInput(input) {
    input = input.trim();

    let newX = player.x;
    let newY = player.y;

    if (input === 'w' && player.y > 0) {
        newY--;
    } else if (input === 's' && player.y < worldSize - 1) {
        newY++;
    } else if (input === 'a' && player.x > 0) {
        newX--;
    } else if (input === 'd' && player.x < worldSize - 1) {
        newX++;
    } else if (input === 'm') {
        // Mark or unmark a mine
        if (world[player.y][player.x] === '.') {
            world[player.y][player.x] = 'F';
        } else if (world[player.y][player.x] === 'F') {
            world[player.y][player.x] = '.';
        }
    } else if (input === 'r') {
        // Reveal a cell
        if (world[player.y][player.x] === 'M') {
            console.log(chalk.red('Boom! You hit a mine! Game over.'));
            rl.close();
            return;
        } else {
            revealCell(player.x, player.y);
        }
    } else {
        console.log(chalk.red('Invalid input! Use w, s, a, d, m, r.'));
        return;
    }

    // Move player to new position
    player.x = newX;
    player.y = newY;

    displayWorld();
}

// Display instructions before starting the game
displayInstructions();

// Place mines in the world
placeMines();

// Set up the event listener and start the game loop after pressing Enter
let gameStarted = false;
rl.on('line', (input) => {
    if (!gameStarted) {
        gameStarted = true;
        displayWorld();
        rl.prompt();
    } else {
        handleInput(input);
        rl.prompt();
    }
});
