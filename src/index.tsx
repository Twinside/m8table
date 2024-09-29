import "./style.css";
import { JSX, render } from "preact";

let midi : MIDIAccess | undefined = undefined;

function onMIDIFailure(msg : any) {
  console.error(`Failed to get MIDI access - ${msg}`);
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      Midi rejected :(
    </div>
  `
}

function MidiInputs(props: { midi: MIDIAccess | undefined }) {
	const { midi } = props;
	if (midi === undefined)
		return <div>No midi!</div>;

	const out : JSX.Element[] = []

	for (const entry of midi.inputs) {
		const input = entry[1];
		out.push(
			<div>
				Input port [type: {input.type}]`
				<ul>
					<li>id: {input.id}</li>
					<li>manufacturer: {input.manufacturer}</li>
					<li>name: {input.name}</li>
					<li>{input.version}</li>
				</ul>
			</div>
		);
	}

	return out.length > 0
		? <div>{out}</div>
		: <div>No midi input found</div>;
}

function MidiOutputs(props : {midi: MIDIAccess | undefined }){
	const { midi } = props;
	const out : JSX.Element[] = []

	if (midi === undefined)
		return <div>No midi!</div>;

	for (const entry of midi.outputs) {
		const output = entry[1];
		out.push(
			<div>
				Output port [type:'{output.type}']
				<ul>
					<li>id:'{output.id}'</li>
					<li>manufacturer:'{output.manufacturer}'</li>
					<li>name:'{output.name}'</li>
					<li>version:'{output.version}'</li>
				</ul>

			</div>
		)
	}

	return out.length > 0
		? <div>{out}</div>
		: <div>No midi output found</div>;
}

function findFirstNamedOutputPort(midi : MIDIAccess | undefined, name: string) : MIDIOutput | undefined {
	if (midi === undefined) return undefined;

	for (const entry of midi.outputs) {
		const output = entry[1];
		if (output.name === name)
			return output;
	}

	return undefined;
}

class Midi {
	public static readonly NoteOnCode : number = 0x90;
	public static readonly NoteOffCode : number = 0x80;

	public static NoteOn(chan : number, note : number, velocity: number) : number[] {
		return [Midi.NoteOnCode | (chan - 1), note, velocity];
	}

	public static NoteOff(chan : number, note : number, velocity: number) : number[] {
		return [Midi.NoteOffCode | (chan - 1), note, velocity];
	}
}

/** Class in charge of formatting various m8 commands and sending them off properly */
class M8Controller {
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

	public constructor(
		public readonly controlChannel: number) {

		this.PlayOn = Midi.NoteOn(controlChannel, 0, 1);
		this.PlayOff = Midi.NoteOff(controlChannel, 0, 1);

		this.ShiftOn = Midi.NoteOn(controlChannel, 1, 1);
		this.ShiftOff = Midi.NoteOff(controlChannel, 1, 1);

		this.EditOn = Midi.NoteOn(controlChannel, 2, 1);
		this.EditOff = Midi.NoteOff(controlChannel, 2, 1);

		this.OptionOn = Midi.NoteOn(controlChannel, 3, 1);
		this.OptionOff = Midi.NoteOff(controlChannel, 3, 1);

		this.LeftOn = Midi.NoteOn(controlChannel, 4, 1);
		this.LeftOff = Midi.NoteOff(controlChannel, 4, 1);

		this.RightOn = Midi.NoteOn(controlChannel, 5, 1);
		this.RightOff = Midi.NoteOff(controlChannel, 5, 1);

		this.UpOn = Midi.NoteOn(controlChannel, 6, 1);
		this.UpOff = Midi.NoteOff(controlChannel, 6, 1);

		this.DownOn = Midi.NoteOn(controlChannel, 7, 1);
		this.DownOff = Midi.NoteOff(controlChannel, 7, 1);
	}

	public sendCommands() {

		/*
		  const noteOnMessage = [0x90, 60, 0x7f]; // note on middle C, full velocity
  const output = midiAccess.outputs.get(portID);
  output.send(noteOnMessage); //omitting the timestamp means send immediately.
  output.send([0x80, 60, 0x40], window.performance.now() + 1000.0); // timestamp = now + 1000ms.
  // */
	}
}

async function sendSequence(midi : MIDIAccess | undefined) {
	if (midi === undefined) return;

	const m8Port = findFirstNamedOutputPort(midi, "M8");

	if (m8Port === undefined) {
		console.log("No M8 found :(");
		return;
	}

	console.log('Opening');
	const noteOnMessage = [0x99, 7, 1];
	const noteOffMessage = [0x89, 7, 0];

	await m8Port.open();

	m8Port.send(noteOnMessage);
	setTimeout(() => {
		
		m8Port.send(noteOffMessage);

		setTimeout(() =>
		{
			m8Port.close();
			console.log('DONE');
		}, 40);
	}, 40);
}

export function App() {
	return <>
		<h2>MIDI inputs</h2>
		<MidiInputs midi={midi} />
		<h2>MIDI outputs</h2>
		<MidiOutputs midi={midi} />
		<button onClick={_ => sendSequence(midi)}>Test</button>
	</>;
}

navigator.requestMIDIAccess()
	.then(
		(midiAccess : MIDIAccess) => {
			console.log("MIDI ready!");
			midi = midiAccess;

			render(<App />, document.getElementById("app")!);
		},
		onMIDIFailure);


/*
export async function prerender(data : any) {
	const { html, links } = await ssr(<App />);
	return {
		html,
		links,
		data: { url: data.url },
		head: {
			lang: "en",
			title: "Prerendered Preact App",
			elements: new Set([
				{
					type: "meta",
					props: {
						name: "description",
						content: "This is a prerendered Preact app",
					},
				},
			]),
		},
	};
}
// */
