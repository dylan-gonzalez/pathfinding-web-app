﻿using SD.Tools.Algorithmia.PriorityQueues;
using System.Collections.Generic;
using System;
using System.Linq;
using WebApplication1.Models;

namespace WebApplication1.PathPlanners
{
    public class AStar : IPathPlannable //changed from internal to public
    {
        private List<State> stateList;
        private Map map;
        private List<double> hTableStatic;
        public List<(State, int)> constraints { get; set; }
        public List<State> path { get; set; }
        public int pathCost { get; set; }

        public State startState { get; set; }
        public State goalState { get; set; }
        public int id { get; set; }

        public int agentId { get; set; }

        private Comparison<State> comparisonF_n = new Comparison<State>((item2, item1) => item1.comparisonFhat - item2.comparisonFhat);

        public bool isFinished { get; set; }

        public SimplePriorityQueue<State> openList { get; set; } // Initialise the OpenList (from IPathPlannable)
        public List<State> closedList { get; set; } // Initialise the ClosedList (from IPathPlannable)

        public AStar()
        {
            openList = new SimplePriorityQueue<State>(comparisonF_n);
            closedList = new List<State>();

            path = new List<State>();

            isFinished = false;

            pathCost = 0;
        }

        public void InitialisePathPlanner(Map map, int agentId, State startState, State goalState)
        {
            stateList = new List<State>();
            this.map = map;
            id = agentId;

            this.startState = startState;
            this.goalState = goalState; 

            hTableStatic = new List<double>(map.width * map.height);
        }


        public List<State> PlanPath(State requestStart, List<(State, int)> newConstraints)
        {
            constraints = newConstraints;

            path.Clear();
            pathCost = 0;

            //check if goal start has been reached yet
            if (!requestStart.positionEqual(goalState, false))
                AStarSearch(requestStart);
            else
                isFinished = true;


            if (openList.Count == 0)
                return null;

            var state = goalState;


            while (!state.positionEqual(startState, false))
            {
                path.Add(state);
                //Trace.WriteLine("path cost: " + pathCost.ToString());
                state = state.parent;
            }
            pathCost = path.Count;

            return path;
        }



        public void AStarSearch(State startState)
        {

            // Initialise variables

            openList.Clear();
            closedList.Clear();

            startState.g = 0;

            openList.Add(startState); // Adding the start state to the openList
                                      // Define f(startState) = h(startState)

            do
            {  // Do this while the OpenList is not empty

                // Create currentState variable
                // Let current state variable equal the state at the beginning of the openList (for first iteration, this will just be the startState. For all other iterations it will be what we decided was the best next step in the path)
                // Remove this state from the openList

                var currentState = openList.Remove();

                if (currentState.positionEqual(goalState, false))
                {
                    goalState.parent = currentState.parent;
                    break;
                }// We are at the goal and can therefore exit the while loop

                // Go through all the successors
                for (int i = -1; i <= 1; i++)
                {
                    for (int j = -1; j <= 1; j++)
                    {
                        if (i == 0 && j == 0)
                            continue;
                        // Create adjacent state
                        var currentSuccessorState = new State();
                        //Set successor's properties and if not valid continue

                        if (!currentSuccessorState.setProperties(currentState.x + i, currentState.y + j, currentState.time + 1, map.width, map.height))
                            continue;


                        // Check if successor state is an obstacle or a constaint
                        if (currentSuccessorState.checkIfStaticObstacle(map.staticObstacles) || currentSuccessorState.checkIfConstraint(constraints, id))
                            continue;

                        // Set g cost of successor state
                        currentSuccessorState.g = startState.distanceTo(currentSuccessorState.x, currentSuccessorState.y);

                        // Initialise successor state cost
                        var successorStateCost = currentState.g + currentState.distanceTo(currentSuccessorState.x, currentSuccessorState.y);

                        var openIndex = openList.ToList().FindIndex(state => state.x == currentSuccessorState.x && state.y == currentSuccessorState.y);
                        var closedIndex = closedList.ToList().FindIndex(state => state.x == currentSuccessorState.x && state.y == currentSuccessorState.y);

                        if (openIndex != -1)
                        {
                            if (currentSuccessorState.g <= successorStateCost) continue;

                        }

                        else if (closedIndex != -1)
                        {
                            if (currentSuccessorState.g <= successorStateCost) continue;
                            closedList.Remove(currentSuccessorState);
                            openList.Add(currentSuccessorState);
                        }

                        else
                        {
                            openList.Add(currentSuccessorState);
                            currentSuccessorState.h = goalState.distanceTo(currentSuccessorState.x, currentSuccessorState.y);
                        }

                        currentSuccessorState.g = successorStateCost; // The distance along the path to the start
                        currentSuccessorState.parent = currentState;                // Chosen state, make old state parent
                        currentSuccessorState.generateComparisonFhat();
                    }
                }
                closedList.Add(currentState);       // Add currentState to closedList because it’s now fully explored, we’ve decided on a successor
            } while (openList.Count != 0);                  // Do we need to initialise this count variable??
        }
    }
}