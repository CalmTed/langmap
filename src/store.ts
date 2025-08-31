import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { AppState, ResultsModel, TaskModel } from './models'
import { INTERFACE_LANG, TESTS_LANG } from './constants'
import { version } from "../package.json"
import { uuidv4 } from './uuid'

const initialState: AppState = {
    version: version,
    interfaceLang: INTERFACE_LANG.UA,
    testsLang: TESTS_LANG.EN,
    lastUpdate: 0,
    results: [],
    activeTasks: [],
    testingStartTime: 0,
    selectedName: undefined
}

const generalSlice = createSlice({
    name: "general",
    initialState,
    reducers: {
        setInterfaceLang: (state, action: PayloadAction<INTERFACE_LANG>) => {
            state.interfaceLang = action.payload;
            state.lastUpdate = new Date().getTime();
        },
        setTestingLang: (state, action: PayloadAction<INTERFACE_LANG>) => {
            state.interfaceLang = action.payload;
            state.lastUpdate = new Date().getTime();
        },
        setTasks: (state, action: PayloadAction<TaskModel[]>) => {
            state.activeTasks = action.payload;
            if(action.payload.length > 0){
                state.testingStartTime = new Date().getTime()
            }
            state.lastUpdate = new Date().getTime();
        },
        updateTask: (state, action: PayloadAction<{ taskUUID: string, answerUUID: string }>) => {
            state.activeTasks = state.activeTasks.map(t => t.uuid === action.payload.taskUUID ? { ...t, answerUUID: action.payload.answerUUID, answerTime: new Date().getTime() } as TaskModel : t)
            state.lastUpdate = new Date().getTime();
        },
        submitResults: (state, action: PayloadAction<string>) => {
            const results: ResultsModel = {
                uuid: uuidv4(),
                name: action.payload,
                timeStart: state.testingStartTime,
                timeFinish: state.activeTasks.map(t => t.answerTime).sort((a,b) => (b || 0) - (a || 0))?.[0] || 0,
                language: TESTS_LANG.EN,
                questions: state.activeTasks.map(t => ({
                    uuid: t.uuid,
                    appVersion: state.version,
                    questionUUID: t.questionUUID,
                    answerUUID: t.answerUUID || "",
                    timeOfAnswer: t.answerTime || 0,   
                }))
            }
            state.results = [...state.results, results];
            state.activeTasks = [];
            state.selectedName = action.payload;
            state.testingStartTime = 0;
            state.lastUpdate = new Date().getTime();
        }
    }
})

const generalReducer = generalSlice.reducer

export const store = configureStore({
    reducer: {
        general: generalReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const selectState = (state: RootState) => state.general
export const { setInterfaceLang, setTestingLang, setTasks, submitResults, updateTask } = generalSlice.actions
