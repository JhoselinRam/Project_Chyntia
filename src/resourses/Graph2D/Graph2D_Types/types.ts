import { Selection } from "d3"
import { Grap2D_Type, Graph2D_AxisPosition, Graph2D_AxisType } from "../Graph2D"

//------------------------- Main ---------------------------

export type Grapg2D_State = {
    canvas : Selection<SVGGElement, unknown, null, undefined>,
    widht : number,
    height : number,
    relativeWidth : number,
    relativeHeigh : number,
    centerX : number,
    centerY : number,
    bgColor : string,
    axisType : Graph2D_AxisType,
    axisPosition : Graph2D_AxisPosition,
    marginStart : number,
    marginTop : number,
    marginEnd : number,
    marginBottom : number
}

export type Method_Generator_Props = {
    graphHandler : Grap2D_Type, 
    state : Grapg2D_State
}

//---------------------------------------------------------
//---------------------- Background -----------------------

export type Background_Type = {

}
