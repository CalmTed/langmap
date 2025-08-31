//page will have
// timer
// progress bar
// cansel test with confirmation (showing confirmation will not stop timer)
// start the test now button(page)
// next part button: separate pages for defferent parts (~20 questions) 
// return button
// last part will show finish button


import { useEffect } from "react"
import { PAGE } from "../constants"
import { selectState, setTasks, updateTask, useAppDispatch, useAppSelector } from "../store"
import { go } from "../go"

export const TestPage = () => {
    const state = useAppSelector(selectState)
    const dispatch = useAppDispatch()
    
    useEffect(() =>{
        if(state.activeTasks.length === 0){
            go(PAGE.HOME)
        }
    },[])

    const handleAnswer: (taskUUID: string, answerUUID: string) => void = (taskUUID, answerUUID) => {
        dispatch(updateTask({taskUUID, answerUUID}))
    }

    const handleCancel = () => {
        dispatch(setTasks([]))
        go(PAGE.HOME)
    }

    const handleFinish = () => {
        //dont save results just now
        go(PAGE.FINISHING)
    }

    const canFinish = state.activeTasks.filter(t => typeof t.answerUUID === "undefined").length === 0
    return <>
        <div>
            <h1>testing</h1>
            <p></p>
            {
                state.activeTasks.map((t,i) => <div key={t.uuid} className="taskItem card">
                    <div className="taskTitle">{i+1}{". "}{t.questionText}</div>
                    <div className="taskOptionsList">{
                        t.questionOptions.map(o => <button key={o.uuid} onClick={() => handleAnswer(t.uuid,o.uuid)} className={`taskOption ${t.answerUUID === o.uuid ? "selected" : ""}`}>{o.text}</button>) 
                    }</div>
                </div>)
            }
            <button onClick={handleCancel}>cancel testing</button>
            <button onClick={handleFinish} disabled={!canFinish}>finish</button>
        </div>
    </>
}