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
        this.handleGamepadConnected = this.handleGamepadConnected.bind(this);
        this.handleGamepadDisconnected = this.handleGamepadDisconnected.bind(this);

        this.movementListeners = [];
        this.gamepadIndex = null;
        this.gamepadDeadzone = 0.15; // Ignore small stick movements
        this.gamepadButtonStates = {};
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

    handleGamepadConnected(event) {
        this.gamepadIndex = event.gamepad.index;
    }

    handleGamepadDisconnected(event) {
        if (this.gamepadIndex === event.gamepad.index) {
            this.gamepadIndex = null;
            // Clear any active gamepad inputs
            this.clearGamepadInputs();
        }
    }

    clearGamepadInputs() {
        // Clear all gamepad-initiated key states
        const hadInput = this.keys.left || this.keys.right || this.keys.up || this.keys.down || this.keys.jump;
        
        this.keys.left = false;
        this.keys.right = false;
        this.keys.up = false;
        this.keys.down = false;
        this.keys.jump = false;
        
        if (hadInput) {
            this.notifyListeners();
        }
    }

    pollGamepad() {
        if (this.gamepadIndex === null) return;

        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[this.gamepadIndex];
        
        if (!gamepad) return;
        let stateChanged = false;

        // D-Pad (buttons 12-15 on standard mapping)
        const dpadUp = gamepad.buttons[12]?.pressed || false;
        const dpadDown = gamepad.buttons[13]?.pressed || false;
        const dpadLeft = gamepad.buttons[14]?.pressed || false;
        const dpadRight = gamepad.buttons[15]?.pressed || false;

        // Left analog stick (axes 0 = horizontal, 1 = vertical)
        const leftStickX = gamepad.axes[0] || 0;
        const leftStickY = gamepad.axes[1] || 0;

        // Apply deadzone
        const stickLeft = leftStickX < -this.gamepadDeadzone;
        const stickRight = leftStickX > this.gamepadDeadzone;
        const stickUp = leftStickY < -this.gamepadDeadzone;
        const stickDown = leftStickY > this.gamepadDeadzone;

        // Combine D-pad and analog stick for directional input
        const newLeft = dpadLeft || stickLeft;
        const newRight = dpadRight || stickRight;
        const newUp = dpadUp || stickUp;
        const newDown = dpadDown || stickDown;

        // Jump buttons: A button (0) or B button (1)
        const jumpPressed = gamepad.buttons[0]?.pressed || gamepad.buttons[1]?.pressed || false;

        // Update keys only if changed
        if (this.keys.left !== newLeft) {
            this.keys.left = newLeft;
            stateChanged = true;
        }
        if (this.keys.right !== newRight) {
            this.keys.right = newRight;
            stateChanged = true;
        }
        if (this.keys.up !== newUp) {
            this.keys.up = newUp;
            stateChanged = true;
        }
        if (this.keys.down !== newDown) {
            this.keys.down = newDown;
            stateChanged = true;
        }

        // Handle jump with button press/release detection
        const wasJumpPressed = this.gamepadButtonStates.jump || false;
        this.gamepadButtonStates.jump = jumpPressed;

        // Trigger jump on button press (not hold)
        if (jumpPressed && !wasJumpPressed) {
            this.keys.jump = true;
            stateChanged = true;
        } else if (!jumpPressed && this.keys.jump) {
            this.keys.jump = false;
            stateChanged = true;
        }

        if (stateChanged) {
            this.notifyListeners();
        }
    }

    startListening() {
        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);

        // Gamepad events
        window.addEventListener('gamepadconnected', this.handleGamepadConnected);
        window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected);

        // Check for already connected gamepads
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                this.gamepadIndex = i;
                alert('Gamepad already connected:', gamepads[i].id);
                break;
            }
        }

        // Start polling gamepad state (needs to be called every frame)
        this.startGamepadPolling();
    }

    startGamepadPolling() {
        const poll = () => {
            this.pollGamepad();
            this.gamepadPollingId = requestAnimationFrame(poll);
        };
        poll();
    }

    stopListening() {
        // Keyboard events
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);

        // Gamepad events
        window.removeEventListener('gamepadconnected', this.handleGamepadConnected);
        window.removeEventListener('gamepaddisconnected', this.handleGamepadDisconnected);

        // Stop gamepad polling
        if (this.gamepadPollingId) {
            cancelAnimationFrame(this.gamepadPollingId);
            this.gamepadPollingId = null;
        }
    }
}