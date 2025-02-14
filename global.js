var scene, camera, renderer, player, tunnel, obstacles = [], score = 0;

var high_score = 0; //Need to save it in the browser locally and load it



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
  