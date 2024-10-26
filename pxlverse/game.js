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

const blockTypes = {
    0: { color: 0x87CEEB }, // empty
    1: { color: 0x008000 }, // grass
    2: { color: 0x8B4513 }, // dirt
    3: { color: 0x808080 }, // stone
    4: { color: 0x1E90FF }  // water
};

const game = new Phaser.Game(config);

let player;
let cursors;
let tileSize = 32; // Each tile is 32x32 pixels
let worldWidth = 25; // 25 tiles horizontally
let worldHeight = 18; // 18 tiles vertically
let world = []; // 2D array representing the world grid
let graphics; // Phaser graphics object to draw grid lines
let buildMode = true; // Toggle between build and remove modes
let selectedBlockType = 1; // Default block type is grass
let blocks; // Static group for physics-enabled blocks

// Preload assets
function preload() {
    console.log("Preloading assets...");
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png'); // Player sprite
    this.load.image('particle', 'https://labs.phaser.io/assets/particles/yellow.png'); // Particle sprite
    this.load.image('block', 'https://via.placeholder.com/32');

    // Generate a placeholder block texture
    this.textures.generate('block', { data: [' '], pixelWidth: 32, pixelHeight: 32 });
}

// Create the game world and player
function create() {
    console.log("Creating game objects...");

    // Initialize the 2D array representing the world grid
    for (let y = 0; y < worldHeight; y++) {
        world[y] = [];
        for (let x = 0; x < worldWidth; x++) {
            world[y][x] = 0; // Initially, all tiles are empty (0)
        }
    }

    // Initialize graphics for drawing grid lines
    graphics = this.add.graphics();

    // Initialize the blocks static group for physics-enabled blocks
    blocks = this.physics.add.staticGroup();

    // Add player sprite
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true); // Prevent player from leaving the screen

    // Set up the camera to follow the player
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, worldWidth * tileSize, worldHeight * tileSize);

    // Create cursor keys for player movement
    cursors = this.input.keyboard.createCursorKeys();

    // Input event for placing/removing blocks
    this.input.on('pointerdown', placeOrRemoveBlock, this);

    // Display instructions for building mode and block selection
    this.add.text(10, 10, 'Click to place/remove blocks. Press B to toggle build mode.\nPress 1-4 to select block types.', { fontSize: '16px', fill: '#fff' });

    // Toggle build mode with the "B" key
    this.input.keyboard.on('keydown-B', toggleBuildMode);

    // Add keyboard input to switch between block types
    this.input.keyboard.on('keydown-ONE', () => selectBlockType(1)); // Grass
    this.input.keyboard.on('keydown-TWO', () => selectBlockType(2)); // Dirt
    this.input.keyboard.on('keydown-THREE', () => selectBlockType(3)); // Stone
    this.input.keyboard.on('keydown-FOUR', () => selectBlockType(4)); // Water

    // Set up collider between player and blocks
    this.physics.add.collider(player, blocks);

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

    drawWorld(); // Draw grid lines only
}

// Draw grid lines only (no blocks needed)
function drawWorld() {
    graphics.clear();
    for (let y = 0; y < worldHeight; y++) {
        for (let x = 0; x < worldWidth; x++) {
            graphics.lineStyle(1, 0x000000, 0.3);
            graphics.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
}

// Place or remove a block when the player clicks
function placeOrRemoveBlock(pointer) {
    const tileX = Math.floor(pointer.x / tileSize);
    const tileY = Math.floor(pointer.y / tileSize);

    if (buildMode) {
        world[tileY][tileX] = selectedBlockType;

        // Create a block in the static group and apply tint color
        blocks.create(tileX * tileSize + tileSize / 2, tileY * tileSize + tileSize / 2, 'block')
            .setTint(blockTypes[selectedBlockType].color)
            .refreshBody();

        // Particle effect for feedback
        const particles = this.add.particles('particle');
        const emitter = particles.createEmitter({
            x: pointer.x,
            y: pointer.y,
            speed: { min: -200, max: 200 },
            lifespan: 300,
            quantity: 5,
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD'
        });

        setTimeout(() => {
            emitter.stop();
            setTimeout(() => particles.destroy(), 300);
        }, 300);

    } else {
        world[tileY][tileX] = 0;

        // Find and remove block if it exists
        const blockToRemove = blocks.getChildren().find(block =>
            block.x === tileX * tileSize + tileSize / 2 && block.y === tileY * tileSize + tileSize / 2
        );
        if (blockToRemove) blocks.remove(blockToRemove, true, true);
    }
}


// Select block type based on key press
function selectBlockType(type) {
    selectedBlockType = type;
    console.log("Selected block type:", type);
}

// Toggle between building and removing blocks
function toggleBuildMode() {
    buildMode = !buildMode;b1
    console.log("Build mode:", buildMode ? "Enabled" : "Remove mode");
}
