import { axisBottom, axisLeft, axisRight, axisTop, scaleLinear, select, Selection } from "d3";
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
        this.canvas = select(svg).append("g").classed(`Graph2D_ID_${groupID}`, true); //Create the graph group

        //Initial setup
        this.canvas     //Append the "background element"
            .append("rect")
            .classed("Background", true)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", svg.clientWidth*this.relativeWidth)
            .attr("height", svg.clientHeight*this.relativeHeight);
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
        this.canvas
            .select(".Background")
            .attr("fill", this.bgColor);
    }

//-------------------------- Utilities --------------------------------
//---------------------------------------------------------------------

    

//----------------------------- Scale ---------------------------------
//---------------------------------------------------------------------

    private _computeScale(){
        const domainStartX = -this.width/2 - this.centerX;  //Inner coordinates bounding box
        const domainEndX   = this.width/2 - this.centerX;
        const domainStartY = -this.height/2 - this.centerY;
        const domainEndY   = this.height/2 - this.centerY;
        let rangeStartX : number;   //Real pixel coordinates bounding box
        let rangeEndX : number;
        let rangeStartY : number;
        let rangeEndY : number;

        ({rangeStartX, rangeEndX, rangeStartY, rangeEndY} = this._setRange());
    }

    private _setRange(){
        const domainStartX = -this.width/2 - this.centerX;
        const domainEndX   = this.width/2 - this.centerX;
        const domainStartY = -this.height/2 - this.centerY;
        const domainEndY   = this.height/2 - this.centerY;
        const fullWidth = (this.canvas
                            .select(".Background") 
                            .node() as SVGRectElement)
                            .getBBox()
                            .width;
        const fullHeight = (this.canvas
                            .select(".Background") 
                            .node() as SVGRectElement)
                            .getBBox()
                            .height;
            
        const auxScaleX = scaleLinear().domain([domainStartX,domainEndX]).range([0,fullWidth]);
        const auxScaleY = scaleLinear().domain([domainStartY,domainEndY]).range([0,fullHeight]);
        let auxAxisX : any;
        let auxAxisY : any;

        if(this.axisPosition==="center" || this.axisPosition==="bottom-left" || this.axisPosition==="bottom-right")    auxAxisX = axisBottom(auxScaleX);
        else    auxAxisX = axisTop(auxScaleX);

        if(this.axisPosition==="center" || this.axisPosition==="bottom-left" || this.axisPosition==="top-left")    auxAxisY = axisLeft(auxScaleY);
        else    auxAxisY = axisRight(auxScaleY);

        this.canvas
            .select("g.Graph2D_Axis")
            .append("g")
            .classed("Graph2D_AxisX", true)
            .call(auxAxisX)
            .attr("opacity", 0);
            
        this.canvas
            .select("g.Graph2D_Axis")
            .append("g")
            .classed("Graph2D_AxisY", true)
            .call(auxAxisY)
            .attr("opacity", 0);
    
    }

}



export default Graph2D;
export type Graph2D_AxisType = "rectangular" | "polar" | "x-log" | "y-log" | "log-log";
export type Graph2D_AxisPosition = "center" | "bottom-left" | "bottom-right" | "top-left" | "top-right";