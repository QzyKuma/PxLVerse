
// --- Main Game Setup ---


class StartScene extends Phaser.Scene {
    constructor () {
        super({key: 'StartScene'});
    }

    preload () {
        this.load.image('startButton', 'assets/images/startButton.png');
        this.load.image('backgroundMusic', 'path/to/background_music.mp3');
    }

    create () {
        this.backgroundMusic = this.sound.add('backgroundMusic', {loop: true, volume: 0.5 } );
        this.backgroundMusic.play();

        this.add.text(300, 150, 'Your Game Title', { fontSize: '48px', fill: '#ffffff' });

        const startButton = this.add.image(400, 300, 'startButton').setInteractive();
        startButton.on('pointerdown', () => {

        });
    }


}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
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
    scene.load.image('block', 'https://via.placeholder.com/32');
    scene.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');

    scene.load.image ('grass', 'https://via.placeholder.com/32?text=Grass');
    scene.load.image ('dirt', 'https://via.placeholder.com/32?text=Dirt');
    scene.load.image ('stone', 'https://via.placeholder.com/32?text=Stone');
    scene.load.image ('water', 'https://via.placeholder.com/32?text=Water');
    scene.load.image ('background', '/spr_stars02.png');
}

// Create the world, player, and handle controls
function createWorld(scene) {
    graphics = scene.add.graphics();
    const blocks = scene.physics.add.staticGroup();

    for (let y = 0; y < 18; y++) {
        world[y] = [];
        for (let x = 0; x < 25; x++) world[y][x] = 0;
    }

    const player = scene.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);
    const cursors = scene.input.keyboard.createCursorKeys();
    scene.cameras.main.startFollow(player);
    scene.cameras.main.setBounds(0, 0, 25 * 32, 18 * 32);

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

        const texture = getBlockTexture(selectedBlockType);
        blocks.create(tileX * 32 + 16, tileY * 32 + 16, texture)
            .refreshBody();
    } else {
        world[tileY][tileX] = 0;
        const blockToRemove = blocks.getChildren().find(block => block.x === tileX * 32 + 16 && block.y === tileY * 32 + 16);
        if (blockToRemove) blocks.remove(blockToRemove, true, true);
    }
}


function getBlockTexture(type) {
    switch(type){
        case 1: return 'grass';
        case 2: return 'dirt';
        case 3: return 'stone';
        case 4: return 'water';
        default: return 'grass'; // Default to grass
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
    scene.load.image('npc', 'https://labs.phaser.io/assets/sprites/ufo.png');
}

// Spawn NPCs with sprite images
function spawnNPCs(scene) {
    const npcs = scene.physics.add.group();
    for (let i = 0; i < 5; i++) {
        const npcX = Phaser.Math.Between(0, 24) * 32;
        const npcY = Phaser.Math.Between(0, 17) * 32;
        npcs.create(npcX, npcY, 'npc');
    }
    return npcs;
}

// Update NPC positions and apply block effects
function updateNPCs(npcs, player) {
    npcs.getChildren().forEach(npc => {
        npc.scene.physics.moveToObject(npc, player, 50);
        applyBlockEffects(npc);
    });
}

function applyBlockEffects(npc) {
    const tileX = Math.floor(npc.x / 32);
    const tileY = Math.floor(npc.y / 32);
    const blockID = world[tileY] && world[tileY][tileX];
    const blockType = blockTypes[blockID] ? blockTypes[blockID].type : 'empty';

    if (blockType === 'water') {
        npc.setVelocity(npc.body.velocity.x * 0.5, npc.body.velocity.y * 0.5);
    } else if (blockType === 'stone') {
        npc.setVelocity(0, 0);
    }
}

// Handle Game Over with Reset Button
function handlePlayerHit(player, npc) {
    player.scene.add.text(300, 280, 'Game Over!', { font: '32px Arial', fill: '#ff0000' });
    const resetButton = player.scene.add.text(350, 320, 'Restart', { font: '24px Arial', fill: '#ffffff' })
        .setInteractive()
        .on('pointerdown', () => {
            player.scene.scene.restart(); // Restart the scene
        });
}


let player, cursors, blocks, npcs, startTime;
const survivalTime = 60000;

// Preload assets for world and NPCs
function preload() {
    preloadWorldAssets(this);
    preloadNPCAssets(this);
}

// Set up the game world, player, NPCs, and survival conditions
function create() {
    this.add.tileSprite(400, 300, 800, 600, 'background');

    ({ player, cursors, blocks } = createWorld(this));


    npcs = spawnNPCs(this);

    this.physics.add.collider(player, blocks);
    this.physics.add.collider(npcs, blocks);
    this.physics.add.overlap(player, npcs, handlePlayerHit, null, this);

    startTime = this.time.now;
}

// Main game update loop
function update(time) {
    player.setVelocity(0);

    const playerSpeed = 160;
    if (cursors.left.isDown) player.setVelocityX(-playerSpeed);
    if (cursors.right.isDown) player.setVelocityX(playerSpeed);
    if (cursors.up.isDown) player.setVelocityY(-playerSpeed);
    if (cursors.down.isDown) player.setVelocityY(playerSpeed);

    updateNPCs(npcs, player);
    drawWorld();

    if (time - startTime >= survivalTime) {
        this.add.text(300, 280, 'You Survived!', { fontSize: '32px', fill: '#ffffff' });
        const resetButton = this.add.text(350, 320, 'Restart', { font: '24px Arial', fill: '#ffffff' })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.restart();
            });
    }
}
