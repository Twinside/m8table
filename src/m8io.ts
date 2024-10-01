import { Midi } from "./midi";
import { never } from "./state";

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

type Rel = { relative: boolean };

// TODO: check all relatives!
const M8WaveSynthCommandPositions : { [ix in M8WaveSynthCommand] : Pos & Rel } = {
    SIZ: { x: 4, y: 4, relative: true },
	MUL: { x: 5, y: 4, relative: true },
	WRP: { x: 6, y: 4, relative: true },
	SCN: { x: 7, y: 4, relative: true },
}

const M8FMSynthCommandPositions : { [ix in M8FMSynthCommand] : Pos & Rel } = {
	FM1: { x: 4, y: 4, relative: true },
	FM2: { x: 5, y: 4, relative: true },
	FM3: { x: 6, y: 4, relative: true },
	FM4: { x: 7, y: 4, relative: true },
};

const M8HyperSynthCommandPositions : { [ix in M8HyperSynthCommand] : Pos & Rel } = {
	SHF: { x: 4, y: 4, relative: true },
	SWM: { x: 5, y: 4, relative: true },
	WID: { x: 6, y: 4, relative: true },
	SUB: { x: 7, y: 4, relative: true },
};

const M8SamplerSynthCommandPositions : { [ix in M8SamplerCommand] : Pos & Rel } = {
	PLY: { x: 3, y: 4, relative: false },
	STA: { x: 4, y: 4, relative: false },
	LOP: { x: 5, y: 4, relative: false },
	LEN: { x: 6, y: 4, relative: false },
	DEG: { x: 7, y: 4, relative: false },
	SLI: { x: 6, y: 5, relative: false },
};

const M8MacroSynthCommandPositions : { [ix in M8MacroSynthCommand] : Pos & Rel } = {
	TBR: { x: 4, y: 4, relative: true },
	COL: { x: 5, y: 4, relative: true },
	DEG: { x: 6, y: 4, relative: true },
	RED: { x: 7, y: 4, relative: true },
};

const M8SequencerCommandPositions : { [ix in M8SequencerCommand] : Pos & Rel} = {
	DEL: { x: 3, y: 0, relative: false },
	HOP: { x: 5, y: 0, relative: false },
	RET: { x: 0, y: 1, relative: false },
	REP: { x: 1, y: 1, relative: false },
	RTO: { x: 2, y: 1, relative: false },
	TIC: { x: 6, y: 2, relative: false }
} as const;

const M8GlobalCommandPositions : { [ix in M8GlobalCommand]: Pos & Rel } = {
	VOL: { x: 0, y: 4, relative: true },
	PIT: { x: 1, y: 4, relative: true },
	FIN: { x: 2, y: 4, relative: true },
	CUT: { x: 1, y: 5, relative: true },
	RES: { x: 2, y: 5, relative: true },
	AMP: { x: 3, y: 5, relative: true },
	PAN: { x: 5, y: 5, relative: true },
	DRY: { x: 0, y: 6, relative: false },
	SCH: { x: 1, y: 6, relative: false },
	SDL: { x: 2, y: 6, relative: false },
	SRV: { x: 3, y: 6, relative: false },
} as const;

export const M8WaveSynthCommands : { [ix in M8WaveSynthCommand] : M8Command } = {
    SIZ: { ty: "WAV", code: M8WaveSynthCommand.SIZ, value: 0 },
	MUL: { ty: "WAV", code: M8WaveSynthCommand.MUL, value: 0 },
	WRP: { ty: "WAV", code: M8WaveSynthCommand.WRP, value: 0 },
	SCN: { ty: "WAV", code: M8WaveSynthCommand.SCN, value: 0 },
} as const;

export const M8FMSynthCommands : { [ix in M8FMSynthCommand] : M8Command } = {
	FM1: { ty: "FM", code: M8FMSynthCommand.FM1, value: 0 },
	FM2: { ty: "FM", code: M8FMSynthCommand.FM2, value: 0 },
	FM3: { ty: "FM", code: M8FMSynthCommand.FM3, value: 0 },
	FM4: { ty: "FM", code: M8FMSynthCommand.FM4, value: 0 },
} as const;

