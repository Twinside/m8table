import { CommandsOfInstrument, HumanCommandKindOfCommand, HumanNameOfInstrument, M8Command, M8Instrument, Plot } from "./m8io";
import { findFirstNamedOutputPort, sendSequence } from "./midi";
import { AttackDecayEnvMacro, FreshMacro, SegmentKindIndex, LFOEnvMacro, ADSREnvMacro } from "./model";
import { createState, never } from "./state";
import "./style.css";
import { render } from "preact";
import { useEffect, useRef } from "preact/hooks";


let state = createState(undefined);

function RangeVal(props: { name: string, val: number, update: (v: number) => void, max?: number | undefined }) {
	const onChange = (a : string) =>
	{
		const n = Number.parseInt(a, 10);
		props.update(n);
	}

	const maxi = props.max === undefined ? 255 : props.max;

	return <div class="valueEdit">
		<label>{props.name}</label><br/>
		<input
			type="range" min="0" max={maxi}
			onInput={(evt) => onChange(evt.currentTarget.value)}
			value={props.val}/>
		<input
			type="number" min="0" max={maxi}
			onInput={(evt) => onChange(evt.currentTarget.value)}
			value={props.val} />
	</div>;
}

function AttackDecayEnvEditor(props: { name: string, def: AttackDecayEnvMacro, update: (v: AttackDecayEnvMacro) => void}) {
	const def = props.def;
	return <form>
		<h3>{props.name}</h3>
		<RangeVal name="Attack (tics)" val={def.AttackTics} update={(v) => props.update({...def, AttackTics: v})} />
		<RangeVal name="Decay (tics)" val={def.DecayTics}  update={(v) => props.update({...def, DecayTics: v})} />
		<RangeVal name="Amount" val={def.Amount}  update={(v) => props.update({...def, Amount: v})} />
		<label>Loop</label>
		<input type="checkbox" checked={def.Loop} 
			onInput={(_evt) => props.update({...def, Loop: !def.Loop})}/>
	</form>;
}

function AdsrEnvEditor(props: { name: string, def: ADSREnvMacro, update: (v: ADSREnvMacro) => void  }) {
	const def = props.def;
	return <form>
		<h3>{props.name}</h3>
		<RangeVal name="Amount" val={def.Amount}  update={(v) => props.update({...def, Amount: v})} />

		<RangeVal name="Attack (tics)" val={def.AttackTics} update={(v) => props.update({...def, AttackTics: v})} />
		<RangeVal name="Decay (tics)" val={def.DecayTics}  update={(v) => props.update({...def, DecayTics: v})} />
		<RangeVal name="Sustain (tics)" val={def.SustainTics}  update={(v) => props.update({...def, SustainTics: v})} />
		<RangeVal name="Sustain Amount" val={def.SustainLevel}  update={(v) => props.update({...def, SustainLevel: v})} />
		<RangeVal name="Release (tics)" val={def.ReleaseTics}  update={(v) => props.update({...def, ReleaseTics: v})} />
		<label>Loop</label>
		<input type="checkbox" checked={def.Loop} 
			onInput={(_evt) => props.update({...def, Loop: !def.Loop})}/>
	</form>;
}

function LfoEditor(props: { name: string, def: LFOEnvMacro, update: (v: LFOEnvMacro) => void, maxAmount?: number | undefined   }) {
	const def = props.def;
	return <form>
		<h3>{props.name}</h3>
		<RangeVal name="Duration (tics)" val={def.Duration} update={(v) => props.update({...def, Duration: v})} />
		<RangeVal name="Amount" val={def.Amount}  update={(v) => props.update({...def, Amount: v})} max={props.maxAmount} />
		<label>Loop</label>
		<input type="checkbox" checked={def.Loop} 
			onInput={(_evt) => props.update({...def, Loop: !def.Loop})}/>
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
			return <AttackDecayEnvEditor
						name="Attack Decay Enveloppe"
						def={macroEditor.def}
						update={(env) => state.current_macro.value = { ...macroEditor, def: env }} />;

		case "adsr_env":
			return <AdsrEnvEditor
						name="ADSR Enveloppe"
						def={macroEditor.def}
						update={(env) => state.current_macro.value = { ...macroEditor, def: env }} />;

		case "tri_lfo":
			return <LfoEditor
						name="Triangle LFO"
						def={macroEditor.def}
						update={(lfo) => state.current_macro.value = { ...macroEditor, def: lfo }} />;
		case "square_lfo":
			return <LfoEditor
						name="Square LFO"
						def={macroEditor.def}
						maxAmount={127}
						update={(lfo) => state.current_macro.value = { ...macroEditor, def: lfo }} />;
		case "ramp_up_lfo":
			return <LfoEditor
						name="Ramp UP LFO"
						def={macroEditor.def}
						update={(lfo) => state.current_macro.value = { ...macroEditor, def: lfo }} />;
		case "ramp_down_lfo":
			return <LfoEditor
						name="Ramp Down LFO"
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
		SegmentKindIndex[state.current_macro.value.kind] - 1;
	
	const setMacro = (i : number) => {
		state.current_macro.value = FreshMacro(i);
	};

	const choices = [
		// "Free",
		"Attack Decay Env",
		"ADSR Env",
		"Triangle LFO",
		"Square LFO",
		"Ramp up LFO",
		"Ramp down LFO"
	];

	const renderChoice = (choice: string, ix : number) =>
		<div>
			<label>
				<input type="radio" checked={selectedIndex === ix} onInput={_ => setMacro(ix + 1)}></input>
				{choice}
			</label>
		</div>;

	return <div>{choices.map(renderChoice)}</div>;
}

