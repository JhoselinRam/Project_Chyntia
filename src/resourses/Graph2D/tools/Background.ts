import { Grap2D_Type } from "../Graph2D";
import { Background_Type, Method_Generator_Props } from "../Graph2D_Types/types";

function Background({graphHandler, state} : Method_Generator_Props) : Background_Type{
  
//---------------------------------------------------------
    function backgroundColor(value : string) : Grap2D_Type{
        if (value === state.background.bgColor) return graphHandler;
        
        state.canvas
            .select("rect.Graph2d_Background")
            .attr("fill", value);
        
        state.background.bgColor = value;
        
        return graphHandler;
    }

//---------------------------------------------------------
    function getBackgroundColor() : string{
        return state.background.bgColor;
    }

//---------------------------------------------------------

    function backgroundOpacity(value : number) : Grap2D_Type{
        const newOpacity = value > 1 ? 1 : (value < 0 ? 0 : value); //Opacity must be between 0 and 1
        if (newOpacity === state.background.bgOpacity) return graphHandler;

        state.canvas
            .select("rect.Graph2d_Background")
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
        backgroundColor,
        getBackgroundColor,
        backgroundOpacity,
        getBackgroundOpacity
    }

}

export default Background;