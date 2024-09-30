
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
