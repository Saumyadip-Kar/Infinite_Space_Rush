var scene, camera, renderer, player, tunnel, obstacles = [], score = 0;

var high_score = 0; //Need to save it in the browser locally and load it

var colors = [
  0xff0000, // Red
  0x00ff00, // Lime
  0x0000ff, // Blue
  0xffff00, // Yellow
  0x00ffff, // Aqua
  0xff00ff, // Fuchsia
  0xffa500, // Orange
  0xff1493, // Deep Pink
  0xadff2f, // Green Yellow
  0x40e0d0  // Turquoise
];


function saveHighScore(s) {
    // Save the score in localStorage
    localStorage.setItem('high_score', s);
}


  
  function loadHighScore() {
    // Check if there's a saved high score in localStorage
    let s = localStorage.getItem('high_score');
    
    // If no high score exists, initialize to 0
    if (s === null) {
      s = 0;
    }
  
    return s;
  }

var paused = false;
var controls_message = `
        <div style="font-size: 24px; margin-top: 20px;">To move the spaceship use: </div>
        <div style="font-size: 24px; margin-top: 20px;">W, A, S, D or the Arrow Keys </div>
    `;
  