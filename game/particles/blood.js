//(function(window,undefined){

function Blood() {
    this.initialize();
}

Blood.prototype = new Sprite();
Blood.prototype.sprite_initialize = Blood.prototype.initialize;
Blood.prototype.initialize = function () {

    this.sprite_initialize('blood'); // the image name of the particle

    this.duration = 800;
    this.total_time = 0;
    this.emitter = null;

    ////////////////////////////////////////////////////////////////////////
    ///////// Set custom properties to the particle

    this.velocity = new Vector(1, 1);
    this.velocity.setAngle(Math.degrees_to_radians(Math.random_int(0, 360)));
    this.trust_magnitude = Math.random_int(100, 250) / 1000;
    this.velocity.setLength(this.trust_magnitude);

    this.begin_scale = Math.random_float(0.1, 0.5);
    this.end_scale = Math.random_float(0.6, .8);

    this.begin_alpha = 0.9;
    this.end_alpha = 0.0;
    this.set_anchor(0.5, 0.5);
    this.set_scale(this.begin_scale);
    this.set_alpha(this.begin_alpha);
    this.gravity = new Vector(0, 0.4 / 1000);
    this.z_index = 2;

};

Blood.prototype.reset = function () {

    // RESET YOUR PARTICLE PROPERTIES 

    this.total_time = 0;
    this.set_scale(this.begin_scale);
    this.set_alpha(this.begin_alpha);

    var angle = 0;
    
    if (Math.random_int(0, 1) === 0) {
        angle = Math.degrees_to_radians(Math.random_int(180, 250));
    } else {
        angle = Math.degrees_to_radians(Math.random_int(270, 360));
    }

    this.velocity.setAngle(angle);
    this.trust_magnitude = Math.random_int(200, 350) / 1000;
    this.velocity.setLength(this.trust_magnitude);

};

Blood.prototype.on_added_to_parent = function (parent) {
    Drawable.prototype.on_added_to_parent.call(this, parent);

    // DELETE THIS CODE IF YOU DON'T NEED DISPLACMENT FROM THE EMISSION PONIT 

    var r1 = Math.random_int(0, 6);
    var r2 = Math.random_int(0, 6);
    var pos = this.get_position();
    this.set_position(pos.x + r1 - 3, pos.y + r2 - 3);

};

Blood.prototype.on_remove_from_parent = function (parent) {
    Drawable.prototype.on_remove_from_parent.call(this, parent);

};

Blood.prototype.update = function (dt) {

    this.total_time += dt;
    var t = this.total_time / this.duration;

    if (t > 1.0) {
        this.emitter.recycle_particle(this);
    } else {

        ////////////////////////////////////////////////////////////////////
        ////////////// Blood Behaviour code

        var pos = this.get_position();
        this.velocity.add(this.gravity.clone().scale(dt));

        pos.add(this.velocity.clone().scale(dt));
        this.set_position(pos.x, pos.y);

        var f = this.begin_scale + (this.end_scale - this.begin_scale) * t;

        var a = this.begin_alpha + (this.end_alpha - this.begin_alpha) * t;

        this.set_scale(f);
        this.set_alpha(a);

    }

};


//    window.Blood = Blood;

//}(window));