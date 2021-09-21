class Core {
    constructor(map, tile, mapWidth, mapHeight) {
        this.tileSize = 30;
        this._noOfAgents = 1;
        this.agents = [];
        //set map dimensions
        this.map = map;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        // this.map.setAttribute(
        //   "width",
        //   (
        //     Math.round(window.screen.width / this.tileSize) * this.tileSize
        //   ).toString()
        // );
        this.map.setAttribute("width", "1350");
        //this.map.setAttribute("height", Math.round((window.screen.height / this.tileSize) * this.tileSize).toString());
        this.map.setAttribute("height", "650");
        this.grid = new Array(mapHeight);
        //create grid
        for (let y = 0; y < mapHeight; y++) {
            this.grid[y] = new Array(mapWidth);
            for (let x = 0; x < mapWidth; x++) {
                let xnew = x * this.tileSize;
                let ynew = y * this.tileSize;
                let newTile = new Tile(xnew, ynew, tile);
                this.grid[y][x] = newTile;
                this.map.appendChild(newTile.element);
            }
        }
        let agent = new Agent(new State(10, 10, 0), new State(15, 15, 0), 1);
        this.agents.push(agent);
        let startTile = this.grid[10][10];
        let goalTile = this.grid[15][15];
        startTile.status = Status.START;
        startTile.agentId = 1;
        goalTile.status = Status.GOAL;
        goalTile.agentId = 1;
        //add event listeners
        this.map.addEventListener("mousedown", (e) => this.onMouseDown(e));
        this.map.addEventListener("mousemove", (e) => this.onMouseMove(e));
        this.map.addEventListener("mouseup", (e) => this.onMouseUp(e));
    }
    get noOfAgents() {
        return this._noOfAgents;
    }
    set noOfAgents(value) {
        console.log("SET: ", value);
        let change = value - this._noOfAgents;
        if (change > 0) {
            //add
            let randomY = Math.floor(Math.random() * (this.grid.length - 1));
            let randomX = Math.floor(Math.random() * (this.grid[0].length - 1)); //assuming this.grid is a square matrix
            let tile = this.grid[randomY][randomX];
            //for (let i = 0; i < 2; i++) {
            //  while (tile.status.value >= 2) {
            //    randomY = Math.floor(Math.random() * (this.grid.length - 1));
            //    randomX = Math.floor(Math.random() * (this.grid[0].length - 1));
            //    tile = this.grid[randomY][randomX];
            //    }
            //    tile.agentId = value;
            //    if (i === 0) {
            //        tile.status = Status.START;
            //        console.log(tile.agentId)              
            //    } else {
            //        tile.status = Status.GOAL;
            //        this.agents[tile.agentId - 1].goal = tile;
            //    }
            //}
            let agent = new Agent(new State(0, 0, 0), new State(0, 1, 0), value);
            this.grid[0][0].status = Status.START;
            this.grid[0][1].status = Status.GOAL;
            this.agents.push(agent);
            console.log("added: ", this.agents);
        }
        else if (change < 0) {
            //remove
            let tile;
            for (let j = 0; j < this.mapHeight; j++) {
                for (let i = 0; i < this.mapWidth; i++) {
                    tile = this.grid[j][i];
                    if (tile.agentId === this.noOfAgents) {
                        tile.status = Status.NONE;
                        tile.agentId = null;
                    }
                }
            }
            this.agents.pop();
        }
        this._noOfAgents = value;
    }
    getCoords(x, y) {
        let map = this.map.getBoundingClientRect();
        let mouseX = Math.floor((x - map.left) / this.tileSize);
        let mouseY = Math.floor((y - map.top) / this.tileSize);
        return { x: mouseX, y: mouseY };
    }
    onMouseDown(event) {
        console.log(this.agents);
        this.mouseDown = true;
        let coords = this.getCoords(event.clientX, event.clientY);
        let tile = this.grid[coords.y][coords.x];
        let statusType;
        if (tile.status === Status.NONE) {
            statusType = Status.OBSTACLE;
        }
        else if (tile.status === Status.OBSTACLE) {
            statusType = Status.NONE;
        }
        else if (tile.status === Status.START) {
            statusType = Status.START;
        }
        else {
            statusType = Status.GOAL;
        }
        tile.status = statusType;
        this.settingTileType = statusType;
        this.currentTile = tile;
    }
    onMouseUp(event) {
        this.mouseDown = false;
    }
    onMouseMove(event) {
        let oldTile;
        let coords = this.getCoords(event.clientX, event.clientY);
        let newTile = this.grid[coords.y][coords.x];
        if (this.currentTile !== newTile) {
            oldTile = this.currentTile;
            this.currentTile = newTile;
            if (this.mouseDown) {
                if (this.settingTileType === Status.START || this.settingTileType === Status.GOAL) {
                    newTile.status = this.settingTileType;
                    newTile.agentId = oldTile.agentId;
                    oldTile.status = oldTile.history[oldTile.history.length - 2];
                    oldTile.agentId = null;
                    console.log(newTile.agentId, oldTile.agentId);
                }
                else {
                    //disallow overriding start/goal state with obstacle/none state
                    if (!(newTile.status === Status.START || newTile.status === Status.GOAL)) {
                        newTile.status = this.settingTileType;
                    }
                }
            }
        }
        // if (this.currentTile !== newTile) {
        //   if (this.mouseDown) {
        //     try {
        //       console.log("transition: ", newTile.status, this.settingTileType);
        //       newTile.status = this.settingTileType;
        //       oldTile = this.currentTile;
        //       this.currentTile = newTile;
        //       console.log(oldTile.history);
        //       oldTile.status = oldTile.history[oldTile.history.length - 2];
        //     } catch {}
        //   }
        // }
    }
    createPathfindingRequestBody(body) {
        console.log("creating request");
        console.log(this.agents);
        body.agents = this.agents;
        let grid_temp = new Array(this.mapHeight);
        for (let j = 0; j < this.mapHeight; j++) {
            grid_temp[j] = new Array(this.mapWidth);
            for (let i = 0; i < this.mapWidth; i++) {
                grid_temp[j][i] = this.grid[j][i].status.value;
            }
        }
        body.map = grid_temp;
        return PathfindingRequestStatus.Ready; // Ready for sending request.
    }
}
class Agent {
    constructor(startState, goalState, id) {
        this.startState = startState;
        this.goalState = goalState;
        this.id = id;
    }
}
class State {
    constructor(x, y, time) {
        this.x = x;
        this.y = y;
        this.time = time;
    }
}
var PathfindingRequestStatus;
(function (PathfindingRequestStatus) {
    PathfindingRequestStatus[PathfindingRequestStatus["None"] = 0] = "None";
    PathfindingRequestStatus[PathfindingRequestStatus["Initiated"] = 1] = "Initiated";
    PathfindingRequestStatus[PathfindingRequestStatus["Ready"] = 2] = "Ready";
})(PathfindingRequestStatus || (PathfindingRequestStatus = {}));
class PathfindingRequestBody {
    constructor() {
        this.agents = [];
        this.map = [];
    }
}
