/** Really light midi message formatter. */
export class Midi {
	public static readonly NoteOnCode : number = 0x90;
	public static readonly NoteOffCode : number = 0x80;
	public static readonly ControlChangeCode : number = 0xB0;

	public static NoteOn(chan : number, note : number, velocity: number) : number[] {
		return [Midi.NoteOnCode | (chan - 1), note, velocity];
	}

	public static NoteOff(chan : number, note : number, velocity: number) : number[] {
		return [Midi.NoteOffCode | (chan - 1), note, velocity];
	}

	public static ControlChange(chan : number, cc : number, value: number) : number[] {
		return [Midi.ControlChangeCode | (chan - 1), cc, value];
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
