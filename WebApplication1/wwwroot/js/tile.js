class Tile {
    constructor(x, y, templateElement, agentId) {
        this.tileSize = 30;
        this.history = [Status.NONE];
        this._status = Status.NONE;
        this._agentId = null;
        this.ALLOWED_TRANSITIONS = {
            none: [Status.OBSTACLE, Status.START, Status.GOAL, Status.NONE],
            obstacle: [Status.OBSTACLE, Status.NONE],
            start: [Status.START, Status.NONE],
            goal: [Status.GOAL],
        };
        this.x = x;
        this.y = y;
        this._agentId = agentId;
        this.element = templateElement.cloneNode();
        this.element.setAttribute("y", y.toString());
        this.element.setAttribute("x", x.toString());
        /*
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewbox", "0 0 " + this.tileSize.toString() + " " + this.tileSize.toString());
        svg.setAttribute("x", this.x.toString());
        svg.setAttribute("y", this.y.toString());
        svg.setAttribute("width", this.tileSize.toString());
        svg.setAttribute("height", this.tileSize.toString())

        var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        //polygon.setAttribute("points", "0 0, 100 100, 0 100");

        var arr = [[0, 0], [50, 50], [25, 25]];
        let value;
        for (let i = 0; i < arr.length; i++) {
            value = arr[i];
            var point = svg.createSVGPoint();
            point.x = value[0]
            point.y = value[1]
            polygon.points.appendItem(point);
        }

        polygon.setAttribute("fill", "black");

        svg.appendChild(polygon);

        this.element = svg;
        */
        //this.element.appendChild(svg);
    }
    set status(status) {
        if (status !== this._status) {
            this.history.push(status);
        }
        // if (this.ALLOWED_TRANSITIONS[this._status.name].includes(status)) {
        this._status = status;
        this.element.setAttribute("fill", this._status.fillColor);
        // } else {
        // throw new Error("Invalid transition");
        // }
    }
    set agentId(agentId) {
        this._agentId = agentId;
    }
    get status() {
        return this._status;
    }
    get agentId() {
        return this._agentId;
    }
}
class Status {
    // private to disallow creating other instances of this type
    constructor(value, name, fillColor) {
        this.value = value;
        this.name = name;
        this.fillColor = fillColor;
    }
    toString() {
        return this.value;
    }
}
Status.NONE = new Status(0, "none", "white");
Status.OBSTACLE = new Status(-1, "obstacle", "gray");
Status.PATH = new Status(1, "path", "blue");
Status.START = new Status(2, "start", "green");
Status.GOAL = new Status(3, "goal", "red");
