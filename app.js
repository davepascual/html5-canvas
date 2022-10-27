const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')


canvas.width = 1024  
canvas.height = 768

canvas.style.cursor = 'crosshair'

const center  = {
    x: canvas.width / 2,
    y: canvas.height / 2,
}


var action = null
var selectedObject = null
var points = []
var duration = 30
var gridCount = 10
var gridGapX = (canvas.width - canvas.height) /10
var gridGapY = canvas.height / gridCount
var selectedNode = null


class GridLine{
    constructor(x, y, type){
        this.x = x
        this.y = y
        this.type = type || 'horizontal'
    }

    draw(){
        context.beginPath()
        
        context.moveTo(this.x, this.y)
        if( this.type == 'horizontal')
            context.lineTo(this.x + canvas.width, this.y)
        else
            context.lineTo(this.x , this.y + canvas.height)

        context.stroke()
    }
}


class Node{
    
    constructor(x,y , color, children){
        this.x = x
        this.y = y
        this.color = color || 'red'
        this.children = children || []
        this.radius = 20
        this.data = {
            color : this.color,
            radius : this.radius
        }
    }
    
    draw(){
        context.beginPath()
        context.moveTo(this.x, this.y)
        context.fillStyle = this.color
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
        
    }

    drawChildren(){
        for(let i= 0; i< this.children.length;i++){
            this.children[i].draw()
            context.beginPath()
            context.moveTo(this.x, this.y)
            context.strokeStyle = 'purple'
            // let x = this.children[i].x
            let x = this.children[i].x
            let y = this.children[i].y
            let disx = Math.abs((this.x + this.radius) - (this.children[i].x + this.children[i].radius))
            let disy = Math.abs((this.y + this.radius) - (this.children[i].y + this.children[i].radius))
            context.lineTo( x, y)
            context.stroke()
            context.font = '20px Calibri'
            context.fillStyle = 'blue'
            // context.moveTo(disx/ 2, disy/2)
            context.fillText(`${disx.toFixed()} , ${disy.toFixed()}`, this.children[i].x + this.children[i].radius, this.children[i].y + this.children[i].radius)
            context.fill()
            // let randomCount =Math.floor(Math.random() * 10)
            // console.log(randomCount)
            // for(let j=0; j < randomCount; j++){
            //     let randomIndex = Math.floor(Math.random() * this.children.length)
            //     console.log(`Index: ${randomIndex}`)
            //     this.children[i].children.push(this.children[randomIndex])
            // }
            this.children[i].update()
        }
    }

    select()
    {
        this.color = 'blue'
        selectedNode = this
    }

    update(){
        this.draw()
        // this.drawChildren()
        if(mouse.x >= this.x  - this.radius 
        && mouse.x <= this.x + this.radius 
        && mouse.y >= this.y  - this.radius
        && mouse.y <= this.y + this.radius ){
                if(this.radius < this.data.radius * 2)
                    this.radius += 2
                this.color = 'purple'
                
                this.drawChildren()
            }
        else{
            this.radius = this.data.radius
            this.color = this.data.color
        }
    }
}



class Rectangle{

    constructor(x, y, width, height, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color || '#333';
    }
    

    draw(){
        context.fill()
        context.fillStyle = this.color
        
        context.fillRect(this.x,this.y, this.width, this.height)
        
    }

    update(x,y){
        
        this.x = x
        this.y = y
         
        context.fillRect(this.x,this.y, this.width, this.height)
    }
    
}

class Point{
    constructor(x,y, radius){
        this.x = x
        this.y = y
        this.radius = radius || (Math.random() * 2) + 30
        this.color = 'rgba(0,0,255,0.5)'
        this.borderColor =  'rgba(0,0,255,1)'
        this.alpha = 1
        this.velocity = {
            x: (Math.round(Math.random()) * 2 - 1) * (Math.random() * 10),
            y: (Math.round(Math.random()) * 2 - 1) * (Math.random() * 10),
        }
        this.originalData = {
          x: this.x,  
          y: this.y,
          radius: this.radius,
          color: this.color,
          borderColor: this.borderColor
        }
    }

    draw(){
        context.beginPath()
        context.moveTo(this.x + this.r,this.y)
        context.fillStyle = this.color
        // context.strokeStyle = this.borderColor
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
        // context.stroke()
        
    }

    update(){
        this.x += this.velocity.x
        this.y += this.velocity.y

        if( this.x - this.radius <= 0 || this.x + this.radius >= canvas.width)
            this.velocity.x = this.velocity.x * -1
        if( this.y - this.radius <= 0  || this.y + this.radius >= canvas.height)
            this.velocity.y =  this.velocity.y * -1
        
        this.color =   `rgba(0,0,255,${this.alpha-=0.01})`
        this.borderColor =   `rgba(0,0,255,${this.alpha-=0.01})`
        
        if (this.alpha<=0)
            points = []
        // for(let i =0; i < points.length; i++){
        //     if(points[i] !== this){
        //         if( this.x <= points[i].x + points[i].radius  || this.x + this.radius <= points[i].x)
        //             this.velocity.x = this.velocity.x * -1
        //         if( this.y <= points[i].y + points[i].radius  || this.y + this.radius <= points[i].y)
        //             this.velocity.y = this.velocity.y * -1
        //     }
        // }


        if(mouse.x >= this.x  - this.originalData.radius  && mouse.x <= this.x + this.originalData.radius &&
        mouse.y >= this.y  - this.originalData.radius  && mouse.y <= this.y + this.originalData.radius ){
            this.radius += 2
            this.color = 'rgba(0,0,255,0.8)'
        }
        else{
            
            if(this.radius> this.originalData.radius)
                this.radius -= 10
            this.color = this.originalData.color

        }

        this.draw()
    }
}

