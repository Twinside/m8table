import { Midi } from "./midi";

export enum M8SequencerCommand {
	DEL = "DEL",
	HOP = "HOP",
	RET = "RET",
	REP = "REP",
	RTO = "RTO",
	TIC = "TIC"
}

export enum M8GlobalCommand {
	VOL = "VOL",
	PIT = "PIT",
	FIN = "FIN",
	CUT = "CUT",
	RES = "RES",
	AMP = "AMP",
	PAN = "PAN",
	DRY = "DRY",
	SCH = "SCH",
	SDL = "SDL",
	SRV = "SRV",
}

export enum M8WaveSynthCommand {
	SIZ = "SIZ",
	MUL = "MUL",
	SCN = "SCN",
	WRP = "WRP"
}

export enum M8FMSynthCommand {
	FM1 = "FM1",
	FM2 = "FM2",
	FM3 = "FM3",
	FM4 = "FM4",
}

export enum M8MacroSynthCommand {
	TBR = "TBR",
	COL = "COL",
	DEG = "DEG",
	RED = "RED"
}

export enum M8HyperSynthCommand {
	SHF = "SHF",
	SWM = "SWM",
	WID = "WID",
	SUB = "SUB"
}

export enum M8SamplerCommand {
	PLY = "PLY",
	STA = "STA",
	LOP = "LOP",
	LEN = "LEN",
	DEG = "DEG",
	SLI = "SLI"
}

const M8WaveSynthCommandPositions : { [ix in M8WaveSynthCommand] : Pos } = {
	SIZ: { x: 4, y: 4 },
	MUL: { x: 5, y: 4 },
	WRP: { x: 6, y: 4 },
	SCN: { x: 7, y: 4 },
}

const M8FMSynthCommandPositions : { [ix in M8FMSynthCommand] : Pos } = {
	FM1: { x: 4, y: 4 },
	FM2: { x: 5, y: 4 },
	FM3: { x: 6, y: 4 },
	FM4: { x: 7, y: 4 },
};

const M8HyperSynthCommandPositions : { [ix in M8HyperSynthCommand] : Pos } = {
	SHF: { x: 4, y: 4 },
	SWM: { x: 5, y: 4 },
	WID: { x: 6, y: 4 },
	SUB: { x: 7, y: 4 },
};

const M8SamplerSynthCommandPositions : { [ix in M8SamplerCommand] : Pos } = {
	PLY: { x: 3, y: 4 },
	STA: { x: 4, y: 4 },
	LOP: { x: 5, y: 4 },
	LEN: { x: 6, y: 4 },
	DEG: { x: 7, y: 4 },
	SLI: { x: 6, y: 5 },
};

const M8MacroSynthCommandPositions : { [ix in M8MacroSynthCommand] : Pos } = {
	TBR: { x: 4, y: 4 },
	COL: { x: 5, y: 4 },
	DEG: { x: 6, y: 4 },
	RED: { x: 7, y: 4 },
};

const M8SequencerCommandPositions : { [ix in M8SequencerCommand] : Pos } = {
	DEL: { x: 3, y: 0 },
	HOP: { x: 5, y: 0 },
	RET: { x: 0, y: 1 },
	REP: { x: 1, y: 1 },
	RTO: { x: 2, y: 1 },
	TIC: { x: 6, y: 2 }
} as const;

const M8GlobalCommandPositions : { [ix in M8GlobalCommand]: Pos } = {
	VOL: { x: 0, y: 4 },
	PIT: { x: 1, y: 4 },
	FIN: { x: 2, y: 4 },
	CUT: { x: 1, y: 5 },
	RES: { x: 2, y: 5 },
	AMP: { x: 3, y: 5 },
	PAN: { x: 5, y: 5 },
	DRY: { x: 0, y: 6 },
	SCH: { x: 1, y: 6 },
	SDL: { x: 2, y: 6 },
	SRV: { x: 3, y: 6 },
} as const;

