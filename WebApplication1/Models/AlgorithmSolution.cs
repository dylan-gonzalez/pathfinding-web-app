using System.Collections.Generic;
using System.Drawing;

namespace WebApplication1.Models
{
    public class AlgorithmSolution
    {

        //Solution = path for each agent
        public List<(List<State> pathList, int pathCost, int agentId)> solution { get; set; }

    }
}
