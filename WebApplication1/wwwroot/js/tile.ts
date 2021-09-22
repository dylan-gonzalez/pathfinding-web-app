class Tile {
    public x: number;
    public y: number;
    public element: Element;
    public tileSize: number = 30;
    public history: Status[] = [Status.NONE];
    private _status: Status = Status.NONE;
    private _agentId?: number = null;

    private ALLOWED_TRANSITIONS = {
        none: [Status.OBSTACLE, Status.START, Status.GOAL, Status.NONE],
        obstacle: [Status.OBSTACLE, Status.NONE],
        start: [Status.START, Status.NONE],
        goal: [Status.GOAL],
    };

    public constructor(
        x: number,
        y: number,
        templateElement: Element,
        agentId?: number
    ) {
        this.x = x;
        this.y = y;
        this._agentId = agentId;

        this.element = templateElement.cloneNode() as Element;
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

    public set status(status: Status) {
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

    public set agentId(agentId: number) {
        this._agentId = agentId;
    }

    public get status(): Status {
        return this._status;
    }

    public get agentId(): number {
        return this._agentId;
    }
}

class Status {
    static readonly NONE = new Status(0, "none", "white");
    static readonly OBSTACLE = new Status(-1, "obstacle", "gray");
    static readonly PATH = new Status(1, "path", "blue");
    static readonly START = new Status(2, "start", "green");
    static readonly GOAL = new Status(3, "goal", "red");

    // private to disallow creating other instances of this type
    private constructor(
        public readonly value: number,
        public readonly name: string,
        public readonly fillColor: string
    ) { }

    toString() {
        return this.value;
    }
}
