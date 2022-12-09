import { Graph2D_Props } from "./Graph2D_Types/types";
import Background from "./tools/Background";

//---------------------- Graph2D Type ---------------------------------

export type Graph2D_Type = {

}

//---------------------------------------------------------------------
//----------------------- Main Function -------------------------------

function Graph2D(this:Graph2D_Type, {svg} : Graph2D_Props) : Graph2D_Type{
    const Default_BackgroundColor = "#ffffff"   //white
    const ref : Graph2D_Type = this;
    const {backgroundColor} = Background({svg});
    

//---------------------------------------------------------------------
    return {

    }
}

export default Graph2D;