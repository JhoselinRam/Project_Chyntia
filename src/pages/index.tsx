import { ChangeEvent } from "react";
import Graph2D, { Grap2D_Type } from "../resourses/Graph2D/Graph2D";

export default function Home() {
  let Graph : Grap2D_Type; 

  function changeColor(e:ChangeEvent){
    const color = (e.target as HTMLInputElement).value as string;
    Graph.setBackground(color);
    
  }
  



  function setGraphObject(element : SVGSVGElement){
    if(element == null) return;

    Graph = Graph2D(element);
  }

  return (
    <>
    <div className="flex items-start justify-center gap-3 my-3">
      <div className="flex flex-col items-start justify-center">
        <p>Color</p>
        <input type="color" defaultValue="#ffffff" onChange={changeColor}/>
      </div>
    </div>

    <div className="w-full h-[500px] p-10 bg-gray-500 flex items-center justify-center">
        <svg className="w-full h-full" ref={setGraphObject}>
        </svg>
    </div>
    </>
    );
  }
 