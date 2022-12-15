import { Grid_Type, Method_Generator_Props } from "../../Graph2D_Types/types";
import Aux_Grid from "./Aux_Grid";
import Main_Grid from "./Main_Grid";

function Grid(props : Method_Generator_Props) : Grid_Type{
    const mainGrid = Main_Grid(props);
    const auxGrid = Aux_Grid(props);





//---------------------------------------------------------

    return {
        mainGrid,
        auxGrid
    }
}

export default Grid;