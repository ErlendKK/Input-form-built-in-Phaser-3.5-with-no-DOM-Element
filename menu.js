gameState = {}

class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        //Button Sprites by Ian Eborn.
        //Background Image by Erlend Kulander Kvitrud from the game Punk Rock Samurai
        this.load.image('bgLoadingScreen', 'assets/bgLoadingScreen.jpg');
        this.load.image('rectangularFrame', 'assets/stoneButtonFrame.png');
        this.load.image('rectangularButton', 'assets/stoneButtonInsetReady.png');
        this.load.image('rectangularButtonHovered', 'assets/stoneButtonInsetHovered.png');
    };

    create() {
        const self = this;
        this.input.keyboard.createCursorKeys();
        this.add.image(550,480, 'bgLoadingScreen').setScale(1.40);


        // Initiate form and input field
        const nameTextConfig = { fontSize: '23px', fill: '#000000' };
        gameState.name = 'Enter your name...';
        gameState.nameText = this.add.text(420, 315, gameState.name, nameTextConfig).setDepth(21);
        gameState.isEnteringName = false;

        const formFrame = this.add.image(550, 325, 'rectangularFrame');
        formFrame.setScale(1.2, 0.60).setInteractive().setDepth(22);
        
        const nameForm = this.add.graphics({x: 400, y: 290});
        nameForm.fillStyle(0xFFFFFF, 1).setAlpha(0.90).setDepth(20);
        nameForm.fillRect(0, 0, 300, 65);
        nameForm.setInteractive(new Phaser.Geom.Rectangle(0, 0, 300, 65), Phaser.Geom.Rectangle.Contains);
        
        activateNameForm(nameForm);
        activateNameForm(formFrame); // Delete if you're not using a frame

        
        // Initiate "start game" button
        const startGameButton = this.add.image(550, 400, 'rectangularButton');
        startGameButton.setScale(1.2, 0.60).setInteractive();

        const buttonTextConfig = { fontSize: '28px', fill: '#000000' };
        const startGameText = this.add.text(470, 387, "Let\'s go!", buttonTextConfig);
        
        startGameButton.on('pointerdown', () => startgame() );
        animateButton(startGameButton);


        // Initiate blinking cursor
        const cursorConfig = { fontSize: '32px', fill: '#000000' };
        gameState.formCursor = this.add.text(420, 310, '|', cursorConfig);
        gameState.formCursor.setDepth(21).setAlpha(0);

        const cursorTween = this.tweens.add({
            targets: gameState.formCursor,
            alpha: 1,
            duration: 300,
            hold: 600,
            yoyo: true,
            repeat: -1,
            paused: true
        });


        // Initiate the on-screen keyboard for mobile devices
        function isMobileDevice() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        };

        if (isMobileDevice()) {
            gameState.hiddenInput = document.createElement('input');
            gameState.hiddenInput.style.position = 'absolute';
            gameState.hiddenInput.style.opacity = '0';
            gameState.hiddenInput.style.zIndex = '-1';
            document.body.appendChild(gameState.hiddenInput);

            gameState.hiddenInput.addEventListener('input', function(event) {
                gameState.name = event.target.value;
            });

            gameState.hiddenInput.addEventListener('focus', function() {
                gameState.hiddenInput.scrollIntoView({ behavior: 'smooth' });
            });
            
        };

        
        // Activate/ deactivate the input form
        function activateNameForm (gameObject) {   
            gameObject.on('pointerup', () => {

                if (!gameState.isEnteringName) { 

                    // isEnteringName is used to turn on and off the recording of key strokes.
                    gameState.isEnteringName = true;

                    // Reset name form
                    if (gameState.name === 'Enter your name...') {
                        gameState.name = '';
                    }

                    // Add blinking cursor
                    gameState.formCursor.setAlpha(0);
                    cursorTween.resume();

                    // Activate the on-screen keyboard for mobile devices
                    if (isMobileDevice()) {
                        gameState.hiddenInput.focus();
                    }
                    
                    // deactivateNameForm() must be called after a short delay to ensure that the pointerup  
                    // event that called activateNameForm() doesn't inadvertently call it as well.
                    self.time.delayedCall(200, () => {
                        deactivateNameForm();
                    })
                };
            })
        };

        function deactivateNameForm() {
            self.input.off('pointerup');
            self.input.once('pointerup', () => {

                if (gameState.isEnteringName) {
                    let delayTime = 0;
                    
                    // Reset form if it's empty
                    if (!gameState.name) {
                        gameState.name = 'Enter your name...';
                        delayTime = 100; // Gives Update() time to update the name field before !isEnteringName.
                    };

                    // Deactivates typing
                    self.time.delayedCall(delayTime, () => {
                        gameState.isEnteringName = false;
                    })

                    // Remove cursor
                    gameState.formCursor.setAlpha(0);
                    cursorTween.pause();

                    // Deactivate the on-screen keyboard for mobile devices
                    if (isMobileDevice()) {
                        gameState.hiddenInput.blur();
                    }
                }
            });
        }
        
        // Log key strokes if isEnteringName === true
        this.input.keyboard.on('keydown', (event) => {
            if (gameState.isEnteringName) {

                // Cap the name length to keep the text from overflowing the form
                const maxNameLength = 16
                
                // Implement backspace
                if (event.keyCode === 8 && gameState.name.length > 0) {
                    gameState.name = gameState.name.slice(0, -1);
                    
                // Add any other characters you want to allow    
                } else if (event.key.length === 1 && event.key.match(/[a-zA-Z0-9\s\-_]/) && gameState.name.length < maxNameLength) {
                    gameState.name += event.key;

                // Gently informs the player that its time to stop typing
                } else if (gameState.name.length === maxNameLength) {
                    self.cameras.main.shake(30, .0010, false);
                }
            }    
        });

        function startgame() {
            if (gameState.name === 'Enter your name...' || gameState.name === '') {
                gameState.name = 'Punk Rock Samurai'; // Set your own default name 
            };

            console.log(`Name: ${gameState.name}`);

            // Replace with your code to start the game
            self.cameras.main.fadeOut(1000);
            self.cameras.main.shake(1000, .0030, false);
        };    

        // Updates the button sprite in response to pointerover/ pointerout events
        function animateButton(button) {
            button.on('pointerover', function () {
                this.setTexture('rectangularButtonHovered');
            });
                
            button.on('pointerout', function () {
                this.setTexture('rectangularButton');
            });
        };

    } // end of create()

    update() {
        let textWidth = 0;

        if (gameState.isEnteringName) {
            // Dynamically updates the displayed input text as it is being typed
            gameState.nameText.setText(gameState.name);
            textWidth = gameState.nameText.width;

            // Dynamically positions the cursor at the end of the typed text
            gameState.formCursor.x = gameState.nameText.x + textWidth - 7;
        }
    };

} // end of scene

const config = {
    type: Phaser.AUTO,
    width: 1100,
    height: 680,
    scene: Menu,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
};

const game = new Phaser.Game(config);
