import { select } from "d3";
import { v4 as uuidv4 } from "uuid";
import { Grapg2D_State } from "./Graph2D_Types/types";
import Axis from "./tools/Axis";
import Background from "./tools/Background";
import Scale from "./tools/Scale";

function Grap2D(svg : SVGSVGElement) : Grap2D_Type{
    const graphID = uuidv4();
    const canvas = select(svg)
                    .append("g")
                    .classed(`Graph2D_Main_Group Graph2D_ID_${graphID}`, true);
    
    //Inner state
    const state : Grapg2D_State = {
        canvas,
        background : {
            bgColor : "#ffffff",   //white
            bgOpacity : 1
        },
        axis : {
            type : "rectangular",
            position : "center",
            axisColor : "#000000", //Black
            axisOpacity : 1,
            tickColor : "#000000",
            tickOpacity : 1,
            textColor : "#000000",
            textOpacity: 1
        },
        grid : {
            
        },
        config : {
            width : 10,
            height : 10,
            relativeWidth : 1,
            relativeHeight : 1,
            centerX : 0,
            centerY : 0,
            marginStart : 5,
            marginTop : 5,
            marginEnd : 5,
            marginBottom : 5
        }
    }
    
    const graphHandler : Grap2D_Type | any = {}; //Main object (method handler)
    
    //Method generators
    state.scale = Scale(state);
    state.axis.compute = Axis(state);
    const background = Background({graphHandler, state});

    //Main object population
    graphHandler.canvas = ()=>canvas.node() as SVGGElement;
    graphHandler.setBackground = background.setBackground;
    graphHandler.getBackground = background.getBackground;
    graphHandler.setBackgroundOpacity = background.setBackgroundOpacity;
    graphHandler.getBackgroundOpacity = background.getBackgroundOpacity;
    
    
    //Setup configuration  
    canvas                  //Generate the "background element"
        .append("rect")
        .classed("Graph2d_Background", true)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", svg.clientWidth)
        .attr("height", svg.clientHeight)
        .attr("fill", state.background.bgColor);

    canvas
        .append("g")
        .classed("Graph2D_Grid", true);
    
    canvas
        .append("g")
        .classed("Graph2D_Axis", true);

    canvas
        .append("g")
        .classed("Graph2D_Data", true);
    
    state.scale.compute();  //Creates the scale
    state.axis.compute();   //Creates the axis


    
    return (graphHandler as Grap2D_Type);

}






//---------------------------------------------------------
//------------------------ Exports ------------------------

export default Grap2D;

export type Grap2D_Type = {
    canvas : ()=>SVGGElement,
    setBackground : (arg0:string)=>Grap2D_Type,
    getBackground : ()=>string,
    setBackgroundOpacity : (arg0:number)=>Grap2D_Type,
    getBackgroundOpacity : ()=>number
}

export type Graph2D_AxisType = "rectangular" | "polar" | "x-log" | "y-log" | "log-log";

export type Graph2D_AxisPosition = "center" | "bottom-left" | "bottom-right" | "top-left" | "top-right";
