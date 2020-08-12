//(function(window,undefined){

function Goat() {
    this.initialize();
}

Goat.prototype = new SpineAnimation();
Goat.prototype.spine_initialize = Goat.prototype.initialize;
Goat.prototype.initialize = function () {

    this.spine_initialize('goat'); // your image name
    this.set_anchor(0.5, 1);
    this.set_size(50, 80);


    this.is_on_ground = true;
    this.is_edge_hold = false;
    this.is_wall_push = false;
    this.is_wall_drag = false;
    this.is_on_slope = false;
    this.is_gliding = false;
    this.head_hits_the_sealing = false;

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

    this.run_speed = 150 / 1000;//px/s
    this.jump_speed = 730 / 1000; // 830 / 1000; //px/s
    this.jump_boost = 0.5 / 1000;

    this.gravity = new Vector(0, 0.0015);
    this.normal_gravity = new Vector(0, 0.0015);
    this.wall_drag_gravity = new Vector(0, 0.0002);

    this.platforms = [];
    this.objects = [];
    this.sensors = [];

    this.controller = new PlayerController();
    
    this.states = new PlayerStates(this);
    
    this.emitter = new Emitter(new V(Config.screen_width / 2, 300), null, Blood, 100 / 1000);

    //  this.emitter = new Emitter(new V(), null, Steam, 30 / 1000);
    //  this.drag_emitter = new Emitter(new V(),null,DragDust,30/1000);

    //  this.drag_emiision_point = new V();
    //  this.steam_emmitter_point = new V(0,10);

    this.number_of_lifes = 1;
    this.has_double_value = false; // if the coins collected have double value
    this.is_invincible = false; // is in transition mode after losing a life
    
    this.play('run');

};

Goat.prototype.on_added_to_parent = function (parent) {
    Sprite.prototype.on_added_to_parent.call(this, parent);
      this.emitter.layer = parent;
    //  this.drag_emitter.layer = parent;
      Notes.add(this.states, Notes.NOTE_SIDE_FLIPPED);
};

Goat.prototype.on_remove_from_parent = function (parent) {
    Sprite.prototype.on_remove_from_parent.call(this, parent);
      Notes.remove(this.states, Notes.NOTE_SIDE_FLIPPED);
};



Goat.prototype.update = function (dt) {
    
    SpineAnimation.prototype.update.call(this,dt);

    if (this.is_dead) {
//        log('is dead');
//        this.emitter.emission_point = this.get_position().clone();
//            this.emitter.run();
//            this.emitter.step(400);
//            this.emitter.stop();
        
        return;
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

    if(Config.is_auto_run){
        if(this.is_on_ground){
            if(this.current_flipped){
                this.velocity.x = -this.run_speed;
            } else {
                this.velocity.x = this.run_speed;
            }
        }
    }

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
        if(this.objects[i].check(this)){
            
        }
    }
    
    if(this.head_hits_the_sealing){
        Notes.send(Notes.NOTE_CHARACTER_IS_DEAD,null,this);
        this.head_hits_the_sealing = false;
    }

    for (var i = 0; i < this.platforms.length; i++)
    {
        var platform = this.platforms[i];
        platform.check(this);
    }


    // trigger sensors

    for (var i = 0; i < this.sensors.length; i++)
    {
        if(this.sensors[i].check(this)){
            if(this.sensors[i] instanceof Spikes){
                Notes.send(Notes.NOTE_CHARACTER_IS_DEAD,null,this);
            }
        };
    }

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


Goat.prototype.on_note = function (note, data, sender) {
    // if (note === Notes.NOTE_NAME) {}
};


//    window.Goat = Goat;

//}(window));