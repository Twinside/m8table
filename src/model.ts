import { Signal, signal } from "@preact/signals";

/** Main definition of what we're trying to represent */
export type Segment =
    {
        /** How much do we increase or decrease a value each step */
        Increment: number,

        /** Duration of the segment in TIC, tic duration can vary. */
        TicDuration: number
    }

export type AttackDecayEnvMacro =
    {
        AttackTics: number,
        DecayTics: number,
        Loop: boolean
    }

export type TriLFOEnvMacro =
    {
        AttackTics: number,
        DecayTics: number,
        Loop: boolean
    }

export type SegmentMacro =
    | { kind:"ad_env", def: AttackDecayEnvMacro }
    | { kind:"tri_lfo", def: TriLFOEnvMacro }
    | { kind:"free"}

export type State =
    {
        current_macro: Signal<SegmentMacro | undefined>,
        current_segments: Signal<Segment[]>
    }

export const createState : () => State = () =>
    ({
        current_segments: signal([]),
        current_macro: signal(undefined)
    });

type Action =
    | { kind: "update_macro", def: SegmentMacro | undefined }
    | { kind: "update_segments", def: Segment[] }

export function never(_: never) : never {
	throw 'never';
}

export const reducer = (state : State, act : Action) => {
    const kind = act.kind;

    switch (kind)
    {
        case "update_macro": return { ...state, current_macro: act.def };
        case "update_segments": return { ...state, current_segments: act.def }
        default: never(kind);
    }

}