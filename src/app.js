var gameLayer = cc.Layer.extend({
    leftFace: null,
    rightFace: null,
    turn: null,
    slapCooldown: null,
    defendCooldown: null,
    slapedFake: null,
    slaped: null,
    defend: null,
    slapsRight: null,
    slapsLeft: null,
    slapsRightLabel: null,
    slapsLeftLabel: null,
    rightBarBG: null,
    leftBarBG: null,
    rightBar: null,
    leftBar: null,
    infoLable: null,
    ctor: function() {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;
        this.turn = true;
        this.slapCooldown = 2;
        this.defendCooldown = 1;
        this.slaped = false;
        this.defend = false;
        this.slapsRight = 0;
        this.slapsLeft = 0;

        var bg = new cc.LayerColor(cc.color(225, 245, 196, 255), size.width, size.height);
        bg.setPosition(0, 0);
        this.addChild(bg);

        var closeItem = new cc.MenuItemSprite(
            new cc.Sprite(res.bttnNormal_png), // normal state image
            new cc.Sprite(res.bttnActive_png), //select state image
            function() {
                cc.LoaderScene.preload(g_resources, function() {
                    cc.director.runScene(new menuScene());
                }, this);
            }, this);
        closeItem.scale = 0.2;
        closeItem.attr({
            x: size.width / 2,
            y: size.height - 10,
            anchorX: 0.5,
            anchorY: 1
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        this.slapsRightLabel = new cc.LabelTTF("Slaps: " + this.slapsRight, "Arial", 38);
        this.slapsLeftLabel = new cc.LabelTTF("Slaps: " + this.slapsLeft, "Arial", 38);
        this.infoLable = new cc.LabelTTF("Defend - Attack", "Arial", 38);
        this.slapsRightLabel.x = size.width - 100;
        this.slapsLeftLabel.x = 100;
        this.infoLable.x = size.width / 2;

        this.slapsRightLabel.y = size.height - 30;
        this.slapsLeftLabel.y = size.height - 30;
        this.infoLable.y = size.height / 2;

        this.slapsRightLabel.setColor(cc.color(255, 78, 80));
        this.slapsLeftLabel.setColor(cc.color(255, 78, 80));
        this.infoLable.setColor(cc.color(255, 78, 80));

        this.addChild(this.slapsRightLabel);
        this.addChild(this.slapsLeftLabel);
        this.addChild(this.infoLable);


        this.leftFace = cc.DrawNode.create();
        this.addChild(this.leftFace);
        this.leftFace.attr({
            x: 0,
            y: size.height / 2,
            scale: 1.0,
            rotation: 0,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.leftFace.drawDot(cc.p(0, 0), 150, cc.color(255, 78, 80, 255));
        this.leftFace.drawDot(cc.p(0, 0), 145, cc.color(237, 229, 116));

        this.rightFace = cc.DrawNode.create();
        this.addChild(this.rightFace);
        this.rightFace.attr({
            x: size.width,
            y: size.height / 2,
            scale: 1.0,
            rotation: 0,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.rightFace.drawDot(cc.p(0, 0), 150, cc.color(255, 78, 80, 255));
        this.rightFace.drawDot(cc.p(0, 0), 145, cc.color(237, 229, 116));

        this.rightBarBG = cc.DrawNode.create();
        this.addChild(this.rightBarBG);
        this.rightBarBG.drawSegment(cc.p(0, 0), cc.p(100, 0), 8, cc.color(249, 212, 35));
        this.rightBarBG.drawSegment(cc.p(0, 0), cc.p(100, 0), 5, cc.color(252, 145, 58));
        this.rightBarBG.attr({
            x: 20,
            y: 20,
            scale: 1.0,
            rotation: 0,
            anchorX: 0.5,
            anchorY: 0.5
        });

        this.leftBarBG = cc.DrawNode.create();
        this.addChild(this.leftBarBG);
        this.leftBarBG.drawSegment(cc.p(0, 0), cc.p(100, 0), 8, cc.color(249, 212, 35));
        this.leftBarBG.drawSegment(cc.p(0, 0), cc.p(100, 0), 5, cc.color(252, 145, 58));
        this.leftBarBG.attr({
            x: size.width - 120,
            y: 20,
            scale: 1.0,
            rotation: 0,
            anchorX: 0.0,
            anchorY: 0.5
        });

        this.rightBar = cc.DrawNode.create();
        this.addChild(this.rightBar);
        this.rightBar.drawSegment(cc.p(0, 0), cc.p(100, 0), 5, cc.color(255, 78, 80));
        this.rightBar.attr({
            x: size.width - 120,
            y: 20,
            scale: 1.0,
            rotation: 0,
            anchorX: 0.5,
            anchorY: 0.5
        });

        this.leftBar = cc.DrawNode.create();
        this.addChild(this.leftBar);
        this.leftBar.drawSegment(cc.p(100, 0), cc.p(0, 0), 5, cc.color(255, 78, 80));
        this.leftBar.attr({
            x: 20,
            y: 20,
            scale: 1.0,
            rotation: 0,
            anchorX: 1.0,
            anchorY: 0.5
        });

        /*this.sprite.runAction(
            cc.sequence(
                cc.rotateTo(2, 0),
                cc.scaleTo(2, 1, 1)
            )
        );*/
        var that = this;
        var scale = null;
        var scale2 = null;
        if (cc.sys.capabilities.hasOwnProperty('keyboard')) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,

                onKeyPressed: function(key, event) {
                    if (key === 13) { // EnterKey
                        cc.log("Right: " + key.toString());
                        if (that.turn) {
                            that.attackAction();
                            scale = cc.scaleBy(0.5, 0, 1);
                            scale2 = cc.scaleTo(that.slapCooldown - 0.5, 1, 1);
                            that.rightBar.runAction(
                                cc.sequence(
                                    scale,
                                    scale2
                                )
                            );
                        } else {
                            that.defendAction();
                            scale = cc.scaleBy(0.5, 0, 1);
                            scale2 = cc.scaleTo(that.defendCooldown - 0.5, 1, 1);
                            that.rightBar.runAction(
                                cc.sequence(
                                    scale,
                                    scale2
                                )
                            );
                        }
                    } else if (key === 32) { // spaceBarKey
                        cc.log("Left: " + key.toString());
                        if (!that.turn) {
                            that.attackAction();
                            scale = cc.scaleBy(0.5, 0, 1);
                            scale2 = cc.scaleTo(that.slapCooldown - 0.5, 1, 1);
                            that.leftBar.runAction(
                                cc.sequence(
                                    scale,
                                    scale2
                                )
                            );
                        } else {
                            that.defendAction();
                            scale = cc.scaleBy(0.5, 0, 1);
                            scale2 = cc.scaleTo(that.defendCooldown - 0.5, 1, 1);
                            that.leftBar.runAction(
                                cc.sequence(
                                    scale,
                                    scale2
                                )
                            );
                        }
                    }
                }
            }, this);
        }
        this.schedule(this.timerHandler, 1);
        return true;
    },
    timerHandler: function() {
        /*cc.log("Slaped: " + this.slaped);
        cc.log("Defended: " + this.defend);
        cc.log("Turn: " + this.turn);*/
        if (this.slaped) {
            cc.log("slapCooldown: " + this.slapCooldown);
            if (this.slapCooldown > 0) {
                this.slapCooldown--;
            } else {
                this.slaped = false;
                this.slapCooldown = 2;
            }
        }
        if (this.defend) {
            cc.log("defendCooldown: " + this.defendCooldown);
            if (this.defendCooldown > 0) {
                this.defendCooldown--;
            } else {
                this.defend = false;
                this.defendCooldown = 1;
            }
        }
    },
    gameOver: function() {
        cc.LoaderScene.preload(g_resources, function() {
            cc.director.runScene(new menuScene());
        }, this);
    },
    attackAction: function() {
        cc.log("Attack");
        if (!this.slaped) {
            this.slaped = true;
            if (!this.defend) {
                if (this.turn) {
                    this.slapsRight++;
                    this.slapsRightLabel.setString("Slaps: " + this.slapsRight);
                } else {
                    this.slapsLeft++;
                    this.slapsLeftLabel.setString("Slaps: " + this.slapsLeft);
                }
                if (this.slapsLeft === 3 || this.slapsRight === 3) {
                    this.gameOver();
                }
            } else {
                this.slapsRight = 0;
                this.slapsLeft = 0;
                this.slapsRightLabel.setString("Slaps: " + this.slapsRight);
                this.slapsLeftLabel.setString("Slaps: " + this.slapsLeft);
                this.turn = !this.turn;
                if (this.turn) {
                    this.infoLable.setString("Defend - Attack");
                } else {
                    this.infoLable.setString("Attack - Defend");
                }
            }
        }
    },
    defendAction: function() {
        cc.log("Defend");
        if (!this.defend) {
            this.defend = true;
        }
    }
});

var gameScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new gameLayer();
        this.addChild(layer);
    }
});