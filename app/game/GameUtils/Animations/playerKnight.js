import knightAttack from '../../GameAssets/KnightPixelArt/Spritesheet/attack-frames/knight-attack.png';
import knightAttackJSON from '../../GameAssets/KnightPixelArt/Spritesheet/attack-frames/knight-attack.json';
import KnightDie from '../../GameAssets/KnightPixelArt/Spritesheet/die-frames/knight-die.png';
import KnightDieJSON from '../../GameAssets/KnightPixelArt/Spritesheet/die-frames/knight-die.json';
import knightHit from '../../GameAssets/KnightPixelArt/Spritesheet/hit-frames/knight-hit.png'
import knightHitJSON from '../../GameAssets/KnightPixelArt/Spritesheet/hit-frames/knight-hit.json';
import knightIdle from '../../GameAssets/KnightPixelArt/Spritesheet/idle-frames/knight-idle.png';
import knightIdleJSON from '../../GameAssets/KnightPixelArt/Spritesheet/idle-frames/knight-idle.json';
import knightJump from '../../GameAssets/KnightPixelArt/Spritesheet/jump-frames/knight-jump.png';
import knightJumpJSON from '../../GameAssets/KnightPixelArt/Spritesheet/jump-frames/knight-jump.json';
import knightWalking from '../../GameAssets/KnightPixelArt/Spritesheet/walk-fames/knight-walk.png';
import knightWalkingJSON from '../../GameAssets/KnightPixelArt/Spritesheet/walk-fames/knight-walk.json';

export const knightAnimations = {
  attack: {
    sprite: knightAttack.src,
    json: knightAttackJSON,
    animationKey: 'knight-attack',
    speed: 0.15
  },
  die: {
    sprite: KnightDie.src,
    json: KnightDieJSON,
    animationKey: 'knight-die',
    speed: 0.1
  },
  hit: {
    sprite: knightHit.src,
    json: knightHitJSON,
    animationKey: 'knight-hit',
    speed: 0.1,
  },
  idle: {
    sprite: knightIdle.src,
    json: knightIdleJSON,
    animationKey: 'knight-idle',
    speed: 0.02
  },
  jump: {
    sprite: knightJump.src,
    json: knightJumpJSON,
    animationKey: 'knight-jump',
    speed: 0.1
  },
  walk: {
    sprite: knightWalking.src,
    json: knightWalkingJSON,
    animationKey: 'knight-walk',
    speed: 0.1
  },
};