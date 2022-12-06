import { ScaleLinear } from "d3";
import { MutableRefObject } from "react";
import { Graph2D_AxisPosition, Graph2D_AxisType } from "../../Graph2D";

export interface Graph2DInterface{
    width ?: number,
    height ?: number,
    centerX ?: number,
    centerY ?: number, 
    backgroundColor ?: string,
    axisType ?: Graph2D_AxisType,
    axisPosition ?: Graph2D_AxisPosition,
    marginTop ?: number,
    marginBottom ?: number,
    marginStart ?: number,
    marginEnd ?: number
}

//------------------------------------------------------------------
//--------------------- Background types ---------------------------

export interface BackgroundProps{
    svg : MutableRefObject<SVGSVGElement | null>,
    backgroundColor : string
}

export type BackgroundType = {
    setBackground : ()=>void,
    setAxisBackground : ()=>void
}

//------------------------------------------------------------------
//------------------------ Scale types -----------------------------

export interface ScaleProps{
    svg : MutableRefObject<SVGSVGElement | null>
    width : number,
    height : number,
    centerX : number,
    centerY : number,
    axisType : Graph2D_AxisType,
    axisPosition : Graph2D_AxisPosition,
    marginStart : number,
    marginTop : number,
    marginEnd : number,
    marginBottom : number
}

export type ScaleType = {
    setScale : ()=>SetScaleType
}

export type SetScaleType = {
    scale :Scale,
    reference : Scale
    
}

export type Scale =  {
    x : ScaleLinear<number, number, never>,
    y : ScaleLinear<number, number, never>
}

export type SetRangeType = {
    rangeStartX : number,
    rangeEndX : number,
    rangeStartY : number,
    rangeEndY : number
}

//------------------------------------------------------------------
//------------------------ Axis types ------------------------------

export interface AxisProps{
    svg : MutableRefObject<SVGSVGElement | null>,
    axisPosition : Graph2D_AxisPosition,
    centerX : number,
    centerY : number,
    marginStart : number,
    marginTop : number,
    marginEnd : number,
    marginBottom : number
}

export type AxisType = {
    setAxis : (arg0:SetScaleType)=>void
}

//------------------------------------------------------------------