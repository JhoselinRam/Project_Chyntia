import { ScaleLinear, Selection } from "d3"
import { type } from "os"
import { Axis_Color_Options, Axis_Opacity_Options, Graph2D_Type, Graph2D_AxisPosition, Graph2D_AxisType } from "../Graph2D"

//------------------------- Main ---------------------------

export type Grapg2D_State = {
    render ?: ()=>void,
    svg : SVGSVGElement,
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

//---------------------------------------------------------
//------------------------ Config -------------------------

export type Config_Type = {
    canvas : ()=>SVGGElement,
    width : (arg0:number)=>Graph2D_Type,
    getWidth : ()=>number,
    height : (arg0:number)=>Graph2D_Type,
    getHeight : ()=>number,
    relativeWidth : (arg0:number)=>Graph2D_Type,
    getRelativeWidth : ()=>number,
    relativeHeight : (arg0:number)=>Graph2D_Type,
    getRelativeHeight : ()=>number,
    centerX : (arg0:number)=>Graph2D_Type,
    getCenterX : ()=>number,
    centerY : (arg0:number)=>Graph2D_Type,
    getCenterY : ()=>number

}
