import { scaleLinear, select, Selection } from "d3";
import { Scale } from "./Graph2D_Types/types";
import {v4 as uuidv4} from "uuid";

class Graph2D{
    private svg  : SVGSVGElement;
    private canvas : Selection<SVGGElement, unknown, null, undefined>
    private bgColor : string;
    private width : number;
    private height : number;
    private relativeWidth : number;
    private relativeHeight : number;
    private centerX : number;
    private centerY: number;
    private marginStart : number;
    private marginEnd : number;
    private marginTop : number;
    private marginBottom : number;
    private scale : Scale;
    private axisType : Graph2D_AxisType;
    private axisPosition : Graph2D_AxisPosition;

//------------------------- Constructor -------------------------------
//--------------------------------------------------------------------- 

    public constructor(svg:SVGSVGElement){
        this.svg = svg;
        const groupID = uuidv4();

        //Default values
        this.bgColor = "#ffffff";   //White
        this.width = 10;
        this.height = 10;
        this.relativeWidth = 1;
        this.relativeHeight = 1;
        this.centerX = 0;
        this.centerY = 0;
        this.marginStart = 5;
        this.marginTop = 5;
        this.marginEnd = 5;
        this.marginBottom = 5
        this.axisType = "rectangular";
        this.axisPosition = "center";
        this.scale = {              //Empty scale                  
            scale:{x:scaleLinear(), y:scaleLinear()},
            reference:{x:scaleLinear(), y:scaleLinear()},
        };
        this.canvas = select(svg).append("g").classed(`Graph2D_${groupID}`, true);

        //Initial setup

        this._changeBackgrounColor();
    }

//-------------------------- Background -------------------------------
//---------------------------------------------------------------------

    public setBackgroundColor(color:string) : Graph2D{
        this.bgColor = color;
        this._changeBackgrounColor();
        return this;
    }

    public getBackgrounColor():string{
        return this.bgColor;
    }

    private _changeBackgrounColor(){
        this.canvas.style("background-color", this.bgColor);
    }

//-------------------------- Utilities --------------------------------
//---------------------------------------------------------------------

    

//----------------------------- Scale ---------------------------------
//---------------------------------------------------------------------



}



export default Graph2D;
export type Graph2D_AxisType = "rectangular" | "polar" | "x-log" | "y-log" | "log-log";
export type Graph2D_AxisPosition = "center" | "bottom-left" | "bottom-right" | "top-left" | "top-right";