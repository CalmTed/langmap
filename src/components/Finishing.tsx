import { useEffect, useState } from "react"
import { PAGE } from "../constants"
import { go } from "../go"
import { selectState, submitResults, useAppDispatch, useAppSelector } from "../store"

export const FinishingPage = () => {
    const [name, setName] = useState("")
    const state = useAppSelector(selectState)
    const dispatch = useAppDispatch()
    
    useEffect(() => {
        if(state.activeTasks.length === 0){
            go(PAGE.HOME)
        }
        if(state.activeTasks.filter(t => typeof t.answerUUID === "undefined").length > 0){
            go(PAGE.TEST)
        }
    },[])

    const handleFinish = () => {
        //save results with name
        dispatch(submitResults(name))
        go(PAGE.RESULT)
    }
    const nameValid = name.length >=3 
    return <>
        <div>
            <h1>Enter your name</h1>
            <div className="nameBlock">
                <input type="text" onChange={(e) => setName(e.target.value)} value={name} />
            </div>
            <button onClick={handleFinish} disabled={!nameValid}>show map</button>
        </div>
    </>
}