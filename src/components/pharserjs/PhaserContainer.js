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

function preload() {
  this.load.spritesheet('spear_move_up',
    'assets/Spear_Move_Up.png',
    { frameWidth: 64, frameHeight: 64 }
  );
  this.load.spritesheet('spear_move_down',
    'assets/Spear_Move_Down.png',
    { frameWidth: 64, frameHeight: 64 }
  );
  this.load.spritesheet('spear_move_left',
    'assets/Spear_Move_Left.png',
    { frameWidth: 64, frameHeight: 64 }
  );
  this.load.spritesheet('spear_move_right',
    'assets/Spear_Move_Right.png',
    { frameWidth: 64, frameHeight: 64 }
  );
}

function create() {
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
}

function update() {
  console.log(this);
  const cursors = this.input.keyboard.createCursorKeys();
  player.setVelocity(0, 0);
  if (cursors.up.isDown) {
    player.setVelocityY(-160);
    player.anims.play('up', true);

  } else if (cursors.down.isDown) {
    player.setVelocityY(160);
    player.anims.play('down', true);

  } else if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);

  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);

  }

  if (cursors.up.isDown && cursors.left.isDown) {
    player.setVelocityY(-160);
    player.setVelocityX(-160);
    player.anims.play('up', true);

  } else if (cursors.up.isDown && cursors.right.isDown) {
    player.setVelocityY(-160);
    player.setVelocityX(160);
    player.anims.play('up', true);

  } else if (cursors.down.isDown && cursors.left.isDown) {
    player.setVelocityY(160);
    player.setVelocityX(-160);
    player.anims.play('down', true);

  } else if (cursors.down.isDown && cursors.right.isDown) {
    player.setVelocityY(160);
    player.setVelocityX(160);
    player.anims.play('down', true);

  }

  console.log("update");
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