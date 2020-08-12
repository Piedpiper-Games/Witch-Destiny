//(function(window,undefined){

function NarativeScreen() {
    this.initialize();
}

NarativeScreen.prototype = new Screen();
NarativeScreen.prototype.screen_initialize = NarativeScreen.prototype.initialize;
NarativeScreen.prototype.initialize = function() {
    this.screen_initialize();


    this.add_label("Fortelling the future", new V(400, 50), new V(), 6000);

    var that = this;


    setTimeout(function() {
        var mt1 = new V();
        mt1.setLength(100);
        mt1.setAngle(Math.degrees_to_radians(10));
        that.add_sprite("witch_intro", new V(380, 130), mt1, 0.6, 0, 5000);
    }, 1000);


    setTimeout(function() {
        var mt3 = new V();
        mt3.setLength(100);
        mt3.setAngle(Math.degrees_to_radians(10));
        that.add_rotating_sprite("witch_ball1", new V(630, 430), mt3, 0.6, 0, 0.5, new V(0.5, 0.5), 5000);
    }, 1000);


    setTimeout(function() {
        var mt4 = new V();
        mt4.setLength(100);
        mt4.setAngle(Math.degrees_to_radians(10));
        that.add_rotating_sprite("witch_ball2", new V(630, 430), mt4, 0.6, 0, -0.5, new V(0.5, 0.5), 5000);
    }, 1000);


    setTimeout(function() {
        var mt5 = new V();
        mt5.setLength(100);
        mt5.setAngle(Math.degrees_to_radians(10));
        that.add_rotating_sprite("witch_ball3", new V(630, 430), mt5, 0.6, 0, null, new V(0.5, 0.5), 5000);
    }, 1000);
  
    
    setTimeout(function() {
        var mt2 = new V();
        mt2.setLength(100);
        mt2.setAngle(Math.degrees_to_radians(10));
        that.add_sprite("witch_intro_hands", new V(537, 350), mt2, 0.6, 0, 5000);
    }, 1000);

    //scene 2
    setTimeout(function(){
        var mt6 = new V();
        mt6.setLength(0);
        mt6.setAngle(Math.degrees_to_radians(90));
        that.add_label("When the magick ball",new V(280,-10) , mt6, 4000);
    },6000);
    
    setTimeout(function(){
           var mt7 = new V();
//        mt7.setLength(20);
//        mt7.setAngle(Math.degrees_to_radians(-90));
        that.add_label("is gone",new V(600,60) , mt7, 3500);
    },6500);
    
    
    setTimeout(function(){
        var mt8 = new V();
        mt8.setLength(100);
        mt8.setAngle(Math.degrees_to_radians(190));
        that.add_sprite("witch_intro_luta",new V(210,150) , mt8, 0.6, 0, 3500);
    },6700);
    
    setTimeout(function(){
        var mt9 = new V();
        mt9.setLength(100);
        mt9.setAngle(Math.degrees_to_radians(190));
        that.add_sprite("witch_intro_hands_luta",new V(380,350) , mt9, 0.6, 0, 3500);
    },6700);
    
    
    setTimeout(function() {
        var mt33 = new V();
        mt33.setLength(70);
        mt33.setAngle(Math.degrees_to_radians(190));
        that.add_rotating_sprite("witch_ball1", new V(460, 430), mt33, 0.6, 0, 0.5, new V(0.5, 0.5), 2500);
    }, 6700);


    setTimeout(function() {
        var mt44 = new V();
        mt44.setLength(70);
        mt44.setAngle(Math.degrees_to_radians(190));
        that.add_rotating_sprite("witch_ball2", new V(460, 430), mt44, 0.6, 0, -0.5, new V(0.5, 0.5), 2500);
    }, 6700);


    setTimeout(function() {
        var mt55 = new V();
        mt55.setLength(70);
        mt55.setAngle(Math.degrees_to_radians(190));
        that.add_rotating_sprite("ggj15_witch_BALL3_broken", new V(460, 430), mt55, 0.6, 0, null, new V(0.5, 0.5), 2500);
    }, 6700);
    
    
   setTimeout(function(){
        var image = new Sprite("ggj15_witch_intro_ball_brokenTotaly");
        image.set_scale(0.6);

        image.set_alpha(1);

        image.set_position(350, 360);
        that.add_child(image);
        
        var t3 = new TweenMoveTo(image, new V(300, 350), null, 1500, function(){that.remove_child(image);});
        t3.run();
    },8400);


    //scene 3
    setTimeout(function(){
        var mt10 = new V();
        mt10.setLength(0);
        mt10.setAngle(Math.degrees_to_radians(90));
        that.add_label("It's imposible to tell the future",new V(120,150) , mt10, 4000);
    },10000);
    
    
     setTimeout(function(){
        var label1 = new Label();
        label1.set({text: "But , the show must go on !"});
        label1.set({text_color: "#FFFFFF"});
        label1.set({text_size: 140});
        label1.set({text_font_name: "AuldMagick"});

        label1.set_position(240, 350);
        that.add_child(label1);
    },13000);
    
    
    setTimeout(function(){
        game.navigator.add(new GameScreen(), Screen.ANIMATION_TYPE_FADEIN);
    },16000);

};

