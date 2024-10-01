import { computed, ReadonlySignal, Signal, signal } from "@preact/signals";
import { M8Builder, M8Command, M8Instrument } from "./m8io";
import { FreshMacro, RenderMacro, Segment, SegmentMacro } from "./model";

export type State =
    {
        current_instrument: Signal<M8Instrument>,
        current_parameter: Signal<M8Command>,
        current_macro: Signal<SegmentMacro>,
        current_segments: Signal<Segment[]>,
        script: ReadonlySignal<M8Command[]>
        midi: MIDIAccess | undefined
    }

export function createState(midi: MIDIAccess | undefined) : State
{
    const current_parameter = signal(M8Builder.CUT(0));
    const current_macro : Signal<SegmentMacro> = signal(FreshMacro(2));
    const script = computed(() =>
        [... RenderMacro(current_parameter.value, current_macro.value)]);

    return {
        current_instrument: signal("MA"),
        current_parameter,
        current_segments: signal([]),
        current_macro,
        script,
        midi
    };
}

export function never(_: never) : never {
	throw 'never';
}