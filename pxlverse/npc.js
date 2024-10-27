import { blockTypes, world } from './world.js';

export function preloadNPCAssets(scene) {
    scene.load.image('npc', 'https://labs.phaser.io/assets/sprites/alien.png');
}

export function spawnNPCs(scene) { // Changed function name to `spawnNPCs` for consistency
    const npcs = scene.physics.add.group();
    for (let i = 0; i < 5; i++) {
        const npcX = Phaser.Math.Between(0, 24) * 32;
        const npcY = Phaser.Math.Between(0, 17) * 32;
        npcs.create(npcX, npcY, 'npc');
    }
    return npcs;
}

export function updateNPCs(npcs, player) { // Removed unused `blocks` parameter
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

    if (blockType === 'water') { // Fixed `blockType` variable name
        npc.setVelocity(npc.body.velocity.x * 0.5, npc.body.velocity.y * 0.5); // Slows NPC on water
    } else if (blockType === 'stone') { // Additional case for stone to block NPC
        npc.setVelocity(0, 0); // Blocks NPC movement on stone
    }
}

export function handlePlayerHit(player, npc) {
    player.scene.add.text(300, 280, 'Game Over!', { font: '32px Arial', fill: '#ff0000' }); // Fixed hex color
    player.scene.scene.pause();
}



