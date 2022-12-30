import { Canvas_Size, Center_Type, Graph2D_Type, Margin_Type, PointerMove_Options, Relative_Position } from "../Graph2D";
import { Compute_PointerMove, Config_Type, Method_Generator_Props } from "../Graph2D_Types/types";

function Config({graphHandler, state}:Method_Generator_Props) : Config_Type{
    const pointerCoords : [number, number] = [0, 0];
    const cursorStyle : [string, string] = ["", ""];
    let delayTime : number;

//--------------------- Canvas ----------------------------

    function canvas() : SVGGElement{
        return state.canvas.node() as SVGGElement;
    }

//---------------------------------------------------------
//------------------- Width & Height ----------------------

    function size({width, height}:Canvas_Size) : Graph2D_Type{
        if(state.render == null) return graphHandler;
        if(width===state.config.width && height===state.config.height) return graphHandler;
        if(width==null && height==null) return graphHandler;

        if(width != null) state.config.width = width;
        if(height != null) state.config.height = height;

        state.render();

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

    function relativeSize({width, height}:Canvas_Size) : Graph2D_Type{
        if(state.fullRender == null) return graphHandler;
        if(width === state.config.relativeWidth && height === state.config.relativeHeight) return graphHandler;
        if(width==null && height==null) return graphHandler;

        if(width != null) state.config.relativeWidth = width < 0 ? 0 : width;
        if(height != null) state.config.relativeHeight = height < 0 ? 0 : height;

        state.fullRender();
        
        return graphHandler;

    }

    function getRelativeSize() : Canvas_Size{
        return{
            width : state.config.relativeWidth,
            height : state.config.relativeHeight
        }
    }

//---------------------------------------------------------
//--------------------- Center ----------------------------

    function center({x, y}:Center_Type) : Graph2D_Type{
        if(state.render == null) return graphHandler;
        if(x===state.config.centerX && y===state.config.centerY) return graphHandler;
        if(x==null && y==null) return graphHandler;

        if(x != null) state.config.centerX = x;
        if(y != null) state.config.centerY = y;

        state.render();

        return graphHandler;
    }   
    
    function getCenter() : Center_Type{
        return {
            x : state.config.centerX,
            y : state.config.centerY
        }
    }

//---------------------------------------------------------
//----------------------- Margin --------------------------

    function margin({left, right, top, bottom} : Margin_Type) : Graph2D_Type{
        if(state.render == null) return graphHandler;
        if(left === state.config.marginStart && 
           right === state.config.marginEnd &&
           top === state.config.marginTop &&
           bottom === state.config.marginBottom) return  graphHandler;
        if(left==null && right==null && top==null && bottom==null) return graphHandler;

        if(left!=null) state.config.marginStart = left;
        if(right!=null) state.config.marginEnd = right;
        if(top!=null) state.config.marginTop = top;
        if(bottom!=null) state.config.marginBottom = bottom;

        state.render();

        return graphHandler;
    }

    function getMargin() : Margin_Type{
        return {
            left : state.config.marginStart,
            right : state.config.marginEnd,
            top : state.config.marginTop,
            bottom : state.config.marginBottom
        }     
    }

//---------------------------------------------------------
//------------------ Relative poition ---------------------

    function relativePosition({x, y}:Relative_Position) : Graph2D_Type{
        if(x===state.config.relativePositionX && y===state.config.relativePositionY) return graphHandler;
        if(x==null && y==null) return graphHandler;

        const svgWidth = state.svg.clientWidth;
        const svgHeight = state.svg.clientHeight;
        if(x!=null) state.config.relativePositionX = x;
        if(y!=null) state.config.relativePositionY = y;
        const newPositionX = svgWidth * state.config.relativePositionX;
        const newPositionY = svgHeight * state.config.relativePositionY;

        state.canvas
            .style("transform", `translate(${newPositionX}px,${newPositionY}px)`)

        return graphHandler;
    }

    function getRelativePosition() : Relative_Position{
        return {
            x : state.config.relativePositionX,
            y : state.config.relativePositionY
        }
    }

//---------------------------------------------------------
//----------------- Enable Pointer Pan --------------------

    function enablePointerMove(enable : boolean = true, {cursorHover,cursorMove,delay}:PointerMove_Options = {cursorHover:"grab",  cursorMove:"grabbing", delay:20}) : Graph2D_Type{
        state.canvas.node()?.removeEventListener("pointerdown", onPointerDown);
        state.canvas.node()?.removeEventListener("pointerup", onPointerUp);
        state.canvas.style("cursor", "auto");

        if(enable){
            cursorStyle[0] = cursorHover;
            cursorStyle[1] = cursorMove;
            delayTime = delay;
            state.canvas.style("cursor", cursorHover);
            state.canvas.attr("touch-action", "none");
            state.canvas.node()?.addEventListener("pointerdown", onPointerDown);
            state.canvas.node()?.addEventListener("pointerup", onPointerUp);
        } 

        return graphHandler
    }

    //---------------------------------------------------------

    function onPointerDown(e:PointerEvent){
        if(state.scale==null) return;
        
        pointerCoords[0] = state.scale.inner.x.invert(e.clientX);
        pointerCoords[1] = state.scale.inner.y.invert(e.clientY);

        state.canvas.style("cursor", cursorStyle[1]);
        state.canvas.node()?.addEventListener("pointermove", onPointerMove);
    }

    //---------------------------------------------------------

    function onPointerUp(e:PointerEvent){
        state.canvas.style("cursor", cursorStyle[0]);
        state.canvas.node()?.removeEventListener("pointermove", onPointerMove);
    }

    //---------------------------------------------------------

    function onPointerMove(e:PointerEvent){
        const coordX = e.clientX;
        const coordY = e.clientY;
        console.log(cursorStyle[1]);
        throttlePointerMove({coordX, coordY});
    }

    //---------------------------------------------------------

    const throttlePointerMove = throttlefy(computePointerMove);
    
    function computePointerMove({coordX, coordY}: Compute_PointerMove){
        if(state.scale==null) return;
        const displacementX = state.scale.inner.x.invert(coordX) - pointerCoords[0];
        const displacementY = state.scale.inner.y.invert(coordY) - pointerCoords[1];
        const newCoordX = state.config.centerX + displacementX;
        const newCoordY = state.config.centerY + displacementY;

        center({
            x : newCoordX,
            y : newCoordY
        });
    }

    function throttlefy(fun:(args:Compute_PointerMove)=>void){
        let shouldWait = false;
        let waitingArgs : Compute_PointerMove | undefined;
        
        function waitThrottle(){
            setTimeout(()=>{
                if(waitingArgs == null){
                    shouldWait = false;
                    return;
                }
                
                fun(waitingArgs);
                waitingArgs = undefined;
                waitThrottle();
            }, delayTime);
        }
        
        return (args:Compute_PointerMove)=>{
            if(shouldWait){
                waitingArgs = args;
                return;
            }

            fun(args);
            shouldWait = true;

            waitThrottle();
        }
    }



    return {
        canvas,
        size,
        getSize,
        relativeSize,
        getRelativeSize,
        center,
        getCenter,
        margin,
        getMargin,
        relativePosition,
        getRelativePosition,
        enablePointerMove
    };
}

export default Config;