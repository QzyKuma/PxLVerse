

const blockTypes = {
    0: { color: 0x87CEEB }, // empty
    1: { color: 0x008000 }, // grass
    2: { color: 0x8B4513 }, // dirt
    3: { color: 0x808080 }, // stone
    4: { color: 0x1E90FF }  // water
};

let graphics, world = [], selectedBlockType = 1, buildMode = true;

export function preloadWorldAssets(scene) {
    scene.load.image('block', 'https://via.placeholder.com/32');
    scene.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
}

export function createWorld(scene) {
    graphics = scene.add.graphics();

    //Ini world grid
    const blocks = scene.physics. add.staticGroup();
    for (let y = 0; y < 18; y++) {
        world[y] = [];
        for (let x = 0; x < 25; x++) world[y][x] = 0;
    }

    const player = this.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);
    const cursors = scene.input.keyboard.createCursorKeys();
    scene.cameras.main.startFollow(player);
    scene.input.main.setBounds(0,0, 25 * 32, 18 * 32);


    scene.input.on('pointerdown')
    scene.input.keyboard.on('keydown-ONE', () => selectBlockType(1)); // Grass
    scene.input.keyboard.on('keydown-TWO', () => selectBlockType(2)); // Dirt
    scene.input.keyboard.on('keydown-THREE', () => selectBlockType(3)); // Stone
    scene.input.keyboard.on('keydown-FOUR', () => selectBlockType(4)); // Water
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
    buildMode = !buildMode;
    console.log("Build mode:", buildMode ? "Enabled" : "Remove mode");
}
