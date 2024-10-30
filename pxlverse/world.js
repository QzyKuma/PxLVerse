// // world.js
// export const blockTypes = {
//     0: { color: 0x87CEEB, type: 'empty' },
//     1: { color: 0x008000, type: 'grass' },
//     2: { color: 0x8B4513, type: 'dirt' },
//     3: { color: 0x808080, type: 'stone' },
//     4: { color: 0x1E90FF, type: 'water' }
// };
//
// export let world = [];
// let graphics, selectedBlockType = 1, buildMode = true;
//
// export function preloadWorldAssets(scene) {
//     scene.load.image('block', 'https://via.placeholder.com/32');
//     scene.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
// }
//
// export function createWorld(scene) {
//     graphics = scene.add.graphics();
//
//     const blocks = scene.physics.add.staticGroup();
//     for (let y = 0; y < 18; y++) {
//         world[y] = [];
//         for (let x = 0; x < 25; x++) world[y][x] = 0;
//     }
//
//     const player = scene.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);
//     const cursors = scene.input.keyboard.createCursorKeys();
//     scene.cameras.main.startFollow(player);
//     scene.cameras.main.setBounds(0, 0, 25 * 32, 18 * 32);
//
//     scene.input.on('pointerdown', (pointer) => placeOrRemoveBlock(scene, pointer, blocks));
//     scene.input.keyboard.on('keydown-B', toggleBuildMode);
//     scene.input.keyboard.on('keydown-ONE', () => selectBlockType(1));
//     scene.input.keyboard.on('keydown-TWO', () => selectBlockType(2));
//     scene.input.keyboard.on('keydown-THREE', () => selectBlockType(3));
//     scene.input.keyboard.on('keydown-FOUR', () => selectBlockType(4));
//
//     return { player, cursors, blocks };
// }
//
// function placeOrRemoveBlock(scene, pointer, blocks) {
//     const tileX = Math.floor(pointer.x / 32);
//     const tileY = Math.floor(pointer.y / 32);
//
//     if (buildMode) {
//         world[tileY][tileX] = selectedBlockType;
//         blocks.create(tileX * 32 + 16, tileY * 32 + 16, 'block')
//             .setTint(blockTypes[selectedBlockType].color)
//             .refreshBody();
//     } else {
//         world[tileY][tileX] = 0;
//         const blockToRemove = blocks.getChildren().find(block => block.x === tileX * 32 + 16 && block.y === tileY * 32 + 16);
//         if (blockToRemove) blocks.remove(blockToRemove, true, true);
//     }
// }
//
// export function drawWorld() {
//     graphics.clear();
//     for (let y = 0; y < 18; y++) {
//         for (let x = 0; x < 25; x++) {
//             graphics.lineStyle(1, 0x000000, 0.3);
//             graphics.strokeRect(x * 32, y * 32, 32, 32);
//         }
//     }
// }
//
// function toggleBuildMode() {
//     buildMode = !buildMode;
// }
//
// function selectBlockType(type) {
//     selectedBlockType = type;
// }
