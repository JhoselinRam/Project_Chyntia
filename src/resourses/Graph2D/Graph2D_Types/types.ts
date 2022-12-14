import { ScaleLinear, Selection } from "d3"
import { type } from "os"
import { Axis_Color_Options, Axis_Opacity_Options, Grap2D_Type, Graph2D_AxisPosition, Graph2D_AxisType } from "../Graph2D"

//------------------------- Main ---------------------------

export type Grapg2D_State = {
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
        compute ?: ()=>void
    },
    grid : {

    },
    config : {
        width : number,
        height : number,
        relativeWidth : number,
        relativeHeight : number,
        centerX : number,
        centerY : number,
        marginStart : number,
        marginTop : number,
        marginEnd : number,
        marginBottom : number
    }
}

export type Method_Generator_Props = {
    graphHandler : Grap2D_Type, 
    state : Grapg2D_State
}

//---------------------------------------------------------
//---------------------- Background -----------------------

export type Background_Type = {
    backgroundColor : (arg0:string)=>Grap2D_Type,
    getBackgroundColor : ()=>string,
    backgroundOpacity : (arg0:number)=>Grap2D_Type,
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

export type Axis_Type = ()=>void;

//---------------------------------------------------------
//------------------------ Config -------------------------

export type Config_Type = {
    canvas : ()=>SVGGElement,
    axisType : (arg0:Graph2D_AxisType)=>Grap2D_Type,
    getAxisType : ()=>Graph2D_AxisType,
    axisPosition : (arg0:Graph2D_AxisPosition)=>Grap2D_Type,
    getAxisPosition : ()=>Graph2D_AxisPosition,
    axisColor : (arg0:Axis_Color_Options)=>Grap2D_Type,
    getAxisColor :  ()=>Axis_Color_Options,
    axisOpacity : (arg0:Axis_Opacity_Options)=>Grap2D_Type,
    getAxisOpacity : ()=>Axis_Opacity_Options
}
