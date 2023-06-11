window.addEventListener("load", function (){
    start()
})

function start(){
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    
    ctx.fillRect(canvas.width / 2 - 0.5, canvas.height / 2 - 0.5, 1, 1)
}