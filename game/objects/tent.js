//(function(window,undefined){

function Tent(messages) {
    this.initialize(messages);
}

Tent.prototype = new Animation();
Tent.prototype.animation_initialize = Tent.prototype.initialize;
Tent.prototype.initialize = function (messages) {

    var sprite_sheet = new SpriteSheet([{
            image: Images.tent_shadows_double,
            frames: {x: 2, y: 1},
            animations: {
                glow: {start: 0, end: 1, loop: true, duration: 500}
            }
            , reg: {x: 0.5, y: 1, width: 1.0, height: 1.0}
        }]);

    this.animation_initialize(sprite_sheet);

    var dialog1 = new Bubble(["What is my", "future?"], 2000, "goat_head", true);
    dialog1.set_position(0, -150);
    this.add_child(dialog1);
    dialog1.show();
    
    this.z_index = 2;

    var that = this;

    

    setTimeout(function () {
        var dialog1 = new Bubble(["Your destiny is", messages[0], messages[1], messages[3]], 3000, "witch_head", false);
        dialog1.set_position(-50, -240);
        that.add_child(dialog1);
        dialog1.show();
    }, 3000);

    setTimeout(function () {
        Notes.send(Notes.NOTE_GOAT_SPAWN);
    }, 8000);

    setTimeout(function () {
        var dialog1 = new Bubble(["Let's create", "some destiny"], 2000, "witch_head", false);
        dialog1.set_position(-50, -240);
        that.add_child(dialog1);
        dialog1.show();

        setTimeout(function () {
            Notes.send(Notes.NOTE_DIALOG_FINISHED);
        }, 2000);

    }, 8600);

};

Tent.prototype.on_added_to_parent = function (parent) {
    Drawable.prototype.on_added_to_parent.call(this, parent);

};

Tent.prototype.on_remove_from_parent = function (parent) {
    Drawable.prototype.on_remove_from_parent.call(this, parent);

};

Tent.prototype.draw = function (context) {
    Animation.prototype.draw.call(this, context);
};

Tent.prototype.clear = function (context) {

};

//    window.Tent = Tent;

//}(window));