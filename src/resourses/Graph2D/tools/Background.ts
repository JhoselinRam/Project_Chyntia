import { Graph2D_Type } from "../Graph2D";
import { Background_Type, Method_Generator_Props } from "../Graph2D_Types/types";

function Background({graphHandler, state} : Method_Generator_Props) : Background_Type{
  
//---------------------------------------------------------

    function backgroundColor(value : string) : Graph2D_Type{
        if (value === state.background.bgColor) return graphHandler;
        
        state.canvas
            .selectAll("rect.Graph2D_Background, rect.Graph2D_Label_Background")
            .attr("fill", value);
        
        
        
        state.background.bgColor = value;
        
        return graphHandler;
    }

    function getBackgroundColor() : string{
        return state.background.bgColor;
    }

//---------------------------------------------------------

    function backgroundOpacity(value : number) : Graph2D_Type{
        if(state.scale == null || state.axis.compute == null) return graphHandler;
        const newOpacity = value > 1 ? 1 : (value < 0 ? 0 : value); //Opacity must be between 0 and 1
        if (newOpacity === state.background.bgOpacity) return graphHandler;

        state.background.bgOpacity = newOpacity;
        state.canvas
            .selectAll("rect.Graph2D_Background, rect.Graph2D_Label_Background")
            .attr("opacity", newOpacity);
        
        state.axis.compute();


        return graphHandler;
    }

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