export const M8HyperSynthCommands : { [ix in M8HyperSynthCommand] : M8Command } = {
	SHF: { ty: "HS", code: M8HyperSynthCommand.SHF, value: 0 },
	SWM: { ty: "HS", code: M8HyperSynthCommand.SWM, value: 0 },
	WID: { ty: "HS", code: M8HyperSynthCommand.WID, value: 0 },
	SUB: { ty: "HS", code: M8HyperSynthCommand.SUB, value: 0 },
} as const;

export const M8SamplerSynthCommands : { [ix in M8SamplerCommand] : M8Command } = {
	PLY: { ty: "SA", code: M8SamplerCommand.PLY, value: 0 },
	STA: { ty: "SA", code: M8SamplerCommand.STA, value: 0 },
	LOP: { ty: "SA", code: M8SamplerCommand.LOP, value: 0 },
	LEN: { ty: "SA", code: M8SamplerCommand.LEN, value: 0 },
	DEG: { ty: "SA", code: M8SamplerCommand.DEG, value: 0 },
	SLI: { ty: "SA", code: M8SamplerCommand.SLI, value: 0 },
} as const;

export const M8MacroSynthCommands : { [ix in M8MacroSynthCommand] : M8Command } = {
	TBR: { ty: "MA", code: M8MacroSynthCommand.TBR, value: 0 },
	COL: { ty: "MA", code: M8MacroSynthCommand.COL, value: 0 },
	DEG: { ty: "MA", code: M8MacroSynthCommand.DEG, value: 0 },
	RED: { ty: "MA", code: M8MacroSynthCommand.RED, value: 0 },
} as const;

export const M8SequencerCommands : { [ix in M8SequencerCommand] : M8Command } = {
	DEL: { ty: "SEQ", code: M8SequencerCommand.DEL, value: 0 },
	HOP: { ty: "SEQ", code: M8SequencerCommand.HOP, value: 0 },
	RET: { ty: "SEQ", code: M8SequencerCommand.RET, value: 0 },
	REP: { ty: "SEQ", code: M8SequencerCommand.REP, value: 0 },
	RTO: { ty: "SEQ", code: M8SequencerCommand.RTO, value: 0 },
	TIC: { ty: "SEQ", code: M8SequencerCommand.TIC, value: 0 }
} as const;

export const M8GlobalCommands : { [ix in M8GlobalCommand]: M8Command } = {
	VOL: { ty: "GLO", code: M8GlobalCommand.VOL, value: 0 },
	PIT: { ty: "GLO", code: M8GlobalCommand.PIT, value: 0 },
	FIN: { ty: "GLO", code: M8GlobalCommand.FIN, value: 0 },
	CUT: { ty: "GLO", code: M8GlobalCommand.CUT, value: 0 },
	RES: { ty: "GLO", code: M8GlobalCommand.RES, value: 0 },
	AMP: { ty: "GLO", code: M8GlobalCommand.AMP, value: 0 },
	PAN: { ty: "GLO", code: M8GlobalCommand.PAN, value: 0 },
	DRY: { ty: "GLO", code: M8GlobalCommand.DRY, value: 0 },
	SCH: { ty: "GLO", code: M8GlobalCommand.SCH, value: 0 },
	SDL: { ty: "GLO", code: M8GlobalCommand.SDL, value: 0 },
	SRV: { ty: "GLO", code: M8GlobalCommand.SRV, value: 0 },
} as const;

export type M8Instrument =
	"WAV" | "FM" | "MA" | "HS" | "SA"

export const HumanNameOfInstrument : { [ix in M8Instrument]: string } = {
	"WAV": "Wavsynth",
	"MA": "Macrosynth",
	"HS": "Hypersynth",
	"SA": "Sampler",
	"FM": "FM Synth"
} as const;

export type M8Command =
	| { ty: "SEQ", code:  M8SequencerCommand, value: number }
	| { ty: "GLO", code:     M8GlobalCommand, value: number }
	| { ty: "WAV", code:  M8WaveSynthCommand, value: number }
	| { ty:  "FM", code:    M8FMSynthCommand, value: number }
	| { ty:  "MA", code: M8MacroSynthCommand, value: number }
	| { ty:  "HS", code: M8HyperSynthCommand, value: number }
	| { ty:  "SA", code:    M8SamplerCommand, value: number }

