//home page will have
// animated? map bg
// name
// description
// selector
    //language seledctor
    // number of tests - time - % of all topics - % assurance(several question for each topic)
    // lang levels (A1-C1) to not to test what they dont
// show localy saved results
// privacy policy - will analitics send data for stats????

import { useEffect, useState } from "react";
import { LANG_LEVEL, PAGE } from "../constants"
import { go } from "../go";
import type { QuestionModel, TaskModel, TopicModel } from "../models";
import { selectState, setTasks, useAppDispatch, useAppSelector } from "../store";
import { uuidv4 } from "../uuid";
import { questionsEN } from "../assets/en";
import { A1Topics } from "../assets/en/A1";
import { A2Topics } from "../assets/en/A2";

export const HomePage = () => {
    const state = useAppSelector(selectState)
    const dispatch = useAppDispatch()
    const [questionNumber, setQuestionNumber] = useState(10)

    const levelRange = [LANG_LEVEL.A1, LANG_LEVEL.A2];
    const generateTask: (q:QuestionModel) => TaskModel = (q) => {
        const newTask: TaskModel = {
            uuid: uuidv4(),
            questionUUID: q.uuid,
            questionText: q.title,
            questionOptions: shuffle(q.options),
            answerUUID: undefined,
            answerTime: undefined
        }
        return newTask;
    }
    const shuffle = (array: any[]) => {
        return array.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    }

    useEffect(() => {
        if(state.activeTasks.length > 0){
            go(PAGE.TEST)
        }
    }, [])

    const allQuestions:QuestionModel[] = questionsEN;
    const rightLevelTopics:TopicModel[] = [
        ...(levelRange.includes(LANG_LEVEL.A1) ? A1Topics : []),
        ...(levelRange.includes(LANG_LEVEL.A2) ? A2Topics : []),
    ]
    const allSelectedQuestions:QuestionModel[] = rightLevelTopics.map(t => t.questions).flat()
    const limitedAndRandomizedQuestions: QuestionModel[] = shuffle(allSelectedQuestions).slice(0,questionNumber)
    const min = 5;
    const max = allQuestions.length;
    const approxTime = limitedAndRandomizedQuestions.map(q => q.expectedTimeSec).reduce((partialSum, a) => partialSum + a, 0) / 60;

    const handleQuestionNumberChange = (number: string) => {
        
        if(isNaN(parseInt(number))){
            return;
        }
        if(parseInt(number) > max){
            setQuestionNumber(max)
        }
        if(parseInt(number) < min){
            setQuestionNumber(min)
        }
        setQuestionNumber(parseInt(number))
    }

    const handleTestStart = () => {
        
        //generate and add to active tasks
        const tasks = limitedAndRandomizedQuestions.map(q => generateTask(q))
        dispatch(setTasks(tasks))

        //switch location
        go(PAGE.TEST)
    }
    return <>
        <div>
            <h1>Карта знання англійської мови</h1>
            <p>Дай відповіді на запитання і подвись які граматичні правила ти знаєш найкраще</p>
            <div>Кількість питань: <input type="number" min={min} max={max} value={questionNumber} onChange={(e) => handleQuestionNumberChange(e.target.value)} /></div>
            <div>Це займе приблизно: {Math.round(approxTime*10)/10} хв.</div>
            <button onClick={handleTestStart}>Почати тест</button>
        </div>
    </>
}