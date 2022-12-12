import { ChangeEvent } from "react";
import Graph2D, { Grap2D_Type } from "../resourses/Graph2D/Graph2D";

export default function Home() {
  let Graph : Grap2D_Type; 

  function changeColor(e:ChangeEvent){
    const color = (e.target as HTMLInputElement).value as string;
    Graph.setBackground(color);
    
  }

  function changeOpacity(e : ChangeEvent){
    const opacity = parseFloat((e.target as HTMLInputElement).value as string);
    Graph.setBackgroundOpacity(opacity);
  }
  



  function setGraphObject(element : SVGSVGElement){
    if(element == null) return;

    Graph = Graph2D(element);
  }

  return (
    <>
    <div className="flex flex-col justify-center items-center">
      
      <div className="flex items-start justify-center gap-3 my-3">
        
        <div className="flex-1 flex flex-col items-start justify-center">
          <p>Color</p>
          <input type="color" defaultValue="#ffffff" onChange={changeColor}/>
        </div>
        <div className="flex-1 flex flex-col justify-start items-start">
          <p>Canvas opacity</p>
          <input type="number" className="border border-gray-500 rounded-md w-full px-1" min={0} max={1} step={0.01} defaultValue={1} onChange={changeOpacity}/>
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
 