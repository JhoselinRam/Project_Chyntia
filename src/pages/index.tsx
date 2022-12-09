import { useRef } from "react";
import Graph2D, { Graph2D_Type } from "../resourses/Graph2D/Graph2D";

export default function Home() {
  const svgElement = useRef<SVGSVGElement | null>(null);
  let Graph : Graph2D_Type;

  function setGraphObject(element : SVGSVGElement){
    if(element == null) return;

    Graph = Graph2D({svg : element});
  }

  return (
    <>
    <div className="w-full h-[500px] p-10 bg-gray-500 flex items-center justify-center">
        <svg className="w-full h-full" ref={setGraphObject}></svg>
    </div>
    </>
    );
  }
 