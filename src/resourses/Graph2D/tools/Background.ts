import { Grap2D_Type } from "../Graph2D";
import { Method_Generator_Props } from "../Graph2D_Types/types";

function Background({graphHandler, state} : Method_Generator_Props){
  
//---------------------------------------------------------
    function setBackground(value : string) : Grap2D_Type{
        if (value === state.background.bgColor) return graphHandler;
        
        state.canvas
            .select(".Background")
            .attr("fill", value);
        
        state.background.bgColor = value;
        
        return graphHandler;
    }

//---------------------------------------------------------
    function getBackground() : string{
        return state.background.bgColor;
    }

//---------------------------------------------------------

    function setBackgroundOpacity(value : number) : Grap2D_Type{
        const newOpacity = value > 1 ? 1 : (value < 0 ? 0 : value); //Opacity must be between 0 and 1
        if (newOpacity === state.background.bgOpacity) return graphHandler;

        state.canvas
            .select(".Background")
            .attr("opacity", newOpacity);

        state.background.bgOpacity = newOpacity;

        return graphHandler;
    }
    
//---------------------------------------------------------

    function getBackgroundOpacity() : number{
        return state.background.bgOpacity;
    }
    
//---------------------------------------------------------
    
    return {
        setBackground,
        getBackground,
        setBackgroundOpacity,
        getBackgroundOpacity
    }

}

export default Background;