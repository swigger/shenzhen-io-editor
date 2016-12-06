import React from 'react';
import { render } from 'react-dom';

class App extends React.component{
	constructor(){
		super();
		this.state = {}
	}
	render(){
		return <div>
			<h1>lines: {this.state.lines}</h1>
			<textarea onChange={this.oncc.bind(this)}>

			</textarea>
		</div>;
	}
	oncc(t)
	{
		this.setState({lines: this.findLines(t.target.value)});
	}
	findLines(v)
	{
		return 1;
	}
}

render(App, document.getElementById('container'));
