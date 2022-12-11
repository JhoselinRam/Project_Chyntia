import { select } from "d3";
import { v4 as uuidv4 } from "uuid";
import { Grapg2D_State } from "./Graph2D_Types/types";
import Background from "./tools/Background";

function Grap2D(svg : SVGSVGElement) : Grap2D_Type{
    const graphID = uuidv4();
    const canvas = select(svg)
                    .append("g")
                    .classed(`Graph2D_ID_${graphID}`, true);
    
    //Inner state
    const state : Grapg2D_State = {
     canvas,
     widht : 10,
     height : 10,
     relativeWidth : 1,
     relativeHeigh : 1,
     centerX : 0,
     centerY : 0,
     bgColor : "#ffffff",   //white
     axisType : "rectangular",
     axisPosition : "center",
     marginStart : 5,
     marginTop : 5,
     marginEnd : 5,
     marginBottom : 5
    }
    const graphHandler : Grap2D_Type | any = {}; //Main object (method handler)
    
    //Method generators
    const background = Background({graphHandler, state});

    //Main object population
    graphHandler.canvas = ()=>canvas.node() as SVGGElement;
    graphHandler.setBackground = background.setBackground;
    graphHandler.getBackground = background.getBackground;
    
    //Setup configuration



    
    return (graphHandler as Grap2D_Type);

}






//---------------------------------------------------------
//------------------------ Exports ------------------------

export default Grap2D;

export type Grap2D_Type = {
    canvas : ()=>SVGGElement,
    setBackground : (arg0:string)=>Grap2D_Type,
    getBackground : ()=>string
}

export type Graph2D_AxisType = "rectangular" | "polar" | "x-log" | "y-log" | "log-log";

export type Graph2D_AxisPosition = "center" | "bottom-left" | "bottom-right" | "top-left" | "top-right";
