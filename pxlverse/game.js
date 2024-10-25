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

// Preload assets
function preload() {
    this.load.image('player', 'https://phaser.io/images/sprites/phaser-dude.png');
}

// Create the game world
function create() {
    // Add player sprite to the scene
    player = this.physics.add.sprite(400, 300, 'player');

    // Set player boundaries within the game world
    player.setCollideWorldBounds(true);

    // Create cursor input (arrow keys)
    cursors = this.input.keyboard.createCursorKeys();
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
}
