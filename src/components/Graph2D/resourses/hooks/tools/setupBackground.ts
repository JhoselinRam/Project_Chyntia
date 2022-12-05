import { select } from "d3";
import { BackgroundProps, BackgroundType } from "../../Graph2D_types/types";


function setupBackground({svg, backgroundColor} : BackgroundProps) : BackgroundType{
    
    function setBackground(){
        if(svg.current == null) return;

        select(svg.current).style("background-color", backgroundColor);
    }

    return {setBackground};

}

export default setupBackground;