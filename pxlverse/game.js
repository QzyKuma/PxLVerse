import {preloadWorldAssets, createWorld, placeOrRemoveBlock, toggleBuildMode, drawWorld, selectBlockType} from './world.js'
import {preloadNPCAssets, spawnNPCs, updateNPCs, handlePlayerHit} from '/npc.js'




// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB', // Sky blue background
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // No gravity for top-down game
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};



const game = new Phaser.Game(config);

let player;
let cursors;
let blocks;
let npc;
let startTime;
const survivalTime = 60000;


///moving code
let tileSize = 32; // Each tile is 32x32 pixels
let worldWidth = 25; // 25 tiles horizontally
let worldHeight = 18; // 18 tiles vertically
let world = []; // 2D array representing the world grid
let graphics; // Phaser graphics object to draw grid lines
let buildMode = true; // Toggle between build and remove modes
let selectedBlockType = 1; // Default block type is grass


// Preload assets
function preload() {
    preloadWorldAssets(this);
    preloadNPCAssets(this);

    // console.log("Preloading assets...");
    // this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png'); // Player sprite
    // this.load.image('particle', 'https://labs.phaser.io/assets/particles/yellow.png'); // Particle sprite
    // this.load.image('block', 'https://via.placeholder.com/32');
    //
    // // Generate a placeholder block texture
    // this.textures.generate('block', { data: [' '], pixelWidth: 32, pixelHeight: 32 });
}

// Create the game world and player
function create() {
    console.log("Creating game objects...");
    ({player, cursors, blocks } = createdWorld(this));
    npc = spawnNPCs(this);

    //Collider and Overlap setup
    this.physics.add.collider(player, blocks);
    this.physics.add.collider(npcs, blocks);
    this.physics.add.collider(player, npcs, handlePlayerHit, null, this);

    startTime = this.time.now



    //
    // // Initialize the 2D array representing the world grid
    // for (let y = 0; y < worldHeight; y++) {
    //     world[y] = [];
    //     for (let x = 0; x < worldWidth; x++) {
    //         world[y][x] = 0; // Initially, all tiles are empty (0)
    //     }
    // }
    //
    // // Initialize graphics for drawing grid lines
    // graphics = this.add.graphics();
    //
    // // Initialize the blocks static group for physics-enabled blocks
    // blocks = this.physics.add.staticGroup();
    //


    //
    // // Set up the camera to follow the player
    // this.cameras.main.startFollow(player);
    // this.cameras.main.setBounds(0, 0, worldWidth * tileSize, worldHeight * tileSize);
    //
    // // Create cursor keys for player movement
    // cursors = this.input.keyboard.createCursorKeys();
    //
    // // Input event for placing/removing blocks
    // this.input.on('pointerdown', placeOrRemoveBlock, this);
    //
    // // Display instructions for building mode and block selection
    // this.add.text(10, 10, 'Click to place/remove blocks. Press B to toggle build mode.\nPress 1-4 to select block types.', { fontSize: '16px', fill: '#fff' });
    //
    // // Toggle build mode with the "B" key
    // this.input.keyboard.on('keydown-B', toggleBuildMode);
    //


    //
    // // Set up collider between player and blocks
    // this.physics.add.collider(player, blocks);
    //
    console.log("World created.");
}

// Update loop - handles player movement and world redrawing
function update(time, delta) {
    // Reset player velocity (stop movement)
    player.setVelocity(0);
    const playerSpeed = 160;
    if (cursors.left.isDown) player.setVelocityX(-playerSpeed);
    else if (cursors.right.isDown) player.setVelocityX(playerSpeed);
    if (cursors.up.isDown) player.setVelocityY(-playerSpeed);
    else if (cursors.down.isDown) player.setVelocityY(playerSpeed);

    updateNPCs(npcs, player, blocks);

    drawWorld(); // Draw grid lines only

    if(time - startTime >= survivalTime) {
        this.add.text(300,280, 'You survived!', { font: '32px Arial', fill: '#fff' } );
        this.scene.pause();
    }
}





