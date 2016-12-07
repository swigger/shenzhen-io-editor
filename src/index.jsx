import React from 'react';
import { render } from 'react-dom';
import './css.less';

class App extends React.Component{
	constructor(){
		super();
		let qs = `gen p0 2 1
slp 1`;
		let r = this.findLines(qs);
		this.state = {
			content: r[1],
			lines:r[0],
			res:r[2],
			org_lines:r[3]
		};
	}
	onSLClick(v)
	{
		this.setState({activeSL:v});
	}
	render(){
		let clsname = null;
		if (this.state.lines > 14)
			clsname = 'text-danger';
		if (this.state.lines > 0  && this.state.lines <= 9)
			clsname = 'text-success';
		let sa = [];
		let salns = 5;
		for (let i=0; i<salns; ++i)
		{
			for (let j=0; j<salns; ++j)
			{
				let iid = i*salns+j;
				let key = "btn"+iid;
				let value = localStorage.getItem(`con${iid}`) ? "✓" : "\xa0";
				if (iid === this.state.activeSL)
				{
					sa.push(<div key={key} className="slgrid selected">{value}</div>);
				}
				else
					sa.push(<div key={key} className="slgrid" onClick={this.onSLClick.bind(this, iid)}>{value}</div>);
			}
			sa.push(<br key={"br"+i} />);
		}

		return <div>
			<h3>lines: <span className={clsname}>{this.state.lines}</span></h3>
			<div className="workarea">
			<textarea className="editor" spellCheck="false" onChange={this.oncc.bind(this)} value={this.state.content} >
			</textarea>
				<div className="rpan">
					<div className="btn-group">
						{sa}
					</div>
					<br />
					<button id="save" className="btn btn-success" onClick={this.doSave.bind(this)}>save</button>
					<button id="load" className="btn btn-primary" onClick={this.doLoad.bind(this)}>load</button>
					<br/>
					<pre>{this.state.res||''}</pre>
					<button id="format" onClick={this.doFmt.bind(this)} className="btn btn-warning">format</button>
				</div>
			</div>
		</div>;
	}
	oncc(t)
	{
		let r = this.findLines(t.target.value);
		this.setState({ content: t.target.value, lines:r[0], res:r[2], org_lines:r[3] });
	}
	doFmt(){
		let r = this.findLines(this.state.content);
		this.setState({content:r[1]});
	}
	doLoad(){
		if (typeof this.state.activeSL !== "number") return;
		let tosl = this.state.activeSL;
		let qs = localStorage.getItem(`con${tosl}`) || '';
		let r = this.findLines(qs);
		this.setState({
			content: r[1],
			lines:r[0],
			res:r[2],
			org_lines:r[3]
		});
	}
	doSave(){
		if (typeof this.state.activeSL !== "number") return;
		let tosl = this.state.activeSL;
		localStorage.setItem(`con${tosl}`, this.state.content);
		this.setState({});
	}
	findLines(v)
	{
		let linec = 0;
		let vv = '';
		let xx = v.split(/\n/);
		let vv2 = '';

		for (let l of xx)
		{
			l = l.replace(/^\s+|\s+$/, '');
			let m = l.match(/^(\S+:)/);
			let newl = '';
			if (m)
			{
				newl = m[1];
				l = l.replace(/^\S+:\s*/, '');
			}
			l = l.replace(/^([+@-])\s*/, '$1 ');
			if (! l.match(/^#/) && l !== '')
			{
				++ linec;
			}
			newl += l;
			newl = this.format(newl);
			vv +=  newl + "\n";
			newl = newl.replace(/#.*/, '');
			if (! newl.match(/^\s*$/))
			{
				vv2 += newl.replace(/\s*$/, '');
				if (!newl.match(/:\s*$/))
					vv2 += "\n";
			}
		}

		vv = vv.substr(0, vv.length-1);
		vv2 = vv2.replace(/:\s*/g, ': ');
		return [linec, vv, vv2, xx.length];
	}
	format(newl)
	{
		newl = newl.replace(/:\s+$/, ':');
		if (newl.match(/^\s*$|^[+@#-]|:/)) return newl;
		newl = '  ' + newl;
		return newl.replace(/\s*#/, ' #');
	}
}

render(<App />, document.getElementById('container'));