NarativeScreen.prototype.show = function() {
    var that = this;

    Screen.prototype.show.call(this);

    game.input.add(this);

};

NarativeScreen.prototype.hide = function() {
    Screen.prototype.hide.call(this);
    game.input.remove(this);
};

NarativeScreen.prototype.update = function() {
    Screen.prototype.update.call(this);

};

NarativeScreen.prototype.on_mouse_up = function(){
    Config.go_fullscreen();
};

NarativeScreen.prototype.on_added_to_parent = function(parent) {
    Drawable.prototype.on_added_to_parent.call(this, parent);

};

NarativeScreen.prototype.on_remove_from_parent = function(parent) {
    Drawable.prototype.on_remove_from_parent.call(this, parent);

};

NarativeScreen.prototype.draw = function(context) {
    var fs = context.fillStyle;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, Config.screen_width, Config.screen_height);
    context.fillStyle = fs;
};

NarativeScreen.prototype.clear = function(context) {

};

NarativeScreen.prototype.add_label = function(text, position, move_to, duration) {

    var label1 = new Label();
    label1.set({text: text});
    label1.set({text_color: "#FFFFFF"});
    label1.set({text_size: 140});
    label1.set({text_font_name: "AuldMagick"});
    label1.set_alpha(0);

    duration = duration ? duration : 2000;

    label1.set_position(position.x, position.y);
    this.add_child(label1);

    var mt = position.clone().add(move_to);

    var t = new TweenAlpha(label1, 1, null, 3000);
    t.run();

    var t3 = new TweenMoveTo(label1, mt, null, duration);
    t3.run();


    setTimeout(function() {

        var t = new TweenAlpha(label1, 0, null, 1000);
        t.run();

    }, duration - 1000);

};

NarativeScreen.prototype.add_sprite = function(name, position, move_to, scale, z_index, duration) {

    var image = new Sprite(name);
    image.set_scale(scale);

    image.set_alpha(0);

    duration = duration ? duration : 2000;
    image.z_index = z_index;

    image.set_position(position.x, position.y);
    this.add_child(image);

    var mt = position.clone().add(move_to);

    var t16 = new TweenAlpha(image, 1, null, duration);
    t16.run();

    var t3 = new TweenMoveTo(image, mt, null, duration);
    t3.run();

    var that=this;
    setTimeout(function() {
        
        var t17 = new TweenAlpha(image, 0, null, 1000, function(){that.remove_child(image);});
        t17.run();

    }, duration - 1000);


};


NarativeScreen.prototype.add_rotating_sprite = function(name, position, move_to, scale, z_index, rotate, anchor, duration) {

    var image = new Sprite(name);
    image.set_scale(scale);

    image.set_alpha(0);
    if (anchor)
        image.set_anchor(anchor.x, anchor.y);

    duration = duration ? duration : 2000;
    image.z_index = z_index;

    image.set_position(position.x, position.y);
    this.add_child(image);

    var mt = position.clone().add(move_to);

    var t16 = new TweenAlpha(image, 0.5, null, 4000);
    t16.run();

    if (rotate != 0)
    {
        var t2 = new TweenRotate(image, rotate, null, duration);
        t2.run();
    }

    var t3 = new TweenMoveTo(image, mt, null, duration);
    t3.run();

    var that=this;
    setTimeout(function() {

        var t17 = new TweenAlpha(image, 0, null, 1000, function(){that.remove_child(image);});
        t17.run();

    }, duration - 1000);


};


//    window.NarativeScreen = NarativeScreen;

//}(window));
