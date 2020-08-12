(function(window) {
    //main class
    function Game() {
        this.initialize();
    }

    Game.prototype.initialize = function() {

        this.stage = new Stage();
        
        this.input = new Input();

        this.input.add_listener('stage');

        this.navigator = new Navigator();

        ////////////////////////////////////////////////////////////////////////////
        ////////////////////  LOADING SCREEN ASSETS ////////////////////////////////

        ContentManager.add_image('lights1', 'assets/images/lights1.png');
        ContentManager.add_image('lights2', 'assets/images/lights2.png');
        ContentManager.add_image('logo', 'assets/images/logo.png');
        ContentManager.add_image('loading_fr', 'assets/images/loading_fr.png');
        ContentManager.add_image('loading_bg', 'assets/images/loading_bg.png');

        // DON'T ADD ASSETS HERE !!!

        ////////////////////////////////////////////////////////////////////////////

        window.game = this;

        ContentManager.download_resources(this.stage, function() {

            game.load_assets();

            game.navigator.add(new LoadingScreen());
            Ticker.add_listener(game);
            Ticker.set_fps(30); // min fps
            Ticker.start();

            ContentManager.download_resources(this.stage, function() {
                window.setTimeout(function() {
                    game.navigator.add(new NarativeScreen(), Screen.ANIMATION_TYPE_FADEIN);
                   // game.navigator.add(new GameScreen(), Screen.ANIMATION_TYPE_FADEIN);
                }, 300);
            });

        });
        
        if(Config.debug_info){
            
            this.debug_label = new Label();
            this.debug_label.z_index = -1;
            
            this.debug_label.set({
                text: "-",
                text_size : (Config.is_low_resolution ? 10: 20) ,
                text_color: "#aaaaaa"
            });
            this.debug_label.z_index = 10000;
            this.stage.add(this.debug_label);
            this.debug_label.set_position(20,20);
            
            
            this.debug_label2 = new Label();
            this.debug_label2.z_index = -1;
            
            this.debug_label2.set({
                text: "-",
                text_size : (Config.is_low_resolution ? 10: 20) ,
                text_color: "#aaaaaa"
            });
            this.debug_label2.z_index = 10000;
            this.stage.add(this.debug_label2);
            this.debug_label2.set_position(20,50);
            
            
            this.debug_label3 = new Label();
            this.debug_label3.z_index = -1;
            
            this.debug_label3.set({
                text: "-",
                text_size : (Config.is_low_resolution ? 10: 20) ,
                text_color: "#aaaaaa"
            });
            this.debug_label3.z_index = 10000;
            this.stage.add(this.debug_label3);
            this.debug_label3.set_position(20,80);
            

        }
    };

    Game.prototype.resize = function() {

        if (Config.is_low_resolution) {
            this.stage.context.canvas.width = Config.screen_width / 2;
            this.stage.context.canvas.height = Config.screen_height / 2;
        } else {
            this.stage.context.canvas.width = Config.screen_width;
            this.stage.context.canvas.height = Config.screen_height;
        }

        this.stage.context.canvas.style.width = Config.canvas_width + "px";
        this.stage.context.canvas.style.height = Config.canvas_height + "px";
        
        if(Config.window_mode === Config.MODE_FLEXIBLE_HEIGHT_CENTERED){
            if(Config.window_width > Config.game_width) {
                // it should be placed in the center       
                var style = ((Config.window_width / 2 ) - Config.canvas_width / 2)+"px";
                this.stage.context.canvas.style.left = style;
            } else {
                this.stage.context.canvas.style.left = "0px";
            }
        }

        for (var i = 0; i < this.navigator.screens.length; i++) {
            this.navigator.screens[i].on_resize();
        }
    };

    /**
     * @description This is the main game loop
     */
    Game.prototype.tick = function() {

        this.stage.clear_canvas();
        
        this.navigator.update();        
        Actions.run();
        this.stage.update();

        if (Config.debug) {
            this.stage.debug_grid();
        }

        SAT.pool.reset();

    };

    window.Game = Game;

}(window));
