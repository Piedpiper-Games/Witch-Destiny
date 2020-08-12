//(function(window,undefined){

function LooseScreen() {
    this.initialize();
}

LooseScreen.prototype = new Screen();
LooseScreen.prototype.screen_initialize = LooseScreen.prototype.initialize;
LooseScreen.prototype.initialize = function () {
    this.screen_initialize();
    
   
    
    this.add_label("Destiny Not Fulfilled!", new V(Config.screen_width/2, 200), new V(), 4000);

    var that = this;

    setTimeout(function(){
        var mt10 = new V();
        mt10.setLength(10);
        mt10.setAngle(Math.degrees_to_radians(0));
        that.add_label("Try Again",new V(Config.screen_width/2,300) , mt10, 4000);
    },1000);
    
    setTimeout(function(){
        Notes.send(Notes.NOTE_RESET_LEVEL);
        game.navigator.go_back(Screen.ANIMATION_TYPE_FADEIN);
    },5000);    

};

LooseScreen.prototype.add_label = function(text, position, move_to, duration) {

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

LooseScreen.prototype.show = function () {
    Screen.prototype.show.call(this);

};

LooseScreen.prototype.hide = function () {
    Screen.prototype.hide.call(this);

};

LooseScreen.prototype.update = function () {
    Screen.prototype.update.call(this);

};

LooseScreen.prototype.on_added_to_parent = function (parent) {
    Drawable.prototype.on_added_to_parent.call(this, parent);

};

LooseScreen.prototype.on_remove_from_parent = function (parent) {
    Drawable.prototype.on_remove_from_parent.call(this, parent);

};

LooseScreen.prototype.draw = function (context) {
    var fs = context.fillStyle;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, Config.screen_width, Config.screen_height);
    context.fillStyle = fs;
};

LooseScreen.prototype.clear = function (context) {

};

//    window.LooseScreen = LooseScreen;

//}(window));