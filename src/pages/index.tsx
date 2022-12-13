import { ChangeEvent } from "react";
import Graph2D, { Grap2D_Type, Graph2D_AxisPosition } from "../resourses/Graph2D/Graph2D";

export default function Home() {
  let Graph : Grap2D_Type; 

  function changeColor(e:ChangeEvent){
    const color = (e.target as HTMLInputElement).value as string;
    Graph.backgroundColor(color);
    
  }

  function changeOpacity(e : ChangeEvent){
    const opacity = parseFloat((e.target as HTMLInputElement).value as string);
    Graph.backgroundOpacity(opacity);
  }

  function changePosition(e : ChangeEvent){
    const position = (e.target as HTMLSelectElement).value as Graph2D_AxisPosition;
    Graph.axisPosition(position);
  }
  



  function setGraphObject(element : SVGSVGElement){
    if(element == null) return;

    Graph = Graph2D(element);
  }

  return (
    <>
    <div className="flex flex-col justify-center items-center">
      
      <div className="flex items-start justify-center gap-3 my-3">
        
        <div className="flex flex-col items-start justify-center">
          <p>Color</p>
          <input type="color" defaultValue="#ffffff" onChange={changeColor}/>
        </div>
        <div className="flex flex-col justify-start items-start">
          <p>Canvas opacity</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1" min={0} max={1} step={0.01} defaultValue={1} onChange={changeOpacity}/>
        </div>
        <div className="flex flex-col justify-start items-start">
          <p>Position</p>
          <select defaultValue="center" className="border border-gray-500 rounded-md w-full px-1" onChange={changePosition}>
            <option value="center">Center</option>
            <option value="bottom-left">Bottom-Left</option>
            <option value="bottom-right">Bottom-Right</option>
            <option value="top-left">Top-Left</option>
            <option value="top-right">Top-Right</option>
          </select>
        </div>
      
      </div>
    
    </div>

    <div className="w-full h-[500px] p-10 bg-gray-500 flex items-center justify-center">
        <svg className="w-full h-full" ref={setGraphObject}>
        </svg>
    </div>
    </>
    );
  }
 