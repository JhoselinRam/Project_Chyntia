import { select } from "d3";
import { v4 as uuidv4 } from "uuid";
import { Grapg2D_State } from "./Graph2D_Types/types";
import Axis from "./tools/Axis";
import Background from "./tools/Background";
import Config from "./tools/Config";
import Scale from "./tools/Scale";

function Grap2D(svg : SVGSVGElement) : Graph2D_Type{
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
            xAxisColor : "#000000", //Black
            xAxisOpacity : 1,
            yAxisColor : "#000000", //Black
            yAxisOpacity : 1,
            xTickColor : "#000000",
            xTickOpacity : 1,
            xLabelColor : "#000000",
            xLabelOpacity: 1,
            yTickColor : "#000000",
            yTickOpacity : 1,
            yLabelColor : "#000000",
            yLabelOpacity: 1
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
    
    const graphHandler : Graph2D_Type | any = {}; //Main object (method handler)
    
    //Method generators
    const axis = Axis({graphHandler, state});
    const background = Background({graphHandler, state});
    const config = Config({graphHandler, state});
    state.scale = Scale(state);
    state.axis.compute = axis.compute;

    //Main object population
    graphHandler.backgroundColor = background.backgroundColor;
    graphHandler.getBackgroundColor = background.getBackgroundColor;
    graphHandler.backgroundOpacity = background.backgroundOpacity;
    graphHandler.getBackgroundOpacity = background.getBackgroundOpacity;
    graphHandler.axisType = axis.axisType;
    graphHandler.getAxisType = axis.getAxisType;
    graphHandler.axisPosition = axis.axisPosition;
    graphHandler.getAxisPosition = axis.getAxisPosition;
    graphHandler.axisColor = axis.axisColor;
    graphHandler.getAxisColor = axis.getAxisColor;
    graphHandler.axisOpacity = axis.axisOpacity;
    graphHandler.getAxisOpacity = axis.getAxisOpacity;
    graphHandler.canvas = config.canvas;
    graphHandler.width = config.width;
    graphHandler.getWidth = config.getWidth,
    graphHandler.height = config.height,
    graphHandler.getHeight = config.getHeight;
    
    
    //Setup configuration  
    canvas                  //Generate the "background element"
        .append("rect")
        .classed("Graph2d_Background", true)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", svg.clientWidth*state.config.relativeWidth)
        .attr("height", svg.clientHeight*state.config.relativeHeight)
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


    
    return (graphHandler as Graph2D_Type);

}






//---------------------------------------------------------
//------------------------ Exports ------------------------

export default Grap2D;

export type Graph2D_Type = {
    backgroundColor : (arg0:string)=>Graph2D_Type,
    getBackgroundColor : ()=>string,
    backgroundOpacity : (arg0:number)=>Graph2D_Type,
    getBackgroundOpacity : ()=>number,
    canvas : ()=>SVGGElement,
    axisType : (arg0:Graph2D_AxisType)=>Graph2D_Type,
    getAxisType : ()=>Graph2D_AxisType,
    axisPosition : (arg0:Graph2D_AxisPosition)=>Graph2D_Type,
    getAxisPosition : ()=>Graph2D_AxisPosition,
    axisColor : (arg0:Axis_Color_Options)=>Graph2D_Type,
    getAxisColor :  ()=>Axis_Color_Options,
    axisOpacity : (arg0:Axis_Opacity_Options)=>Graph2D_Type,
    getAxisOpacity : ()=>Axis_Opacity_Options,
    width : (arg0:number)=>Graph2D_Type,
    getWidth : ()=>number,
    height : (arg0:number)=>Graph2D_Type,
    getHeight : ()=>number
}

export type Graph2D_AxisType = "rectangular" | "polar" | "x-log" | "y-log" | "log-log";

export type Graph2D_AxisPosition = "center" | "bottom-left" | "bottom-right" | "top-left" | "top-right";

export type Axis_Color_Options = {
    axis ?: string,
    xAxis ?: string,
    yAxis ?: string,
    xBase ?: string,
    xTick ?: string,
    xLabel ?: string,
    yBase ?: string,
    yTick ?: string,
    yLabel ?: string,
}
export type Axis_Opacity_Options = {
    axis ?: number,
    xAxis ?: number,
    yAxis ?: number,
    xBase ?: number,
    xTick ?: number,
    xLabel ?: number,
    yBase ?: number,
    yTick ?: number,
    yLabel ?: number,
}
