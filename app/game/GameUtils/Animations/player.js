import playerAttackDefault from '../../GameAssets/player/attack/default/attack.png';
import playerAttackDefaultJSON from '../../GameAssets/player/attack/default/attack.json';
import playerAttackDown from '../../GameAssets/player/attack/down/attack-down.png';
import playerAttackDownJSON from '../../GameAssets/player/attack/down/attack-down.json';
import playerAttackUp from '../../GameAssets/player/attack/up/attack-up.png';
import playerAttackUpJSON from '../../GameAssets/player/attack/up/attack-up.json';
import playerClimb from '../../GameAssets/player/climb/climb.png';
import playerClimbJSON from '../../GameAssets/player/climb/climb.json';
import playerIdle from '../../GameAssets/player/idle/idle.png';
import playerIdleJSON from '../../GameAssets/player/idle/idle.json';
import playerJump from '../../GameAssets/player/jump/jump.png';
import playerJumpJSON from '../../GameAssets/player/jump/jump.json';
import playerWalk from '../../GameAssets/player/walk/walk.png';
import playerWalkJSON from '../../GameAssets/player/walk/walk.json';

export const playerAnimations = {
  attack: {
    sprite: playerAttackDefault.src,
    json: playerAttackDefaultJSON,
    animationKey: 'attack',
    speed: 0.2
  },
  attackDown: {
    sprite: playerAttackDown.src,
    json: playerAttackDownJSON,
    animationKey: 'attack-down',
    speed: 0.2
  },
  attackUp: {
    sprite: playerAttackUp.src,
    json: playerAttackUpJSON,
    animationKey: 'attack-up',
    speed: 0.2
  },
  climb: {
    sprite: playerClimb.src,
    json: playerClimbJSON,
    animationKey: 'climb',
    speed: 0.15
  },
  idle: {
    sprite: playerIdle.src,
    json: playerIdleJSON,
    animationKey: 'idle',
    speed: 0.1
  },
  jump: {
    sprite: playerJump.src,
    json: playerJumpJSON,
    animationKey: 'jump',
    speed: 0.15
  },
  walk: {
    sprite: playerWalk.src,
    json: playerWalkJSON,
    animationKey: 'walk',
    speed: 0.3
  },
};  