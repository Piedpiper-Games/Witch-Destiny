//(function(window,undefined){

function Player() {
    this.initialize();
}

Player.prototype = new SpineAnimation();
Player.prototype.spine_initialize = Player.prototype.initialize;
Player.prototype.initialize = function () {

    this.spine_initialize('dwarf'); // your image name
    this.set_anchor(0.5, 1);
    this.set_size(50, 80);


    this.is_on_ground = true;
    this.is_edge_hold = false;
    this.is_wall_push = false;
    this.is_wall_drag = false;
    this.is_on_slope = false;
    this.is_gliding = false;

    this.is_dead = false;

    this.current_flipped = false;

    this.velocity = new Vector();
    this.max_velocity = 1.1;
    this.max_gliding_velocity = 0.13;
    this.acceleration = 0.0007; // 0.013;
    this.mass = 0.1;
    this.decceleration = 0.005;

    this.slope_id = 0;
    this.float_id = 0;

    this.run_speed = 300 / 1000;//px/s
    this.jump_speed = 730 / 1000; // 830 / 1000; //px/s
    this.jump_boost = 0.5 / 1000;
    this.push_speed = 200 / 1000;
    this._run_speed = 300 / 1000;

    this.gravity = new Vector(0, 0.0015);
    this.normal_gravity = new Vector(0, 0.0015);
    this.wall_drag_gravity = new Vector(0, 0.0002);

    this.platforms = [];
    this.objects = [];
    this.sensors = [];

    this.controller = new PlayerController(true);

    this.states = new PlayerStates(this);

    //  this.emitter = new Emitter(new V(), null, Steam, 30 / 1000);
    //  this.drag_emitter = new Emitter(new V(),null,DragDust,30/1000);

    //  this.drag_emiision_point = new V();
    //  this.steam_emmitter_point = new V(0,10);

    this.number_of_lifes = 1;
    this.has_double_value = false; // if the coins collected have double value
    this.is_invincible = false; // is in transition mode after losing a life

    this.play('idle');


    this.stateData.setMixByName("run", "idle", 0.25);
    this.stateData.setMixByName("run", "jump", 0.15);
    this.stateData.setMixByName("run", "fall", 0.15);
    this.stateData.setMixByName("idle", "run", 0.1);
    this.stateData.setMixByName('jump', 'fall', 0.1);
    this.stateData.setMixByName('fall', 'run', 0.1);
    this.stateData.setMixByName('fall', 'idle', 0.15);


    this.stateData.setMixByName("run", "object_push", 0.1);
    this.stateData.setMixByName("idle", "object_push", 0.1);
    this.stateData.setMixByName("fall", "object_push", 0.1);
    this.stateData.setMixByName("object_push", "idle", 0.1);
    this.stateData.setMixByName("object_push", "jump", 0.1);


};

Player.prototype.on_added_to_parent = function (parent) {
    Sprite.prototype.on_added_to_parent.call(this, parent);
    //  this.emitter.layer = parent;
    //  this.drag_emitter.layer = parent;
    Notes.add(this.states, Notes.NOTE_SIDE_FLIPPED);
};

Player.prototype.on_remove_from_parent = function (parent) {
    Sprite.prototype.on_remove_from_parent.call(this, parent);
    Notes.remove(this.states, Notes.NOTE_SIDE_FLIPPED);
};

//Player.prototype.draw = function (context) {
//    Sprite.prototype.draw.call(this, context);
//
//    var pos = this.bounds.pos;
//    var fill = context.fillStyle;
//    context.fillStyle = "blue";
//    var ach = this.get_anchor();
//    context.fillRect(pos.x + (-this.width * ach.x), pos.y + (-this.height * ach.y), this.width, this.height);
//    context.fillStyle = fill;
//};

