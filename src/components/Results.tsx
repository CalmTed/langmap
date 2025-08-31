import { useState, useEffect } from "react"
import { PAGE } from "../constants"
import { go } from "../go"
import { useAppSelector, selectState, useAppDispatch } from "../store"
import type { QuestionModel } from "../models"
import { A1Topics } from "../assets/A1"
import { A2Topics } from "../assets/A2"

export const ResultsPage = () => {
    const state = useAppSelector(selectState)
    const dispatch = useAppDispatch()
    const [ selectedResult, setSelectedResult ] = useState(0)
    
    useEffect(() => {
        if(state.results.length === 0 || !state.selectedName){
            go(PAGE.HOME)
        }
        if(state.activeTasks.filter(t => typeof t.answerUUID === "undefined").length > 0){
            go(PAGE.TEST)
        }
    },[])
    const resultsList = state.results.filter(r => r.name === state.selectedName)
    if(resultsList.length === 0){
        go(PAGE.HOME)
    }
    const selectedResults = resultsList[selectedResult]
    const allQuestions:QuestionModel[] = [...A1Topics,...A2Topics].map(t => t.questions).flat()
    
    return <>
        <div>
            <h1>Result</h1>
            <div>
                <canvas></canvas>
            </div>
            {resultsList.length > 1 && <div>
                {
                    resultsList.map((r,i) => (<button key={r.uuid} onClick={() => setSelectedResult(i)}>{i+1}</button>))
                }
            </div>}
            <div className="resultsList">
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