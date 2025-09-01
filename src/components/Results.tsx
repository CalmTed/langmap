import { useState, useEffect, useRef } from "react"
import { PAGE } from "../constants"
import { go } from "../go"
import { useAppSelector, selectState, useAppDispatch } from "../store"
import type { MapData, QuestionModel, ResultsModel } from "../models"
import paper from "paper"
import { drawMap } from "../grawMap"
import { questionsEN, topicsEN } from "../assets/en"

const generateMapData = (resultsData: ResultsModel[]) => {
    return topicsEN.map(t => {
        const correctQuestionsUUIDs = t.questions.map(q => q.uuid)
        const correctAnswersUUIDs = t.questions.map(q => q.options[0].uuid)
        const allAnswers = 8;
        const correctnessArray = resultsData.map(r => 
            r.questions.filter(q => correctQuestionsUUIDs.includes(q.questionUUID)).map(q => 
                correctAnswersUUIDs.includes(q.answerUUID) ? 1 : -1 as number
            )
        ).flat()
        const correctness = correctnessArray.length > 0 ? correctnessArray.reduce((ps, v) => ps + v) : 0;
        const mapDataItem: MapData = {
            topicUUID: t.uuid,
            lanquageLevel: t.level,
            correctness
        }
        return mapDataItem;
    })
}

export const ResultsPage = () => {
    const state = useAppSelector(selectState)
    const dispatch = useAppDispatch()
    const [ selectedResult, setSelectedResult ] = useState(0)
    const [ mapData, setMapData] = useState(generateMapData(state.results))
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    
    useEffect(() => {
        if(state.results.length === 0 || !state.selectedName){
            go(PAGE.HOME)
        }
        if(state.activeTasks?.filter((t: any) => typeof t.answerUUID === "undefined")?.length > 0){
            go(PAGE.TEST)
        }
    },[])
    const resultsList = state.results?.filter((r:any) => r.name === state.selectedName) as ResultsModel[]
    if(resultsList.length === 0){
        go(PAGE.HOME)
    }
    const selectedResults = resultsList[selectedResult]
    const allQuestions:QuestionModel[] = questionsEN;
    

    

    useEffect(() => {
        if (!canvasRef.current) return;

        // Setup Paper.js with this canvas
        paper.setup(canvasRef.current);

        drawMap(paper, mapData)
        // Example: draw a circle
        

        // Cleanup on unmount
        return () => {
        paper.project.clear();
        };

    },[mapData])

    const pageWidth = Math.min(
          document.body.scrollWidth,
          document.documentElement.scrollWidth,
          document.body.offsetWidth,
          document.documentElement.offsetWidth,
          document.documentElement.clientWidth
        );
      
     const pageHeight = Math.min(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight,
          document.documentElement.clientHeight
        );

    
    return <>
        <div>
            <h1>Result</h1>
            <div>
                <canvas 
                    ref={canvasRef} 
                    width={pageWidth} 
                    height={pageHeight * 0.9} 
                    className="map" 
                    style={{top: "0px", position:"absolute", left: "0px", zIndex: 0}}
                    ></canvas>
            </div>
            {resultsList.length > 1 && <div>
                {
                    resultsList.map((r,i) => (<button key={r.uuid} onClick={() => setSelectedResult(i)}>{i+1}</button>))
                }
            </div>}
            <div className="resultsList" style={{position: "relative", marginTop: "90ph"}}>
                <div>Start time: {selectedResults.timeStart}</div>
                <div>Finish time: {selectedResults.timeFinish}</div>
                <div>Duration time: {selectedResults.timeFinish - selectedResults.timeStart}</div>
                {selectedResults.questions.map(q => {
                    const targetQuestion = allQuestions.filter(aq => aq.uuid === q.questionUUID)[0];
                    const isRight = targetQuestion.options[0].uuid === q.answerUUID;
                    return (<div key={q.uuid} className={`card resultQuestion ${isRight ? "right" : "wrong"}`}>
                        <div>{targetQuestion.title}</div>
                        {isRight && <div>{targetQuestion.options[0].text}</div>}
                        {!isRight && <><span>{targetQuestion.options[0].text}</span>, а не <span>{targetQuestion.options.filter(o => o.uuid === q.answerUUID)[0].text}</span></>}
                    </div>)
                }
            )}
            </div>
            <button onClick={() => {window.location.hash = PAGE.HOME}}>test again</button>
        </div>
    </>
}