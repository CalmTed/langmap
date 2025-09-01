import type { INTERFACE_LANG, LANG_LEVEL, TESTS_LANG } from "./constants";

export interface AppState{
    version: string,
    interfaceLang: INTERFACE_LANG,
    testsLang: TESTS_LANG,
    lastUpdate: number,
    activeTasks: TaskModel[],
    results: ResultsModel[],
    testingStartTime: number,
    selectedName: string | undefined
}

export interface TopicModel{
    uuid: string,
    level: LANG_LEVEL,
    title: string,
    description?: string,
    questions: QuestionModel[],
}

export interface QuestionModel{
    uuid: string,
    topicUUID: string,
    title: string, 
    level: LANG_LEVEL,
    expectedTimeSec: number,
    options: OptionModel[],
}

export interface OptionModel{
    uuid: string,
    text: string
}

export interface TaskModel{
    uuid: string,
    questionUUID: string,
    questionText: string,
    questionOptions: OptionModel[],
    answerUUID: string | undefined,
    answerTime: number | undefined
}

export interface ResultsModel{
    uuid: string,
    name: string,
    timeStart: number,
    timeFinish: number,
    language: TESTS_LANG,
    questions: ResultQuestionModel[],
}

export interface ResultQuestionModel{
    uuid: string,
    appVersion: string,//in case of long time storage
    questionUUID: string,
    answerUUID: string,
    timeOfAnswer: number,
}

export type MapData = {
    topicUUID: string,
    lanquageLevel: LANG_LEVEL,
    correctness: number, //-1 > 0 > 1
}