/** Human readable name */
export function HumanCommandKindOfCommand(cmd: M8Command) : string {
	const k = cmd.ty;
	switch (k)
	{
		case "SEQ": return "Sequencer";
		case "GLO": return "Global";
		default: return HumanNameOfInstrument[k];
	}
}
export class M8Builder {
	public static DEL(v: number) : M8Command {
		return { ty: "SEQ", code: M8SequencerCommand.DEL, value: v };
	}

	public static REP(v: number) : M8Command {
		return { ty: "SEQ", code: M8SequencerCommand.REP, value: v };
	}

	public static HOP(v: number) : M8Command {
		return { ty: "SEQ", code: M8SequencerCommand.HOP, value: v };
	}

	public static CUT(v: number) : M8Command {
		return { ty: "GLO", code: M8GlobalCommand.CUT, value: v };
	}
}

function* mk(dic: { [ix: string]: M8Command }) {
	for (let k in dic) {
		yield dic[k];
	}
}

export const CommandsOfInstrument : { [ix in M8Instrument]: M8Command[][] } = {
	"WAV": [[   ...mk(M8WaveSynthCommands)], [...mk(M8GlobalCommands)]],
	"FM":  [[     ...mk(M8FMSynthCommands)], [...mk(M8GlobalCommands)]],
	"MA":  [[  ...mk(M8MacroSynthCommands)], [...mk(M8GlobalCommands)]],
	"HS":  [[  ...mk(M8HyperSynthCommands)], [...mk(M8GlobalCommands)]],
	"SA":  [[...mk(M8SamplerSynthCommands)], [...mk(M8GlobalCommands)]],
} as const

export function Plot(ctx: CanvasRenderingContext2D, baseValue: number, commands: M8Command[]) {
	let current_instruction = 0;
	let current_tick = 0;
	let value = baseValue;
	let prevValue = 0;

	const widthPerTick = 3;
	const heightPerValue = 2;
	
	const height = ctx.canvas.clientHeight;
	const render = (v: number) => {
		ctx.fillRect(
			current_tick * widthPerTick,
			height - v,
			widthPerTick,
			heightPerValue);
	}

	const maxTick = ctx.canvas.clientWidth / widthPerTick;

	while (current_instruction < commands.length) {
		if (current_tick >= maxTick)
			break;

		const cmd = commands[current_instruction];

		switch (cmd.code) {
			case M8SequencerCommand.REP:
				for (let i = 0; i < cmd.value; i++) {
					if (current_tick >= maxTick)
						break;

					value = Math.min(255, Math.max(0, value + prevValue));
					render(value);
					current_tick++;
				}
				break;

			case M8SequencerCommand.DEL:
				for (let i = 0; i < cmd.value; i++) {
					if (current_tick >= maxTick) break;
					render(value);
					current_tick++;
				}
				break;
				break;

			case M8SequencerCommand.HOP:
				if (cmd.value === current_instruction)
					render(value);
				current_instruction = cmd.value - 1;
				current_tick++;
				break;

			default:
				const signed = cmd.value > 0x80
					? -((~cmd.value + 1) & 0xFF)
					: cmd.value;

				value = signed + value;
				value = Math.min(255, Math.max(0, value));
				render(value);
				prevValue = signed;
				current_tick++;
				break;
		}

		current_instruction++;
	}

	while (current_tick < maxTick) {
		render(value);
		current_tick++;
	}
}

export function IsFunctionRelative(cmd: M8Command) : boolean {
	const ty = cmd.ty;

	switch (ty) {
		case "SEQ": return M8SequencerCommandPositions[cmd.code].relative;
		case "GLO": return M8GlobalCommandPositions[cmd.code].relative;
		case "WAV": return M8WaveSynthCommandPositions[cmd.code].relative;
		case "FM": return M8FMSynthCommandPositions[cmd.code].relative;
		case "MA": return M8MacroSynthCommandPositions[cmd.code].relative;
		case "HS": return M8HyperSynthCommandPositions[cmd.code].relative;
		case "SA": return M8SamplerSynthCommandPositions[cmd.code].relative;
		default:
			return never(ty);
	}
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
