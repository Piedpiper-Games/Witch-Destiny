//(function(window,undefined){

function Switch1(message, time_stay, person_image, is_right) {
    this.initialize(message, time_stay, person_image, is_right);
}

Switch1.prototype = new Drawable();
Switch1.prototype.drawable_initialize = Switch1.prototype.initialize;
Switch1.prototype.initialize = function (message, time_stay, person_image, is_right) {
    this.drawable_initialize();
    
    this.sensor = new Sprite('transparent');
    
    
    
    this.sensor.set_size(100,100);
    this.sensor.set_position(0,0);
    this.sensor.set_anchor(0.5,0.5);
    
    this.is_animating = false;
    
   

    this.base = new Sprite('switch_base');
    this.base.set_scale(0.5);
    this.base.set_position(0, 0);
    //this.base.set_scale(0.1);
    this.base.set_anchor(0.5, 0.5);
    
    this.base.z_index=1;
    //this.base.set_alpha(0);

    this.handle = new Sprite('switch_handle');
    this.handle.set_scale(0.5);
    //this.handle.set_position(110, 80);
    this.handle.set_anchor(0.5, 0.9);
    this.add_child(this.handle);
    this.handle.z_index=-1;

    this.add_child(this.base);
    this.add_child(this.sensor);
    
    this.object = null;
     this.graphic = null;
    
     
    this.is_state_on = false;
    
    
    this.handle.rotate_to(Math.degrees_to_radians(60));
    
    
};

Switch1.prototype.show = function () {

};

Switch1.prototype.on_added_to_parent = function (parent) {
    Drawable.prototype.on_added_to_parent.call(this, parent);
};

Switch1.prototype.on_remove_from_parent = function (parent) {
    Drawable.prototype.on_remove_from_parent.call(this, parent);
};

Switch1.prototype.draw = function (context) {

};

Switch1.prototype.clear = function (context) {

};

Switch1.prototype.turn_on = function () {
    this.is_state_on = true;
    Notes.send(Notes.NOTE_SWITCH_OBJECT,null,this);
    var t = new TweenRotateTo(this.handle,Math.degrees_to_radians(-60),null,400);
    t.run();
    
};


Switch1.prototype.turn_off = function () {
    this.is_state_on = false;
    Notes.send(Notes.NOTE_SWITCH_OBJECT,null,this);
    var t = new TweenRotateTo(this.handle,Math.degrees_to_radians(60),null,400);
    t.run();
    
};

//    window.Switch1 = Switch1;

//}(window));
