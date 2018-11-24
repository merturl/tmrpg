import React, { Component } from 'react';
import Phaser from "phaser";
import GameScene from "./scenes/GameScene";

class PhaserContainer extends Component {
  game = null;

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  

  componentDidMount() {
    console.log("componentDidMount");
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
      scene: [new GameScene()]
    };
    
    if (!this.game) {
      this.game = new Phaser.Game(config);
    }
  }

  componentWillUnmount() {
    this.game.scene.destroy('GameScene')
    this.game.destroy();
    console.log("componentWillUnmount");
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