import readline from 'readline';
import chalk from 'chalk';

// Display game instructions
function displayInstructions() {
    console.log(chalk.green('Welcome to the Minecraft Terminal Game!'));
    console.log(chalk.green('Controls:'));
    console.log(chalk.green('w - move up'));
    console.log(chalk.green('s - move down'));
    console.log(chalk.green('a - move left'));
    console.log(chalk.green('d - move right'));
    console.log(chalk.green('m - mine (remove a block)'));
    console.log(chalk.green('p - place a block'));
    console.log(chalk.green('b - place a bomb'));
    console.log(chalk.green('Press Enter to start...'));
}

// Set up the readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const worldSize = 5;

// Define different block types and their display colors
const blockTypes = ['.', 'O', 'X', 'S', 'W', 'B']; // .: air, O: mined, X: placed, S: stone, W: wood, B: bomb
const blockColors = {
    '.': chalk.gray('.'),
    'O': chalk.black('O'),
    'X': chalk.yellow('X'),
    'S': chalk.white('S'),
    'W': chalk.rgb(139, 69, 19)('W'), // Chalk doesn't have a brown color, so using rgb for wood
    'B': chalk.red('B') // Bomb
};

// Initialize the game world with random blocks
const world = Array.from({ length: worldSize }, () => 
    Array(worldSize).fill(null).map(() => blockTypes[Math.floor(Math.random() * (blockTypes.length - 1))]) // Exclude bombs in initial world
);

let player = { x: 2, y: 2 };

function displayWorld() {
    console.clear();
    console.log(chalk.green('+') + '-'.repeat(worldSize) + chalk.green('+'));
    for (let y = 0; y < worldSize; y++) {
        let row = chalk.green('|');
        for (let x = 0; x < worldSize; x++) {
            if (player.x === x && player.y === y) {
                row += chalk.blue('@');
            } else {
                row += blockColors[world[y][x]];
            }
        }
        row += chalk.green('|');
        console.log(row);
    }
    console.log(chalk.green('+') + '-'.repeat(worldSize) + chalk.green('+'));
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
        world[player.y][player.x] = '.'; // Mine
    } else if (input === 'p') {
        world[player.y][player.x] = 'X'; // Place
    } else if (input === 'b') {
        world[player.y][player.x] = 'B'; // Place Bomb
    } else {
        console.log(chalk.red('Invalid input! Use w, s, a, d, m, p, b.'));
        return;
    }

    // Check for bomb at new position
    if (world[newY][newX] === 'B') {
        console.log(chalk.red('Boom! You hit a bomb! Game over.'));
        rl.close();
        return;
    }

    // Move player to new position
    player.x = newX;
    player.y = newY;

    displayWorld();
}

// Display instructions before starting the game
displayInstructions();

// Set up the event listener and start the game loop after pressing Enter
let gameStarted = false;
rl.on('line', (input) => {
    if (!gameStarted) {
        displayWorld();
        gameStarted = true;
        rl.prompt();
    } else {
        handleInput(input);
        rl.prompt();
    }
});
rl.prompt();
