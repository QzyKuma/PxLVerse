// game.js

// --- World and Block Configuration ---
const blockTypes = {
    0: { color: 0x87CEEB, type: 'empty' },
    1: { color: 0x008000, type: 'grass' },
    2: { color: 0x8B4513, type: 'dirt' },
    3: { color: 0x808080, type: 'stone' },
    4: { color: 0x1E90FF, type: 'water' }
};

let graphics, world = [], selectedBlockType = 1, buildMode = true;

// Preload assets for world and player
function preloadWorldAssets(scene) {
    scene.load.image('block', 'https://via.placeholder.com/32'); // Placeholder for blocks
    scene.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
}

// Create the world, player, and handle controls
function createWorld(scene) {
    graphics = scene.add.graphics();
    const blocks = scene.physics.add.staticGroup();

    // Initialize world grid
    for (let y = 0; y < 18; y++) {
        world[y] = [];
        for (let x = 0; x < 25; x++) world[y][x] = 0;
    }

    const player = scene.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);
    const cursors = scene.input.keyboard.createCursorKeys();
    scene.cameras.main.startFollow(player);
    scene.cameras.main.setBounds(0, 0, 25 * 32, 18 * 32);

    // Input for block placement
    scene.input.on('pointerdown', (pointer) => placeOrRemoveBlock(scene, pointer, blocks));
    scene.input.keyboard.on('keydown-B', toggleBuildMode);
    scene.input.keyboard.on('keydown-ONE', () => selectBlockType(1));
    scene.input.keyboard.on('keydown-TWO', () => selectBlockType(2));
    scene.input.keyboard.on('keydown-THREE', () => selectBlockType(3));
    scene.input.keyboard.on('keydown-FOUR', () => selectBlockType(4));

    return { player, cursors, blocks };
}

// Place or remove blocks on the grid
function placeOrRemoveBlock(scene, pointer, blocks) {
    const tileX = Math.floor(pointer.x / 32);
    const tileY = Math.floor(pointer.y / 32);

    if (buildMode) {
        world[tileY][tileX] = selectedBlockType;
        blocks.create(tileX * 32 + 16, tileY * 32 + 16, 'block')
            .setTint(blockTypes[selectedBlockType].color)
            .refreshBody();
    } else {
        world[tileY][tileX] = 0;
        const blockToRemove = blocks.getChildren().find(block => block.x === tileX * 32 + 16 && block.y === tileY * 32 + 16);
        if (blockToRemove) blocks.remove(blockToRemove, true, true);
    }
}

// Draw the world grid
function drawWorld() {
    graphics.clear();
    for (let y = 0; y < 18; y++) {
        for (let x = 0; x < 25; x++) {
            graphics.lineStyle(1, 0x000000, 0.3);
            graphics.strokeRect(x * 32, y * 32, 32, 32);
        }
    }
}

function toggleBuildMode() {
    buildMode = !buildMode;
}

function selectBlockType(type) {
    selectedBlockType = type;
}

// --- NPC Functions ---

function preloadNPCAssets(scene) {
    scene.load.image('npc', 'https://labs.phaser.io/assets/sprites/alien.png'); // Use sprite for NPCs
}

// Spawn NPCs with sprite images
function spawnNPCs(scene) {
    const npcs = scene.physics.add.group();
    for (let i = 0; i < 5; i++) {
        const npcX = Phaser.Math.Between(0, 24) * 32;
        const npcY = Phaser.Math.Between(0, 17) * 32;
        npcs.create(npcX, npcY, 'npc'); // Use the 'npc' sprite
    }
    return npcs;
}

// Update NPC positions and apply block effects
function updateNPCs(npcs, player) {
    npcs.getChildren().forEach(npc => {
        npc.scene.physics.moveToObject(npc, player, 50); // NPC speed toward player
        applyBlockEffects(npc); // Apply block effects like slowing or stopping
    });
}

function applyBlockEffects(npc) {
    const tileX = Math.floor(npc.x / 32);
    const tileY = Math.floor(npc.y / 32);
    const blockID = world[tileY] && world[tileY][tileX];
    const blockType = blockTypes[blockID] ? blockTypes[blockID].type : 'empty';

    if (blockType === 'water') {
        npc.setVelocity(npc.body.velocity.x * 0.5, npc.body.velocity.y * 0.5); // Slow down on water
    } else if (blockType === 'stone') {
        npc.setVelocity(0, 0); // Stop NPC on stone
    }
}

// Display Game Over text and reset button without pausing the scene
function handlePlayerHit(player, npc) {
    player.setVelocity(0); // Stop player movement
    npc.scene.physics.world.disable(player); // Disable player physics to simulate "game over"

    // Display Game Over message
    player.scene.add.text(300, 280, 'Game Over!', { font: '32px Arial', fill: '#ff0000' });

    // Display reset button
    const resetButton = player.scene.add.text(350, 320, 'Restart', { font: '24px Arial', fill: '#ffffff' })
        .setInteractive()
        .on('pointerdown', () => {
            player.scene.scene.restart(); // Restart the scene
        });
}

// --- Main Game Setup ---

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB', // Light blue background color
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // No gravity for a top-down view
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Initialize the Phaser game
new Phaser.Game(config);

let player, cursors, blocks, npcs, startTime;
const survivalTime = 60000; // 1-minute survival time

// Preload assets for world and NPCs
function preload() {
    preloadWorldAssets(this); // Load world assets (blocks, player)
    preloadNPCAssets(this);   // Load NPC assets
}

// Set up the game world, player, NPCs, and survival conditions
function create() {
    // Initialize the world, including player, controls, and blocks group
    ({ player, cursors, blocks } = createWorld(this));

    // Spawn NPCs (enemies)
    npcs = spawnNPCs(this);

    // Set up collisions and overlaps
    this.physics.add.collider(player, blocks); // Player collides with blocks
    this.physics.add.collider(npcs, blocks);   // NPCs collide with blocks
    this.physics.add.overlap(player, npcs, handlePlayerHit, null, this); // NPCs overlap with player to cause game over

    startTime = this.time.now; // Start timer for survival
}

// Main game update loop
function update(time) {
    // Only allow movement if the player is active
    if (player.active) {
        player.setVelocity(0);

        const playerSpeed = 160; // Set the player speed
        if (cursors.left.isDown) player.setVelocityX(-playerSpeed);
        if (cursors.right.isDown) player.setVelocityX(playerSpeed);
        if (cursors.up.isDown) player.setVelocityY(-playerSpeed);
        if (cursors.down.isDown) player.setVelocityY(playerSpeed);
    }

    // Update NPC behavior (movement and effects from blocks)
    updateNPCs(npcs, player);

    // Draw the grid of the world
    drawWorld();

    // Check survival time to determine if player has won
    if (time - startTime >= survivalTime) {
        this.add.text(300, 280, 'You Survived!', { fontSize: '32px', fill: '#ffffff' }); // White text for win message
        this.scene.pause(); // End the game on survival
    }
}
