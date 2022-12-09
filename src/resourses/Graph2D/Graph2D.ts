import { select } from "d3";

class Graph2D{
    private svg  : SVGSVGElement;
    private bgColor : string;

    public constructor(svg:SVGSVGElement){
        this.svg = svg;

        //Default values
        this.bgColor = "#ffffff";   //White


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
        select(this.svg).style("background-color", this.bgColor);
    }

//---------------------------------------------------------------------
}

export default Graph2D;