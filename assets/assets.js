Game.prototype.load_assets = function() {

    ////////////////////////////////////////////////////////////////////////
    //////////////////////   LOAD YOUR ASSETS HERE   ///////////////////////

    ContentManager.add_image('dialog', 'assets/images/dialog.png');
    ContentManager.add_image('white_circle', 'assets/images/white_circle.png');

    ContentManager.add_image('blood', 'assets/images/blood.png');
    ContentManager.add_image('transparent', 'assets/images/transparent.png');
    
    ContentManager.add_spine_animation('dwarf');
    ContentManager.add_spine_animation('goat');
    
    ContentManager.add_file('assets/levels/level_1.json',function(data){
        ContentManager.current_level_data = data;
    },function(){});

    ContentManager.add_image('witch_intro', 'assets/images/ggj15_witch_intro_happy.png');
    ContentManager.add_image('witch_intro_hands', 'assets/images/ggj15_witch_intro_hands.png');
    ContentManager.add_image('witch_intro_luta', 'assets/images/ggj15_witch_intro_luta.png');
    ContentManager.add_image('witch_intro_hands_luta', 'assets/images/ggj15_witch_intro_hands_luta.png');
    ContentManager.add_image('witch_ball1', 'assets/images/ggj15_witch_BALL1.png');
    ContentManager.add_image('witch_ball2', 'assets/images/ggj15_witch_BALL2.png');
    ContentManager.add_image('witch_ball3', 'assets/images/ggj15_witch_BALL3.png');
    ContentManager.add_image('ggj15_witch_BALL3_broken', 'assets/images/ggj15_witch_BALL3_broken.png');
    ContentManager.add_image('ggj15_witch_intro_ball_brokenTotaly', 'assets/images/ggj15_witch_intro_ball_brokenTotaly.png');
    ContentManager.add_image('tent_shadows_double', 'assets/images/tent.png');
    ContentManager.add_image('dwarf_head', 'assets/images/dwarf_head.png');
    ContentManager.add_image('witch_head', 'assets/images/witch_head.png');
    ContentManager.add_image('goat_head', 'assets/images/goat_head.png');
    ContentManager.add_image('smoke', 'assets/images/smoke.png');
    ContentManager.add_image('switch_base', 'assets/images/ggj15_switch_kamen.png');
    ContentManager.add_image('switch_handle', 'assets/images/ggj15_switch_rachka.png');
    
    ContentManager.add_image('ggj15_most', 'assets/images/ggj15_most.png');
    ContentManager.add_image('shilci', 'assets/images/shilci.png');
    
    // 
    
//    
//    ContentManager.add_sound('labels_intro', 'assets/sounds/labeli_intro');
//    ContentManager.add_sound('smach', 'assets/sounds/smach');
        
    ////////////////////////////////////////////////////////////////////////

};
