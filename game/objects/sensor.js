//(function(window,undefined){
    
    function Sensor(){
        this.initialize();
    }    
    
    Sensor.prototype = new Drawable();
    Sensor.prototype.drawable_initialize = Sensor.prototype.initialize;    
    Sensor.prototype.initialize = function(){        
        this.drawable_initialize();
        this.response = new Response();
    };
    
    Sensor.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    Sensor.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    Sensor.prototype.draw = function(context){
        
    };
    
    Sensor.prototype.check = function(object){
        
        var polygon = this.bounds;
        
        if (SAT.testPolygonPolygon(object.bounds, polygon, this.response)) {
            Notes.send(Notes.NOTE_YOU_LOOSE,null,object);
        }
        
    };
    
    Sensor.prototype.clear = function(context){
        
    };
    
//    window.Sensor = Sensor;
    
//}(window));