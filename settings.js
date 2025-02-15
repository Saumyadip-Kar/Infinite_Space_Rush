var keymaps = {
    movement: {
        keyboard: {
            left_keys: ["ArrowLeft", "a"],
            right_keys: ["ArrowRight", "d"],
            up_keys: ["ArrowUp", "w"],
            down_keys: ["ArrowDown", "s"],
        },
        gamepad: {
            left_keys: ["DPadLeft", "ThumbstickLeft"],
            right_keys: ["DPadRight", "ThumbstickRight"],
            up_keys: ["DPadUp", "ThumbstickUp"],
            down_keys: ["DPadDown", "ThumbstickDown"],
        }
    }
};

var objects = {
    obstacles:{
        spawn_distance: -100,
        spawn_range: 5,
    }
}

var current_difficulty =  "beginner";
var difficulty = {
    "beginner": {
        obstacle_spawn_probability: 0.02,
        speed: 0.15,
    },
    "intermediate": {
        obstacle_spawn_probability: 0.05,
        speed: 0.2,
    },
    "pro": {
        obstacle_spawn_probability: 0.10,
        speed: 0.5,
    }
    
}

var limits = {
    left_limit: -5,
    right_limit: 5,
    top_limit: 4,
    bottom_limit: -4
}
