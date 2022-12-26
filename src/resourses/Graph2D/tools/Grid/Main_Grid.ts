import { Main_Grid, Main_Lines_Props, Method_Generator_Props, MinMaxCoords_Type } from "../../Graph2D_Types/types";

function Main_Grid({graphHandler, state}:Method_Generator_Props, getMinMaxCoords:()=>MinMaxCoords_Type) : Main_Grid{

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
        state.canvas
            .select("g.Graph2D_Main_Grid")
            .append("g")
            .classed(`Graph2D_Main_Grid${axis}`, true);

        
    }

//---------------------------------------------------------

    return {
        compute
    };
}

export default Main_Grid;