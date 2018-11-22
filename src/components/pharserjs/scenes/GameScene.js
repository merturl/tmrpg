import Phaser from 'phaser';
import io from 'socket.io-client';

class GameScene extends Phaser.Scene {
  client = null;
  playerMap = null;
  constructor(client) {
    super({ key: 'GameScene' });
    this.client = client;
    this.playerMap = {};
    this.client.on('newplayer', (function (newplayer) {
      console.log(this);
      this.addNewPlayer(newplayer);
    }).bind(this));

    this.client.on('allplayers', (function (allplayers) {
      for (const player of Object.values(allplayers)) {
        this.addNewPlayer(player);
      }
    }).bind(this));

    this.client.on('movePlayer', (function (player) {
      this.movePlayer(player);
    }).bind(this));
  }

  askNewPlayer() {
    this.client.emit('newplayer');
  }
  
  sendKeyDown(pointer) {
    this.client.emit('keydown', JSON.stringify(pointer));
  }

  addNewPlayer(player) {
    if (!this.playerMap[player.id]) {
      this.playerMap[player.id] = this.physics.add.sprite(player.x, player.y, 'spear_move_up');
      this.playerMap[player.id].setBounce(0.2);
      this.playerMap[player.id].setCollideWorldBounds(true);
      this.playerMap[player.id].direction = player.direction;
    }
  }

  movePlayer(player) {
    console.log(player.id);
    console.log(this.playerMap);
    this.playerMap[player.id].x +=player.x;
    this.playerMap[player.id].y +=player.y;
    this.playerMap[player.id].anims.play(player.direction, true);
    this.playerMap[player.id].direction = player.direction;
  }

  stopPlayer(id) {
    this.playerMap[id].setVelocityX(0);
    this.playerMap[id].setVelocityY(0);
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
    this.askNewPlayer();

    this.last_state = 'up';
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
}

export default GameScene;