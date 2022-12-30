import { Graph2D_Type, PointerMove_Options } from "../Graph2D";
import { Compute_PointerMove, Events_Type, Method_Generator_Props } from "../Graph2D_Types/types";

function Events({graphHandler, state}:Method_Generator_Props) : Events_Type{
    const throttlePointerMove = throttlefy(computePointerMove);
    
    //---------------------------------------------------------
    //-------------- Enable Pointer Move ----------------------

    function enablePointerMove(enable=true, {cursorHover="grab", cursorMove="grabbing", delay=20, pointerCapture=false, callback}:PointerMove_Options={cursorHover:"grab", cursorMove:"grabbing", delay:20, pointerCapture:false}) : Graph2D_Type{
        //Remove old event listeners
        state.canvas.node()?.removeEventListener("pointerdown", onPointerDown);
        state.canvas.node()?.removeEventListener("pointerup", onPointerUp);
        state.canvas.style("cursor", "auto");

        if(enable){
            state.events.pointerMove.cursorHover = cursorHover;
            state.events.pointerMove.cursorMove = cursorMove;
            state.events.pointerMove.delay = delay;
            state.events.pointerMove.pointerCapture = pointerCapture;
            state.events.pointerMove.callback = callback;

            state.canvas.attr("touch-action", "none");
            state.canvas.style("cursor", state.events.pointerMove.cursorHover);
            
            //Add the new event listeners
            state.canvas.node()?.addEventListener("pointerdown", onPointerDown);
            state.canvas.node()?.addEventListener("pointerup", onPointerUp);
        }

        return graphHandler;
    }

    //---------------------------------------------------------
    //------------------- On Pointer Down ---------------------
    
    function onPointerDown(e:PointerEvent){
        if(state.scale==null) return;
        
        state.events.pointerMove.x = state.scale.inner.x.invert(e.clientX);
        state.events.pointerMove.y = state.scale.inner.y.invert(e.clientY);

        state.canvas.style("cursor", state.events.pointerMove.cursorMove);
        state.canvas.node()?.addEventListener("pointermove", onPointerMove);
        
        if(state.events.pointerMove.pointerCapture)
            state.canvas.node()?.setPointerCapture(e.pointerId);
    }
    
    //---------------------------------------------------------
    //------------------ On Pointer Move ----------------------
    
    function onPointerMove(e:PointerEvent){
        const coordX = e.clientX;
        const coordY = e.clientY;
        
        throttlePointerMove({coordX, coordY});
    }
    
    //---------------------------------------------------------
    //------------------- On Pointer Up -----------------------
    
    function onPointerUp(){
        state.canvas.style("cursor", state.events.pointerMove.cursorHover);
        state.canvas.node()?.removeEventListener("pointermove", onPointerMove);
    }

    //---------------------------------------------------------
    //---------------------------------------------------------
    
    function computePointerMove({coordX, coordY}: Compute_PointerMove){
        if(state.scale==null) return;

        //compute the new center
        const displacementX = state.scale.inner.x.invert(coordX) - state.events.pointerMove.x;
        const displacementY = state.scale.inner.y.invert(coordY) - state.events.pointerMove.y;
        const newCoordX = state.config.centerX + displacementX;
        const newCoordY = state.config.centerY + displacementY;

        //Sets the new center
        graphHandler.center({
            x : newCoordX,
            y : newCoordY
        });

        if(state.events.pointerMove.callback != null)
            state.events.pointerMove.callback(graphHandler); 
    }

    //---------------------------------------------------------
    //-------------------- Throttlefy -------------------------
    
    //Takes the real callback and apply a throttle optimization on it
    function throttlefy(cal:(args:Compute_PointerMove)=>void){
        let shouldWait = false;
        let waitingArgs : Compute_PointerMove | null;
        
        function waitThrottle(){
            setTimeout(()=>{
                if(waitingArgs == null){
                    shouldWait = false;
                    return;
                }
                
                cal(waitingArgs);
                waitingArgs = null;
                waitThrottle();
            }, state.events.pointerMove.delay);
        }
        
        
        return (args:Compute_PointerMove)=>{
            if(shouldWait){
                waitingArgs = args;
                return;
            }

            cal(args);
            shouldWait = true;

            waitThrottle();
        }
    }
    
    //---------------------------------------------------------

    return {
        enablePointerMove
    }

}

export default Events;