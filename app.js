// targetting elements
const puneet = document.querySelector('.puneet')
const game = document.querySelector('.game')
const instructions = document.querySelector('.instruction')


// constants 
const enemySpeed = 20
const jumpSpeed = 40

// variables
let isGameOver = false

// listening to key press and doing something on it
document.addEventListener("keydown", (e)=>{
    if(e.key== " " | "space"){
        if(!isJumping && !isGameOver){
            jump()
        }
    }
    
    if(e.key == "Enter"){
        startGame()
    }
})

// array of enemies

const enemies = [
    {
        image : '/public/babu1.png',
        sounds : ['/public/babu1.mp3', '/public/babu2.mp3']
    },

    {
        image : '/public/akhsay1.png',
        sounds : ['/public/akhsay1.mp3', '/public/akhsay2.mp3']
    },

    {
        image : '/public/bhau1.png',
        sounds : ['/public/bhau1.mp3', '/public/bhau2.mp3']
    },

]


// jump function
let jumpHeight = 0
let isJumping = false

let jumpSound = sound('/public/jumpSound.mp3')

function jump(){
    jumpSound.currentTime = 0.5
    jumpSound.play()
    isJumping = true
    const jumpUpInterval = setInterval(()=>{
        jumpHeight += 10
        console.log('jumping')
        puneet.style.bottom = jumpHeight + "px"

        if(jumpHeight>=20){
            puneet.src = '/public/puneet1.png'
        }
        if(isGameOver){
            clearInterval(jumpUpInterval)
        }

        if(jumpHeight>250){
            clearInterval(jumpUpInterval)
            const jumpDownInterval = setInterval(()=>{
                jumpHeight -= 10
                puneet.style.bottom = jumpHeight + "px"

                if(jumpHeight<=20){
                    puneet.src = '/public/puneet2.png'
                }
                if(isGameOver){
                    clearInterval(jumpDownInterval)
                }

                if(jumpHeight<=0){
                    clearInterval(jumpDownInterval)
                    jumpSound.pause()
                    isJumping = false
                }
            }, jumpSpeed)
        }
    }, 20)
}

// sound function

function sound(url){
    const audio = new Audio(url)
    return audio
}

function createEnemy(){
    const enemy = document.createElement('img')
    enemy.classList.add('enemy')
    enemy.src = '/public/bhau1.png'
    game.appendChild(enemy)

    moveEnemy(enemy)
}

// to get random enemy object
function generateRandomEnemy(){
    return enemies[Math.floor(Math.random()*enemies.length)]
}

function moveEnemy(enemy){
    let randomEnemyObject = generateRandomEnemy() 
    let positionRight = 0
    let entrySound = sound(randomEnemyObject.sounds[0])
    let hitSound = sound(randomEnemyObject.sounds[1])
    entrySound.play()

    enemy.src = randomEnemyObject.image
    const enemyInterval = setInterval(() => {
        positionRight += 1
        enemy.style.right = positionRight + "%"

        if(positionRight>=100){
            clearInterval(enemyInterval)
            game.removeChild(enemy)
        }
        const enemyLeftPosition = enemy.getBoundingClientRect().left
        
        // game over condition here
        if(enemyLeftPosition<=120 && enemyLeftPosition>=0){
            if(jumpHeight<=150){
                clearInterval(enemyInterval)
                isGameOver = true
                jumpSound.pause()
                let enemyImage = enemy.src
                enemy.src = enemyImage.replace('1.png', '2.png')
                entrySound.pause()
                hitSound.play()
                puneet.classList.add('puneet-hit')
                instructions.innerHTML = 'Game Over'
            }
        }

        if(isGameOver){
            clearInterval(enemyInterval)
        }

    }, enemySpeed)
}


function createEnemies(){
    if(!isGameOver){
        createEnemy()
    }
    setTimeout(()=>{
        createEnemies()
    }, Math.random()*2000+700)
}

function startGame(){
    createEnemies()
    instructions.innerHTML = ''
}