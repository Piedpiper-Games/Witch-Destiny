(function (window, undefined) {

    function PlayerStates(player) {
        this.initialize(player);
    }
    //PlayerStates.prototype = new ParentClassName();
    //PlayerStates.prototype.parent_initialize = PlayerStates.prototype.initialize;    
    PlayerStates.prototype.initialize = function (player) {
        // this.parent_initialize();

        this.player = player;

        // idle
        // running
        // jumping
        // falling
        // attacking
        // edge_hold
        // wall_push
        // orb_attacking
        // object push
        // wall_drag
        // ring_hold


        var states = [
            {
                name: 'idle',
                initial: true,
                events: {
                    running: 'running',
                    jumping: 'jumping',
                    attacking: 'attacking',
                    orb_attacking: 'orb_attacking',
                    wall_push: 'wall_push',
                    object_push: 'object_push',
                    ring_hold: 'ring_hold'
                }
            },
            {
                name: 'running',
                events: {
                    idle: 'idle',
                    jumping: 'jumping',
                    falling: 'falling',
                    attacking: 'attacking',
                    orb_attacking: 'orb_attacking',
                    wall_push: 'wall_push',
                    object_push: 'object_push',
                    ring_hold: 'ring_hold'
                }
            },
            {
                name: 'jumping',
                events: {
                    idle: 'idle',
                    falling: 'falling',
                    attacking: 'attacking',
                    orb_attacking: 'orb_attacking',
                    running: 'running',
                    wall_drag: 'wall_drag',
                    ring_hold: 'ring_hold'
                }
            },
            {
                name: 'falling',
                events: {
                    idle: 'idle',
                    attacking: 'attacking',
                    orb_attacking: 'orb_attacking',
                    running: 'running',
                    jumping: 'jumping',
                    edge_hold: 'edge_hold',
                    wall_push: 'wall_push',
                    object_push: 'object_push',
                    wall_drag: 'wall_drag',
                    ring_hold: 'ring_hold'
                }
            },
            {
                name: 'attacking',
                events: {
                    idle: 'idle',
                    running: 'running',
                    jumping: 'jumping',
                    falling: 'falling',
                    edge_hold: 'edge_hold',
                    wall_push: 'wall_push',
                    object_push: 'object_push',
                    orb_attacking: 'orb_attacking',
                    wall_drag: 'wall_drag',
                    ring_hold: 'ring_hold'
                }
            },
            {
                name: 'orb_attacking',
                events: {
                    idle: 'idle',
                    running: 'running',
                    jumping: 'jumping',
                    falling: 'falling',
                    edge_hold: 'edge_hold',
                    wall_push: 'wall_push',
                    object_push: 'object_push',
                    attacking: 'attacking',
                    wall_drag: 'wall_drag',
                    ring_hold: 'ring_hold'
                }
            },
            {
                name: 'edge_hold',
                events: {
                    jumping: 'jumping',
                    falling: 'falling'
                }
            },
            {
                name: 'wall_push',
                events: {
                    jumping: 'jumping',
                    idle: 'idle',
                    running: 'running'
                }
            },
            {
                name: 'object_push',
                events: {
                    jumping: 'jumping',
                    idle: 'idle',
                    running: 'running',
                    wall_push: 'wall_push'
                }
            },
            {
                name: 'wall_drag',
                events: {
                    jumping: 'jumping',
                    idle: 'idle',
                    wall_push: 'wall_push',
                    falling: 'falling'
                }
            },
            {
                name: 'ring_hold',
                events: {
                    jumping: 'jumping',
                    falling: 'falling',
                    idle: 'idle',
                    running: 'running'
                }
            }
        ];

        this.fsm = new StateMachine(states);
        this.fsm.subscribe("*", this);
    };

    PlayerStates.prototype.update = function () {

        var that = this;

        if (this.player.velocity.y > 0) {
            this.player.is_on_ground = false;
        }

        if (this.player.is_on_ground) {

            if (this.player.controller.is_attacking) {
                this.fsm.set('attacking');
            } else if (this.player.controller.is_orb_attacking) {
                this.fsm.set('orb_attacking');
            } else if (this.player.is_wall_push) {
                this.fsm.set('wall_push');
            } else if (this.player.is_object_push) {
                this.fsm.set('object_push');
            } else if (this.player.velocity.x !== 0) {
                this.fsm.set('running');
            } else {
                this.fsm.set('idle');
            }

        } else {

            if (this.player.controller.is_attacking) {
                this.fsm.set('attacking');
            } else if (this.player.controller.is_orb_attacking) {
                this.fsm.set('orb_attacking');
            } else if (this.player.is_edge_hold) {
                this.fsm.set('edge_hold');
            } else if (this.player.is_wall_drag) {
                this.fsm.set('wall_drag');
            } else if (this.player.is_ring_hold) {
                this.fsm.set('ring_hold');
            } else if (this.player.velocity.y > 0) {
                this.fsm.set('falling');
            } else {
                this.fsm.set('jumping');
            }

        }


    };

    PlayerStates.prototype.on_state = function (prev_state, current_state, data) {

        if (current_state.name === 'idle') {
            this.player.play('idle', true, this.player.current_flipped);
        } else if (current_state.name === 'running') {
            this.player.play('run', true, this.player.current_flipped);
        } else if (current_state.name === 'jumping') {
            this.player.play('jump', false, this.player.current_flipped);
        } else if (current_state.name === 'falling') {
            this.player.play('fall', false, this.player.current_flipped);
        } else if (current_state.name === 'attacking') {
//            this.player.play('attack', false, this.player.current_flipped, function ()
//            {
//                this.controller.is_attacking = false;
//            });
        } else if (current_state.name === 'orb_attacking') {
//            this.player.play('attack_orb', false, this.player.current_flipped, function ()
//            {
//                this.controller.is_orb_attacking = false;
//            });
        } else if (current_state.name === 'edge_hold') {
//            this.player.play('edge_hold', true, this.player.current_flipped);
//            this.player.is_on_ground = true;
        } else if (current_state.name === 'wall_push') {
          //  this.player.play('wall_push', true, this.player.current_flipped);
        } else if (current_state.name === 'object_push') {
            this.player.play('object_push', true, this.player.current_flipped);
        } else if (current_state.name === 'wall_drag') {
//            this.player.velocity.y = 0.05;
//            this.player.play('edge_hold', true, this.player.current_flipped);
        } else if (current_state.name === 'ring_hold') {
          //  this.player.play('ring_hold', true, this.player.current_flipped);
        }

    };

    PlayerStates.prototype.on_note = function (event_name, data, sender) {

        if (sender === this.player) {
            if (this.player.current_animation !== 'attack_orb' &&
                    this.player.current_animation !== 'edge_hold' &&
                    this.player.current_animation !== 'attack' &&
                    this.player.current_animation !== 'wall_drag'
                    ) {

                this.player.current_flipped = !this.player.current_flipped;
                this.player.play(this.player.current_animation, true, this.player.current_flipped);
            }
        }



    };

    window.PlayerStates = PlayerStates;

}(window));