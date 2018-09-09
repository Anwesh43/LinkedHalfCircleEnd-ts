const w : number = window.innerWidth, h : number = window.innerHeight
const nodes : number = 5
class HalfCircleEndStage {
    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = '#BDBDBD'
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : HalfCircleEndStage = new HalfCircleEndStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {
    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += 0.1 * this.prevScale
        if (Math.abs(this.prevScale - this.scale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {
    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class HCENode {
    state : State = new State()
    prev : HCENode
    next : HCENode
    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < nodes - 1) {
            this.next = new HCENode(this.i + 1)
            this.next.prev = this
        }
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : HCENode {
        var curr : HCENode = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }

    draw(context : CanvasRenderingContext2D) {
        const gap : number = h / (nodes + 1)
        const size : number = gap / 3
        context.fillStyle = '#FFC107'
        context.save()
        context.translate(w/2, this.i * gap + gap)
        for(var i = 0; i < 2; i++) {
            context.save()
            context.scale(1 - 2 * (i%2), 0)
            context.save()
            context.translate((w/2 - size/2) * this.state.scale, 0)
            context.rotate(Math.PI * this.state.scale)
            context.beginPath()
            for (var j = -90; j <= 90; j++) {
                const x = (size/2) *  Math.cos(j * Math.PI/180), y = (size/2) * Math.sin(j * Math.PI/180)
                if (j == -90) {
                    context.moveTo(x, y)
                } else {
                    context.lineTo(x, y)
                }
            }
            context.fill()
            context.restore()
            context.restore()
        }
        context.restore()
        if (this.next) {
            this.next.draw(context)
        }
    }
}
