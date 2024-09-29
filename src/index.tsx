import { M8Controller, M8GlobalCommand, M8SequencerCommand } from "./m8io";
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

async function sendSequence(midi : MIDIAccess | undefined) {
	if (midi === undefined) return;

	const m8Port = findFirstNamedOutputPort(midi, "M8");

	if (m8Port === undefined) {
		console.log("No M8 found :(");
		return;
	}

	await m8Port.open();

	const m8 = new M8Controller(10);
	m8.sendCommands(m8Port,[
		{ ty:"GLO", code: M8GlobalCommand.CUT, value: 30 },
		{ ty:"GLO", code: M8GlobalCommand.CUT, value: 0xFF },
		{ ty:"SEQ", code: M8SequencerCommand.REP, value: 4 },
		{ ty:"SEQ", code: M8SequencerCommand.HOP, value: 3 },
	]);
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
