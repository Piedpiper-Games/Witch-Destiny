(function (window, undefined) {

    function Grid(columns, rows, initial) {
        this.initialize(columns, rows);
    }
    //Grid.prototype = new ParentClassName();
    //Grid.prototype.parent_initialize = Grid.prototype.initialize;    
    Grid.prototype.initialize = function (columns, rows) {
        // this.parent_initialize();
        
        this.grid = [];
        this.rows = rows;
        this.columns = columns;

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                var index = i * columns + j;
                this.grid[index] = [];
            }
        }

    };

    Grid.prototype.get = function (y, x) {
        var index = x * this.columns + y;
        var grid = this.grid;
        return this.grid[index];
    };

    Grid.prototype.set = function (y, x, object) {
        if (x < this.columns && y < this.rows) {
            this.grid[x * this.columns + y] = object;
        } else {
            console.warn("You cant set to invalid index of y:" + y + " x:" + x);
        }        
    };

    Grid.prototype.push = function (y, x, object) {
        if (x < this.rows && y < this.columns) {
            this.grid[x * this.columns + y].push(object);
        } else {
            console.warn("You cant push to invalid index of y:" + y + " x:" + x);
        }
    };

    window.Grid = Grid;

}(window));