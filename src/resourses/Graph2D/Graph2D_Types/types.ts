import { ScaleLinear } from "d3";


export type Graph2D_Props = {
    svg : SVGSVGElement;
}

//-------------------------- Background -------------------------------
//---------------------------------------------------------------------

export type Background_Props = {
    svg : SVGSVGElement
}

export type Background_Type = {

}

//----------------------------- Scale ---------------------------------
//---------------------------------------------------------------------

export type Scale = {
    scale :BasicScale,
    reference : BasicScale 
    
}

export type BasicScale =  {
    x : ScaleLinear<number, number, never>,
    y : ScaleLinear<number, number, never>
}




