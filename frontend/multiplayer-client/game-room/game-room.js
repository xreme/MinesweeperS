var gamemodeLbl = null;
document.addEventListener('DOMContentLoaded',()=>{
    gamemodeLbl = document.getElementById("gamemode")

})

export function setGamemodeLbl(text){
    gamemodeLbl.textContent = text
}