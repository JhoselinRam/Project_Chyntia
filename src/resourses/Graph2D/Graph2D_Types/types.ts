import { BaseType, ScaleLinear, Selection } from "d3"
import { Axis_Color_Options, Axis_Opacity_Options, Graph2D_Type, Graph2D_AxisPosition, Graph2D_AxisType, Canvas_Size, Center_Type, Margin_Type, Relative_Position, Graph2D_LineStyle, Axis_Dynamic } from "../Graph2D"

//------------------------- Main ---------------------------

export type Grapg2D_State = {
    render ?: ()=>void,
    svg : SVGSVGElement,
    graphID : string,
    canvas : Selection<SVGGElement, unknown, null, undefined>,
    background : {
        bgColor : string,
        bgOpacity : number
    },
    scale ?: {
        inner : Scale,
        reference : Scale,
        compute : ()=>void
    },
    axis :{
        type : Graph2D_AxisType,
        position : Graph2D_AxisPosition,
        xAxisContained : boolean,
        yAxisContained : boolean,
        xLabelDynamic : boolean,
        yLabelDynamic : boolean,
        xUnit : string | null,
        yUnit : string | null,
        xAxisColor : string,
        xAxisOpacity : number,
        yAxisColor : string,
        yAxisOpacity : number,
        xTickColor : string,
        xTickOpacity : number,
        xLabelColor : string,
        xLabelOpacity : number,
        yTickColor : string,
        yTickOpacity : number,
        yLabelColor : string,
        yLabelOpacity : number,
        xAxisOverlap : boolean,
        yAxisOverlap : boolean,
        overlapPriority : "X" | "Y" | "none",
        compute ?: ()=>void
    },
    grid : {
        main : {
            compute ?: ()=>void,
            xColor : string,
            xOpacity : number,
            xStyle : Graph2D_LineStyle,
            yColor : string,
            yOpacity : number,
            yStyle : Graph2D_LineStyle
        },
        aux : {
            compute ?: ()=>void,
            xColor : string,
            xOpacity : number,
            xStyle : Graph2D_LineStyle,
            yColor : string,
            yOpacity : number,
            yStyle : Graph2D_LineStyle
        }
    },
    config : {
        width : number,
        height : number,
        relativeWidth : number,
        relativeHeight : number,
        relativePositionX : number,
        relativePositionY : number,
        centerX : number,
        centerY : number,
        marginStart : number,
        marginTop : number,
        marginEnd : number,
        marginBottom : number
    }
}

export type Method_Generator_Props = {
    graphHandler : Graph2D_Type, 
    state : Grapg2D_State
}

//---------------------------------------------------------
//---------------------- Background -----------------------

export type Background_Type = {
    backgroundColor : (arg0:string)=>Graph2D_Type,
    getBackgroundColor : ()=>string,
    backgroundOpacity : (arg0:number)=>Graph2D_Type,
    getBackgroundOpacity : ()=>number
}

//---------------------------------------------------------
//------------------------- Scale -------------------------

export type Scale = {
    x : ScaleLinear<number, number, never>,
    y : ScaleLinear<number, number, never>
}

export type Scale_Type = {
    inner : Scale,
    reference : Scale,
    compute : ()=>void   
}

export type _GetScale_Type = {
    rangeStartX : number,
    rangeEndX : number,
    rangeStartY : number,
    rangeEndY : number
}

//---------------------------------------------------------
//-------------------------- Axis -------------------------

export type Axis_Type = {
    compute : ()=>void,
    axisType : (arg0:Graph2D_AxisType)=>Graph2D_Type,
    getAxisType : ()=>Graph2D_AxisType,
    axisPosition : (arg0:Graph2D_AxisPosition)=>Graph2D_Type,
    getAxisPosition : ()=>Graph2D_AxisPosition,
    axisColor : (arg0:Axis_Color_Options)=>Graph2D_Type,
    getAxisColor :  ()=>Axis_Color_Options,
    axisOpacity : (arg0:Axis_Opacity_Options)=>Graph2D_Type,
    getAxisOpacity : ()=>Axis_Opacity_Options
};

export type Define_Mask_Props = {
    tick : SVGGElement, 
    initCoords:Array<string>,
    mask : string
}

//---------------------------------------------------------
//------------------------ Config -------------------------

export type Config_Type = {
    canvas : ()=>SVGGElement,
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
    getAxisDynamic : ()=>Axis_Dynamic
}

//---------------------------------------------------------
//------------------------- Grid --------------------------

export type Grid_Type = {
    mainGrid : Main_Grid,
    auxGrid : Aux_Grid
}

export type Main_Grid = {

}

export type Aux_Grid = {

}

//---------------------------------------------------------