import { select } from "d3";
import { v4 as uuidv4 } from "uuid";
import { Graph2D_State, Line_Style_Map } from "./Graph2D_Types/types";
import Axis from "./tools/Axis";
import Background from "./tools/Background";
import Config from "./tools/Config";
import Events from "./tools/Events";
import Grid from "./tools/Grid/Grid";
import Scale from "./tools/Scale";

function Graph2D(svg : SVGSVGElement) : Graph2D_Type{
    const graphID = uuidv4();
    const canvas = select(svg)
                    .append("g")
                    .classed(`Graph2D_Main_Group Graph2D_ID_${graphID}`, true);
    const lineStyleMap : Line_Style_Map = {
        solid : "",
        dashed : "5 2",
        doted : "2 2",
        "dash-dot" : "5 2 2 2",
        "dash-2dot" : "5 2 2 2 2 2"
    }
    //Inner state
    const state : Graph2D_State = {
        svg,
        graphID,
        canvas,
        lineStyleMap,
        background : {
            bgColor : "#ffffff",   //white
            bgOpacity : 1
        },
        axis : {
            type : "rectangular",
            position : "center",
            xAxisContained : true,
            yAxisContained : true,
            xLabelDynamic : true,
            yLabelDynamic : true,
            xUnit : null,
            yUnit : null,
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
            yLabelOpacity: 1,
            xAxisOverlap : false,
            yAxisOverlap : false,
            overlapPriority : "X"
        },
        grid : {
            main : {
                xEnabled : true,
                xColor : "#000000",
                xOpacity : 0.3,
                xStyle : "solid",
                yEnabled : true,
                yColor : "#000000",
                yOpacity : 0.3,
                yStyle : "solid"
            },
            aux : {
                xEnabled : true,
                xColor : "#000000",
                xOpacity : 0.15,
                xStyle : "doted",
                xSpacing : "auto",
                yEnabled : true,
                yColor : "#000000",
                yOpacity : 0.15,
                yStyle : "doted",
                ySpacing : "auto"
            }
        },
        config : {
            width : 10,
            height : 10,
            relativeWidth : 1,
            relativeHeight : 1,
            relativePositionX : 0,
            relativePositionY : 0,
            centerX : 0,
            centerY : 0,
            marginStart : 5,
            marginTop : 5,
            marginEnd : 5,
            marginBottom : 5
        },
        events : {
            pointerMove : {
                pointerCapture : false,
                delay : 20,
                x : 0,
                y : 0,
                cursorHover : "grab",
                cursorMove : "grabbing"
            }
        }
    }
    
    const graphHandler : Graph2D_Type | any = {}; //Main object (method handler)
    
    //Method generators
    const axis = Axis({graphHandler, state});
    const background = Background({graphHandler, state});
    const {mainGrid, auxGrid} = Grid({graphHandler, state});
    const config = Config({graphHandler, state});
    const events = Events({graphHandler, state});
    state.scale = Scale(state);
    state.axis.compute = axis.compute;
    state.grid.main.compute = mainGrid.compute;
    state.grid.aux.compute = auxGrid.compute;
    state.fullRender = fullRender(state);
    state.render = render(state);

    //Populate main object
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
    graphHandler.axisOverlap = axis.axisOverlap;
    graphHandler.getAxisOverlap = axis.getAxisOverlap;
    graphHandler.getAxisOpacity = axis.getAxisOpacity;
    graphHandler.axisDynamic = axis.axisDynamic;
    graphHandler.getAxisDynamic = axis.getAxisDynamic;
    graphHandler.axisUnits = axis.axisUnits;
    graphHandler.getAxisUnits = axis.getAxisUnits;
    graphHandler.canvas = config.canvas;
    graphHandler.size = config.size;
    graphHandler.getSize = config.getSize;
    graphHandler.relativeSize = config.relativeSize;
    graphHandler.getRelativeSize = config.getRelativeSize;
    graphHandler.center = config.center;
    graphHandler.getCenter = config.getCenter;
    graphHandler.margin = config.margin;
    graphHandler.getMargin = config.getMargin;
    graphHandler.relativePosition = config.relativePosition;
    graphHandler.getRelativePosition = config.getRelativePosition;
    graphHandler.mainGridEnabled = mainGrid.mainGridEnabled;
    graphHandler.getMainGridEnabled = mainGrid.getMainGridEnabled;
    graphHandler.mainGridColor = mainGrid.mainGridColor;
    graphHandler.getMainGridColor = mainGrid.getMainGridColor;
    graphHandler.mainGridOpacity = mainGrid.mainGridOpacity;
    graphHandler.getMainGridOpacity = mainGrid.getMainGridOpacity;
    graphHandler.mainGridStyle = mainGrid.mainGridStyle;
    graphHandler.getMainGridStyle = mainGrid.getMainGridStyle;
    graphHandler.auxGridEnabled = auxGrid.auxGridEnabled;
    graphHandler.getAuxGridEnabled = auxGrid.getAuxGridEnabled;
    graphHandler.auxGridColor = auxGrid.auxGridColor;
    graphHandler.getAuxGridColor = auxGrid.getAuxGridColor;
    graphHandler.auxGridOpacity = auxGrid.auxGridOpacity;
    graphHandler.getAuxGridOpacity = auxGrid.getAuxGridOpacity;
    graphHandler.auxGridStyle = auxGrid.auxGridStyle;
    graphHandler.getAuxGridStyle = auxGrid.getAuxGridStyle;
    graphHandler.auxGridSpacing = auxGrid.auxGridSpacing;
    graphHandler.getAuxGridSpacing = auxGrid.getAuxGridSpacing;
    graphHandler.enablePointerMove = events.enablePointerMove;
    
    
    //Setup configuration 
    canvas.append("defs")   
          .append("clipPath")
          .attr("id", `Graph2D_ClipPath_ID_${graphID}`)
          .append("rect");

    canvas.attr("clip-path", `url(#Graph2D_ClipPath_ID_${graphID})`);

    canvas                  
        .append("rect")
        .classed("Graph2D_Background", true);

    canvas
        .append("g")
        .classed("Graph2D_Grid", true);
    
    canvas
        .append("g")
        .classed("Graph2D_Axis", true);

    canvas
        .append("g")
        .classed("Graph2D_Data", true);
    
    state.fullRender();


    
    return (graphHandler as Graph2D_Type);

}

