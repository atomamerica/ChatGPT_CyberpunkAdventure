        let player = {
            health: 100,
            attack: 10,
            cred: 100,
            inventory: []
        };

        let enemies = {
            'thug': { health: 50, attack: 15, cred: 20 },
            'cybernetic beast': { health: 100, attack: 25, cred: 50 }
        };

        let items = {
            'health potion': { health: 30 },
            'strength potion': { attack: 10 }
        };

        let currentEnemy = null;
        let gameState = 'start';
        let barState = 'main';
        let cityState = 'main';

        let characters = {
            'cyberDoc': {
                dialogue: 'Care for an upgrade, chummer?',
                options: ['Buy health potion', 'Buy strength potion'],
                itemCost: 50,
                art: '\n\
            __\n\
            (>_<)\n'
            },
            'hackers': {
                dialogue: 'Heard about the beast in the city. You might need this.',
                giveItem: 'strength potion',
                art: '\n\
            __\n\
            o o\n\
            |=<\n'
            }
        };

        let gameStates = {
            'start': {
                'description': 'You are standing in a neon-lit alleyway in the heart of the city. To one side, there\'s a sleazy dive bar. To the other, the dark corners of the metropolis.',
                'options': ['Enter the bar', 'Explore the city'],
                'art': '\n\
            _..-----._\n\
            .'          '.__\n\
            :               .\'-\n\
            :               :\n\
            \'.             ;\n\
            `\'-._..---.._\'\n'
            },
            'bar': {
                'main': {
                    'description': 'You step into the grimy dive bar, the smell of cheap alcohol and stale smoke hitting your senses.',
                    'options': ['Talk to the cyberDoc', 'Talk to the hackers', 'Exit the bar'],
                    'art': '\n\
            __....____,\n\
        .:\'  o    `-. \n\
        .\'`-._..---.._\n\
        ;-\'`;` ;  ; ; ;`_\n\
        .\'   `  `  `  `  `;\n\
        :   .------. :   :\n\
        :  /        \\  :  :\n\
        \'.            ;  .\'\n\
        `"-......-"\`\'\n'
                }
            },
            'city': {
                'main': {
                    'description': 'You delve deeper into the city\'s dark underbelly.',
                    'options': ['Encounter a random enemy', 'Return to the alley'],
                    'art': '\n\
            .-""""""-.\n\
            .\'          \'.\n\
            /   O      O  \\\n\
            :           :\n\
            |           |\n\
            :           :\n\
            \'.         .\'\n\
            `"-......-"\`\n'
                },
                'fight': {
                    'description': 'A ' + currentEnemy + ' appears!',
                    'options': ['Fight', 'Run'],
                    'art': enemies[currentEnemy].art
                }
            }
        };

        function printInventory() {
            let inventoryElement = document.getElementById('inventory');
            inventoryElement.textContent = 'Inventory: ' + player.inventory.join(', ');
        }

        function generateRandomEnemy() {
            let enemyNames = Object.keys(enemies);
            let randomIndex = Math.floor(Math.random() * enemyNames.length);
            return enemyNames[randomIndex];
        }

        function encounterEnemy() {
            currentEnemy = generateRandomEnemy();
            cityState = 'fight';
            gameStates.city.fight.description = 'A ' + currentEnemy + ' appears!';
        }

        function runFromEnemy() {
            cityState = 'main';
            gameStates.city.fight.description = '';
        }

        function fightEnemy() {
            let enemy = enemies[currentEnemy];
            player.health -= enemy.attack;
            enemy.health -= player.attack;
            if (player.health <= 0) {
                gameState = 'gameover';
            } else if (enemy.health <= 0) {
                player.cred += enemy.cred;
                enemy.health = 100; // reset enemy health
                currentEnemy = null;
                cityState = 'main';
                gameStates.city.fight.description = '';
            }
        }

        function useItem(itemName) {
            let item = items[itemName];
            player.health += item.health || 0;
            player.attack += item.attack || 0;
            let itemIndex = player.inventory.indexOf(itemName);
            if (itemIndex > -1) {
                player.inventory.splice(itemIndex, 1);
            }
        }

        function buyItem(itemName) {
            if (player.cred >= 50) {
                player.cred -= 50;
                player.inventory.push(itemName);
            } else {
                storyElement.textContent = "You don't have enough cred.";
            }
        }

        function talkTo(characterName) {
            let character = characters[characterName];
            let dialogueElement = document.getElementById('dialogue');
            dialogueElement.textContent = character.dialogue;
            if (character.options) {
                optionsElement.textContent = 'Options: ' + character.options.join(', ');
            }
            if (character.giveItem) {
                player.inventory.push(character.giveItem);
                printInventory();
            }
        }

        function chooseAction(action) {
            if (gameState === 'start') {
                gameState = action === 1 ? 'bar' : 'city';
                if (gameState === 'city') {
                    cityState = 'main';
                } else if (gameState === 'bar') {
                    barState = 'main';
                }
            } else if (gameState === 'bar') {
                if (action === 1) {
                    talkTo('cyberDoc');
                } else if (action === 2) {
                    talkTo('hackers');
                } else if (action === 3) {
                    gameState = 'start';
                }
            } else if (gameState === 'city') {
                if (cityState === 'main') {
                    if (action === 1) {
                        encounterEnemy();
                    } else if (action === 2) {
                        gameState = 'start';
                    }
                } else if (cityState === 'fight') {
                    if (action === 1) {
                        fightEnemy();
                    } else if (action === 2) {
                        runFromEnemy();
                    }
                }
            }

            updateStory();
        }

        // Get the necessary DOM elements
        let storyElement = document.getElementById('story');
        let optionsElement = document.getElementById('options');
        let inventoryElement = document.getElementById('inventory');
        let dialogueElement = document.getElementById('dialogue');

        // Function to update the game story and options on the screen
        function updateStory() {
            let currentState = gameStates[gameState][cityState || barState];
            storyElement.textContent = currentState.description;
            optionsElement.textContent = 'Options: ' + currentState.options.join(', ');
            printInventory();
        }

        // Function to print the player's inventory on the screen
        function printInventory() {
            inventoryElement.textContent = 'Inventory: ' + player.inventory.join(', ');
        }

        // Add event listener to handle player input
        document.addEventListener('keydown', function(event) {
            if (event.key === '1') {
                chooseAction(1);
            } else if (event.key === '2') {
                chooseAction(2);
            }
        });

        // Call the initial game update
        updateStory();
