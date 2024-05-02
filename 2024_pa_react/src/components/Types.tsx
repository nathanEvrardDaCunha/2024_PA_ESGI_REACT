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
    choices: Choice[];
}

export interface TopicFormProps {
    topic: Topic;
    onChange: (updatedTopic: Topic) => void;
}