//---------------------------------------------------------
//---------------------- Render ---------------------------

function render(state:Graph2D_State){
    return function(){
        if(state.scale==null || state.axis.compute==null || state.grid.main.compute==null || state.grid.aux.compute==null || state.grid.aux.compute == null) return;

        state.scale.compute();
        state.axis.compute();
        state.grid.main.compute();
        state.grid.aux.compute();
        state.grid.aux.compute();
    }
}

function fullRender(state:Graph2D_State){
    return function(){

        const svgWidth = state.svg.clientWidth;
        const svgHeight = state.svg.clientHeight;

        state.canvas
            .select("rect.Graph2D_Background")
            .attr("width" , svgWidth*state.config.relativeWidth)
            .attr("height", svgHeight*state.config.relativeHeight)
            .attr("fill", state.background.bgColor)
            .attr("opacity", state.background.bgOpacity);

        state.canvas
                .select("defs")
                .select("rect")
                .attr("width" , svgWidth*state.config.relativeWidth)
                .attr("height", svgHeight*state.config.relativeHeight)

        render(state)();
    }
}

//---------------------------------------------------------





//---------------------------------------------------------
//------------------------ Exports ------------------------

export default Graph2D;

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
    size : (arg0:Canvas_Size)=>Graph2D_Type,
    getSize : ()=>Canvas_Size,
    relativeSize : (arg0:Canvas_Size)=>Graph2D_Type,
    getRelativeSize : ()=>Canvas_Size,
    center :  (arg0:Center_Type)=>Graph2D_Type,
    getCenter : ()=>Center_Type,
    margin : (arg0:Margin_Type)=>Graph2D_Type,
    getMargin : ()=>Margin_Type,
    relativePosition : (arg0:Relative_Position)=>Graph2D_Type,
    getRelativePosition : ()=>Relative_Position,
    axisDynamic : (arg0:Axis_Dynamic)=>Graph2D_Type,
    getAxisDynamic : ()=>Axis_Dynamic,
    axisOverlap : (arg0:Axis_Overlap)=>Graph2D_Type,
    getAxisOverlap : ()=>Axis_Overlap,
    axisUnits : (arg0:Axis_Units)=>Graph2D_Type,
    getAxisUnits : ()=>Axis_Units,
    mainGridEnabled : (arg0:Grid_Enabled)=>Graph2D_Type,
    getMainGridEnabled : ()=>Grid_Enabled,
    mainGridColor : (arg0:Grid_Color)=>Graph2D_Type,
    getMainGridColor : ()=>Grid_Color,
    mainGridOpacity : (arg0:Grid_Opacity)=>Graph2D_Type,
    getMainGridOpacity : ()=>Grid_Opacity,
    mainGridStyle : (arg0:Grid_Style)=>Graph2D_Type,
    getMainGridStyle : ()=>Grid_Style,
    auxGridEnabled : (arg0:Grid_Enabled)=>Graph2D_Type,
    getAuxGridEnabled : ()=>Grid_Enabled,
    auxGridColor : (arg0:Grid_Color)=>Graph2D_Type,
    getAuxGridColor : ()=>Grid_Color,
    auxGridOpacity : (arg0:Grid_Opacity)=>Graph2D_Type,
    getAuxGridOpacity : ()=>Grid_Opacity,
    auxGridStyle : (arg0:Grid_Style)=>Graph2D_Type,
    getAuxGridStyle : ()=>Grid_Style,
    auxGridSpacing : (arg0:Grid_Spacing)=>Graph2D_Type,
    getAuxGridSpacing : ()=>Grid_Spacing,
    enablePointerMove : (arg0?:boolean, arg1?:PointerMove_Options)=>Graph2D_Type
}