function ScriptPlot() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const script = state.script.value;
	const param = state.current_parameter.value;
  
    useEffect(() => {
		const current = canvasRef.current;
		if (current === null) return;

        const context = current.getContext('2d');
		if (context === null) return;


		const width = context.canvas.clientWidth;
		const height = context.canvas.clientHeight;

        context.clearRect(0, 0, width, height);

        context.fillStyle = '#555';
		for (var i = 1; i < 0xFF; i += 0x10)
		{
			context.fillRect(0, i, width, 1);
		}

        context.fillStyle = '#080';
		context.fillRect(0, 0xFF - param.value, width, 2);

        context.fillStyle = '#fff';
		Plot(context, param.value, script);
    }, [script]);
  
    return <div><canvas class="visualization" ref={canvasRef} width={512 + 128} height={258}/></div>;
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
	const parameter = state.current_parameter.value;
	const commands = CommandsOfInstrument[instrument];

	let allCommands : M8Command[]= [];

	const setValue = (ixStr : string) =>
	{
		const ix = Number.parseInt(ixStr, 10);
		const cmd = allCommands[ix];
		state.current_parameter.value = { ...cmd, value: parameter.value};
	}

	let i = 0;
	const onCmd = (cmd : M8Command)  =>
	{
		allCommands.push(cmd);
		return <option value={i++} selected={parameter.code === cmd.code}> {cmd.code} </option>;
	}

	const groups = commands.map(grp =>
			<optgroup label={HumanCommandKindOfCommand(grp[0])}>{grp.map(onCmd)}</optgroup>);

	return <select size={20} onChange={e => setValue(e.currentTarget.value)}>{groups}</select>;
}

function InstrumentBaseValue() {
	const param = state.current_parameter.value;

	return <RangeVal name="Amount"
					 val={param.value} 
					 update={(v) => state.current_parameter.value = {...param, value: v}} />
}

function TryUpdateM8Port() {
	if (state.midi === undefined) return;

	const port = findFirstNamedOutputPort(state.midi, "M8");
	state.m8port.value = port?.id;
}

function MidiStatus() {

	const port = state.m8Channel.value;
	const m8port = state.m8port.value;

	if (state.midi === undefined) {
		return <div class="message">
			No midi allowed, cannot write to M8, grant MIDI rights and refresh page
		</div>;
	}

	const midiStatus =
		m8port === undefined ? "No connected M8 found" :
		"M8 OK, put cursor in an instrument table for writing.";

	const setVal = (str : string) => {
		const ix = Number.parseInt(str, 10);
		state.m8Channel.value = ix;
	};

	return <div class="message">
		<span class="midistatus">{midiStatus}</span>
		<span class="separator"></span>
		<label>
			<span class="midistatus">M8 control channel : </span>
			<input
				type="number"
				min="1" max="16"
				title="M8 Midi control channel (10 by default)"
				value={port}
				onInput={evt => setVal(evt.currentTarget.value)}/>
		</label>
		<span class="separator"></span>
		<button title="Search for M8" onClick={_ => TryUpdateM8Port()}>⟳ Refresh M8</button>
	</div>
}

function sendCurrentScript() {
	const port = findFirstNamedOutputPort(state.midi, "M8");
	if (port === undefined) {
		state.m8port.value = undefined;
		alert("No M8 found, please connect and refresh")
		return;
	}

	sendSequence(port, state.m8Channel.peek(), state.script.peek());
}

export function App() {
	const disabled = state.m8port.value === undefined;

	return <div>
		<div class="rootheader">
			<h1>M8 Table generator</h1>
			<MidiStatus />
		</div>
		<div class="rootcontainer">
			<div class="rootcolumn">
				<h3>Generator</h3>
				<MacroChoice />
				<h3>Instrument</h3>
				<InstrumentChoice />
				<h3>Value</h3>
				<InstrumentBaseValue />
				<ValueChoice />
			</div>
			<div class="rootcolumn">
				<MacroEditor />
			</div>
			<div class="rootcolumn">
				<h3>M8 'script'</h3>
				<ScriptRender />
				<ScriptPlot />

				<button
				 	disabled={disabled}
					onClick={_ => sendCurrentScript()}>M8 write</button>
			</div>
		</div>
	</div>;
}

try {
	navigator.requestMIDIAccess()
		.then(
			(midiAccess : MIDIAccess) => {
				state = createState(midiAccess);
				TryUpdateM8Port();
				render(<App />, document.getElementById("app")!);
			},
			_ => {
				render(<App />, document.getElementById("app")!);
			});
} catch {
	document.addEventListener('DOMContentLoaded', function () {
		// moving on...
		const app = document.getElementById("app");
		render(<App />, app!);
	}, false);
}
