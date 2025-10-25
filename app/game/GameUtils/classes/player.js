import { Character } from "./character";

export class Player extends Character {
    constructor() {
        super();
        this.isPlayer = true; // Flag for physics engine to identify player
    }

    onAttackStart() {
        return;
    }
    
    // NOTE: We moved the input parsing (key to action) into InputManager.
    // The InputManager now updates 'this.movement' directly via subscription.
    // We can remove the old handleInput and updatePosition methods.
    
    // If you need a method to handle a specific player action (e.g., a sword swing), 
    // it would go here, which the PhysicsEngine or a new 'ActionManager' would trigger.
}