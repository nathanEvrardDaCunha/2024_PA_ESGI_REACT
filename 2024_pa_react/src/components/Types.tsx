export interface Choice {
    description: string;
}

export interface Topic {
    label: string;
    description: string;
    status: string;
    isAnonyme: boolean;
    modality: string;
    totalRounds: number;
    choices: Choice[];
    quorum: number;
}

export interface TopicFormProps {
    topic: Topic;
    onChange: (updatedTopic: Topic) => void;
}

export interface Question {
    label: string;
    type: QuestionType;
    options: string[];
}

export enum QuestionType {
    TEXT = 'TEXT',
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    CHECKBOX = 'CHECKBOX',
}

export interface Survey {
    title: string;
    description: string;
    questions: Question[];
}

export interface SurveyResponse {
    surveyId: string;
    respondentId: string;
    answers: Response[];
}

export interface Response {
    questionId: string;
    answer: string;
}

export interface GeneralAssembly {
    meetingDate: Date;
    status: string;
    outcome: string;
    creationDate: Date;
    endingDate: Date;
    topics: Topic[];
    surveys: Survey[];
}