import { M8Builder, M8Command } from "./m8io";
import { never } from "./state";

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

export type ADSREnvMacro =
    {
        AttackTics: number,
        DecayTics: number,
        SustainTics: number,
        SustainLevel: number,
        ReleaseTics: number,
        Amount: number,
        Loop: boolean
    }

function* renderAttackDecay(
    parameter: M8Command,
    macro: AttackDecayEnvMacro) : Iterable<M8Command> {

    let instructionCount = 0;

    if (macro.AttackTics === 0) {
        yield {...parameter, value: macro.Amount };
        instructionCount++;
    } else {
        const attackSlope = (macro.Amount / macro.AttackTics) | 0;
        yield {...parameter, value: attackSlope};
        instructionCount ++;

        if (macro.AttackTics > 1) {
            yield M8Builder.REP(macro.AttackTics - 1);
            instructionCount++;
        }

    }

    if (macro.DecayTics === 0) {
        yield {...parameter, value: signed(macro.Amount) };
        instructionCount++;
    } else {
        const decaySlope = (macro.Amount / macro.DecayTics) | 0;
        yield {...parameter, value: signed(decaySlope)};
        instructionCount++;

        if (macro.DecayTics > 1) {
            instructionCount++;
            yield M8Builder.REP(macro.DecayTics - 1);
        }

    }

    if (macro.Loop) {
        yield M8Builder.HOP(0);
    } else {
        yield M8Builder.HOP(instructionCount);
    }
}

function* renderAdsr(
    parameter: M8Command,
    macro: ADSREnvMacro) : Iterable<M8Command> {

    let instructionCount = 0;

    if (macro.AttackTics === 0) {
        yield {...parameter, value: macro.Amount };
        instructionCount++;
    } else {
        const attackSlope = (macro.Amount / macro.AttackTics) | 0;
        yield {...parameter, value: attackSlope};
        instructionCount ++;

        if (macro.AttackTics > 1) {
            yield M8Builder.REP(macro.AttackTics - 1);
            instructionCount++;
        }

    }

    const sustainDelta = macro.Amount - macro.SustainLevel;

    if (macro.DecayTics === 0) {
        yield {...parameter, value: signed(sustainDelta) };
        instructionCount++;
    } else {
        const decaySlope = (sustainDelta / macro.DecayTics) | 0;
        yield {...parameter, value: signed(decaySlope)};
        instructionCount++;

        if (macro.DecayTics > 1) {
            instructionCount++;
            yield M8Builder.REP(macro.DecayTics - 1);
        }
    }

    yield M8Builder.DEL(macro.SustainTics);
    instructionCount++;

    if (macro.ReleaseTics > 0) {
        const releaseSlope = (macro.SustainLevel / macro.ReleaseTics) | 0;
        yield {...parameter, value: signed(releaseSlope) };
        instructionCount++;

        if (macro.ReleaseTics > 1) {
            instructionCount++;
            yield M8Builder.REP(macro.ReleaseTics - 1);
        }
    } else {
        yield {...parameter, value: signed(macro.SustainLevel) };
        instructionCount++;
    }

    if (macro.Loop) {
        yield M8Builder.HOP(0);
    } else {
        yield M8Builder.HOP(instructionCount);
    }
}

