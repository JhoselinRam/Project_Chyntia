import { interval, select } from "d3";
import { Graph2D_Type, Grid_Color, Grid_Enabled, Grid_Opacity, Grid_Style } from "../../Graph2D";
import { Aux_Grid, Aux_Lines_Props, Grid_Method_Generator, Spacing_Info_Props, Spacing_Info_Type } from "../../Graph2D_Types/types";

function Aux_Grid({state, graphHandler, getMinMaxCoords} : Grid_Method_Generator) : Aux_Grid{
    const minSeparation = 12;   //Min separation between lines in pixels
    const defaulSpacing = 5;    //Defaul number of lines between two ticks
//---------------------------------------------------------
//----------------- Compute Aux Grid Lines ----------------

    function compute(){
        state.canvas    //Remove the last grid
            .select("g.Graph2D_Aux_Grid")
            .remove();

        state.canvas    //Create the new grid group
            .select("g.Graph2D_Grid")
            .append("g")
            .classed("Graph2D_Aux_Grid", true);

        //Set the grid lines if enabled
        if(state.grid.aux.xEnabled){
            setAuxGridLines({
                axis : "X",
                color : state.grid.aux.xColor,
                opacity : state.grid.aux.xOpacity,
                style : state.grid.aux.xStyle,
                spacing : state.grid.aux.xSpacing
            })
        }
        
        if(state.grid.aux.yEnabled){
            setAuxGridLines({
                axis : "Y",
                color : state.grid.aux.yColor,
                opacity : state.grid.aux.yOpacity,
                style : state.grid.aux.yStyle,
                spacing : state.grid.aux.ySpacing
            })
        }
    }
    
//---------------------------------------------------------
//------------------ Set Aux Grid Lines -------------------

    function setAuxGridLines({axis, color, opacity, style, spacing} : Aux_Lines_Props){
        
        state.canvas
        .select("g.Graph2D_Aux_Grid")
        .append("g")
        .classed(`Graph2D_Aux_Grid${axis}`, true);

        const {ticks, amount} =  getSpacingInfo({axis,spacing});
        const delta = (ticks[1]-ticks[0])/(amount+1);

        ticks.forEach((value)=>{
            for(let i=1; i<=amount; i++){
                const position = value+delta*i;
                const {xStart, xEnd, yStart, yEnd} = getLinePosition(axis, position);
                
                state.canvas
                    .select(`g.Graph2D_Aux_Grid${axis}`)
                    .attr("stroke", color)
                    .attr("opacity", opacity)
                    .attr("stroke-dasharray", state.lineStyleMap[style])
                    .append("line")
                    .attr("x1", xStart)
                    .attr("x2", xEnd)
                    .attr("y1", yStart)
                    .attr("y2", yEnd)
            }
        });
    }
    
    //---------------------------------------------------------
    //---------------------------------------------------------
    
    function getSpacingInfo({axis, spacing} : Spacing_Info_Props) : Spacing_Info_Type{
        if(state.scale == null) return {ticks:[],amount:0};
        const unit = (axis==="X" ? state.axis.xUnit : state.axis.yUnit) as string;
        const ticks : Array<number> = [];
        let amount : number;
        const scale = axis==="X" ? state.scale.inner.x : state.scale.inner.y;

        state.canvas
            .select(`g.Graph2D_Axis${axis}`)
            .selectAll("g.tick")
            .each((d,i,nodes)=>{
                const position = parseFloat(select(nodes[i])
                                    .select("text")
                                    .text()
                                    .replace("−","-")
                                    .replaceAll(",","")
                                    .replace(unit,""));

                ticks.push(position);
            });

        const localInterval = ticks[1] - ticks[0];
        const interval = Math.abs(scale(ticks[1]) - scale(ticks[0]))
        ticks.push(ticks[ticks.length-1]+localInterval); //Pushes another tick value width the same separation

        if(spacing === "auto"){
            const maxSpacing = Math.ceil(interval/minSeparation-1);
            amount = maxSpacing < defaulSpacing? maxSpacing : defaulSpacing;
        }
        else{
            amount = spacing;
        }

        return {
            ticks,
            amount
        }
    }

//---------------------------------------------------------

    function getLinePosition(axis : "X" | "Y", position:number){
        const {xMin, xMax, yMin, yMax} = getMinMaxCoords();
        let xStart : number;
        let xEnd : number;
        let yStart : number;
        let yEnd : number;

        if(axis==="X"){
            xStart = state.scale?.inner.x(position) as number;
            xEnd = xStart;
            yStart = yMin;
            yEnd = yMax;
        }
        else{
            xStart = xMin;
            xEnd = xMax;
            yStart = state.scale?.inner.y(position) as number;
            yEnd = yStart;
        }

        return {
            xStart,
            xEnd,
            yStart,
            yEnd
        }
    }

//---------------------------------------------------------









/*------------- Customization functions -----------------*/

//---------------------------------------------------------
//-------------------- Aux Grid ---------------------------

function auxtGridEnabled({enabled, xEnabled, yEnabled}:Grid_Enabled) : Graph2D_Type{
    if(state.grid.aux.compute == null) return graphHandler;
    if(enabled == null && xEnabled == null && yEnabled == null) return graphHandler;
    if(enabled===state.grid.aux.xEnabled && enabled===state.grid.aux.yEnabled) return graphHandler;
    if(xEnabled===state.grid.aux.xEnabled && yEnabled===state.grid.aux.yEnabled) return graphHandler;

    if(enabled!=null){
        state.grid.aux.xEnabled = enabled;         
        state.grid.aux.yEnabled = enabled;         
    }
    if(xEnabled != null) state.grid.aux.xEnabled = xEnabled;
    if(yEnabled != null) state.grid.aux.yEnabled = yEnabled;
    
    state.grid.aux.compute();


    return graphHandler;
}

function getAuxGridEnabled():Grid_Enabled{
    return {
        xEnabled : state.grid.aux.xEnabled,
        yEnabled : state.grid.aux.yEnabled
    }
}

//---------------------------------------------------------
//--------------------- Aux Grid Color --------------------

function auxGridColor({color, xColor, yColor}:Grid_Color) : Graph2D_Type{
    if(color==null && xColor==null && yColor==null) return graphHandler;
    if(color===state.grid.aux.xColor && color===state.grid.aux.yColor) return graphHandler;
    if(xColor===state.grid.aux.xColor && yColor===state.grid.aux.yColor) return graphHandler;

    if(color!=null) {
        state.grid.aux.xColor = color;
        state.grid.aux.yColor = color;
    }
    if(xColor!=null) state.grid.aux.xColor = xColor;
    if(yColor!=null) state.grid.aux.yColor = yColor;

    state.canvas
        .select("g.Graph2D_Aux_GridX")
        .attr("stroke", state.grid.aux.xColor);
    
    state.canvas
        .select("g.Graph2D_Aux_GridY")
        .attr("stroke", state.grid.aux.yColor);


    return graphHandler;
}

function getAuxGridColor():Grid_Color{
    return {
        xColor : state.grid.aux.xColor,
        yColor : state.grid.aux.yColor
    }
}

//---------------------------------------------------------
//--------------------- Aux Grid Opacity ------------------

function auxGridOpacity({opacity, xOpacity, yOpacity}:Grid_Opacity) : Graph2D_Type{
    if(opacity==null && xOpacity==null && yOpacity==null) return graphHandler;
    if(opacity===state.grid.aux.xOpacity && opacity===state.grid.aux.yOpacity) return graphHandler;
    if(xOpacity===state.grid.aux.xOpacity && yOpacity===state.grid.aux.yOpacity) return graphHandler;

    if(opacity!=null){
        state.grid.aux.xOpacity = opacity<0?0:(opacity>1?1:opacity);
        state.grid.aux.yOpacity = opacity<0?0:(opacity>1?1:opacity);
    }
    if(xOpacity!=null) state.grid.aux.xOpacity = xOpacity<0?0:(xOpacity>1?1:xOpacity);
    if(yOpacity!=null) state.grid.aux.yOpacity = yOpacity<0?0:(yOpacity>1?1:yOpacity);

    state.canvas
        .select("g.Graph2D_Aux_GridX")
        .attr("opacity", state.grid.aux.xOpacity);
    
    state.canvas
        .select("g.Graph2D_Aux_GridY")
        .attr("opacity", state.grid.aux.yOpacity);

    return graphHandler;
}

function getAuxGridOpacity():Grid_Opacity{
    return {
        xOpacity : state.grid.aux.xOpacity,
        yOpacity : state.grid.aux.yOpacity
    }
}

//---------------------------------------------------------
//--------------------- Aux Grid Style --------------------

function auxGridStyle({style, xStyle, yStyle}:Grid_Style) : Graph2D_Type{
    if(style==null && xStyle==null && yStyle==null) return graphHandler;
    if(style===state.grid.aux.xStyle && style===state.grid.aux.yStyle) return graphHandler;
    if(xStyle===state.grid.aux.xStyle && yStyle===state.grid.aux.yStyle) return graphHandler;

    if(style!=null){
        state.grid.aux.xStyle = style;
        state.grid.aux.yStyle = style;
    }
    if(xStyle!=null) state.grid.aux.xStyle = xStyle;
    if(yStyle!=null) state.grid.aux.yStyle = yStyle;

    state.canvas
        .select("g.Graph2D_Aux_GridX")
        .attr("stroke-dasharray", state.lineStyleMap[state.grid.aux.xStyle]);
    
    state.canvas
        .select("g.Graph2D_Aux_GridY")
        .attr("stroke-dasharray", state.lineStyleMap[state.grid.aux.yStyle]);

    return graphHandler;
}

function getAuxGridStyle():Grid_Style{
    return {
        xStyle : state.grid.aux.xStyle,
        yStyle : state.grid.aux.yStyle
    }
}

//---------------------------------------------------------



    return {
        compute
    };
}

export default Aux_Grid;