export type Graph2D_AxisType = "rectangular" | "polar" | "x-log" | "y-log" | "log-log";

export type Graph2D_AxisPosition = "center" | "bottom-left" | "bottom-right" | "top-left" | "top-right";

export type Graph2D_LineStyle = "solid" | "dashed" | "doted" | "dash-dot" | "dash-2dot";

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

export type Canvas_Size = {
    width ?: number,
    height ?: number
}

export type Center_Type = {
    x ?: number,
    y ?: number
}

export type Margin_Type = {
    left ?: number,
    right ?: number,
    top ? : number,
    bottom ?: number 
}

export type Relative_Position = {
    x ?: number,
    y ?: number
}

export type Axis_Dynamic = {
    xContained ?: boolean,
    yContained ?: boolean,
    xDynamic ?: boolean,
    yDynamic ?: boolean
}

export type Axis_Overlap = {
    x ?: boolean,
    y ?: boolean,
    priority ?: "X" | "Y"
}

export type Axis_Units = {
    x ?: string | null,
    y ?: string | null 
}

export type Grid_Enabled = {
    enabled ?: boolean,
    xEnabled ?: boolean,
    yEnabled ?: boolean
}

export type Grid_Color = {
    color ?: string,
    xColor ?: string,
    yColor ?: string
}

export type Grid_Opacity = {
    opacity ?: number,
    xOpacity ?: number,
    yOpacity ?: number
}

export type Grid_Style = {
    style ?: Graph2D_LineStyle,
    xStyle ?: Graph2D_LineStyle,
    yStyle ?: Graph2D_LineStyle
}

export type Grid_Spacing = {
    x ?: "auto" | number,
    y ?: "auto" | number
}

export type PointerMove_Options = {
    cursorHover ?: string,
    cursorMove ?: string,
    delay ?: number,
    pointerCapture ?: boolean,
    callback ?: (arg0?:Graph2D_Type)=>void
}