//(function(window,undefined){
    
    function Spikes(name){
        this.initialize(name);
    }    
    
    Spikes.prototype = new Sprite();
    Spikes.prototype.sprite_initialize = Spikes.prototype.initialize;    
    Spikes.prototype.initialize = function(name){        
        this.sprite_initialize('transparent'); // your image name
        this.set_size(300, 50);
        
    };
    
    Spikes.prototype.on_added_to_parent = function(parent){
        Sprite.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    Spikes.prototype.on_remove_from_parent = function(parent){
        Sprite.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    Spikes.prototype.on_draw = function(context){
        
    };
    
    Spikes.prototype.update = function(dt){
        
    };
    
    Spikes.prototype.check = function(object){
      
        if(SAT.testPolygonPolygon(this.bounds,object.bounds)){
          return true;
        }
        
        return false;
        
    };
    
    Spikes.prototype.on_note = function (note, data, sender) {
       // if (note === Notes.NOTE_NAME) {}
    };
    
    
//    window.Spikes = Spikes;
    
//}(window));