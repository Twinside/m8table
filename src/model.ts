import { never } from "./helper";
import { IsFunctionRelative, M8Builder, M8Command } from "./m8io";

/** Main definition of what we're trying to represent */
export type Segment =
    {
        /** How much do we increase or decrease value on all steps */
        Amount: number,

        /** Duration of the segment in TIC, tic duration can vary. */
        TicDuration: number
    }

/** Free form shape, defined by afine segments */
export type FreeFormMacro =
    {
        /** List of segments of the shape */
        Segments: Segment[],
        /** Are we looping? */
        Loop: boolean
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

    if (!IsFunctionRelative(parameter)) {
        yield* renderFreeSegments(parameter, {
            Segments: [
                {
                    Amount: macro.Amount,
                    TicDuration: macro.AttackTics
                },
                {
                    Amount: -macro.Amount,
                    TicDuration: macro.DecayTics
                }
            ],
            Loop: macro.Loop
        });

        return;
    }

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

    if (!IsFunctionRelative(parameter)) {
        yield* renderFreeSegments(parameter, {
            Segments: [
                {
                    Amount: (macro.Amount / 2) | 0,
                    TicDuration: upDuration
                },
                {
                    Amount: -macro.Amount,
                    TicDuration: downDuration
                },
                {
                    Amount: (macro.Amount / 2) | 0,
                    TicDuration: upDuration
                },
            ],
            Loop: macro.Loop
        });

        return;
    }
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

    if (IsFunctionRelative(parameter)) {
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
    } else {
        const base = parameter.value;
        yield {...parameter, value: Math.min(255, (base + macro.Amount / 2) | 0)};
        if (phaseLength > 1) {
            yield M8Builder.DEL(phaseLength - 1);
            instruction_count++;
        }

        instruction_count++;
        yield {...parameter, value: Math.max(0, (base - macro.Amount / 2) | 0)};
        if (phaseLength > 1) {
            instruction_count++;
            yield M8Builder.DEL(phaseLength - 1);
        }

        if (macro.Loop) {
            yield M8Builder.HOP(0);
        } else {
            yield M8Builder.HOP(instruction_count);
        }
    }
}

function* renderSawUpLFO(parameter: M8Command, macro: LFOEnvMacro) : Iterable<M8Command> {
    let instruction_count = 2;

    if (IsFunctionRelative(parameter)) {
        const slope = (macro.Amount / macro.Duration) | 0;

        yield {...parameter, value: slope }

        if (macro.Duration > 1) {
            yield M8Builder.REP(macro.Duration);
            instruction_count++;
        }

        if (macro.Loop) {
            // LFO reset
            yield {...parameter, value: signed(macro.Amount) };
            yield M8Builder.HOP(0);
        } else {
            yield M8Builder.HOP(instruction_count);
        }
    } else if (macro.Duration <= 15) {
        for (let i = 0; i < macro.Duration; i++) {
            yield {...parameter, value: (parameter.value + macro.Amount * i / macro.Duration) | 0 }
        }

        if (macro.Loop) {
            yield M8Builder.HOP(0);
        } else {
            yield M8Builder.HOP(macro.Duration);
        }
    } else {
        const segmentCount = 7;
        const segmentIncrement = macro.Duration / segmentCount;
        let acc = segmentIncrement;
        
        for (let i = 0; i < segmentCount; i++) {
            yield {...parameter, value: (parameter.value + macro.Amount * i / segmentCount) | 0 }
            instruction_count++;
            if ((acc | 0) >= 1) {
                instruction_count++;
                yield M8Builder.DEL(acc | 0);
                acc = acc - (acc | 0);
            }
            acc += segmentIncrement;
        }

        if (macro.Loop) {
            yield M8Builder.HOP(0);
        } else {
            yield M8Builder.HOP(instruction_count);
        }
    }
}

