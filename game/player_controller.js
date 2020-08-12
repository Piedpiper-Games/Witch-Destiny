(function (window, undefined) {

    function PlayerController(should_attach_keyboard) {
        this.initialize(should_attach_keyboard);
    }
    //PlayerController.prototype = new ParentClassName();
    //PlayerController.prototype.parent_initialize = PlayerController.prototype.initialize;    
    PlayerController.prototype.initialize = function (should_attach_keyboard) {
        // this.parent_initialize();

        var that = this;

        this.reset();
        
        this.should_attach_keyboard = should_attach_keyboard;

        if (should_attach_keyboard) {

            this.kibo = new Kibo();

           

            /////////////////

            this.kibo.down('space', function () {
                that.is_space = true;
                
                return false;
            });

            this.kibo.up('space', function () {
                that.is_space = false;
                Notes.send(Notes.NOTE_CHECK_SWITCH);
            });


            this.kibo.down('up', function () {
                that.is_up_holding = true;
                if (!that.is_up_locked) {
                    that.is_up_locked = true;
                    that.is_up_pressed = true;
                    that.handle_down();
                }
                return false;
            });
            this.kibo.down('right', function () {
                that.is_right_pressed = true;
                that.last_pressed = 2;
                that.handle_down();
                return false;
            });
            
            this.kibo.down('left', function () {
                that.is_left_pressed = true;
                that.last_pressed = 4;
                that.handle_down();
                return false;
            });



            this.kibo.up('up', function () {
                that.is_up_holding = false;
                that.is_up_locked = false;
                that.is_up_pressed = false;
                that.handle_up();
            });
            this.kibo.up('right', function () {
                that.is_right_pressed = false;
                that.handle_up();
            });
            
            this.kibo.up('left', function () {
                that.is_left_pressed = false;
                that.handle_up();
            });

        }


    };

    PlayerController.prototype.handle_down = function () {

        if (this.is_left_pressed && !this.is_right_pressed) {
            this.is_left = true;
            this.is_right = false;
        }

        if (this.is_right_pressed && !this.is_left_pressed) {
            this.is_right = true;
            this.is_left = false;
        }

        if (this.is_left_pressed && this.is_right_pressed) {

            if (this.last_pressed == 2) {
                this.is_right = true;
                this.is_left = false;
            } else if (this.last_pressed == 4) {
                this.is_left = true;
                this.is_right = false;
            }
        }

        if (this.is_up_pressed) {
            this.is_up = true;
        } else if (this.is_down_pressed) {
            this.is_down = true;
        }

    };

    PlayerController.prototype.handle_up = function () {

        if (this.is_left_pressed && !this.is_right_pressed) {
            this.is_left = true;
            this.is_right = false;
        }

        if (this.is_right_pressed && !this.is_left_pressed) {
            this.is_right = true;
            this.is_left = false;
        }

        if (!this.is_left_pressed && !this.is_right_pressed) {
            this.is_left = false;
            this.is_right = false;
        }

        if (!this.is_up_pressed) {
            this.is_up = false;
        }

        if (!this.is_down_pressed) {
            this.is_down = false;
        }

    };

    PlayerController.prototype.reset = function () {
        this.is_up = false;
        this.is_right = false;
        this.is_down = false;
        this.is_left = false;


        this.is_up_pressed = false;
        this.is_right_pressed = false;
        this.is_down_pressed = false;
        this.is_left_pressed = false;
        this.is_up_holding = false;

        this.is_up_locked = false;

        this.is_attacking = false;
        this.is_orb_attacking = false;

        this.last_pressed = 0;
        
        this.is_space = false;
    };
    
    PlayerController.prototype.destroy = function(){
        this.kibo.up('space',null);
        this.kibo.down('space',null);
    };

    window.PlayerController = PlayerController;

}(window));