export class InputManager {
    constructor() {
        this.keys = {};
        this.keyMap = {
            'w': 'up', 'W': 'up', 'ArrowUp': 'up',
            's': 'down', 'S': 'down', 'ArrowDown': 'down',
            'a': 'left', 'A': 'left', 'ArrowLeft': 'left',
            'd': 'right', 'D': 'right', 'ArrowRight': 'right',
            ' ': 'jump'
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.movementListeners = [];
    }

    // A method for the Player/PhysicsEngine to subscribe to changes
    subscribe(callback) {
        this.movementListeners.push(callback);
    }

    unsubscribe(callback) {
        this.movementListeners = this.movementListeners.filter(l => l !== callback);
    }

    notifyListeners() {
        // Send the current state of movement flags to all subscribers
        this.movementListeners.forEach(callback => callback(this.keys));
    }

    handleKeyDown(event) {
        const action = this.keyMap[event.key];
        if (action && this.keys[action] !== true) {
            this.keys[action] = true;
            this.notifyListeners();
        }
    }

    handleKeyUp(event) {
        const action = this.keyMap[event.key];
        if (action && this.keys[action] !== false) {
            this.keys[action] = false;
            this.notifyListeners();
        }
    }

    startListening() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    stopListening() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
}