function* renderSawDownLFO(parameter: M8Command, macro: LFOEnvMacro) : Iterable<M8Command> {
    let instruction_count = 2;

    if (IsFunctionRelative(parameter)) {
        const slope = (macro.Amount / macro.Duration) | 0;

        yield {...parameter, value: macro.Amount };
        yield {...parameter, value: signed(slope) }

        if (macro.Duration > 1) {
            yield M8Builder.REP(macro.Duration);
            instruction_count++;
        }

        if (macro.Loop) {
            yield M8Builder.HOP(0);
        } else {
            yield M8Builder.HOP(instruction_count);
        }
    } else if (macro.Duration <= 15) {
        for (let i = macro.Duration - 1; i >= 0; i--) {
            yield {...parameter, value: (parameter.value + macro.Amount * i / macro.Duration) | 0 }
        }

        if (macro.Loop) {
            yield M8Builder.HOP(0);
        } else {
            yield M8Builder.HOP(macro.Duration);
        }
    } else {
        const segmentCount = 7;
        const segmentIncrement = macro.Duration / segmentCount;
        let acc = segmentIncrement;
        
        for (let i = segmentCount - 1; i >= 0; i--) {
            yield {...parameter, value: (parameter.value + macro.Amount * i / segmentCount) | 0 }
            instruction_count++;
            if ((acc | 0) >= 1) {
                instruction_count++;
                yield M8Builder.DEL(acc | 0);
                acc = acc - (acc | 0);
            }
            acc += segmentIncrement;
        }

        if (macro.Loop) {
            yield M8Builder.HOP(0);
        } else {
            yield M8Builder.HOP(instruction_count);
        }
    }

}

function* renderFreeSegments(parameter: M8Command, macro: FreeFormMacro) : Iterable<M8Command> {
    let instruction_count = 0;

    if (IsFunctionRelative(parameter)) {
        for (const seg of macro.Segments) {
            if (seg.TicDuration <= 1) {
                yield {...parameter, value: seg.Amount < 0 ? signed(seg.Amount) : (seg.Amount | 0) };
                instruction_count++;
            } else if (seg.Amount !== 0) {
                const absValue = seg.Amount < 0
                    ? Math.abs(seg.Amount)
                    : seg.Amount;

                const slope = (absValue / seg.TicDuration) | 0;
                const signedSlope = seg.Amount < 0 ? signed(slope) : slope;
                yield {...parameter, value: signedSlope}
                yield M8Builder.REP(seg.TicDuration - 1);
                instruction_count += 2;
            } else {
                yield M8Builder.DEL(seg.TicDuration);
            }
        }

        if (macro.Loop) {
            yield M8Builder.HOP(0);
        } else {
            yield M8Builder.HOP(instruction_count);
        }
    } else {
        const fullTick = macro.Segments.reduce((a, seg) => a + (seg.Amount === 0 ? 1 : seg.TicDuration), 0)
        let accum = parameter.value;

        // full tick, we just write stuff on every step
        if (fullTick <= 0xF) {
            for (const seg of macro.Segments) {

                if (seg.TicDuration <= 1) {
                    accum += seg.Amount;
                    yield {...parameter, value: accum };
                    instruction_count++;
                } else if (seg.Amount !== 0) {

                    const slope = (seg.Amount / seg.TicDuration) | 0;
                    for (let i = 0; i < seg.TicDuration; i++) {
                        accum += slope;
                        yield {...parameter, value: accum | 0 }
                        instruction_count++;
                    }
                } else {
                    yield M8Builder.DEL(seg.TicDuration);
                    instruction_count++;
                }
            }

            if (macro.Loop) {
                yield M8Builder.HOP(0);
            } else {
                yield M8Builder.HOP(instruction_count);
            }

        } else {
            for (const seg of macro.Segments) {
                if (instruction_count >= 0xD) break;

                const steps = (seg.TicDuration * 7 / fullTick) | 0;
                if (steps <= 1) {
                    accum += seg.Amount;
                    yield {...parameter, value: accum };
                    instruction_count++;

                    if (seg.TicDuration > 1) {
                        yield M8Builder.DEL(seg.TicDuration);
                        instruction_count++;
                    }
                } else if (seg.Amount !== 0) {
                    const slope = (seg.Amount / steps) | 0;
                    for (let i = 0; i < steps; i++) {
                        accum += slope;
                        yield {...parameter, value: accum | 0 };
                        yield M8Builder.DEL((seg.TicDuration / steps) | 0);
                        instruction_count += 2;
                    }
                } else {
                    yield M8Builder.DEL(seg.TicDuration);
                    instruction_count++;
                }
            }

            if (macro.Loop) {
                yield M8Builder.HOP(0);
            } else {
                yield M8Builder.HOP(instruction_count);
            }
        }
    }
}


/** Generic LFO configuration */
export type LFOEnvMacro =
    {
        /** Duration in TICS */
        Duration: number,
        /** Amount (absolute). Value should oscillate around zero */
        Amount: number,
        /** Do we loop the LFO or one shot. */
        Loop: boolean
    }

