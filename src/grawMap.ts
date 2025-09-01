import type { MapData } from "./models";

export const drawMap = (paper: paper.PaperScope, mapData: MapData[]) => {
    // const itemRadius = 40
    const mapWidth = paper.view.bounds.width;
    const mapHeight = paper.view.bounds.height;
    const mapArea = mapHeight * mapWidth;
    const itemArea = mapArea / mapData.length;
    const itemRadius = Math.sqrt(itemArea) / 2;
    const itemDiameter = itemRadius * 2
    const numberPerRow = Math.floor(mapWidth / itemDiameter)
    // const numberPerColumn = Math.round()
    const bubbles = [];
    console.log(mapArea, itemArea * mapData.length, itemArea, Math.pow(itemRadius * 2, 2))
    mapData.forEach((md, i) => {
        const nthRow = Math.floor(i / numberPerRow)
        const y = itemRadius + nthRow * itemDiameter;
        const nthCol = i - (nthRow * numberPerRow)
        const x = itemRadius + nthCol * itemDiameter;
        // const sqare = new paper.Path.Rectangle({
        //     point: [x, y],
        //     size: [itemDiameter, itemDiameter],
        //     strokeColor: 'black'
        // })
        const circle = new paper.Path.Circle({
            center: [x, y],
            radius: itemRadius,
            fillColor: md.correctness > 0 ? new paper.Color("#1A9E37") : md.correctness < 0 ? new paper.Color("#9e1a1a") :  new paper.Color("#919191"),
        });
        bubbles.push(circle);
    })


        // Example: animate
        // paper.view.onFrame = (event: any) => {
            // quare.rotate(1);
        // };
}


// class Bubble {
//     constructor(id: number, x: number,y: number,level: string, correctness: number){
        
//     }
//     render(){
        
//     }
// }