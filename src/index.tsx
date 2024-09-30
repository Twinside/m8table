import { HumanNameOfInstrument, M8Command, M8Controller, M8Instrument, Plot } from "./m8io";
import { AttackDecayEnvMacro, createState, FreshMacro, never, SegmentKindIndex, TriLFOEnvMacro } from "./model";
import "./style.css";
import { JSX, render } from "preact";
import { useEffect, useRef } from "preact/hooks";

let midi : MIDIAccess | undefined = undefined;

function onMIDIFailure(msg : any) {
  console.error(`Failed to get MIDI access - ${msg}`);
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      Midi rejected :(
    </div>
  `
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
					<li>name:'{output.name}'</li>
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

	// we don't want to register anything to be re-run or something
	m8.sendCommands(m8Port, state.script.peek());
}

const state = createState();

function RangeVal(props: { name: string, val: number, update: (v: number) => void }) {
	const onChange = (a : string) =>
	{
		const n = Number.parseInt(a, 10);
		props.update(n);
	}

	return <div class="valueEdit">
		<label>{props.name}</label>
		<input
			type="range" min="0" max="255"
			onInput={(evt) => onChange(evt.currentTarget.value)}
			value={props.val}/>
		<input
			type="number" min="0" max="255"
			onInput={(evt) => onChange(evt.currentTarget.value)}
			value={props.val} />
	</div>;
}

function AdEnvEditor(props: { def: AttackDecayEnvMacro, update: (v: AttackDecayEnvMacro) => void  }) {
	return <></>;
}

function TriLfoEditor(props: { def: TriLFOEnvMacro, update: (v: TriLFOEnvMacro) => void }) {
	const def = props.def;
	return <form>
		<h3>Triangle LFO</h3>
		<RangeVal name="Duration" val={def.Duration} update={(v) => props.update({...def, Duration: v})} />
		<RangeVal name="Amount" val={def.Amount}  update={(v) => props.update({...def, Amount: v})} />
		<label>Loop</label>
		<input type="checkbox" checked={def.Loop} 
			onInput={(evt) => props.update({...def, Loop: !def.Loop})}/>
	</form>;
}

function hexCode(n : number) {
	const asHex = n.toString(16);
	return asHex.length < 2 ? "0" + asHex : asHex;
}
function M8CommandScriptRender(id: number, cmd: M8Command) {
	return `${hexCode(id)} : ${cmd.code} ${hexCode(cmd.value)}`;
}

function ScriptRender() {
	const script = state.script.value;
	return <pre>
		{script.map((c, i) => M8CommandScriptRender(i, c) + '\n')}
	</pre>;
}

function MacroEditor() {
	const macroEditor = state.current_macro.value;

	const kind = macroEditor.kind;
	switch (kind)
	{
		case "ad_env":
			return <AdEnvEditor
						def={macroEditor.def}
						update={(lfo) => state.current_macro.value = { ...macroEditor, def: lfo }} />;

		case "tri_lfo":
			return <TriLfoEditor
						def={macroEditor.def}
						update={(lfo) => state.current_macro.value = { ...macroEditor, def: lfo }} />;
		case "free":
			return <></>;
		default:
			never(kind);
	}
}

function MacroChoice() {
	const selectedIndex =
		SegmentKindIndex[state.current_macro.value.kind];
	
	const setMacro = (i : number) => {
		state.current_macro.value = FreshMacro(i);
	};

	return <div>
		<div>
			<label>
				<input type="radio" checked={selectedIndex === 0} onInput={_ => setMacro(0)}></input>
				Free
			</label>
		</div>
		<div>
			<label>
				<input type="radio" checked={selectedIndex === 1} onInput={_ => setMacro(1)}></input>
				Attack Decay Env
			</label>
		</div>
		<div>
			<label>
				<input type="radio" checked={selectedIndex === 2} onInput={_ => setMacro(2)}></input>
				Triangle LFO
			</label>
		</div>
	</div>;
}

function ScriptPlot() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const script = state.script.value;
  
    useEffect(() => {
		const current = canvasRef.current;
		if (current === null) return;

        const context = current.getContext('2d');
		if (context === null) return;



        context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);

        context.fillStyle = '#fff';
		Plot(context, script);
    }, [script]);
  
    return <canvas ref={canvasRef} width={512} height={256}/>;
}

function InstrumentChoice() {
	const instrument = state.current_instrument.value;
	const mkRadio = (m8i : M8Instrument) =>
		<div>
			<label>
				<input type="radio" value={m8i}
					   checked={m8i === instrument}
					   onInput={_ => state.current_instrument.value = m8i}/>{HumanNameOfInstrument[m8i]}
			</label>
		</div>;

	return <div>
		{mkRadio("WAV")}
		{mkRadio("MA")}
		{mkRadio("HS")}
		{mkRadio("SA")}
		{mkRadio("FM")}
	</div>
}

function ValueChoice() {
	const instrument = state.current_instrument.value;

	return <select>

	</select>;
}

/*
			<div>
				<h2>MIDI outputs</h2>
				<MidiOutputs midi={midi} />
			</div>
			// */
export function App() {
	return <div class="rootcontainer">
		<div class="rootcolumn">
			<h3>Generator</h3>
			<MacroChoice />
			<h3>Instrument</h3>
			<InstrumentChoice />
			<h3>Value</h3>
		</div>
		<div class="rootcolumn">
			<MacroEditor />
		</div>
		<div class="rootcolumn">
			<h3>M8 'script'</h3>
			<ScriptRender />
			<ScriptPlot />

			<button onClick={_ => sendSequence(midi)}>M8 write</button>
		</div>
	</div>;
}

navigator.requestMIDIAccess()
	.then(
		(midiAccess : MIDIAccess) => {
			console.log("MIDI ready!");
			midi = midiAccess;

			render(<App />, document.getElementById("app")!);
		},
		onMIDIFailure);