/////////////////////////////////////////////////////////////////////////
//////  LFO
/////////////////////////////////////////////////////////////////////////

function lfoEnvFromQuery(params: URLSearchParams) : LFOEnvMacro | undefined{
    const durationStr = params.get(Keys.Duration);
    const amountStr = params.get(Keys.Amount);

    if (durationStr === null || amountStr === null) return undefined;

    const Duration = Number.parseInt(durationStr, 16);
    const Amount = Number.parseInt(amountStr, 16);
    const Loop = params.has(Keys.Loop);

    return { Duration, Amount, Loop }
}

function queryParamsFromLfo(macro: LFOEnvMacro, params: URLSearchParams) {
    params.append(Keys.Duration, macro.Duration.toString(16));
    params.append(Keys.Amount, macro.Amount.toString(16));

    if (macro.Loop)
        params.append(Keys.Loop, "1");
}

/////////////////////////////////////////////////////////////////////////
//////  Attack/Decay env
/////////////////////////////////////////////////////////////////////////
export namespace Keys {
    // General key
    export const Instrument = "ins";
    export const ValueTarget = "tgt";
    export const ValueTargetAmount = "tval";


    // Generator keys
    export const Kind = "knd";
    export const Attack = "att";
    export const Decay = "dec";
    export const Duration = "ln";
    export const Amount = "val";
    export const Sustain = "sus";
    export const SustainLevel = "susv";
    export const Release = "rel";
    export const Loop = "lop";

    export const SegCount = "segs";
}

function adEnvFromQuery(params : URLSearchParams) : AttackDecayEnvMacro | undefined {
    const attackStr = params.get(Keys.Attack);
    const decayStr = params.get(Keys.Decay);
    const amountStr = params.get(Keys.Amount);

    if (attackStr === null || decayStr == null || amountStr == null)
        return undefined;

    return {
        AttackTics: Number.parseInt(attackStr, 16),
        DecayTics: Number.parseInt(decayStr, 16),
        Amount: Number.parseInt(amountStr, 16),
        Loop: params.has(Keys.Loop)
    }
}

function querParamsFromAdEnv(macro: AttackDecayEnvMacro, params: URLSearchParams) {
    params.append(Keys.Attack, macro.AttackTics.toString(16));
    params.append(Keys.Decay, macro.DecayTics.toString(16));
    params.append(Keys.Amount, macro.Amount.toString(16));

    if (macro.Loop)
        params.append(Keys.Loop, "1");
}

/////////////////////////////////////////////////////////////////////////
//////  ADSR env
/////////////////////////////////////////////////////////////////////////

function adsrEnvFromQuery(params: URLSearchParams) : ADSREnvMacro | undefined {
    const attackStr = params.get(Keys.Attack);
    const sustainStr = params.get(Keys.SustainLevel);
    const sustainTicsStr = params.get(Keys.Sustain);
    const decayStr = params.get(Keys.Decay);
    const amountStr = params.get(Keys.Amount);
    const releaseStr = params.get(Keys.Release);

    if (attackStr === null || decayStr == null || amountStr == null ||
        sustainStr == null || releaseStr == null || sustainTicsStr == null)
        return undefined;

    return {
        AttackTics: Number.parseInt(attackStr, 16),
        DecayTics: Number.parseInt(decayStr, 16),
        SustainLevel: Number.parseInt(sustainStr, 16),
        SustainTics: Number.parseInt(sustainTicsStr, 16),
        Amount: Number.parseInt(amountStr, 16),
        ReleaseTics: Number.parseInt(releaseStr, 16),
        Loop: params.has(Keys.Loop)
    }
}

function queryParamFromAdsr(macro: ADSREnvMacro, params: URLSearchParams) {
    params.append(Keys.Attack, macro.AttackTics.toString(16));
    params.append(Keys.SustainLevel, macro.SustainLevel.toString(16));
    params.append(Keys.Sustain, macro.SustainTics.toString(16));
    params.append(Keys.Decay, macro.DecayTics.toString(16));
    params.append(Keys.Amount, macro.Amount.toString(16));
    params.append(Keys.Release, macro.ReleaseTics.toString(16));

    if (macro.Loop)
        params.append(Keys.Loop, "1");
}

/////////////////////////////////////////////////////////////////////////
//////  Free env
/////////////////////////////////////////////////////////////////////////

