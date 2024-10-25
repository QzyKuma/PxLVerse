// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // No gravity, since this is a top-down game
            debug: false // Turn this on if you want to see the collision boxes
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Create a new Phaser game instance
const game = new Phaser.Game(config);

let player;
let cursors;
let tileSize = 32;
let worldWidth = 25;
let worldHeight = 18;
let world = [];
let graphics;
let buildMode = true;

// Preload assets
function preload() {
    this.load.image('player', 'https://phaser.io/images/sprites/phaser-dude.png');

}

// Create the game world
function create() {
    //World Array
    for (let y = 0; y < world.height; y++ ) {
        world[y] = [];
        for (let x = 0; x < world.width; x++ ) {
            world[y][x] = 0;
        }
    }
    // Player Sprite and controls
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();

    //Graphics Objs to draw the world
    graphics = this.add.graphics();


    //input events for placing/Removing blocks
    this.input.on('pointerdown', placeOrRemoveBlock,this);
    //displays instructions for build mode
    this.add.text(10,10, 'Click to replace/remove blocks. Press B to toggle build mode.')
    //toggle build mode
    this.input.keyboard.on('keydown-B', toggleBuildMode);
}


// Update loop for player movement
function update() {
    // Reset player velocity
    player.setVelocity(0);

    // Move left/right
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    }

    // Move up/down
    if (cursors.up.isDown) {
        player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
    }

    drawWorld();
}

function drawWorld() {
    graphics.clear(); // Clear previous Drawings

    for (let y = 0; y < worldHeight; y++) {
        for (let x = 0; x < worldWidth; x++) {
            if (world[y][x] === 1) {
            //draw a filled block
                graphics.fillStyle(0x00800, 1)
            }
        }
    }
}
