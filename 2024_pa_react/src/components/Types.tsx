// Types.ts
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
export interface GeneralAssembly {
    meetingDate: Date;
    status: string;
    outcome: string;
    creationDate: Date;
    endingDate: Date;
    topics: Topic[];
}