import { AnimatedSprite, Assets, Spritesheet, Point } from 'pixi.js';

export class Character {
    constructor() {
        this.animations = {};
        this.currentAnimation = null;
        this.velocity = new Point(0);
        this.mass = 3;
        this.facing = 'right';
    }

    async loadAnimations(animationData) {
        for (const [name, data] of Object.entries(animationData)) {
            const texture = await Assets.load(data.sprite);

            // Create and parse spritesheet
            const spritesheet = new Spritesheet(texture, data.json);
            await spritesheet.parse();
            
            // Create animated sprite
            const animationData = spritesheet?.animations[data.animationKey];
            const animation = new AnimatedSprite(animationData);
            animation.animationSpeed = data.speed;
            animation.visible = false;
            
            // Set pixel-perfect rendering
            texture.baseTexture.scaleMode = 'nearest';
            
            this.animations[name] = animation;
        }

        // Set initial animation
        this.playAnimation('idle');
    }

    playAnimation(animationName) {
        if (this.currentAnimation) {
            this.currentAnimation.visible = false;
            this.currentAnimation.stop();
        }

        this.currentAnimation = this.animations[animationName];
        this.currentAnimation.visible = true;
        this.currentAnimation.play();
    }

    setPosition(x, y) {
        for (const animation of Object.values(this.animations)) {
            animation.position.set(x, y);
        }
    }

    setScale(scale) {
        for (const animation of Object.values(this.animations)) {
            animation.scale.set(scale);
        }
    }

    // Flip character based on direction
    setDirection(direction) {
        if (this.facing !== direction) {
            this.facing = direction;
            for (const animation of Object.values(this.animations)) {
                animation.scale.x *= -1;
            }
        }
    }
}