function queryParamsFromFree(macro: FreeFormMacro, params: URLSearchParams) {
    params.append(Keys.SegCount, macro.Segments.length.toString(16));

    for (let i = 0; i < macro.Segments.length; i++) {
        const seg = macro.Segments[i];
        params.append(`${Keys.Amount}${i.toString(16)}`, seg.Amount.toString(16));
        params.append(`${Keys.Duration}${i.toString(16)}`, seg.TicDuration.toString(16));
    }

    if (macro.Loop)
        params.append(Keys.Loop, "1");
}

function freeFromQuaryParams(params: URLSearchParams) : FreeFormMacro | undefined {
    const segCount = params.get(Keys.SegCount);
    if (segCount === null) return undefined;

    const count = Number.parseInt(segCount, 16);
    const segs : Segment[] = [];
    for (let i = 0; i < count; i++) {
        const amount = params.get(`${Keys.Amount}${i.toString(16)}`);
        const duration = params.get(`${Keys.Duration}${i.toString(16)}`);

        if (amount === null || duration === null)
            return undefined;

        segs.push({
            Amount: Number.parseInt(amount, 16),
            TicDuration: Number.parseInt(duration, 16)
        })
    }

    return {
        Segments: segs,
        Loop: params.has(Keys.Loop)
    };
}

/** Sum type representing all possible generators  */
export type SegmentMacro =
    | { kind:"ad_env", def: AttackDecayEnvMacro }
    | { kind:"adsr_env", def: ADSREnvMacro }
    | { kind:"tri_lfo", def: LFOEnvMacro }
    | { kind:"square_lfo", def: LFOEnvMacro }
    | { kind:"ramp_up_lfo", def: LFOEnvMacro }
    | { kind:"ramp_down_lfo", def: LFOEnvMacro }
    | { kind:"free", def:FreeFormMacro  }

export function MacroAsUrlQuery(macro: SegmentMacro) : URLSearchParams {
    const params = new URLSearchParams();
    params.append(Keys.Kind, macro.kind);

    const kind = macro.kind;
    switch (kind) {
        case "ad_env": querParamsFromAdEnv(macro.def, params); break;
        case "adsr_env": queryParamFromAdsr(macro.def, params); break;
        case "tri_lfo":
        case "square_lfo":
        case "ramp_up_lfo":
        case "ramp_down_lfo": queryParamsFromLfo(macro.def, params); break;
        case "free": queryParamsFromFree(macro.def, params); break;
        default:
            never(kind);
    }

    return params;

}

export function TryParseUrlMacro(params: URLSearchParams) : SegmentMacro | undefined {
    switch (params.get(Keys.Kind)) {
        case "ad_env": {
            const def = adEnvFromQuery(params);
            return def !== undefined ? { kind: "ad_env", def} : undefined;
        }
        case "adsr_env": {
            const def = adsrEnvFromQuery(params);
            return def !== undefined ? { kind: "adsr_env", def} : undefined;
        }
        case "tri_lfo": {
            const def = lfoEnvFromQuery(params);
            return def !== undefined ? { kind: "tri_lfo", def } : undefined;
        }
        case "square_lfo": {
            const def = lfoEnvFromQuery(params);
            return def !== undefined ? { kind: "square_lfo", def } : undefined;
        }
        case "ramp_up_lfo": {
            const def = lfoEnvFromQuery(params);
            return def !== undefined ? { kind: "ramp_up_lfo", def } : undefined;
        }
        case "ramp_down_lfo": {
            const def = lfoEnvFromQuery(params);
            return def !== undefined ? { kind: "ramp_down_lfo", def } : undefined;
        }
        case "free": {
            const def = freeFromQuaryParams(params);
            return def !== undefined ? { kind: "free", def } : undefined;
        }
        default:
            return undefined;
    }
}

export function RenderMacro(parameter: M8Command, macro: SegmentMacro) : Iterable<M8Command> {
    const kind = macro.kind;
    switch (kind) {
        case "ad_env": return renderAttackDecay(parameter, macro.def);
        case "adsr_env": return renderAdsr(parameter, macro.def);
        case "tri_lfo": return renderTriLfo(parameter, macro.def);
        case "square_lfo": return renderSquareLfo(parameter, macro.def);
        case "ramp_up_lfo": return renderSawUpLFO(parameter, macro.def);
        case "ramp_down_lfo": return renderSawDownLFO(parameter, macro.def);
        case "free": return renderFreeSegments(parameter, macro.def);
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
            return { kind: "free", def: { Segments: [{ Amount: 40, TicDuration: 10 }], Loop: false }};
    }
}
