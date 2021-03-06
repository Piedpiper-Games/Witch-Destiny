//(function(window,undefined){

function FloatPlatform(image_name) {
    this.initialize(image_name);
}

FloatPlatform.prototype = new Sprite();
FloatPlatform.prototype.sprite_initialize = FloatPlatform.prototype.initialize;
FloatPlatform.prototype.initialize = function (image_name) {
    this.sprite_initialize(image_name); // your image name
    this.response = new Response();
    this.velocity = new V();
    this.velocity.setLength(110 / 1000);
    this.velocity.setAngle(Math.degrees_to_radians(-90));
    this.is_dynamic = true;
    this.collided_objects = [];
    this.c_index = 2;

    this.start_point = new V();
    this.end_point = new V();
};

FloatPlatform.prototype.set_points = function (start_point, end_point) {

    if (start_point.y > end_point.y) {
        this.start_point.copy(start_point);
        this.end_point.copy(end_point);
    } else {
        this.start_point.copy(end_point);
        this.end_point.copy(start_point);
    }


};

FloatPlatform.prototype.check = function (object) {

    var polygon = this.bounds;


    if (SAT.testPolygonPolygon(object.bounds, polygon, this.response)) {


        if (object.velocity.y < 0) { // while jumping 
            return;
        }

        if (object.velocity.y === 0 && this.velocity.y > 0) {
            return;
        }

        var overlap = this.response.overlapV;

        if (overlap.x !== 0) {
            return; // if it is on the side of the platform
        }
        
        // this factor is to dinamicly prevent from passing the platform
        // if the speed is grater , then we need grater value
        // so , if the player is landing of the platform with a grater speed
        // the platform will behave like it has grater height and it will prevent
        // it from falling

        var factor = 20;

        var pos = object.get_position();

        var p = this.get_position();
        var y = p.y + factor + (factor * object.velocity.y);

        if (y < pos.y) {
            return;
        }



        if (object.velocity.y > -0.05) { // its a threshold not to start running on the edge
            object.velocity.y = 0;
            object.is_on_ground = true;
        }



        pos.sub(overlap);
        object.set_position(pos.x, pos.y);


        //  this.did_collide = true;
        object.float_id = this.id;
        this.collided_objects.push(object);

    }
    this.response.clear();
};

FloatPlatform.prototype.on_added_to_parent = function (parent) {
    Drawable.prototype.on_added_to_parent.call(this, parent);

};

FloatPlatform.prototype.on_remove_from_parent = function (parent) {
    Drawable.prototype.on_remove_from_parent.call(this, parent);

};

FloatPlatform.prototype.on_draw = function (context) {

};

FloatPlatform.prototype.update = function (dt) {

    var pos = this.get_position();

    if (pos.y < this.end_point.y) {
        this.velocity.setAngle(Math.degrees_to_radians(90));
    } else if (pos.y > this.start_point.y) {
        this.velocity.setAngle(Math.degrees_to_radians(-90));
    }

    pos.add(this.velocity.clone().scale(dt));

    if (this.collided_objects.length > 0) {

        for (var i = 0; i < this.collided_objects.length; i++) {

            var object = this.collided_objects[i];

            if (object.float_id === this.id) {

                var pp = object.get_position();
                pp.add(this.velocity.clone().scale(dt));
                object.set_position(pp.x, pp.y);

            }


            object.float_id = 0;
        }
        this.collided_objects = [];
    }



    this.set_position(pos.x, pos.y);

};


//    window.FloatPlatform = FloatPlatform;

//}(window));