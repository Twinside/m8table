import { M8Command, M8Controller } from "./m8io";

/** Really light midi message formatter. */
export class Midi {
	public static readonly NoteOnCode : number = 0x90;
	public static readonly NoteOffCode : number = 0x80;

	public static NoteOn(chan : number, note : number, velocity: number) : number[] {
		return [Midi.NoteOnCode | (chan - 1), note, velocity];
	}

	public static NoteOff(chan : number, note : number, velocity: number) : number[] {
		return [Midi.NoteOffCode | (chan - 1), note, velocity];
	}
}

export function findFirstNamedOutputPort(midi : MIDIAccess | undefined, name: string) : MIDIOutput | undefined {
	if (midi === undefined) return undefined;

	for (const entry of midi.outputs) {
		const output = entry[1];
		if (output.name === name)
			return output;
	}

	return undefined;
}

export async function sendSequence(
	m8Port: MIDIOutput,
	controlChannel: number,
	script: M8Command[]) {

	await m8Port.open();

	const m8 = new M8Controller(controlChannel);
	m8.sendCommands(m8Port, script);
}
