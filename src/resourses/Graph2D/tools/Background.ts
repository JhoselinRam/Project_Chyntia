import { Grap2D_Type } from "../Graph2D";
import { Method_Generator_Props } from "../Graph2D_Types/types";

function Background({graphHandler, state} : Method_Generator_Props){
    
    function setBackground(value : string) : Grap2D_Type{
        state.bgColor = value;
        
        return graphHandler;
    }

    function getBackground() : string{
        return state.bgColor;
    }
    
    return {
        setBackground,
        getBackground
    }

}

export default Background;