//(function(window,undefined){

function WinScreen() {
    this.initialize();
}

WinScreen.prototype = new Screen();
WinScreen.prototype.screen_initialize = WinScreen.prototype.initialize;
WinScreen.prototype.initialize = function() {
    this.screen_initialize();

    

    this.add_label("The destiny is fullfill!", new V(Config.screen_width/2, 250), new V(), 4000);

    var that = this;

    setTimeout(function(){
        var mt10 = new V();
        mt10.setLength(10);
        mt10.setAngle(Math.degrees_to_radians(-90));
        that.add_label("Going to next level",new V(Config.screen_width/2,350) , mt10, 4000);
    },1000);
    
    
    setTimeout(function(){
        Notes.send(Notes.NOTE_LOAD_NEXT_LEVEL);
        game.navigator.go_back(Screen.ANIMATION_TYPE_FADEIN);
    },5000);

};

WinScreen.prototype.show = function() {
    var that = this;

    Screen.prototype.show.call(this);



};

WinScreen.prototype.hide = function() {
    Screen.prototype.hide.call(this);

};

WinScreen.prototype.update = function() {
    Screen.prototype.update.call(this);

};

WinScreen.prototype.on_added_to_parent = function(parent) {
    Drawable.prototype.on_added_to_parent.call(this, parent);

};

WinScreen.prototype.on_remove_from_parent = function(parent) {
    Drawable.prototype.on_remove_from_parent.call(this, parent);

};

WinScreen.prototype.draw = function(context) {
    var fs = context.fillStyle;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, Config.screen_width, Config.screen_height);
    context.fillStyle = fs;
};

WinScreen.prototype.clear = function(context) {

};

WinScreen.prototype.add_label = function(text, position, move_to, duration) {

    var label1 = new Label();
    label1.set({text: text});
    label1.set({text_align:'center'});
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

WinScreen.prototype.add_sprite = function(name, position, move_to, scale, z_index, duration) {

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


WinScreen.prototype.add_rotating_sprite = function(name, position, move_to, scale, z_index, rotate, anchor, duration) {

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


//    window.WinScreen = WinScreen;

//}(window));