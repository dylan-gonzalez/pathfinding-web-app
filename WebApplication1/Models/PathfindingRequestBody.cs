using System;
using System.Collections.Generic;
using Newtonsoft.Json;


namespace WebApplication1.Models
{
    public class PathfindingRequestBody
    {
        //public List<AgentRequestObject> agents{ get; set; }
        [JsonProperty(Required = Required.Always)]
        public Agent[] agents { get; set; }

        [JsonProperty(Required = Required.Always)]
        public int[][] map { get; set; } 

        public PathfindingSettings ToSettings()
        {
            return new PathfindingSettings()
            {
                agents = agents,
            };
        }
    }
}