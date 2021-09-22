class Core {
    public map: SVGElement;
    public mapWidth: number;
    public mapHeight: number;
    public grid: Tile[][];
    public tileSize: number = 30;
    public _noOfAgents: number = 1;
    public agents: Agent[] = [];

    private mouseDown: boolean;
    private settingTileType: Status;
    private currentTile: Tile; //to avoid this, probably have to create a Mouse/Cursor class?

    public constructor(map: SVGElement, tile: SVGElement, mapWidth: number, mapHeight: number) {
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
      this.map.setAttribute("height", "650")
    this.grid = new Array<Tile[]>(mapHeight);

    //create grid
      for (let y = 0; y < mapHeight; y++) {
          this.grid[y] = new Array<Tile>(mapWidth);
          for (let x = 0; x < mapWidth; x++) {
              let xnew = x * this.tileSize;
              let ynew = y * this.tileSize;
              let newTile = new Tile(xnew, ynew, tile);

              this.grid[y][x] = newTile;
              this.map.appendChild(newTile.element);
          }
      }



      //let agent = new Agent(new State(10, 10, 0), new State(15, 15, 0), 1);
        let agent = { startState: { x: 10, y: 10, time: 0 }, goalState: { x: 15, y: 15, time: 0 }, id: 1 }

      this.agents.push(agent);

    let startTile = this.grid[10][10];
    let goalTile = this.grid[15][15];
    startTile.status = Status.START;
    startTile.agentId = 1;
    goalTile.status = Status.GOAL;
    goalTile.agentId = 1;

    //add event listeners
    this.map.addEventListener("mousedown", (e: MouseEvent) => this.onMouseDown(e));
    this.map.addEventListener("mousemove", (e: MouseEvent) => this.onMouseMove(e));
    this.map.addEventListener("mouseup", (e: MouseEvent) => this.onMouseUp(e));
  }

    public get noOfAgents(): number {
    return this._noOfAgents;
    }

    public set noOfAgents(value: number) {
      console.log("SET: ", value)
    let change = value - this._noOfAgents;

    if (change > 0) {
      //add
      let randomY: number = Math.floor(Math.random() * (this.grid.length - 1));
      let randomX: number = Math.floor(Math.random() * (this.grid[0].length - 1)); //assuming this.grid is a square matrix
      let tile: Tile = this.grid[randomY][randomX];

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

        //let agent = new Agent(new State(0, 0, 0), new State(0, 1, 0), value);
        let agent = { startState: { x: 0, y: 0, time: 0 }, goalState: {x: 0, y: 1, time: 0}, id: value}
        this.grid[0][0].status = Status.START;
        this.grid[0][1].status = Status.GOAL;


        this.agents.push(agent);
        console.log("added: ", this.agents);

    } else if (change < 0) {
      //remove

        let tile: Tile;
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


  public getCoords(x: number, y: number): Coords {
    let map = this.map.getBoundingClientRect();
    let mouseX = Math.floor((x - map.left) / this.tileSize);
    let mouseY = Math.floor((y - map.top) / this.tileSize);

    return { x: mouseX, y: mouseY };
  }

    public onMouseDown(event: MouseEvent) {
        console.log(this.agents);
        this.mouseDown = true;
        let coords = this.getCoords(event.clientX, event.clientY);

        let tile = this.grid[coords.y][coords.x];

        let statusType: Status;

        if (tile.status === Status.NONE) {
          statusType = Status.OBSTACLE;
        } else if (tile.status === Status.OBSTACLE) {
          statusType = Status.NONE;
        } else if (tile.status === Status.START) {
          statusType = Status.START;
        } else {
          statusType = Status.GOAL;
        }

        tile.status = statusType;
        this.settingTileType = statusType;
        this.currentTile = tile;
  }

  public onMouseUp(event: MouseEvent) {
    this.mouseDown = false;
  }

  public onMouseMove(event: MouseEvent) {
    let oldTile: Tile;
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

            console.log(newTile.agentId);

            if (this.settingTileType === Status.START) {
                this.agents[newTile.agentId - 1].startState = { x: coords.x, y: coords.y, time: 0 }
            } else {
                this.agents[newTile.agentId - 1].goalState = { x: coords.x, y: coords.y, time: 0 }
            }

            console.log(this.agents);
        } else {
          //disallow overriding start/goal state with obstacle/none state
          if (
            !(newTile.status === Status.START || newTile.status === Status.GOAL)
          ) {
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

    public createPathfindingRequestBody(body: PathfindingRequestBody): PathfindingRequestStatus {
        console.log("creating request")
        console.log(this.agents);
        body.agents = this.agents;

        let grid_temp: number[][] = new Array<number[]>(this.mapHeight);
        for (let j = 0; j < this.mapHeight; j++) {
            grid_temp[j] = new Array<number>(this.mapWidth);

            for (let i = 0; i < this.mapWidth; i++) {
                grid_temp[j][i] = this.grid[j][i].status.value;
            }
        }

        body.map = grid_temp;

        return PathfindingRequestStatus.Ready; // Ready for sending request.
    }

    public drawSolution(paths: Array<State[]>) {
        paths.forEach(path => {
            path.forEach(state => {
                this.grid[state.y][state.x].status = Status.PATH;
            })
        })
    }
}

interface Coords {
  x: number;
  y: number;
}

interface State {
    x: number;
    y: number;
    time: number;
}

interface Agent {
    startState: State;
    goalState: State;
    id: number;
}



//class Agent {
//    startState: State;
//    goalState: State;
//    id: number;

//    public constructor(startState: State, goalState: State, id: number) {
//        this.startState = startState;
//        this.goalState = goalState;
//        this.id = id;
//    }
//}

//class State {
//    x: number;
//    y: number;
//    time: number;

//    public constructor(x: number, y: number, time: number) {
//        this.x = x;
//        this.y = y;
//        this.time = time;
//    }
//}

enum PathfindingRequestStatus {
    None = 0,
    Initiated = 1,
    Ready = 2,
}

class PathfindingRequestBody {
    public agents: Agent[];
    public map: number[][];

    public constructor() {
        this.agents = [];
        this.map = [];
    }
}