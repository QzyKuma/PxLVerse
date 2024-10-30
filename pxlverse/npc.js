// // npc.js
//
// import { world } from "./game.js";
//
// export const blockTypes = {
//     0: { color: 0x87CEEB, type: 'empty' },
//     1: { color: 0x008000, type: 'grass' },
//     2: { color: 0x8B4513, type: 'dirt' },
//     3: { color: 0x808080, type: 'stone' },
//     4: { color: 0x1E90FF, type: 'water' }
// };
//
// // Load alien sprite for NPCs
// export function preloadNPCAssets(scene) {
//     scene.load.image('alien', 'https://labs.phaser.io/assets/sprites/ufo.png'); // Alien sprite
// }
//
// // Spawn NPCs using the alien sprite
// export function spawnNPCs(scene) {
//     const npcs = scene.physics.add.group();
//     for (let i = 0; i < 5; i++) {
//         const npcX = Phaser.Math.Between(0, 24) * 32;
//         const npcY = Phaser.Math.Between(0, 17) * 32;
//         npcs.create(npcX, npcY, 'alien'); // Use the alien sprite
//     }
//     return npcs;
// }
//
// // Update NPC positions and apply block effects
// export function updateNPCs(npcs, player) {
//     npcs.getChildren().forEach(npc => {
//         npc.scene.physics.moveToObject(npc, player, 50);
//         applyBlockEffects(npc);
//     });
// }
//
// // Apply block-specific effects on NPCs
// function applyBlockEffects(npc) {
//     const tileX = Math.floor(npc.x / 32);
//     const tileY = Math.floor(npc.y / 32);
//     const blockID = world[tileY] && world[tileY][tileX];
//     const blockType = blockTypes[blockID] ? blockTypes[blockID].type : 'empty';
//
//     if (blockType === 'water') {
//         npc.setVelocity(npc.body.velocity.x * 0.5, npc.body.velocity.y * 0.5); // Slow down on water
//     } else if (blockType === 'stone') {
//         npc.setVelocity(0, 0); // Stop NPC on stone
//     }
// }
