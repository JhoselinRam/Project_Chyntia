import { select } from "d3";
import { GridProps, GridType } from "../../Graph2D_types/types";


function setupGrid({svg}:GridProps)  : GridType{

//-------------------------- Main Grid -----------------------------
//------------------------------------------------------------------
    function setMainGrid(){
        if(svg == null) return;
        
        select(svg.current)
            .select()
    }

//-------------------------- Aux Grid ------------------------------
//------------------------------------------------------------------

    function setAuxGrid(){
        
    }
//------------------------------------------------------------------

    return {
        setMainGrid,
        setAuxGrid
    }
}

export default setupGrid;