var nodeCount = 50


var nodes = []

for(let i = 0; i< nodeCount; i++){
    nodes.push( new Node(Math.random() * canvas.width, Math.random() * canvas.height))
}



var mouse = {
    x: 0,
    y: 0,
    button: null
}

var centerOfRotation = {
    x: center.x,
    y: center.y,
}
var distanceFromCenter = 100
const circle = new Node(canvas.width /2 + distanceFromCenter, canvas.height/2 + distanceFromCenter, 'blue', [])
const circleOrigin = new Node(canvas.width /2 + distanceFromCenter, canvas.height/2 + distanceFromCenter , 'purple', [])
circleOrigin.draw()
const circleCenter = new Node(center.x, center.y, 'red', [])
circleCenter.radius = 10
circleCenter.draw()



function showPoints(x, y){
    points = []
    var pointCount = 100

    for (let i = 0; i < pointCount; i++) {
        let radius = (Math.random() * 2) + 30
        let point = new Point(x, y, radius)
        points.push(point)
        point.draw()
    }
}

var angle = 0


function update(){
   
    // context.fillStyle = 'rgba(0,0,0,0.05)'
    context.clearRect(0,0, canvas.width, canvas.height)
    context.beginPath()
    context.strokeStyle = 'red'
    context.moveTo(mouse.x, mouse.y)
    context.lineTo(center.x , center.y)
    context.stroke()
    angle+= 0.05
    let x =  centerOfRotation.x + Math.abs( center.x - mouse.x) + distanceFromCenter * Math.cos(angle)
    let y =  centerOfRotation.y + Math.abs( center.y - mouse.y ) + distanceFromCenter   * Math.sin(angle)
    circle.x = x
    circle.y = y
    circle.draw()
    circleOrigin.draw()
    circleCenter.draw()
   
    
    // for(let i=0; i< nodes.length; i++){
    //     nodes[i].update()
    // }

    for (let i = 0; i < points.length; i++) {
        points[i].update()
    }

    // Grid Lines
    // context.beginPath()
    // for(let i = 0; i< canvas.width; i+= gridGapX){
        
    //     context.moveTo(i, 0)
    //     context.lineTo(i,canvas.height)
        
    //     context.moveTo(0, i)
    //     context.lineTo(canvas.width,i)

    //     context.strokeStyle = 'gray'
        

    //     for( let j=0; j<= canvas.width; j+=gridGapX){
    //         // context.moveTo(0,i)
    //         // context.arc(j, i, 10, 0, Math.PI * 2)
    //         // context.fill()
    //     }
    // }

    // context.stroke()

    // Label coordinates
    // context.fillStyle = 'red'
    // if(mouse.x + 200 >= canvas.width)
    // {
    //     context.fillRect(mouse.x - 200, mouse.y , 200, 50)
    //     context.fillStyle = 'white'
    //     context.font = '20px Arial'
    //     context.fillText(`x: ${mouse.x}, y: ${mouse.y}`, mouse.x + 10 - 200, mouse.y + 25, 300)
    // }
    // else
    // {
    //     context.fillRect(mouse.x , mouse.y , 200, 50)
    //     context.fillStyle = 'white'
    //     context.font = '20px Arial'
    //     context.fillText(`x: ${mouse.x}, y: ${mouse.y}`, mouse.x + 10, mouse.y + 25, 300)
    // }
   
    // context.fill()
    requestAnimationFrame(update)
}



update();




canvas.addEventListener('mousemove', e=>{
    // console.log(e.button)
    mouse.x = e.offsetX
    mouse.y = e.offsetY
    // mouse.button = e.button
    // context.fillRect(e.x, e.y, 100, 50)
    // context.fill()
})


canvas.addEventListener('mousedown', (e)=>{
    if(action == 'add_point'){
        // context.beginPath()
        // context.moveTo(e.x, e.y)
        
        // let point = new Point(e.x, e.y, duration)
        // points.push(point)
        // point.draw()
        // expandCircle(e.x , e.y)
    
    }
    if(points.length <=0)
        showPoints(e.x, e.y)

    console.log(e.button)
    
})

canvas.addEventListener('mouseup', e =>{
    if(action == 'add_point'){

        let now = new Date()
        
        context.beginPath()
        context.moveTo(e.x, e.y)
        
        let point = new Point(e.x, e.y, radius)
        points.push(point)
        point.draw()
        duration = 0
        
    }
    mouse.button = null
})

const drawLineBtn = document.getElementById('draw-line')
const addPointBtn = document.getElementById('add-point')
const distanceSlider = document.getElementById('slider')

distanceSlider.value = distanceFromCenter

distanceSlider.addEventListener('mousedown', e=>{
    console.log(e.target.value)
    distanceFromCenter = e.target.value
    circleOrigin.x = e.target.value
    circleOrigin.y = e.target.value
    // requestAnimationFrame(update)
})

function drawLine(e){
    console.log('Draw Line')
    action = 'draw_line'

    context.clearRect(0,0,canvas.width, canvas.height)

    context.beginPath()
    if(points.length > 0){
        context.moveTo(points[0].x, points[0].y)
        points[0].draw()
        for (let i = 1; i <points.length; i++) {
            let x = points[i].x;
            let y = points[i].y;
            points[i].draw()
            context.moveTo(points[i-1].x, points[i-1].y)
            context.fillStyle = 'transparent'
            context.lineTo(x, y)
        }
    }
    context.stroke()
    
}

drawLineBtn.addEventListener('click',drawLine)

addPointBtn.addEventListener('click',(e)=>{
    console.log('Add Point')
    action = 'add_point'
    canvas.style.cursor = 'crosshair'
})

