import React from 'react';
import ReactDOM from 'react-dom';
import textpos from './textpos';
import './css.less';


class App extends React.Component{
	constructor(){
		super();
		let qs = ` @mov 50 x1
  wait:
  mov x1 acc
  teq acc -999
+ slp 1
+ jmp wait

  gen p1 x1 0
  gen p0 x1 0`;
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
				</div>
			</div>
		</div>;
	}
	oncc(t)
	{
		let info = textpos.info(t.target.value, t.target.selectionStart);
		let keepsp = info.lines == this.state.org_lines;
		let r = this.findLines(t.target.value, keepsp);
		let newpos = textpos.apply(r[1], info);

		this.setState({ content: r[1], lines:r[0], res:r[2], org_lines:r[3] });

		let xx = ReactDOM.findDOMNode(t.target);
		window.setTimeout(()=>{
			xx.selectionStart = xx.selectionEnd = newpos;
		}, 1);
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
	findLines(v, keep_tail_sp)
	{
		let xstrip = (s)=>{
			if (keep_tail_sp)
				return s.replace(/^\s+/, '');
			else
				return s.replace(/^\s+|\s+$/, '');
		};

		let lines =  v.split(/\n/);
		if (lines.length > 0 && lines[lines.length-1] === '')
			lines.pop();

		let linec = 0;
		let vv = '';
		let vv2 = '';
		let m;

		for (let l of lines)
		{
			let prefix='', body='', tail='';
			l = xstrip(l);
			m = l.match(/#.*/);
			if (m) { tail = m[0]; l = l.substr(0, l.length - tail.length); }
			m = l.match(/^(\S+:)/);
			if (m) prefix = m[0];
			body = l.substr(prefix.length, l.length - prefix.length);
			body = xstrip(body);

			if (body.length > 0) ++ linec;
			body = body.replace(/^([+@-])\s*/, '$1 ');

			let newl =  prefix;
			if (body){
				if (!prefix && !body.match(/^[+@-]/))
				{
					newl += '  ';
				}
				else
					if (newl && !newl.match(/\s$/)) newl += ' ';
				newl += body;
			}
			if (tail)
			{
				if (newl && !newl.match(/\s$/)) newl += ' ';
				newl += tail;
			}

			vv +=  newl + "\n";
			newl = newl.replace(/\s*#.*/, '');
			if (newl)
			{
				vv2 += newl + "\n";
			}
		}
		vv2 = vv2.replace(/:\s+/g, ': ');
		return [linec, vv, vv2, lines.length];
	}
}

ReactDOM.render(<App />, document.getElementById('container'));
