var menuLayer = cc.Layer.extend({
    ctor: function() {
        //1. call super class's ctor function
        this._super();
    },
    init: function() {
        //call super class's super function
        this._super();

        //2. get the screen size of your game canvas
        var winsize = cc.director.getWinSize();

        //3. calculate the center point
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);
        // Background
        var bg = new cc.LayerColor(cc.color(225, 245, 196, 255), winsize.width, winsize.height);
        bg.setPosition(0, 0);
        this.addChild(bg);

        var titleSprite = new cc.Sprite(res.title_png);
        titleSprite.setPosition(centerpos);
        titleSprite.scale = 0.2;
        this.addChild(titleSprite);


        //5.
        cc.MenuItemFont.setFontSize(60);

        //6.create a menu and assign onPlay event callback to it
        var menuItemPlay = new cc.MenuItemSprite(
            new cc.Sprite(res.bttnNormal_png), // normal state image
            new cc.Sprite(res.bttnActive_png), //select state image
            this.onPlay, this);
        var menuItemAbout = new cc.MenuItemSprite(
            new cc.Sprite(res.bttnNormal_png), // normal state image
            new cc.Sprite(res.bttnActive_png), //select state image
            this.onPlay, this);
        var menuItemSettings = new cc.MenuItemSprite(
            new cc.Sprite(res.bttnNormal_png), // normal state image
            new cc.Sprite(res.bttnActive_png), //select state image
            this.onPlay, this);
        menuItemPlay.setPosition(48, 0);
        menuItemPlay.scale = 0.2;
        menuItemAbout.scale = 0.2;
        menuItemAbout.setPosition(-48, 0);
        menuItemSettings.setPosition(0, -50);
        var menu = new cc.Menu(menuItemPlay, menuItemAbout); //7. create the menu
        //menu.scale = 0.2;
        menu.setPosition(winsize.width /2, 90);
        this.addChild(menu);
    },

    onPlay: function() {
        cc.LoaderScene.preload(g_resources, function() {
            cc.director.runScene(new gameScene());
        }, this);
        cc.log("==onplay clicked");
    }
});

var menuScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new menuLayer();
        layer.init();
        this.addChild(layer);
    }
});