import { Canvas_Size, Graph2D_Type } from "../Graph2D";
import { Config_Type, Method_Generator_Props } from "../Graph2D_Types/types";

function Config({graphHandler, state}:Method_Generator_Props) : Config_Type{

//--------------------- Canvas ----------------------------

    function canvas() : SVGGElement{
        return state.canvas.node() as SVGGElement;
    }

//---------------------------------------------------------
//------------------- Width & Height ----------------------

    function size({width, height}:Canvas_Size) : Graph2D_Type{
        if(state.scale == null || state.axis.compute == null) return graphHandler;
        if(width===state.config.width && height===state.config.height) return graphHandler;

        if(width != null) state.config.width = width;
        if(height != null) state.config.height = height;

        state.scale.compute();
        state.axis.compute();

        return graphHandler;
    }

    function getSize() : Canvas_Size{
        return {
            width : state.config.width,
            height : state.config.height 
        };
    }

//---------------------------------------------------------
//---------------Relative Width & Height ------------------

    function relativeWidth(value:number) : Graph2D_Type{
        if(state.render == null) return graphHandler;
        if(value === state.config.relativeWidth) return graphHandler;
        const newRelativeWidth = value < 0 ? 0: value;

        state.config.relativeWidth = newRelativeWidth;
        state.render();

        return graphHandler;
    }

    function getRelativeWidth() : number{
        return state.config.relativeWidth;
    }

    //---------------------------------------------------------

    function relativeHeight(value:number) : Graph2D_Type{

        if(state.render == null) return graphHandler;
        if(value === state.config.relativeHeight) return graphHandler;
        const newRelativeHeight = value < 0 ? 0: value;

        state.config.relativeHeight = newRelativeHeight;
        state.render();

        return graphHandler;
    }

    function getRelativeHeight() : number{
        return state.config.relativeHeight;
    }

//---------------------------------------------------------
//--------------------- Center ----------------------------

    function centerX(position:number) : Graph2D_Type{
        if(state.scale == null || state.axis.compute == null) return graphHandler;
        if(position === state.config.centerX) return graphHandler;

        state.config.centerX = position;
        state.scale.compute();
        state.axis.compute();

        return graphHandler;
    }

    function getCenterX() : number{
        return state.config.centerX;
    }
    
    //---------------------------------------------------------
    
    function centerY(position:number) : Graph2D_Type{
        if(state.scale == null || state.axis.compute == null) return graphHandler;
        if(position === state.config.centerY) return graphHandler;

        state.config.centerY = position;
        state.scale.compute();
        state.axis.compute();

        return graphHandler;
    }

    function getCenterY(){
        return state.config.centerY;
    }

//---------------------------------------------------------
//----------------------- Margin --------------------------

    //---------------------------------------------------------



    //---------------------------------------------------------



    //---------------------------------------------------------



    //---------------------------------------------------------



//---------------------------------------------------------

    return {
        canvas,
        size,
        getSize,
        relativeWidth,
        getRelativeWidth,
        relativeHeight,
        getRelativeHeight, 
        centerX,
        getCenterX,
        centerY,
        getCenterY
    };
}

export default Config;