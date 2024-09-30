import { computed, ReadonlySignal, Signal, signal } from "@preact/signals";
import { IsFunctionRelative, M8Builder, M8Command } from "./m8io";

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
        Amount: number,
        Loop: boolean
    }

function* renderAttackDecay(
    parameter: M8Command,
    macro: AttackDecayEnvMacro) : Iterable<M8Command> {


    const isRelative = IsFunctionRelative(parameter);

    if (macro.AttackTics === 0) {
        yield {...parameter, value: macro.Amount };
    } else {
        const attackRepeat = (macro.Amount / macro.AttackTics) | 0;
        yield {...parameter, value: attackRepeat};
        yield M8Builder.REP(macro.AttackTics);
    }
}

function* renderTriLfo(
    parameter: M8Command,
    macro: TriLFOEnvMacro) {

    // const isRelative = IsFunctionRelative(parameter);

    const upDuration = (macro.Duration / 4) | 0;
    const downDuration = (macro.Duration / 2) | 0;

    const attackRepeat = (macro.Amount / (macro.Duration / 2)) | 0;
    let instruction_count = 3;

    yield {...parameter, value: attackRepeat};
    if (upDuration > 1) {
        yield M8Builder.REP(upDuration - 1);
        instruction_count++;
    }

    yield {...parameter, value: (0xFF - attackRepeat + 1) % 0x100 };
    if (downDuration > 1) {
        yield M8Builder.REP(downDuration - 1);
        instruction_count++;
    }
    
    yield {...parameter, value: attackRepeat};
    if (upDuration > 1) {
        yield M8Builder.REP(upDuration - 1);
        instruction_count++;
    }

    if (macro.Loop) {
        yield M8Builder.HOP(0);
    } else {
        yield M8Builder.HOP(instruction_count);
    }
}

export type TriLFOEnvMacro =
    {
        Duration: number,
        Amount: number,
        Loop: boolean
    }

export type SegmentMacro =
    | { kind:"ad_env", def: AttackDecayEnvMacro }
    | { kind:"tri_lfo", def: TriLFOEnvMacro }
    | { kind:"free"}

export function RenderMacro(parameter: M8Command, macro: SegmentMacro) : Iterable<M8Command> {
    const kind = macro.kind;
    switch (kind) {
        case "ad_env": return renderAttackDecay(parameter, macro.def);
        case "tri_lfo": return renderTriLfo(parameter, macro.def);
        case "free": return [];
        default:
            never(kind);
    }
}

export const SegmentKindIndex : { [ix in SegmentMacro["kind"]]: number } =
    {
        free: 0,
        ad_env: 1,
        tri_lfo: 2
    } as const;

export function FreshMacro(ix: number) : SegmentMacro {
    switch (ix) {
        case 1:
            return { kind: "ad_env", def: { AttackTics: 0, DecayTics: 10, Amount: 0xFF, Loop: false }}
        case 2:
            return { kind: "tri_lfo", def: { Duration: 16, Amount: 10, Loop: true }}
        case 0:
        default:
            return { kind: "free" };
    }
}

export type State =
    {
        current_parameter: Signal<M8Command>,
        current_macro: Signal<SegmentMacro>,
        current_segments: Signal<Segment[]>,
        script: ReadonlySignal<M8Command[]>
    }

export const createState : () => State = () =>
{
    const current_parameter = signal(M8Builder.CUT(0));
    const current_macro : Signal<SegmentMacro> = signal({kind: "free"});
    const script = computed(() =>
        [... RenderMacro(current_parameter.value, current_macro.value)]);

    return {
        current_parameter,
        current_segments: signal([]),
        current_macro,
        script
    };
}

export function never(_: never) : never {
	throw 'never';
}