function signed(v : number) : number {
    return (0xFF - v + 1) % 0x100;
}
function* renderTriLfo(parameter: M8Command, macro: LFOEnvMacro) {
    const upDuration = (macro.Duration / 4) | 0;
    const downDuration = (macro.Duration / 2) | 0;

    const slope = (macro.Amount / (macro.Duration / 2)) | 0;
    let instruction_count = 3;

    yield {...parameter, value: slope};
    if (upDuration > 1) {
        yield M8Builder.REP(upDuration - 1);
        instruction_count++;
    }

    yield {...parameter, value: signed(slope) };
    if (downDuration > 1) {
        yield M8Builder.REP(downDuration - 1);
        instruction_count++;
    }
    
    yield {...parameter, value: slope};
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

function* renderSquareLfo(parameter: M8Command, macro: LFOEnvMacro) {
    const phaseLength = (macro.Duration / 2) | 0;

    let instruction_count = 1;

    yield {...parameter, value: (macro.Amount / 2) | 0};
    if (phaseLength > 1) {
        yield M8Builder.DEL(phaseLength - 1);
        instruction_count++;
    }

    instruction_count++;
    yield {...parameter, value: signed(macro.Amount)};
    if (phaseLength > 1) {
        instruction_count++;
        yield M8Builder.DEL(phaseLength - 1);
    }

    instruction_count++;
    yield {...parameter, value: macro.Amount};
    if (phaseLength > 1) {
        instruction_count++;
        yield M8Builder.DEL(phaseLength - 1);
    }

    if (macro.Loop) {
        yield M8Builder.HOP(phaseLength > 1 ? 2 : 1);
    } else {
        yield M8Builder.HOP(instruction_count);
    }
}

function* renderSawLFO(parameter: M8Command, macro: LFOEnvMacro, downward: boolean) {
    let instruction_count = 2;

    const slope = (macro.Amount / macro.Duration) | 0;

    if (downward) {
        yield {...parameter, value: macro.Amount };
        yield {...parameter, value: signed(slope) }
    }
    else {
        yield {...parameter, value: slope }
    }

    if (macro.Duration > 1) {
        yield M8Builder.REP(macro.Duration);
        instruction_count++;
    }

    if (macro.Loop) {
        if (!downward) {
            // LFO reset
            yield {...parameter, value: signed(macro.Amount) };
        }

        yield M8Builder.HOP(0);
    } else {
        yield M8Builder.HOP(instruction_count);
    }
}

export type LFOEnvMacro =
    {
        Duration: number,
        Amount: number,
        Loop: boolean
    }

export type SegmentMacro =
    | { kind:"ad_env", def: AttackDecayEnvMacro }
    | { kind:"adsr_env", def: ADSREnvMacro }
    | { kind:"tri_lfo", def: LFOEnvMacro }
    | { kind:"square_lfo", def: LFOEnvMacro }
    | { kind:"ramp_up_lfo", def: LFOEnvMacro }
    | { kind:"ramp_down_lfo", def: LFOEnvMacro }
    | { kind:"free"}

export function RenderMacro(parameter: M8Command, macro: SegmentMacro) : Iterable<M8Command> {
    const kind = macro.kind;
    switch (kind) {
        case "ad_env": return renderAttackDecay(parameter, macro.def);
        case "adsr_env": return renderAdsr(parameter, macro.def);
        case "tri_lfo": return renderTriLfo(parameter, macro.def);
        case "square_lfo": return renderSquareLfo(parameter, macro.def);
        case "ramp_up_lfo": return renderSawLFO(parameter, macro.def, false);
        case "ramp_down_lfo": return renderSawLFO(parameter, macro.def, true);
        case "free": return [];
        default:
            never(kind);
    }
}

export const SegmentKindIndex : { [ix in SegmentMacro["kind"]]: number } =
    {
        free: 0,
        ad_env: 1,
        adsr_env: 2,
        tri_lfo: 3,
        square_lfo: 4,
        ramp_up_lfo: 5,
        ramp_down_lfo: 6,
    } as const;

export function FreshMacro(ix: number) : SegmentMacro {
    switch (ix) {
        case 1:
            return { kind: "ad_env", def: { AttackTics: 0, DecayTics: 10, Amount: 0x30, Loop: false }}
        case 2:
            return { kind: "adsr_env", def: { AttackTics: 7, DecayTics: 5, SustainTics: 29, ReleaseTics: 8, SustainLevel: 59, Amount: 0x50, Loop: false }}
        case 3:
            return { kind: "tri_lfo", def: { Duration: 40, Amount: 62, Loop: true }}
        case 4:
            return { kind: "square_lfo", def: { Duration: 40, Amount: 62, Loop: true }}
        case 5:
            return { kind: "ramp_up_lfo", def: { Duration: 22, Amount: 77, Loop: true }}
        case 6:
            return { kind: "ramp_down_lfo", def: { Duration: 22, Amount: 47, Loop: true }}
        case 0:
        default:
            return { kind: "free" };
    }
}
