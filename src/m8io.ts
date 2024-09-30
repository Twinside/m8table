import { Midi } from "./midi";
import { never } from "./model";

/** Sequencer command */
export enum M8SequencerCommand {
	DEL = "DEL",
	HOP = "HOP",
	RET = "RET",
	REP = "REP",
	RTO = "RTO",
	TIC = "TIC"
}

/** Global instrument command shared between instruments */
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

/** Wavesynth specific commands */
export enum M8WaveSynthCommand {
	SIZ = "SIZ",
	MUL = "MUL",
	SCN = "SCN",
	WRP = "WRP"
}

/** FM specific comments */
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
	| { ty: "SEQ", code: M8SequencerCommand, value: number }
	| { ty: "GLO", code: M8GlobalCommand, value: number }
	| { ty: "WAV", code: M8WaveSynthCommand, value: number }
	| { ty: "FM", code: M8FMSynthCommand, value: number }
	| { ty: "MA", code: M8MacroSynthCommand, value: number }
	| { ty: "HS", code: M8HyperSynthCommand, value: number }
	| { ty: "SA", code: M8SamplerCommand, value: number }

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

/** Put the cursor on the top left position  */
function* resetCommandView() : Iterable<M8UserCommand> {
    for (let i = 0; i < 7; i++) {
        yield M8UserCommand.Left; // on
        yield M8UserCommand.Left; // off
    }

    for (let i = 0; i < 15; i++) {
        yield M8UserCommand.Up; // on
        yield M8UserCommand.Up; // off
    }
}

/** Given a value between zero and 0xFF, create a sequence
 * of edit commands that can be used to write a value.
 */
function* setValue(v : number) : Iterable<M8UserCommand> {
    // reset value to zero
    yield M8UserCommand.Edit;
    yield M8UserCommand.Option;

    yield M8UserCommand.Edit;
    yield M8UserCommand.Option;


    yield M8UserCommand.Edit;

    const bigStepCount = ((v / 16) | 0) * 2;
    for (let i = 0; i < bigStepCount; i++) {
        yield M8UserCommand.Up;
    }

    const smallStepCount = (v & 0xF) * 2;
    for (let i = 0; i < smallStepCount; i++) {
        yield M8UserCommand.Right;
    }

    yield M8UserCommand.Edit;
}


/** Transform a script to edit command list, ready to be sent to the M8
 * via MIDI.
 */
function* CommandToWriteOrders(commands: Iterable<M8Command>) : Iterable<M8UserCommand> {
    const currentPos : Pos = { x: 0, y: 0 };
    let isFirst = true;

    for (const cmd of commands) {
        const toPos = PositionOfCommand(cmd);

        const dx = toPos.x - currentPos.x;
        const dy = toPos.y - currentPos.y;

        const hDir = dx < 0 ? M8UserCommand.Left : M8UserCommand.Right;
        const vDir = dy < 0 ? M8UserCommand.Up : M8UserCommand.Down;

        yield M8UserCommand.Edit;
        yield M8UserCommand.Up; // on
        yield M8UserCommand.Up; // off

        if (isFirst) {
            yield* resetCommandView();
            isFirst = false;
        }

        // repeat left once for left, once for right
        const repX = Math.abs(dx);
        for (let x = 0; x < 2 * repX; x++) {
            yield hDir;
        }

        const repY = Math.abs(dy);
        for (let y = 0; y < 2 * repY; y++) {
            yield vDir;
        }

        yield M8UserCommand.Edit; // off

        yield M8UserCommand.Right; //on
        yield M8UserCommand.Right; //off

        yield* setValue(cmd.value);

        yield M8UserCommand.Left; //on
        yield M8UserCommand.Left; //off

        yield M8UserCommand.Down; //on
        yield M8UserCommand.Down; //off

        currentPos.x = toPos.x;
        currentPos.y = toPos.y;
    }
}

/** Position of the command in the edit menu, in order
 * to be able to write it easily.
 */
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
			Midi.NoteOn(controlChannel, 0, 1),
			Midi.NoteOn(controlChannel, 1, 1),
			Midi.NoteOn(controlChannel, 2, 1),
			Midi.NoteOn(controlChannel, 3, 1),
			Midi.NoteOn(controlChannel, 4, 1),
			Midi.NoteOn(controlChannel, 5, 1),
			Midi.NoteOn(controlChannel, 6, 1),
			Midi.NoteOn(controlChannel, 7, 1)
		];

		this.NoteOffs = [
			Midi.NoteOff(controlChannel, 0, 0),
			Midi.NoteOff(controlChannel, 1, 0),
			Midi.NoteOff(controlChannel, 2, 0),
			Midi.NoteOff(controlChannel, 3, 0),
			Midi.NoteOff(controlChannel, 4, 0),
			Midi.NoteOff(controlChannel, 5, 0),
			Midi.NoteOff(controlChannel, 6, 0),
			Midi.NoteOff(controlChannel, 7, 0)
		];
	}

    public sendCommands(out: MIDIOutput, commands: Iterable<M8Command>) {
        this.sendUserCommands(out, CommandToWriteOrders(commands));
    }

	public sendUserCommands(out: MIDIOutput, commands: Iterable<M8UserCommand>) {
		let i = 0;
        const timeBetweenNotes = 15; // ms

		for (const command of commands) {
			const status = this.keyStates[command];
			// if key is up we want to set it down.
			const mapping = status
				? this.NoteOffs
				: this.NoteOns;

			this.keyStates[command] = !status;
			out.send(mapping[command], window.performance.now() + i * timeBetweenNotes);
			i++;
		}
	}
}