export type M8Command =
	| { ty: "SEQ", code: M8SequencerCommand }
	| { ty: "GLO", code: M8GlobalCommand }
	| { ty: "WAV", code: M8WaveSynthCommand }
	| { ty: "FM", code: M8FMSynthCommand }
	| { ty: "MA", code: M8MacroSynthCommand }
	| { ty: "HS", code: M8HyperSynthCommand }
	| { ty: "SA", code: M8SamplerCommand }

function never(_: never) : never {
	throw 'never';
}

export function PositionOfCommand(cmd: M8Command) : Pos {
	const ty = cmd.ty;

	switch (ty) {
		case "SEQ": return M8SequencerCommandPositions[cmd.code];
		case "GLO": return M8GlobalCommandPositions[cmd.code];
		case "WAV": return M8WaveSynthCommandPositions[cmd.code];
		case "FM": return M8FMSynthCommandPositions[cmd.code];
		case "MA": return M8MacroSynthCommandPositions[cmd.code];
		case "HS": return M8HyperSynthCommandPositions[cmd.code];
		case "SA": return M8SamplerSynthCommandPositions[cmd.code];
		default:
			return never(ty);
	}
}

export type Pos = { x: number, y: number }

export enum M8UserCommand {
	Play = 0,
	Shift = 1,
	Edit = 2,
	Option = 3,
	Left = 4,
	Right = 5,
	Up = 6,
	Down = 7
}

/** Class in charge of formatting various m8 commands and sending them off properly */
export class M8Controller {
	public readonly PlayOn : number[];
	public readonly PlayOff : number[];

	public readonly ShiftOn : number[];
	public readonly ShiftOff : number[];

	public readonly EditOn : number[];
	public readonly EditOff : number[];

	public readonly OptionOn : number[];
	public readonly OptionOff : number[];

	public readonly LeftOn : number[];
	public readonly LeftOff : number[];

	public readonly RightOn : number[];
	public readonly RightOff : number[];

	public readonly UpOn : number[];
	public readonly UpOff : number[];

	public readonly DownOn : number[];
	public readonly DownOff : number[];

	private readonly NoteOns : number[][];
	private readonly NoteOffs : number[][];

	private readonly keyStates : boolean[];

	public constructor(
		public readonly controlChannel: number) {

		this.keyStates = [
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false
		];

		this.NoteOns = [
			this.PlayOn = Midi.NoteOn(controlChannel, 0, 1),
			this.ShiftOn = Midi.NoteOn(controlChannel, 1, 1),
			this.EditOn = Midi.NoteOn(controlChannel, 2, 1),
			this.OptionOn = Midi.NoteOn(controlChannel, 3, 1),
			this.LeftOn = Midi.NoteOn(controlChannel, 4, 1),
			this.RightOn = Midi.NoteOn(controlChannel, 5, 1),
			this.UpOn = Midi.NoteOn(controlChannel, 6, 1),
			this.DownOn = Midi.NoteOn(controlChannel, 7, 1)
		];

		this.NoteOffs = [
			this.PlayOff = Midi.NoteOff(controlChannel, 0, 1),
			this.ShiftOff = Midi.NoteOff(controlChannel, 1, 1),
			this.EditOff = Midi.NoteOff(controlChannel, 2, 1),
			this.OptionOff = Midi.NoteOff(controlChannel, 3, 1),
			this.LeftOff = Midi.NoteOff(controlChannel, 4, 1),
			this.RightOff = Midi.NoteOff(controlChannel, 5, 1),
			this.UpOff = Midi.NoteOff(controlChannel, 6, 1),
			this.DownOff = Midi.NoteOff(controlChannel, 7, 1)
		];
	}

	public sendCommands(out: MIDIOutput, commands: Iterable<M8UserCommand>) {
		let i = 0;

		for (const command of commands) {
			const status = this.keyStates[command];
			// if key is up we want to set it down.
			const mapping = status
				? this.NoteOffs
				: this.NoteOns;

			this.keyStates[command] = !status;
			out.send(mapping[command], window.performance.now() + i * 40.0);
			i++;
		}
	}
}
