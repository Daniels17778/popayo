
function selectLevel(levelNumber) {
    // Redirect to the specific level based on the selected level
    window.location.href = `basketball_game.html?level=${levelNumber}`;
}

function goBack() {
    window.location.href = "index.html";
}
