
let canvas = document.querySelector('canvas')
console.log(gsap)
canvas.width = innerWidth
canvas.height = innerHeight



let score = document.querySelector('#score')
let container = document.querySelector(".container");

let end_score = document.querySelector('#end_score')
let high_score = document.querySelector("#score_high");


let start = document.querySelector("#start");



let c = canvas.getContext('2d')
// player........................................
class Player{
    constructor(x,y,radius,color){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }
    Draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2,false)
        c.fillStyle = this.color
        c.fill()
    }
}


// partice...............................
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  Draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  Update(){
      this.Draw()
      this.x = this.x + this.velocity.xx
      this.y = this.y + this.velocity.yy
  }
}

 let particle_array = []
 let ennimy_array = [];
 let explose_array = [];
let sc = 0;

// high_score.innerHTML = sc


 function init(){
    particle_array = [];
    ennimy_array = [];
     explose_array = [];
     sc = 0;
     score.innerHTML = sc
     end_score.innerHTML = sc
 
 }
 
//  Enimy..............
class Enimy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  Draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  Update() {
    this.Draw();
    this.x = this.x + this.velocity.xx;
    this.y = this.y + this.velocity.yy;
  }
}



// explose

let friction_of = 0.99
class Explose {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.opacity = 1
  }
  Draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore()
  }
  Update() {
    this.Draw();
    this.velocity.xx *= friction_of
    this.velocity.yy *= friction_of;

    this.x = this.x + this.velocity.xx;
    this.y = this.y + this.velocity.yy;
    this.opacity -= 0.01
  }
}



function Diff_Animy(){
   
     let count = 0;

  let iii =   setInterval(()=>{
      count+=1
      // console.log(count)
        let radius = Math.random () * (30 - 4) + 4;
        let x;
        let y;
        if(Math.random < 0.5){
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height
        
        }else{
             x = Math.random() * canvas.width 
             y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
       

        let angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

        velocity = {
          xx: Math.cos(angle) * 2,
          yy: Math.sin(angle) * 2,
        };
        let color = ['red','blue','green','orange','yellow','gray','skyblue']

        let cccc = color[Math.trunc((Math.random()*6)+1)]
        

       ennimy_array.push(new Enimy(x,y,radius,cccc,velocity))
              
    },1000)
    
}

// Animation ...................
let animationId;


function Animatio(){

    c.fillStyle = 'rgba(0,0,0,0.1)'
    c.fillRect(0,0,canvas.width,canvas.height)
    animationId = requestAnimationFrame(Animatio);
    let player = new Player(canvas.width / 2, canvas.height / 2, 30, "white");
    player.Draw();

    explose_array.forEach((ex,ex_index)=>{
      if(ex.opacity <=0){
        explose_array.splice(ex_index, 1)
       
      }else{
         ex.Update();
      }
      
    })
    // Remove the particle from array when its left from screen
       particle_array.forEach((ele,index) => {
         ele.Update();
         if(ele.x - ele.radius < 0 || ele.x + ele.radius > canvas.width || ele.y - ele.radius < 0 || ele.y + ele.radius > canvas.height){
            setTimeout(function () {
              particle_array.splice(index,1)
            })
         }
       });
    
     ennimy_array.forEach((eni,index)=>{
        eni.Update()
        let dist = Math.hypot(player.x - eni.x, player.y - eni.y);
        if(dist - player.radius - eni.radius < 1){

           
          //  End game///////////////////////////////
            cancelAnimationFrame(animationId)
            container.style.display = 'block'
            end_score.innerHTML = sc
        }

        // Collison of particle and enimy
        particle_array.forEach((pp,p_index)=>{
    
          let dist = Math.hypot(pp.x - eni.x,pp.y-eni.y)
         
        
          if(dist - pp.radius - eni.radius < 1){
             sc+=10
             score.innerHTML = sc

            //  Exploser...................
             for (let i = 0; i < eni.radius; i++) {
               explose_array.push(
                 new Explose(
                   pp.x,
                   pp.y,
                   Math.random() * 2,
                   eni.color,
                   (velocity = {
                     xx: (Math.random() - 0.5) * 8,
                     yy: (Math.random() - 0.5) * 8,
                   })
                 )
               );
             }
             console.log(explose_array);

              

            // if(eni.radius - 10 > 10){
              
            //    gsap.to(eni,{ radius : eni.radius - 10})
            //    setTimeout(() => {
                
            //       particle_array.splice(p_index, 1);
            //    }, 0);
               
            // }else{
                setTimeout(() => {
                  particle_array.splice(p_index, 1);
                  ennimy_array.splice(index, 1);
                }, 0);

            // }
            
          }

        })
    })
    
 
   
}

document.addEventListener('click',(e)=>{
  console.log(particle_array)
  
    let angle = Math.atan2(e.clientY - canvas.height /2 ,e.clientX - canvas.width /2)

    let width = Math.trunc(canvas.width/2)
    let height = canvas.height/2
   
    const velocity = {
        xx : Math.cos(angle) * 20,
        yy : Math.sin(angle) * 20
    }
    particle_array.push(
      new Particle(width,height, 10, "white", velocity)
    );
  
})



start.addEventListener('click',()=>{
     init()
    Animatio();
    Diff_Animy();
     container.style.display = "none";
})

