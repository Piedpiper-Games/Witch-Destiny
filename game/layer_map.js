(function (window, undefined) {

    function LayerMap(graphics) {
        this.initialize(graphics);
    }
    //LayerMap.prototype = new ParentClassName();
    //LayerMap.prototype.parent_0initialize = LayerMap.prototype.initialize;    
    LayerMap.prototype.initialize = function (graphics) {

        this.cell_width = 160;
        this.cell_height = 160;

        // this.parent_initialize();
        this.minX = Number.MAX_VALUE;
        this.minY = Number.MAX_VALUE;
        this.maxX = Number.MIN_VALUE;
        this.maxY = Number.MIN_VALUE;
        this.width = 0;
        this.height = 0;
        this.grid = null;
        this.visible_objects = {};

        this.calculate_size(graphics);
        this.create_grid();
        this.populate_grid(graphics);
    };

    LayerMap.prototype.populate_grid = function (graphics) {

        for (var i = 0; i < graphics.length; i++) {
            
            var graphic = graphics[i];

            if (!(graphic instanceof Sprite) || graphic.is_dynamic){
                continue;
            }

            graphic.is_visible = false;
            
            var pos = graphic.get_position();
            
            pos.x -= graphic.anchor.x*graphic.width;
            pos.y -= graphic.anchor.y*graphic.height;

            var x0 = Math.abs(this.minX - pos.x);
            var y0 = Math.abs(this.minY - pos.y);
            var x1 = Math.abs(x0 + graphic.width);
            var y1 = Math.abs(y0 + graphic.height);

            var start_column = Math.floor(x0 / this.cell_width);
            var start_row = Math.floor(y0 / this.cell_height);

            var end_column = Math.floor(x1 / this.cell_width);
            var end_row = Math.floor(y1 / this.cell_height);

            this.add_to_grid(start_column, start_row, end_column, end_row, graphic);
        }

    };

    LayerMap.prototype.get_objects_at = function (x, y, width, height) {

        for (var key in this.visible_objects) {
            delete this.visible_objects[key];
        }
        
        var x0 = Math.abs(this.minX - x);
        var y0 = Math.abs(this.minY - y);

        var x1 = Math.abs(x0 + width);
        var y1 = Math.abs(y0 + height);

        var start_column = Math.floor(x0 / this.cell_width);
        var start_row = Math.floor(y0 / this.cell_height);

        var end_column = Math.floor(x1 / this.cell_width);
        var end_row = Math.floor(y1 / this.cell_height);

        for (var i = start_column; i <= end_column; i++) {
            for (var j = start_row; j <= end_row; j++) {
                var objects = this.grid.get(i, j);
                if(objects){
                    for (var ind = 0; ind < objects.length; ind++) {
                        var o = objects[ind];
                        this.visible_objects[o.id] = o;
                    }
                }
                

            }
        }
        
        return this.visible_objects;

    };

    LayerMap.prototype.add_to_grid = function (sc, sr, ec, er, graphic) {

        for (var i = sc; i <= ec; i++) {
            for (var j = sr; j <= er; j++) {
                this.grid.push(i, j, graphic);
            }
        }

    };

    LayerMap.prototype.create_grid = function () {
        var columns = Math.ceil(this.width / this.cell_width);
        var rows = Math.ceil(this.height / this.cell_height);
        this.grid = new Grid(columns, rows);
    };

    LayerMap.prototype.calculate_size = function (graphics) {
        for (var i = 0; i < graphics.length; i++) {

            var graphic = graphics[i];
            var pos = graphic.get_position();

            var x0 = pos.x;
            var y0 = pos.y;
            var x1 = pos.x + graphic.width;
            var y1 = pos.y + graphic.height;

            if (x0 < this.minX) {
                this.minX = x0;
            }

            if (y0 < this.minY) {
                this.minY = y0;
            }

            if (x1 > this.maxX) {
                this.maxX = x1;
            }

            if (y1 > this.maxY) {
                this.maxY = y1;
            }
        }

        this.width = this.maxX - this.minX;
        this.height = this.maxY - this.minY;
    };

    window.LayerMap = LayerMap;

}(window));