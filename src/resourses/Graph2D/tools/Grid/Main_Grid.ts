import { select } from "d3";
import { Graph2D_Type, Grid_Color, Grid_Enabled, Grid_Opacity, Grid_Style } from "../../Graph2D";
import { Grid_Method_Generator, Main_Grid, Main_Lines_Props} from "../../Graph2D_Types/types";

function Main_Grid({state, graphHandler, getMinMaxCoords} : Grid_Method_Generator) : Main_Grid{

//---------------------------------------------------------
//------------------ Compute Main Grid --------------------

    function compute(){
        state.canvas    //Remove the last grid
            .select("g.Graph2D_Main_Grid")
            .remove();

        state.canvas    //Create the new grid group
            .select("g.Graph2D_Grid")
            .append("g")
            .classed("Graph2D_Main_Grid", true);

        //Set the grid lines if enabled
        if(state.grid.main.xEnabled){
            setGridLines({
                axis : "X",
                color : state.grid.main.xColor,
                opacity : state.grid.main.xOpacity,
                style : state.grid.main.xStyle
            })
        }
        
        if(state.grid.main.yEnabled){
            setGridLines({
                axis : "Y",
                color : state.grid.main.yColor,
                opacity : state.grid.main.yOpacity,
                style : state.grid.main.yStyle
            })
        }
    }

//---------------------------------------------------------
//------------------- Set Grid Lines ----------------------

    function setGridLines({axis, color, opacity, style} : Main_Lines_Props){
        const unit = (axis==="X" ? state.axis.xUnit : state.axis.yUnit) as string;

        state.canvas
            .select("g.Graph2D_Main_Grid")
            .append("g")
            .classed(`Graph2D_Main_Grid${axis}`, true);

        state.canvas
            .select(`g.Graph2D_Axis${axis}`)
            .selectAll("g.tick")
            .each((d,i,nodes)=>{
                const tick = nodes[i] as SVGGElement;
                if(select(tick).attr("visibility")==="hidden") return;

                const position = parseFloat(select(tick)
                                            .select("text")
                                            .text()
                                            .replace("−","-")
                                            .replaceAll(",","")
                                            .replace(unit,""));
                
                const {xStart, xEnd, yStart, yEnd} = getLinePosition(axis, position);

                state.canvas
                    .select(`g.Graph2D_Main_Grid${axis}`)
                    .attr("stroke", color)
                    .attr("opacity", opacity)
                    .attr("stroke-dasharray", state.lineStyleMap[style])
                    .append("line")
                    .attr("x1", xStart)
                    .attr("x2", xEnd)
                    .attr("y1", yStart)
                    .attr("y2", yEnd)

            });
    }

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
//---------------------------------------------------------





/*------------- Customization functions -----------------*/

//---------------------------------------------------------
//------------------- Main Grid ---------------------------

    function mainGridEnabled({enabled, xEnabled, yEnabled}:Grid_Enabled) : Graph2D_Type{
        if(state.grid.main.compute == null) return graphHandler;
        if(enabled == null && xEnabled == null && yEnabled == null) return graphHandler;
        if(enabled===state.grid.main.xEnabled && enabled===state.grid.main.yEnabled) return graphHandler;
        if(xEnabled===state.grid.main.xEnabled && yEnabled===state.grid.main.yEnabled) return graphHandler;

        if(enabled!=null){
            state.grid.main.xEnabled = enabled;         
            state.grid.main.yEnabled = enabled;         
        }
        if(xEnabled != null) state.grid.main.xEnabled = xEnabled;
        if(yEnabled != null) state.grid.main.yEnabled = yEnabled;
        
        state.grid.main.compute();


        return graphHandler;
    }

    function getMainGridEnabled():Grid_Enabled{
        return {
            xEnabled : state.grid.main.xEnabled,
            yEnabled : state.grid.main.yEnabled
        }
    }

//---------------------------------------------------------
//--------------------- Main Grid Color --------------------

    function mainGridColor({color, xColor, yColor}:Grid_Color) : Graph2D_Type{
        if(color==null && xColor==null && yColor==null) return graphHandler;
        if(color===state.grid.main.xColor && color===state.grid.main.yColor) return graphHandler;
        if(xColor===state.grid.main.xColor && yColor===state.grid.main.yColor) return graphHandler;

        if(color!=null) {
            state.grid.main.xColor = color;
            state.grid.main.yColor = color;
        }
        if(xColor!=null) state.grid.main.xColor = xColor;
        if(yColor!=null) state.grid.main.yColor = yColor;

        state.canvas
            .select("g.Graph2D_Main_GridX")
            .attr("stroke", state.grid.main.xColor);
        
        state.canvas
            .select("g.Graph2D_Main_GridY")
            .attr("stroke", state.grid.main.yColor);


        return graphHandler;
    }

    function getMainGridColor():Grid_Color{
        return {
            xColor : state.grid.main.xColor,
            yColor : state.grid.main.yColor
        }
    }

//---------------------------------------------------------
//-------------------- Main Grid Opacity ------------------

    function mainGridOpacity({opacity, xOpacity, yOpacity}:Grid_Opacity) : Graph2D_Type{
        if(opacity==null && xOpacity==null && yOpacity==null) return graphHandler;
        if(opacity===state.grid.main.xOpacity && opacity===state.grid.main.yOpacity) return graphHandler;
        if(xOpacity===state.grid.main.xOpacity && yOpacity===state.grid.main.yOpacity) return graphHandler;

        if(opacity!=null){
            state.grid.main.xOpacity = opacity<0?0:(opacity>1?1:opacity);
            state.grid.main.yOpacity = opacity<0?0:(opacity>1?1:opacity);
        }
        if(xOpacity!=null) state.grid.main.xOpacity = xOpacity<0?0:(xOpacity>1?1:xOpacity);
        if(yOpacity!=null) state.grid.main.yOpacity = yOpacity<0?0:(yOpacity>1?1:yOpacity);

        state.canvas
            .select("g.Graph2D_Main_GridX")
            .attr("opacity", state.grid.main.xOpacity);
        
        state.canvas
            .select("g.Graph2D_Main_GridY")
            .attr("opacity", state.grid.main.yOpacity);

        return graphHandler;
    }

    function getMainGridOpacity():Grid_Opacity{
        return {
            xOpacity : state.grid.main.xOpacity,
            yOpacity : state.grid.main.yOpacity
        }
    }
    
//---------------------------------------------------------
//-------------------- Main Grid Style ------------------

    function mainGridStyle({style, xStyle, yStyle}:Grid_Style) : Graph2D_Type{
        if(style==null && xStyle==null && yStyle==null) return graphHandler;
        if(style===state.grid.main.xStyle && style===state.grid.main.yStyle) return graphHandler;
        if(xStyle===state.grid.main.xStyle && yStyle===state.grid.main.yStyle) return graphHandler;

        if(style!=null){
            state.grid.main.xStyle = style;
            state.grid.main.yStyle = style;
        }
        if(xStyle!=null) state.grid.main.xStyle = xStyle;
        if(yStyle!=null) state.grid.main.yStyle = yStyle;

        state.canvas
            .select("g.Graph2D_Main_GridX")
            .attr("stroke-dasharray", state.lineStyleMap[state.grid.main.xStyle]);
        
        state.canvas
            .select("g.Graph2D_Main_GridY")
            .attr("stroke-dasharray", state.lineStyleMap[state.grid.main.yStyle]);

        return graphHandler;
    }

    function getMainGridStyle():Grid_Style{
        return {
            xStyle : state.grid.main.xStyle,
            yStyle : state.grid.main.yStyle
        }
    }

//---------------------------------------------------------




    return {
        compute,
        mainGridEnabled,
        getMainGridEnabled,
        mainGridColor,
        getMainGridColor,
        mainGridOpacity,
        getMainGridOpacity,
        mainGridStyle,
        getMainGridStyle
    };
}

export default Main_Grid;