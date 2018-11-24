import Phaser from 'phaser';
import io from 'socket.io-client';

class GameScene extends Phaser.Scene {
  client = null;
  playerMap = null;
  constructor(sceneName) {
    super({ key: sceneName });
    console.log("constructor");
  }

  askNewPlayer() {
    this.client.emit('askNewPlayer');
  }

  sendKeyDown(pointer) {
    this.client.emit('keydown', JSON.stringify(pointer));
  }

  addPlayer(player) {
    if (!this.playerMap[player.id]) {
      this.playerMap[player.id] = this.physics.add.sprite(player.x, player.y, 'spear_move_up');
      this.playerMap[player.id].setBounce(0.2);
      this.playerMap[player.id].setCollideWorldBounds(true);
      this.playerMap[player.id].direction = player.direction;
    }
  }

  removePlayer(id) {
    if (this.playerMap[id]) {
      this.playerMap[id].destroy()
      delete this.playerMap[id]
    }
  }

  currentPlayers(players) {
    for (const player of Object.values(players)) {
      if (!this.playerMap[player.id]) {
        this.playerMap[player.id] = this.physics.add.sprite(player.x, player.y, 'spear_move_up');
        this.playerMap[player.id].setBounce(0.2);
        this.playerMap[player.id].setCollideWorldBounds(true);
        this.playerMap[player.id].direction = player.direction;
      }
    }
  }

  movePlayer(player) {
    if (this.playerMap[player.id]) {
      this.playerMap[player.id].x += player.x;
      this.playerMap[player.id].y += player.y;
      this.playerMap[player.id].direction = player.direction;
      this.playerMap[player.id].anims.play(player.direction, true);
    }
  }

  init() {
    console.log("init");
    this.events.on('destroy', this.shutdown, this);
  }

  preload() {
    console.log("preload");
    //spear move 
    this.load.spritesheet('spear_move_up',
      'assets/spear/move/Spear_Move_Up.png',
      { frameWidth: 64, frameHeight: 64 }
    );
    this.load.spritesheet('spear_move_down',
      'assets/spear/move/Spear_Move_Down.png',
      { frameWidth: 64, frameHeight: 64 }
    );
    this.load.spritesheet('spear_move_left',
      'assets/spear/move/Spear_Move_Left.png',
      { frameWidth: 64, frameHeight: 64 }
    );
    this.load.spritesheet('spear_move_right',
      'assets/spear/move/Spear_Move_Right.png',
      { frameWidth: 64, frameHeight: 64 }
    );

    //spear attack
    this.load.spritesheet('spear_attack_up',
      'assets/spear/attack/Spear_Attack_Up.png',
      { frameWidth: 64, frameHeight: 64 }
    );
    this.load.spritesheet('spear_attack_down',
      'assets/spear/attack/Spear_Attack_Down.png',
      { frameWidth: 64, frameHeight: 64 }
    );
    this.load.spritesheet('spear_attack_left',
      'assets/spear/attack/Spear_Attack_Left.png',
      { frameWidth: 64, frameHeight: 64 }
    );
    this.load.spritesheet('spear_attack_right',
      'assets/spear/attack/Spear_Attack_Right.png',
      { frameWidth: 64, frameHeight: 64 }
    );
  }

  create() {
    console.log("create");
    if (!this.client) {
      this.client = io.connect();
      this.client.on('addPlayer', (player) => { this.addPlayer(player) });
      this.client.on('removePlayer', (player) => { this.removePlayer(player) });
      this.client.on('currentPlayers', (players) => { this.currentPlayers(players) });
      this.client.on('movePlayer', (player) => { this.movePlayer(player) });
    }

    if (!this.client.connected) {
      this.client.connect();
    }

    
    if (!this.playerMap) {
      this.playerMap = {};
    }

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('spear_move_up', { start: 0, end: 9 }),
    });

    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('spear_move_down', { start: 0, end: 9 }),
    });

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('spear_move_left', { start: 0, end: 9 }),
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('spear_move_right', { start: 0, end: 9 }),
    });

    this.anims.create({
      key: 'space_up',
      frames: this.anims.generateFrameNumbers('spear_attack_up', { start: 0, end: 9 }),
    });

    this.anims.create({
      key: 'space_down',
      frames: this.anims.generateFrameNumbers('spear_attack_down', { start: 0, end: 9 }),
    });

    this.anims.create({
      key: 'space_left',
      frames: this.anims.generateFrameNumbers('spear_attack_left', { start: 0, end: 9 }),
    });

    this.anims.create({
      key: 'space_right',
      frames: this.anims.generateFrameNumbers('spear_attack_right', { start: 0, end: 9 }),
    });

    this.askNewPlayer();
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    const pointer = { x: 0, y: 0, direction: 'up' }
    if (cursors.up.isDown) {
      if (cursors.left.isDown) {
        pointer.x = -5;
        pointer.y = -5;
        pointer.direction = 'up';

        this.sendKeyDown(pointer);
      } else if (cursors.right.isDown) {
        pointer.x = 5;
        pointer.y = -5;
        pointer.direction = 'up';

        this.sendKeyDown(pointer);

      } else {
        pointer.x = 0;
        pointer.y = -5;
        pointer.direction = 'up';

        this.sendKeyDown(pointer);
      }
    } else if (cursors.down.isDown) {
      if (cursors.left.isDown) {
        pointer.x = -5;
        pointer.y = 5;
        pointer.direction = 'down';

        this.sendKeyDown(pointer);
      } else if (cursors.right.isDown) {
        pointer.x = 5;
        pointer.y = 5;
        pointer.direction = 'down';

        this.sendKeyDown(pointer);

      } else {
        pointer.x = 0;
        pointer.y = 5;
        pointer.direction = 'down';

        this.sendKeyDown(pointer);
      }


    } else if (cursors.left.isDown) {
      pointer.x = -5;
      pointer.y = 0;
      pointer.direction = 'left';

      this.sendKeyDown(pointer);


    } else if (cursors.right.isDown) {
      pointer.x = 5;
      pointer.y = 0;
      pointer.direction = 'right';

      this.sendKeyDown(pointer);

    } else if (cursors.space.isDown) {
      if (this.last_state == 'up') {
        // this.player.anims.play('space_up', true);

      } else if (this.last_state == 'down') {
        // this.player.anims.play('space_down', true);

      } else if (this.last_state == 'left') {
        // this.player.anims.play('space_left', true);

      } else if (this.last_state == 'right') {
        // this.player.anims.play('space_right', true);
      }
    }
  }

  shutdown() {
    console.log("shutdown");
    if(this.client) {
      if (!this.client.disconnected) {
        this.client.disconnect();
      }
    }
  }
}

export default GameScene;