mapWidth = 60;
console.log(mapWidth);
mapHeight = 20;
noOfAgents = 1;

var current = new PathfindingRequestBody();
console.log(current);

core = new Core(
    document.getElementById("map"),
    document.getElementsByClassName("tile")[0],
    mapWidth,
    mapHeight
);

document.getElementById("agents-quantity").innerHTML = noOfAgents;
function adjustNoOfAgents(qty) {
    console.log("adjusting");

    if (qty == 1) {
        noOfAgents += 1;
    } else {
        if (noOfAgents > 1) {
            noOfAgents -= 1;
        }
    }
    console.log(noOfAgents);
    core.noOfAgents = noOfAgents;

    //document.getElementById("agents-quantity").innerHTML = noOfAgents;
    $("#agents-quantity").innerHTML = "test"
}


function start() {
    if (core.createPathfindingRequestBody(current) == PathfindingRequestStatus.Ready) {
        console.log(current);
        $.ajax({
            type: "POST",
            url: "/pathfinding",
            data: JSON.stringify(current),
            contentType: "application/json",
            success: function (response) {
                var solution = response.data.solution;

                console.log("test");
                console.log("Solution: ", solution);

                solution = solution.map(agent => { return agent.path });

                console.log("test")

                console.log(solution);

                core.drawSolution(solution)

            },
            error: function (jqXHR, textStatus, errorThrown) {
                var msg = "";
                switch (jqXHR.status) {
                    case 400:
                        msg = "// The selected algorithm needs at least one Heuristic function.";
                        $(':input[name="heuristic"]').parent().css("color", "red");
                        break;
                    case 500:
                        msg = "// Something went wrong. Please try again later or report an issue at GitHub.";
                        break;
                }
                $("#exampleSelectMany").find("code").text(msg);
                $("#exampleExcept").find("code").text(msg);
                $("#exampleWhere").find("code").text(msg);
            },
            complete: function () {
                // TODO:
            }
        });
    }


}