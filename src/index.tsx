import { never } from "./helper";
import { CommandsOfInstrument, HumanCommandKindOfCommand, HumanNameOfInstrument, M8Command, M8Instrument, Plot } from "./m8io";
import * as M8IO from "./m8io";
import { findFirstNamedOutputPort } from "./midi";
import { AttackDecayEnvMacro, FreshMacro, SegmentKindIndex, LFOEnvMacro, ADSREnvMacro, Segment, FreeFormMacro, MacroAsUrlQuery, Keys } from "./model";
import { createState } from "./state";
import "./style.css";
import { render } from "preact";
import { useEffect, useRef } from "preact/hooks";


let state = createState(undefined);

function RangeVal(props: { name: string, val: number, update: (v: number) => void, min?: number | undefined, max?: number | undefined }) {
	const onChange = (a : string) =>
	{
		const n = Number.parseInt(a, 10);
		props.update(n);
	}

	const maxi = props.max === undefined ? 255 : props.max;
	const mini = props.min === undefined ? 0 : props.min;

	return <div class="valueEdit">
		<label>{props.name}</label><br/>
		<input
			type="range" min={mini} max={maxi}
			onInput={(evt) => onChange(evt.currentTarget.value)}
			value={props.val}/>
		<input
			type="number" min={mini} max={maxi}
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

function RenderSegment(props: { seg: Segment, update: (seg: Segment) => void, remove: () => void }) {
	const seg = props.seg;

	return <form class="segmentedit">
		<RangeVal name="Duration (tics)" val={seg.TicDuration}  update={(v) => props.update({...seg, TicDuration: v})} />
		<RangeVal name="Amount" val={seg.Amount} min={-128} max={127} update={(v) => props.update({...seg, Amount: v})} />
		<button title="Remove segment" onClick={() => props.remove()}>Remove</button>
	</form>;
}

function FreeFormEditor( props: { name: string, def: FreeFormMacro, update: (v: FreeFormMacro) => void }) {
	const def = props.def;

	const addSegment = () =>
		props.update({...def, Segments: [...def.Segments, {Amount: 10, TicDuration: 10 }]});

	const segmentWidgets = def.Segments.map((seg, i) =>
		{
			const update = (newSeg : Segment) => {
				const newSegs = [...def.Segments];
				newSegs[i] = newSeg;
				props.update({...def, Segments: newSegs });
			}

			const remove = () => {
				const newSegs = [...def.Segments];
				newSegs.splice(i, 1);
				props.update({...def, Segments: newSegs });
			}

			return <RenderSegment seg={seg} update={update} remove={remove} />
		});

	return <div>
		<h3>{props.name}</h3>
		<div class="segmentList">
			{segmentWidgets}
		</div>
		<button title="Add a segment" onClick={_ => addSegment()}>+</button>
		<label>Loop</label>
		<input type="checkbox" checked={def.Loop} 
			onInput={(_evt) => props.update({...def, Loop: !def.Loop})}/>
	</div>;
}


function hexCode(n : number) {
	const asHex = n.toString(16);
	return asHex.length < 2 ? "0" + asHex : asHex;
}
function M8CommandScriptRender(id: number, cmd: M8Command) {
	const str = `${hexCode(id)} : ${cmd.code} ${hexCode(cmd.value)}\n`;
	return id === 0x0F ? <span class="warncolor" title="Beware approaching instruction count limit...">{str}</span> :
		   id > 0x0F   ? <span class="errorcolor" title="Out of bound instruction, cannot be executed.">{str}</span> :
		   str;
}

function ScriptRender() {
	const script = state.script.value;
	return <pre>
		{script.map((c, i) => M8CommandScriptRender(i, c))}
	</pre>;
}

function MacroEditor() {
	const macroEditor = state.current_macro.value;

	const kind = macroEditor.kind;
	switch (kind)
	{
		case "free":
			return <FreeFormEditor
						name="Free form"
						def={macroEditor.def}
						update={(env) => {
							const fresh = { ...macroEditor, def: env }
							state.current_macro.value = fresh;
						}} />;
		case "ad_env":
			return <AttackDecayEnvEditor
						name="Attack Decay Enveloppe"
						def={macroEditor.def}
						update={(env) => {
							const fresh = { ...macroEditor, def: env }
							state.current_macro.value = fresh;
						}} />;

		case "adsr_env":
			return <AdsrEnvEditor
						name="ADSR Enveloppe"
						def={macroEditor.def}
						update={(env) => {
							const fresh = { ...macroEditor, def: env }
							state.current_macro.value = fresh;
						}} />;

		case "tri_lfo":
			return <LfoEditor
						name="Triangle LFO"
						def={macroEditor.def}
						update={(lfo) => {
							const fresh = { ...macroEditor, def: lfo }
							state.current_macro.value = fresh;
						}} />;
		case "square_lfo":
			return <LfoEditor
						name="Square LFO"
						def={macroEditor.def}
						maxAmount={127}
						update={(lfo) => {
							const fresh = { ...macroEditor, def: lfo }
							state.current_macro.value = fresh;
						}} />;
		case "ramp_up_lfo":
			return <LfoEditor
						name="Ramp UP LFO"
						def={macroEditor.def}
						update={(lfo) => {
							const fresh = { ...macroEditor, def: lfo }
							state.current_macro.value = fresh;
						}} />;
		case "ramp_down_lfo":
			return <LfoEditor
						name="Ramp Down LFO"
						def={macroEditor.def}
						update={(lfo) => {
							const fresh = { ...macroEditor, def: lfo }
							state.current_macro.value = fresh;
						}} />;
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

	const choices = [
		"Free",
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
				<input type="radio" checked={selectedIndex === ix} onInput={_ => setMacro(ix)}></input>
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

	const ccSend =
		m8port === undefined
			? undefined
			: <button title="Send CC to the M8 to activate midi mapping"
					  onClick={_ => sendCC()}>CC</button>;

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
		{ccSend}
	</div>
}

function sendCurrentScript() {
	const port = findFirstNamedOutputPort(state.midi, "M8");
	if (port === undefined) {
		state.m8port.value = undefined;
		alert("No M8 found, please connect and refresh")
		return;
	}

	M8IO.sendSequence(port, state.m8Channel.peek(), state.script.peek());
}

function sendCC() {
	const port = findFirstNamedOutputPort(state.midi, "M8");
	if (port === undefined) {
		state.m8port.value = undefined;
		alert("No M8 found, please connect and refresh")
		return;
	}

	M8IO.sendCC(port, 50, state.m8Channel.peek(), 14, 0x40);
}

export function App() {
	const scriptTooLong = state.script.value.length > 0x10;
	const disabled =
		state.m8port.value === undefined ||
		scriptTooLong;

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

				<div>
					<button
						disabled={disabled}
						onClick={_ => sendCurrentScript()}>M8 write</button>
					{scriptTooLong ? "Your script is too long and can't be executed on a M8" : ""}
				</div>
			</div>
		</div>
	</div>;
}

function updateUrl() {
	if (!window.history.pushState) return;

    var url = new URL(window.location.href);
	const macro = state.current_macro.value;
    var params = MacroAsUrlQuery(macro);
	params.append(Keys.Instrument, state.current_instrument.value);
	const parameter = state.current_parameter.value;
	params.append(Keys.ValueTarget, parameter.code);
	params.append(Keys.ValueTargetAmount, parameter.value.toString());

    url.search = params.toString();
    const strUrl = url.toString();
    window.history.replaceState({url: strUrl}, "", strUrl);
}

state = createState(undefined);
function main() {
	state.script.subscribe(updateUrl);
	state.current_instrument.subscribe(updateUrl);
	render(<App />, document.getElementById("app")!);
}
document.addEventListener('DOMContentLoaded', function () {
	// moving on...
	main();
}, false);

try {
	navigator.requestMIDIAccess()
		.then(
			(midiAccess : MIDIAccess) => {
				state.midi = midiAccess;
				TryUpdateM8Port();
			});
} catch {
}
