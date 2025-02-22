export type Exercise = {
    id: number;
    description: string;
    image_url: string;
    sets?: Set[];
};

export type Set = {
    reps: number;
    weight: number;
    notes: string;
    rir: number;
    type: string;
};