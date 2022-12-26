import { Grid_Type, Method_Generator_Props, MinMaxCoords_Type } from "../../Graph2D_Types/types";
import Aux_Grid from "./Aux_Grid";
import Main_Grid from "./Main_Grid";

function Grid({state, graphHandler} : Method_Generator_Props) : Grid_Type{
    
//---------------------------------------------------------
//----------------- Get Min Max Coords --------------------

function getMinMaxCoords() : MinMaxCoords_Type{
    let xMin : number;
    let xMax : number;
    let yMin : number;
    let yMax : number;

    const canvasWidth = parseFloat(state.canvas
                            .select("rect.Graph2D_Background")
                            .attr("width"));
                                
    const canvasHeight = parseFloat(state.canvas
                            .select("rect.Graph2D_Background")
                            .attr("height"));

    const axisWidth = (state.canvas
                        .select("g.Graph2D_AxisY")
                        .node() as SVGGElement)
                        .getBBox()
                        .width;
                        
    const axisHeight = (state.canvas
                        .select("g.Graph2D_AxisX")
                        .node() as SVGGElement)
                        .getBBox()
                        .height;

    switch(state.axis.position){
        case "center":
            xMin = state.config.marginStart;
            xMax = canvasWidth - state.config.marginEnd;
            yMin = state.config.marginTop;
            yMax = canvasHeight - state.config.marginBottom;
            break;

        case "bottom-left":
            xMin = axisWidth + state.config.marginStart;
            xMax = canvasWidth - state.config.marginEnd;
            yMin = state.config.marginTop;
            yMax = canvasHeight - axisHeight - state.config.marginBottom;
            break;

        case "bottom-right":
            xMin = state.config.marginStart;
            xMax = canvasWidth - axisWidth - state.config.marginEnd;
            yMin = state.config.marginTop;
            yMax = canvasHeight - axisHeight - state.config.marginBottom;
            break;

        case "top-left":
            xMin = axisWidth + state.config.marginStart;
            xMax = canvasWidth - state.config.marginEnd;
            yMin = axisHeight + state.config.marginTop;
            yMax = canvasHeight - state.config.marginBottom;
            break;

        case "top-right":
            xMin = state.config.marginStart;
            xMax = canvasWidth - axisWidth - state.config.marginEnd;
            yMin = axisHeight + state.config.marginTop;
            yMax = canvasHeight - state.config.marginBottom;
            break;
    }                
    

    return {
        xMin,
        xMax,
        yMin,
        yMax
    }
}

//---------------------------------------------------------
    
    
    const mainGrid = Main_Grid({state, graphHandler, getMinMaxCoords});
    const auxGrid = Aux_Grid({state, graphHandler, getMinMaxCoords});
    
    return {
        mainGrid,
        auxGrid
    }
}

export default Grid;