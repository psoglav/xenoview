export type MarkType = 'primary' | 'secondary' | 'default';
export type MarkLineType = 'dashed' | 'solid';
export interface MarkModel {
    type: MarkType;
    color: string;
    bg?: string;
    text: string;
    x: number;
    y: number;
    line?: MarkLineType;
    fullWidth?: boolean;
}
