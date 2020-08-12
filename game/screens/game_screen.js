(function (window, undefined) {

    function GameScreen() {
        this.initialize();
    }

    GameScreen.prototype = new Screen();
    GameScreen.prototype.screen_initialize = GameScreen.prototype.initialize;

    GameScreen.prototype.initialize = function () {

        this.screen_initialize();

        this.is_level_loaded = false;

        this.current_level = 1;

        this.layers = [];
        this.platforms = [];
        this.objects = [];
        this.obsticles = [];
        this.sensors = [];
        this.switches = [];
        this.obsticles = [];

        this.grids = [];

        this.check_point = new V();

        this.player = null;
        this.goat = null;

        this.trackable_object = null;

        this.import_level(ContentManager.current_level_data);

        Notes.add(this, Notes.NOTE_CHARACTER_IS_DEAD);
        Notes.add(this, Notes.NOTE_YOU_LOOSE);
        Notes.add(this, Notes.NOTE_YOU_WIN);
        Notes.add(this, Notes.NOTE_GOAT_SPAWN);
        Notes.add(this, Notes.NOTE_DIALOG_FINISHED);
        Notes.add(this, Notes.NOTE_RESET_LEVEL);
        Notes.add(this, Notes.NOTE_LOAD_NEXT_LEVEL);
        Notes.add(this, Notes.NOTE_CHECK_SWITCH);
        Notes.add(this, Notes.NOTE_SWITCH_OBJECT);

    };

    GameScreen.prototype.import_level = function (json) {

        var data = JSON.parse(json);

        for (var i = 0; i < data.images.length; i++) {
            var img = data.images[i];

            ContentManager.add_image(img.key, "assets/images/" + img.file_name);
        }
        var that = this;

        ContentManager.download_resources(this.stage, function () {

            that.layout_level(data);

        });

    };

    GameScreen.prototype.create_grid_system = function () {

        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];

            var grid = new LayerMap(layer.children);
            this.grids.push({
                grid: grid,
                layer: layer
            });
        }

    };


    GameScreen.prototype.handle_visibility = function () {

        for (var i = 0; i < this.grids.length; i++) {
            var s = this.grids[i];
            var grid = s.grid;
            var layer = s.layer;
            var pos = layer.get_position();

            for (var key in grid.visible_objects) {
                var o = grid.visible_objects[key];
                o.is_visible = false;
            }

            var objects = grid.get_objects_at(0 - pos.x, 0 - pos.y, Config.screen_width, Config.screen_height);

            for (var key in objects) {
                var o = objects[key];
                o.is_visible = true;
            }

        }
    };

    GameScreen.prototype.sort_strategy = function (a, b) {
        return a.c_index < b.c_index;
    };

    GameScreen.prototype.on_note = function (note, data, sender) {

        if (note === Notes.NOTE_CHARACTER_IS_DEAD) {

            sender.emitter.emission_point = sender.get_position().clone().add(new V(0, -80));
            sender.emitter.run();
            sender.emitter.step(1500);
            sender.emitter.stop();
            sender.remove_from_parent();
            sender.is_dead = true;

            setTimeout(function () {
                game.navigator.add(new WinScreen(), Screen.ANIMATION_TYPE_FADEIN);
            }, 1500);

        } else if (note === Notes.NOTE_YOU_LOOSE) {

            sender.remove_from_parent();

            if (sender === this.player) {
                if (this.player) {
                    this.player.controller.destroy();
                }
                this.player = null;
            } else if (sender === this.goat) {
                this.goat = null;
            }

            setTimeout(function () {
                game.navigator.add(new LooseScreen(), Screen.ANIMATION_TYPE_FADEIN);
            }, 600);

        } else if (note === Notes.NOTE_GOAT_SPAWN) {

            var forground = this.get_layer_by_name("playground");
            forground.add_child(this.goat);

        } else if (note === Notes.NOTE_DIALOG_FINISHED) {

            this.trackable_object = this.player;

        } else if (note === Notes.NOTE_RESET_LEVEL) {
            this.reset_level();
        } else if (note === Notes.NOTE_LOAD_NEXT_LEVEL) {
            this.load_next_level();
        } else if (note === Notes.NOTE_CHECK_SWITCH) {

            Notes.send(Notes.NOTE_DIALOG_FINISHED);
          
            for (var i = 0; i < this.switches.length; i++) {
                var s = this.switches[i];

                if (SAT.testPolygonPolygon(s.sensor.bounds, this.player.bounds)) {


                    if (s.object instanceof OneWayPlatform) {

                        var p_s = s.object.get_position();
                        var p1 = -280;
                        if (s.is_state_on) {
                            p1 = 280;
                        }

                        var t = new TweenMoveTo(s.object,
                                new V().copy(p_s.clone().add(new V(p1, 0))), null, 500);
                        t.run();

                        var t2 = new TweenMoveTo(s.graphic,
                                new V().copy(p_s.clone().add(new V(p1, 0))), null, 500, function () {

                        });
                        t2.run();

                    } else if (s.object instanceof SolidPlatform) {

                        var p_s = s.object.get_position();
                        var p1 = -400;
                        if (s.is_state_on) {
                            p1 = 400;
                        }

                        var t = new TweenMoveTo(s.object, new V().copy(p_s.clone().add(new V(0, p1))), null, 500);
                        t.run();
                    }

                    if (s.is_state_on) {
                        s.turn_off();
                    } else {
                        s.turn_on();
                    }


                }

            }


        }

    };

    GameScreen.prototype.load_next_level = function () {

        if (this.current_level === 2) {
            setTimeout(function () {
                game.navigator.add(new EndScreen(), Screen.ANIMATION_TYPE_FADEIN);
            }, 600);
        } else {

            this.current_level++;

            var that = this;
            ContentManager.add_file('assets/levels/level_' + this.current_level + '.json', function (data) {
                ContentManager.current_level_data = data;
                that.reset_level();
            }, function () {

            });

            ContentManager.download_resources(this.stage, function () {

            });
        }
    };

    GameScreen.prototype.on_level_start = function () {

        // this perform sorting
        Math.insertionSort(this.platforms, this.sort_strategy);

        this.is_level_loaded = true;
        // test
        //  this.create_grid_system();

    };

    GameScreen.prototype.layout_level = function (data) {


        // create layers


        for (var i = data.layers.length - 1; i >= 0; i--) {
            var l = data.layers[i];
            var layer = new Layer();
            layer.set_position(0, 0);
            layer.name = l.name;
            layer.factor = l.factor;
            this.layers.push(layer);
            this.add_child(layer);
        }

        for (var i = 0; i < data.obsticles.length; i++) {
            var o = data.obsticles[i];

            o.c_index = Math.round(o.c_index);
            o.z_index = Math.round(o.z_index);

            var layer = this.get_layer_by_name(o.layer_name);

            if (o.object_type === "Graphic") {


                if (o.type === "Passable Bounce Platform") { // down-up Platform

                    var child_bounds = o.children[0];

                    var points = [];
                    for (var j = 0; j < child_bounds.points.length; j++) {
                        var p = child_bounds.points[j];
                        points.push(new V(p.x, p.y));
                    }

                    var platform = new FloatBouncePlatform(o.image_name);
                    var b = new Polygon(new V(o.pos.x, o.pos.y), points);
                    b.translate(child_bounds.pos.x, child_bounds.pos.y);
                    b.offset.copy(child_bounds.pos);
                    platform.set_bounds(b);
                    platform.set_position(o.pos.x, o.pos.y);
                    platform.initial_position.copy(o.pos);
                    this.platforms.push(platform);
                    layer.add_child(platform);

                } else if (o.type === "Spear") { // Moving Platform


                    var spear = new Spear();
                    spear.set_anchor(Math.round_decimal(o.anchor_x, 2), Math.round_decimal(o.anchor_y, 2));
                    spear.rotate_to(o.angle);
                    spear.set_base_position(o.pos.x, o.pos.y);
                    spear.initial_delay = Math.round_decimal(o.properties.delay, 2);


                    this.obsticles.push(spear);
                    layer.add_child(spear);

                } else if (o.type === "Ring") { // Moving Platform

                    var ring = new Ring(o.image_name);

                    var circle = o.children[0];
                    ring.bounds = new Circle(new V(), Math.round(circle.radius));
                    ring.set_position(o.pos.x, o.pos.y);
                    ring.set_anchor(o.anchor_x, o.anchor_y);

                    this.platforms.push(ring);
                    layer.add_child(ring);

                } else if (o.type === "Pushable Object") { // down-up Platform


                    var child_bounds = o.children[0];

                    var points = [];
                    for (var j = 0; j < child_bounds.points.length; j++) {
                        var p = child_bounds.points[j];
                        points.push(new V(p.x, p.y));
                    }


                    var box = new BoxPlatform(o.image_name);

                    var b = new Polygon(new V(o.pos.x, o.pos.y), points);
                    b.translate(child_bounds.pos.x, child_bounds.pos.y);
                    b.offset.copy(child_bounds.pos);
                    box.set_bounds(b);


                    box.z_index = 2;
                    box.c_index = o.c_index;
                    box.set_position(o.pos.x, o.pos.y);
                    this.objects.push(box);

                    layer.add_child(box);


                } else {

                    var s = new Sprite(o.image_name);
                    s.z_index = o.z_index;
                    s.set_anchor(o.anchor_x, o.anchor_y);
                    s.set_alpha(o.alpha);
                    s.set_scale_x(o.scale_x);
                    s.set_scale_y(o.scale_y);
                    s.set_position(o.pos.x, o.pos.y);
                    s.rotate_to(o.angle);
                    layer.add_child(s);

                }



            } else if (o.object_type === "Polygon" || o.object_type === "Box") {

                if (o.type === "Solid Platform") { // Solid Platform

                    var points = [];
                    for (var j = 0; j < o.points.length; j++) {
                        var p = o.points[j];
                        points.push(new V(p.x, p.y));
                    }

                    var platform = new SolidPlatform();
                    var b = new Polygon(new V(o.pos.x, o.pos.y), points);
                    platform.set_bounds(b);
                    platform.set_position(o.pos.x, o.pos.y);
                    platform.c_index = o.c_index;
                    this.platforms.push(platform);
                    layer.add_child(platform);

                } else if (o.type === "Passable Platform") { // down-up Platform

                    var points = [];
                    for (var j = 0; j < o.points.length; j++) {
                        var p = o.points[j];
                        points.push(new V(p.x, p.y));
                    }

                    var platform = new OneWayPlatform();
                    var b = new Polygon(new V(o.pos.x, o.pos.y), points);
                    platform.set_bounds(b);
                    platform.set_position(o.pos.x, o.pos.y);
                    this.platforms.push(platform);
                    layer.add_child(platform);

                } else if (o.type === "Obsticle") { // Solid Platform

                    var points = [];
                    for (var j = 0; j < o.points.length; j++) {
                        var p = o.points[j];
                        points.push(new V(p.x, p.y));
                    }

                    var platform = new Sprite('');
                    var b = new Polygon(new V(o.pos.x, o.pos.y), points);
                    platform.set_bounds(b);
                    platform.set_position(o.pos.x, o.pos.y);
                    platform.c_index = o.c_index;
                    this.obsticles.push(platform);
                    layer.add_child(platform);

                }
            }

            if (o.object_type === "Circle") {

                var platform = new CirclePlatform();
                var b = new Circle(new V(o.pos.x, o.pos.y), Math.round(o.radius));
                platform.set_bounds(b);
                platform.set_position(o.pos.x, o.pos.y);
                this.platforms.push(platform);
                layer.add_child(platform);

            } else if (o.type === "Player") { // Enemy

                var forground = this.get_layer_by_name("playground");


                this.player = new Player();
                this.player.set_position(o.pos.x, o.pos.y);
                this.player.z_index = 3;
                forground.add_child(this.player);

                this.player.platforms = this.platforms;
                this.player.objects = this.objects;
                this.player.obsticles = this.obsticles;
                this.player.sensors = this.sensors;
                this.player.enemies = this.enemies;


            } else if (o.type === "Moving Platform") { // Moving Platform


                var platform = new FloatPlatform('float');
                platform.set_anchor(0.5, 0.5);
                var b = new Box(new V(), 205, 60).toPolygon();
                b = b.translate(-110, -12);

                if (o.children.length) {
                    var path = o.children[0];

                    platform.set_points(path.points[0], path.points[1]);
                }

                platform.set_bounds(b);
                platform.set_position(o.pos.x, o.pos.y);
                this.platforms.push(platform);
                layer.add_child(platform);

            } else if (o.type === "Check Point") { // Moving Platform


                var points = [];
                for (var j = 0; j < o.points.length; j++) {
                    var p = o.points[j];
                    points.push(new V(p.x, p.y));
                }

                var sensor = new CheckPoint();
                var b = new Polygon(new V(o.pos.x, o.pos.y), points);
                sensor.set_bounds(b);
                sensor.set_position(o.pos.x, o.pos.y);

                if (o.children[0].pos) {
                    sensor.check_point.copy(o.children[0].pos);
                    sensor.check_point.add(sensor.get_position());
                } else {
                    log("check point without assigned checkpoint");
                }



                this.sensors.push(sensor);
                layer.add_child(sensor);

            } else if (o.type === "Slope") { // Solid Platform

                var points = [];
                for (var j = 0; j < o.points.length; j++) {
                    var p = o.points[j];
                    points.push(new V(p.x, p.y));
                }

                var platform = new Slope();
                var b = new Polygon(new V(o.pos.x, o.pos.y), points);
                platform.set_bounds(b);
                platform.set_position(o.pos.x, o.pos.y);
                this.platforms.push(platform);
                layer.add_child(platform);

            } else if (o.type === "Start") { // Enemy

                var forground = this.get_layer_by_name("playground");

                this.goat = new Goat();
                this.goat.set_position(o.pos.x, o.pos.y);
                this.goat.z_index = 3;
                // forground.add_child(this.goat);

                this.goat.platforms = this.platforms;
                this.goat.objects = this.objects;
                this.goat.obsticles = this.obsticles;
                this.goat.sensors = this.sensors;

            } else if (o.type === 'End') {

                var points = [];
                for (var j = 0; j < o.points.length; j++) {
                    var p = o.points[j];
                    points.push(new V(p.x, p.y));
                }

                var sensor = new Sensor();
                var b = new Polygon(new V(o.pos.x, o.pos.y), points);
                sensor.set_bounds(b);
                sensor.set_position(o.pos.x, o.pos.y);

                layer.add_child(sensor);
                this.sensors.push(sensor);

            } else if (o.type === 'Tent') {

                var messages = ["to die by piano", "crashing on your", "head"];

                if (this.current_level === 1) {
                    messages = ["to die by piano", "crashing on you", ""];
                } else if (this.current_level === 2) {
                    messages = ["to die from", "the rasing spikes", ""];
                }

                var tent = new Tent(messages);
                tent.set_position(o.pos.x, o.pos.y);
                tent.play('glow');
                layer.add_child(tent);
                this.trackable_object = tent;
                this.track(this.trackable_object, true);

            } else if (o.type === 'Switch') {

                var s = new Switch1();
                s.set_position(o.pos.x, o.pos.y);
                layer.add_child(s);
                this.switches.push(s);

                var c = o.children[0];



                if (c) {
                    if (c.type === 'Switch Bridge') {

                        var points = [];
                        for (var j = 0; j < c.points.length; j++) {
                            var p = c.points[j];
                            points.push(new V(p.x, p.y));
                        }

                        var ppp = new V(o.pos.x, o.pos.y).add(new V(c.pos.x, c.pos.y));

                        var platform = new OneWayPlatform();
                        var b = new Polygon(new V(c.pos.x, c.pos.y), points);
                        platform.set_bounds(b);
                        platform.set_position(ppp.x, ppp.y);
                        this.platforms.push(platform);
                        layer.add_child(platform);

                        s.object = platform;

                        var g = new Sprite('ggj15_most');
                        g.set_position(ppp.x, ppp.y);
                        g.z_index = 5;
                        layer.add_child(g);
                        s.graphic = g;

                    } else if (c.type === 'Switch Stone') {

                        var shilci = new SolidPlatform('shilci');
                        var ppp = new V(o.pos.x, o.pos.y).add(new V(c.pos.x, c.pos.y));
                        shilci.set_position(ppp.x, ppp.y);
                        this.platforms.push(shilci);
                        layer.add_child(shilci);
                        s.object = shilci;

                        var platform = new Spikes();

                        platform.set_position(2, -5);
                        platform.c_index = o.c_index;
                        this.sensors.push(platform);
                        shilci.add_child(platform);


                    }
                }



                // Switch Bridge
                // Switch Stone


            }

        }

        this.on_level_start();

    };

    GameScreen.prototype.track = function (object, immidiate) {

        if (!object) {
            return;
        }

        var target_pos = object.bounds.pos;

        var forground = this.get_layer_by_name("playground");

        var pos = forground.get_position();
        var center_camera = new V(Config.screen_width / 2, Config.screen_height / 2);
        center_camera.add(new V(0, -100));

        var angle = Math.get_angle(center_camera, target_pos);
        var distance = Math.get_distance(center_camera, target_pos);

        distance = (distance > 10 && !immidiate) ? Ticker.step : distance;

        var v = new Vector();
        v.setLength(distance);
        v.setAngle(angle);
        pos.sub(v);

        pos.y = pos.y < 170 ? 170 : pos.y;

        for (var i = 0; i < this.layers.length; i++) {
            var l = this.layers[i];
            var k = l.factor;
            l.set_position(pos.x * k, pos.y * k);
        }

    };


    GameScreen.prototype.get_layer_by_name = function (name) {
        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            if (layer.name === name) {
                return layer;
            }
        }
        return false;
    };

    GameScreen.prototype.reset_level = function () {

        this.is_level_loaded = false;

        this.layers = [];
        this.platforms = [];
        this.objects = [];
        this.obsticles = [];
        this.sensors = [];
        this.switches = [];
        this.obsticles = [];

        this.grids = [];

        if (this.player) {
            this.player.controller.destroy();
        }
        this.player = null;
        this.goat = null;
        this.trackable_object = null;

        for (var i = this.children.length - 1; i >= 0; i--) {
            var c = this.children[i];
            c.remove_from_parent();
        }

        this.import_level(ContentManager.current_level_data);


    };

    GameScreen.prototype.update = function (dt) {

        if (!this.is_level_loaded) {
            return;
        }

        for (var j = 0; j < this.objects.length; j++) {

            var o = this.objects[j];
            o.update_movement(dt);

            for (var i = 0; i < this.platforms.length; i++)
            {
                if (!this.platforms[i].is_dynamic) {
                    this.platforms[i].check(o);
                }
            }
        }

        for (var i = 0; i < this.obsticles.length; i++) {
            var obs = this.obsticles[i];

            if (this.player) {
                if (SAT.testPolygonPolygon(this.player.bounds, obs.bounds)) {
                    Notes.send(Notes.NOTE_YOU_LOOSE, null, this.player);
                }
            }


            if (this.goat) {
                if (SAT.testPolygonPolygon(this.goat.bounds, obs.bounds)) {
                    Notes.send(Notes.NOTE_YOU_LOOSE, null, this.goat);
                }
            }



        }

        this.track(this.trackable_object);

        this.handle_visibility();
    };

    GameScreen.prototype.draw = function (context) {
        Screen.prototype.draw.call(this, context);

        var fs = context.fillStyle;
        context.fillStyle = "#efdbd8";
        context.fillRect(0, 0, Config.screen_width, Config.screen_height);
        context.fillStyle = fs;
    };

    GameScreen.prototype.show = function () {
        Screen.prototype.show.call(this);
        // this.reset_level();
    };

    GameScreen.prototype.hide = function () {
        Screen.prototype.hide.call(this);
    };

    GameScreen.prototype.on_resize = function () {

    };

    GameScreen.prototype.on_added_to_parent = function (parent) {

    };

    window.GameScreen = GameScreen;

}(window));