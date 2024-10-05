import { computed, ReadonlySignal, Signal, signal } from "@preact/signals";
import { CommandsOfInstrument, M8Builder, M8Command, M8Instrument, ParseM8Instrument } from "./m8io";
import { Keys, FreshMacro, RenderMacro, SegmentMacro, TryParseUrlMacro } from "./model";

export type State =
    {
        current_instrument: Signal<M8Instrument>,
        current_parameter: Signal<M8Command>,
        current_macro: Signal<SegmentMacro>,
        script: ReadonlySignal<M8Command[]>
        midi: MIDIAccess | undefined,
        m8Channel: Signal<number>,
        m8port: Signal<string | undefined>
    }

function tryFindCommand(instr : M8Instrument, commandName : string) : M8Command | undefined {
    const commandGroups = CommandsOfInstrument[instr];

    for (const commands of commandGroups) {
        for (const command of commands) {
            if (command.code === commandName) {
                return command;
            }
        }
    }

    return undefined;
}

export function createState(midi: MIDIAccess | undefined) : State
{
    const params = new URL(document.location.href).searchParams;

    const instr = ParseM8Instrument(params.get(Keys.Instrument)) || "MA";
    const macro = TryParseUrlMacro(params) || FreshMacro(2);
    const defaultAmountStr = params.get(Keys.ValueTargetAmount);
    const value = defaultAmountStr !== null
        ? Math.max(0, Math.min(255, Number.parseInt(defaultAmountStr, 10)))
        : 80;

    const target = params.get(Keys.ValueTarget) || "CUT";
    const command = tryFindCommand(instr, target) || M8Builder.CUT(value);


    const current_parameter = signal({...command, value });
    const current_macro : Signal<SegmentMacro> = signal(macro);
    const script = computed(() =>
        [... RenderMacro(current_parameter.value, current_macro.value)]);

    return {
        current_instrument: signal(instr),
        current_parameter,
        current_macro,
        script,
        midi,
        m8Channel: signal(10),
        m8port: signal(undefined)
    };
}
