import { Grap2D_Type, Graph2D_AxisPosition, Graph2D_AxisType } from "../Graph2D";
import { Config_Type, Method_Generator_Props } from "../Graph2D_Types/types";

function Config({graphHandler, state}:Method_Generator_Props) : Config_Type{

//--------------------- Axis Type -------------------------

    function setAxisType(type : Graph2D_AxisType) : Grap2D_Type{
        if(type === state.axis.type) return graphHandler;
        if(state.scale == null) return graphHandler;
        if(state.axis.compute == null) return graphHandler;

        state.axis.type = type;
        state.scale.compute();
        state.axis.compute();

        return graphHandler;
    }

    function getAxisType():Graph2D_AxisType{
        return state.axis.type;
    }

//---------------------------------------------------------
//------------------- Axis Position -----------------------

    function setAxisPosition(position : Graph2D_AxisPosition) : Grap2D_Type{
        if(position === state.axis.position) return graphHandler;
        if(state.scale == null) return graphHandler;
        if(state.axis.compute == null) return graphHandler;

        state.axis.position = position;
        state.scale.compute();
        state.axis.compute();

        return graphHandler;
    }

    function getAxisPosition():Graph2D_AxisPosition{
        return state.axis.position;
    }

//---------------------------------------------------------

    return {
        setAxisType,
        getAxisType,
        setAxisPosition,
        getAxisPosition
    };
}

export default Config;