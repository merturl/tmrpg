import React, { Component } from 'react';
import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import io from 'socket.io-client';

class PhaserContainer extends Component {
  game = null;
  client = null;

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  

  componentDidMount() {
    console.log("componentDidMount");
    this.client = io.connect();
    console.log(this.client);
    this.client.on('disconnect', function(){
      console.log("HHHHEEE");
    });

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
      scene: [new GameScene(this.client)]
    };
    
    if (!this.game) {
      this.game = new Phaser.Game(config);
    }
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
    this.client.disconnect();
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