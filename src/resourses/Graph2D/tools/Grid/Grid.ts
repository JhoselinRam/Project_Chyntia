import { Grid_Type, Method_Generator_Props, MinMaxCoords_Type } from "../../Graph2D_Types/types";
import Aux_Grid from "./Aux_Grid";
import Main_Grid from "./Main_Grid";

function Grid(props : Method_Generator_Props) : Grid_Type{
    
//---------------------------------------------------------
//----------------- Get Min Max Coords --------------------

function getMinMaxCoords() : MinMaxCoords_Type{
    let xMin : number = 0;
    let xMax : number = 0;
    let yMin : number = 0;
    let yMax : number = 0;



    return {
        xMin,
        xMax,
        yMin,
        yMax
    }
}

//---------------------------------------------------------
    
    
    const mainGrid = Main_Grid(props, getMinMaxCoords);
    const auxGrid = Aux_Grid(props, getMinMaxCoords);
    
    return {
        mainGrid,
        auxGrid
    }
}

export default Grid;