import { ChangeEvent } from "react";
import Graph2D from "../resourses/Graph2D/Graph2D";

export default function Home() {
  let Graph : Graph2D;

  function changeColor(e:ChangeEvent){
    const color = (e.target as HTMLInputElement).value as string;
    Graph.setBackgroundColor(color);
  }
  



  function setGraphObject(element : SVGSVGElement){
    if(element == null) return;

    Graph = new Graph2D(element);
  }

  return (
    <>
    <div className="flex items-start justify-center gap-3 my-3">
      <div className="flex flex-col items-start justify-center">
        <p>Color</p>
        <input type="color" defaultValue="#ffffff"/>
      </div>
    </div>

    <div className="w-full h-[500px] p-10 bg-gray-500 flex items-center justify-center">
        <svg className="w-full h-full" ref={setGraphObject}>
        </svg>
    </div>
    </>
    );
  }
 