Player.prototype.update = function (dt) {
    
    SpineAnimation.prototype.update.call(this,dt);

    if (this.is_dead) {
        return;
    }
    
    if(this.is_object_push) {
        this.run_speed = this.push_speed;
    } else {
        this.run_speed = this._run_speed;
    }

    if (this.controller.is_left) {

        if (this.current_flipped !== true) {
            Notes.send(Notes.NOTE_SIDE_FLIPPED, null, this);
        }

        if (this.is_on_ground) {
            this.velocity.x = -this.run_speed;
        } else {
            this.velocity.x -= this.acceleration * dt;
        }

    } else if (this.controller.is_right) {

        if (this.current_flipped !== false) {
            Notes.send(Notes.NOTE_SIDE_FLIPPED, null, this);
        }

        if (this.is_on_ground) {
            this.velocity.x = this.run_speed;
        } else {
            this.velocity.x += this.acceleration * dt;
        }

    } else {

        if (this.is_on_ground && !this.controller.is_up_pressed) {
            this.velocity.x = 0;
        } else {
            // decelerate
            if (this.velocity.x > 0) {
                this.velocity.x -= this.acceleration * 0.3 * dt;
                this.velocity.x = (this.velocity.x < 0) ? 0 : this.velocity.x;
            } else {
                this.velocity.x += this.acceleration * 0.3 * dt;
                this.velocity.x = (this.velocity.x > 0) ? 0 : this.velocity.x;
            }
        }

    }

    this.velocity.x = (this.velocity.x < -this.run_speed) ? -this.run_speed : this.velocity.x;
    this.velocity.x = (this.velocity.x > this.run_speed) ? this.run_speed : this.velocity.x;

    if (this.controller.is_up) {
        if (this.velocity.y === 0 && this.is_on_ground) {// jump only if on ground
            this.velocity.y = -this.jump_speed;
            this.is_on_ground = false;
            this.is_edge_hold = false;
            this.is_on_slope = false;
        }
    }

    if (this.controller.is_up && this.is_wall_drag) {
        this.velocity.y = -this.jump_speed;
        this.is_on_ground = false;
        this.is_edge_hold = false;
        this.is_on_slope = false;
        this.is_wall_drag = false;

        if (this.current_flipped) {
            this.velocity.setAngle(Math.degrees_to_radians(-45));
        } else {
            this.velocity.setAngle(Math.degrees_to_radians(-135));
        }
        this.velocity.y = -this.jump_speed * 0.8;

        this.current_flipped = !this.current_flipped;

    }

    this.is_gliding = false;

    if (this.controller.is_up_holding && this.velocity.y < 0) { // add boost only whle jumping
        this.velocity.y -= this.jump_boost * dt;
    } else if (this.controller.is_up_holding && this.velocity.y > 0) {

//        if (this.velocity.y > this.max_gliding_velocity) {
//            this.velocity.y -= this.decceleration * dt;
//            if (this.velocity.y < this.max_gliding_velocity) {
//                this.velocity.y = this.max_gliding_velocity;
//            }
//        }
//
//        if (!this.is_wall_drag) {
//            this.is_gliding = true;
//        }
    }

    if (this.controller.is_down) {
        if (this.is_edge_hold) {
            this.is_edge_hold = false;
        }

        if (this.is_wall_drag) {
            this.is_wall_drag = false;
        }
    }


    if (this.is_wall_drag) {
        this.gravity = this.wall_drag_gravity;
    } else {
        this.gravity = this.normal_gravity;
    }
    var v = this.gravity.clone().scale(dt);
    this.velocity.add(v);

    if (this.is_wall_drag) {
        this.velocity.x = this.current_flipped ? -0.01 : 0.01;
    }

    if (this.is_edge_hold) {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    if (this.is_wall_push || this.is_object_push || this.is_wall_drag) {
        this.controller.is_attacking = false;
        this.controller.is_orb_attacking = false;
    }
    
    

    if (this.controller.is_attacking) {
        this.controller.is_orb_attacking = false;
    } else if (this.controller.is_orb_attacking) {
        this.controller.is_attacking = false;
        if (this.is_on_ground) {
            this.velocity.x = 0;
        }

    }

    if (this.velocity.len() > this.max_velocity) {
        this.velocity.setLength(this.max_velocity);
    }

//    if(Config.is_auto_run){
//        if(this.is_on_ground){
//            if(this.current_flipped){
//                this.velocity.x = -this.run_speed;
//            } else {
//                this.velocity.x = this.run_speed;
//            }
//        }
//    }

    ////////////////////////////////update movement

    var v = this.velocity.clone();
    v.scale(dt);

    var p = this.get_position();
    p.add(v);

    this.set_position(p.x, p.y);

    //////////////////////////////resolve collisions
    this.is_wall_push = false;
    this.is_object_push = false;
    this.is_wall_drag = false;
    this.is_ring_hold = false;

    // Perform collision test with objects first
    for (var i = 0; i < this.objects.length; i++)
    {
        this.objects[i].check(this);
    }

    for (var i = 0; i < this.platforms.length; i++)
    {
        var platform = this.platforms[i];
        platform.check(this);
    }


//    // trigger sensors
//
//    for (var i = 0; i < this.sensors.length; i++)
//    {
//        this.sensors[i].check(this);
//    }

    // handle animation 

    this.states.update();

    // add effects

//    this.emitter.emission_point = this.get_position().clone().add(this.steam_emmitter_point);
//
//    if (this.is_gliding) {
//        this.emitter.run();
//    } else {
//        this.emitter.stop();
//    }


//    if(this.is_wall_drag){
//        
//        if(this.current_flipped){
//            this.drag_emiision_point.x = -20;
//            this.drag_emiision_point.y = -80;
//        } else {
//            this.drag_emiision_point.x = 20;
//            this.drag_emiision_point.y = -80;
//        }
//        
//        if(!this.drag_emitter.is_running){
//            this.drag_emitter.reset();
//        }
//        
//        this.drag_emitter.emission_point = this.get_position().clone().add(this.drag_emiision_point);
//        this.drag_emitter.frequency = (this.velocity.y)*40 / 1000;
//        if(this.velocity.y > 0.15){
//            this.drag_emitter.run();
//        }
//    } else {
//        this.drag_emitter.stop();
//    }


//    // reset controller
//    this.controller.is_up_pressed = false;
//    this.controller.handle_up();

};

Player.prototype.on_note = function (note, data, sender) {
    // if (note === Notes.NOTE_NAME) {}
};


//    window.Player = Player;

//}(window));