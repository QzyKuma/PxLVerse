import {blockTypes, world} from './world.js';

export function preloadNPCAssets(scene) {
    scene.load.image('npc', 'https://labs.phaser.io/assets/sprites/alien.png' );
}

export function spawnNPCS(scene){
        const npcs = scene.physics.add.group();
        for(let i = 0; i < 5; i++) {
            const npcX = Phaser.Math.Between(0, 24) * 32;
            const npcY = Phaser.Math.Between(0, 17) * 32;
            npcs.create(npcX, npcY, 'npc');
        }
        return npcs;
}

export function updateNPCs(npcs, player, blocks) {
        npcs.getChildren().forEach(npc => {
            npc.scene.physics.moveToObject(npc, player, 50);
            applyBlockEffects(npc);
        })
}

function applyBlockEffects(npc) {
        const tileX = Math.floor(npc.x /32)
        const tileY = Math.floor(npc.y /32)
        const blockID = world[tileY] && world[tileY][tileX];
        const blockType = blockTypes[blockID] ? blockTypes[blockID].type : 'empty';

        if (blocktype === 'water') {
                npc.setVelocity(npc.body.velocity.x * 0.5, npc.body.velocity.y * 0.5);
        } else {
            npc.setVelocity(0,0);
        }
}

export function handlePlayerHit (player, npc) {
        player.scene.add.text(300, 280, 'Game Over!', { font: '32px Arial', fill: '#fff0000' });
        player.scene.scene.pause();
}