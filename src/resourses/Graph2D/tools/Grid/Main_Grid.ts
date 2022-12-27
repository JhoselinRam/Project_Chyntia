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
        let xStart : number;
        let xEnd : number;
        let yStart : number;
        let yEnd : number;

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

    function mainGridEnabled({x, y}:Grid_Enabled) : Graph2D_Type{
        if(state.grid.main.compute == null) return graphHandler;
        if(x == null && y == null) return graphHandler;
        if(x===state.grid.main.xEnabled && y===state.grid.main.yEnabled) return graphHandler;

        if(x != null) state.grid.main.xEnabled = x;
        if(y != null) state.grid.main.yEnabled = y;
        
        state.grid.main.compute();


        return graphHandler;
    }

    function getMainGridEnabled():Grid_Enabled{
        return {
            x : state.grid.main.xEnabled,
            y : state.grid.main.yEnabled
        }
    }

//---------------------------------------------------------
//--------------------- Main Grid Color --------------------

    function mainGridColor({x ,y}:Grid_Color) : Graph2D_Type{
        if(x==null && y==null) return graphHandler;
        if(x===state.grid.main.xColor && y===state.grid.main.yColor) return graphHandler;

        if(x!=null){
            state.grid.main.xColor = x;
            state.canvas
                .select("g.Graph2D_Main_GridX")
                .attr("stroke", x);
        }
        if(y!=null){
            state.grid.main.yColor = y;
            state.canvas
                .select("g.Graph2D_Main_GridY")
                .attr("stroke", y);
        }

        return graphHandler;
    }

    function getMainGridColor():Grid_Color{
        return {
            x : state.grid.main.xColor,
            y : state.grid.main.yColor
        }
    }

//---------------------------------------------------------
//-------------------- Main Grid Opacity ------------------

    function mainGridOpacity({x ,y}:Grid_Opacity) : Graph2D_Type{
        if(x==null && y==null) return graphHandler;
        if(x===state.grid.main.xOpacity && y===state.grid.main.yOpacity) return graphHandler;

        if(x!=null){
            state.grid.main.xOpacity = x;
            state.canvas
                .select("g.Graph2D_Main_GridX")
                .attr("opacity", x);
        }
        if(y!=null){
            state.grid.main.yOpacity = y;
            state.canvas
                .select("g.Graph2D_Main_GridY")
                .attr("opacity", y);
        }

        return graphHandler;
    }

    function getMainGridOpacity():Grid_Opacity{
        return {
            x : state.grid.main.xOpacity,
            y : state.grid.main.yOpacity
        }
    }
    
//---------------------------------------------------------
//-------------------- Main Grid Style ------------------

    function mainGridStyle({x ,y}:Grid_Style) : Graph2D_Type{
        if(x==null && y==null) return graphHandler;
        if(x===state.grid.main.xStyle && y===state.grid.main.yStyle) return graphHandler;

        if(x!=null){
            state.grid.main.xStyle = x;
            state.canvas
                .select("g.Graph2D_Main_GridX")
                .attr("stroke-dasharray", x);
        }
        if(y!=null){
            state.grid.main.yStyle = y;
            state.canvas
                .select("g.Graph2D_Main_GridY")
                .attr("stroke-dasharray", y);
        }

        return graphHandler;
    }

    function getMainGridStyle():Grid_Style{
        return {
            x : state.grid.main.xStyle,
            y : state.grid.main.yStyle
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