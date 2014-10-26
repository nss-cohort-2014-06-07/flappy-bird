var game = new Phaser.Game(800, 600, Phaser.AUTO, 'flappybird');

// ************************************************************************** //

var menu = (function(){

  var o = {
    l : {},
    preload: function(){
      game.load.image('sky', '/assets/sky.png');
      game.load.image('start', '/assets/start.png');
    },
    create: function(){
      game.add.sprite(0, 0, 'sky');

      var button = game.add.button(game.world.centerX, game.world.centerY, 'start', o.l.startGame);
      button.anchor.setTo(0.5);
      button.scale.setTo(0.5);

      var text = game.add.text(game.world.centerX, game.world.centerY - button.height, 'Flappy Bird');
      text.anchor.setTo(0.5);
    },
  };

  o.l.startGame = function(){
    game.state.start('level1');
  };

  return o;

})();

// ************************************************************************** //

var level1 = (function(){

  var o = {
    l : {},
    preload: function(){
      game.load.image('sky', '/assets/sky.png');
      game.load.image('pipe', '/assets/pipe.png');
      game.load.spritesheet('dude', '/assets/dude.png', 32, 48);
      game.load.audio('jump', '/assets/pusher.wav');
      game.load.audio('song', '/assets/music.mp3');
    },
    create: function(){
      game.physics.startSystem(Phaser.Physics.ARCADE);

      o.l.jumpSound = game.add.audio('jump');
      o.l.song = game.add.audio('song');
      o.l.song.loop = true;
      o.l.song.play();

      game.add.sprite(0, 0, 'sky');

      o.l.dude = game.add.sprite(10,10, 'dude');
      o.l.dude.anchor.setTo(-0.2, 0.5);
      o.l.dude.animations.add('right', [5, 6, 7, 8], 10, true);
      game.physics.arcade.enable(o.l.dude);
      o.l.dude.body.gravity.y = 1000;

      var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      spaceKey.onDown.add(o.l.jump);

      o.l.pipes = game.add.group();
      o.l.pipes.enableBody = true;
      o.l.pipes.createMultiple(50, 'pipe');

      o.l.score = 0;
      o.l.txtScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

      game.time.events.loop(1000, o.l.addRowOfPipes);
    },
    update: function(){
      if(!o.l.dude.inWorld)
        o.l.gameOver();

      o.l.dude.animations.play('right');
      game.physics.arcade.overlap(o.l.dude, o.l.pipes, o.l.gameOver);
    }
  };

  o.l.gameOver = function(){
    game.state.restart();
    o.l.song.destroy();
  };

  o.l.jump = function(){
    game.add.tween(o.l.dude).to({angle: -20}, 100).start();
    o.l.dude.body.velocity.y = -350;
    o.l.jumpSound.play();
  };

  o.l.addRowOfPipes = function(){
    o.l.score++;
    o.l.txtScore.text = o.l.score;

    var hole = Math.floor(Math.random() * 5) + 1;
    for (var i = 0; i < 10; i++)
      if (i != hole && i != hole + 1)
        o.l.addOnePipe(400, i * 60 + 10);
  };

  o.l.addOnePipe = function(x, y){
    var pipe = o.l.pipes.getFirstDead();

    pipe.reset(x, y);

    pipe.body.velocity.x = -200;

    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  };

  return o;

})();

// ************************************************************************** //

game.state.add('menu', menu);
game.state.add('level1', level1);
game.state.start('menu');
