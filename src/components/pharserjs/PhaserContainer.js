import React, { Component } from 'react';
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let player = null;
let last_state = null;

function preload() {
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

function create() {
  last_state = 'up';
  player = this.physics.add.sprite(500, 500, 'spear_move_up');


  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

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

function update() {
  const cursors = this.input.keyboard.createCursorKeys();
  player.setVelocity(0, 0);
  if (cursors.up.isDown) {
    player.setVelocityY(-160);
    player.anims.play('up', true);
    last_state = 'up';

  } else if (cursors.down.isDown) {
    player.setVelocityY(160);
    player.anims.play('down', true);
    last_state = 'down';

  } else if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
    last_state = 'left';

  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
    last_state = 'right';

  }

  if (cursors.up.isDown && cursors.left.isDown) {
    player.setVelocityY(-160);
    player.setVelocityX(-160);
    player.anims.play('up', true);
    last_state = 'up';

  } else if (cursors.up.isDown && cursors.right.isDown) {
    player.setVelocityY(-160);
    player.setVelocityX(160);
    player.anims.play('up', true);
    last_state = 'up';

  } else if (cursors.down.isDown && cursors.left.isDown) {
    player.setVelocityY(160);
    player.setVelocityX(-160);
    player.anims.play('down', true);
    last_state = 'down';

  } else if (cursors.down.isDown && cursors.right.isDown) {
    player.setVelocityY(160);
    player.setVelocityX(160);
    player.anims.play('down', true);
    last_state = 'down';

  }

  if (cursors.space.isDown) {
    if (last_state == 'up') {
      console.log("up");
      player.anims.play('space_up', true);

    } else if(last_state == 'down') {
      console.log("down");
      player.anims.play('space_down', true);

    } else if(last_state == 'left') {
      console.log("left");
      player.anims.play('space_left', true);
      
    } else if(last_state == 'right') {
      console.log("right");
      player.anims.play('space_right', true);

    }
  }
}



class PhaserContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    console.log(this);
    this.game = new Phaser.Game(config);
    console.log(this);
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
    this.game.destroy();
  }

  render() {
    return (
      <div className="phaserContainer" id="phaser-container">
      </div>
    );
  }
}

PhaserContainer.defaultProps = {
  name: '기본이름'
};

export default PhaserContainer;