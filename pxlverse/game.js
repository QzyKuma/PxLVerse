import {preloadWorldAssets, createWorld, drawWorld} from '/world.js';
import {preloadNPCAssets, spawnNPCs, updateNPCs, handlePlayerHit} from '/npc.js';




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
        preload, create, update
    }
};



const game = new Phaser.Game(config);

let player, cursors, blocks, npcs, startTime;
const survivalTime = 60000;


// Preload assets
function preload() {
    preloadWorldAssets(this);
    preloadNPCAssets(this);
}


function create() {
    console.log("Creating game objects...");
    ({player, cursors, blocks } = createWorld(this));
    npcs = spawnNPCs(this);

    //Collider and Overlap setup
    this.physics.add.collider(player, blocks);
    this.physics.add.collider(npcs, blocks);
    this.physics.add.collider(player, npcs, handlePlayerHit, null, this);

    startTime = this.time.now

    console.log("World created.");
}


function update(time) {
    // Player Movement
    player.setVelocity(0);
    const playerSpeed = 160;
    if (cursors.left.isDown) player.setVelocityX(-playerSpeed);
    else if (cursors.right.isDown) player.setVelocityX(playerSpeed);
    if (cursors.up.isDown) player.setVelocityY(-playerSpeed);
    else if (cursors.down.isDown) player.setVelocityY(playerSpeed);

    updateNPCs(npcs, player);
    drawWorld();

    //Check survival time
    if(time - startTime >= survivalTime) {
        this.add.text(300,280, 'You survived!', { font: '32px Arial', fill: '#fff' } );
        this.scene.pause();
    }
}





