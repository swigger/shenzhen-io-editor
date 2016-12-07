/**
 * Created by xungeng on 2016/12/7.
 */
let _ = require('underscore');

function info(text, cpos)
{
	let chars_info = function(line, lpos){
		let nc = 0, sp = 0;
		for (let i=0; i<line.length; ++i)
		{
			if (i == cpos)break;
			if (line[i] == ' ' || line[i] == "\t")
			{
				sp += 1;
			}
			else
			{
				sp = 0;
				nc += 1;
			}
		}
		return [nc, sp];
	};
	//translate cpos to line, non-space chars, space chars.
	let r = {};
	let cpinfo = [];
	let lines = text.split(/\n/);

	if (lines.length > 0 && lines[lines.length-1]==='')
		lines.pop();
	r.lines = lines.length;
	if (r.lines < 0) r.lines = 0;

	for (let i = 0; i<r.lines; ++i)
	{
		let l = lines[i];
		if (l.length  < cpos)
			cpos -= l.length + 1;
		else
		{
			cpinfo.push(i);
			cpinfo = cpinfo.concat(chars_info(l, cpos));
			break;
		}
	}

	r.cpinfo = cpinfo;
	return r;
}

function apply(text, infoobj)
{
	let chars_apply = function(line, nc2, sp2){
		let nc = 0,  sp = 0;
		for (let i=0; i<line.length; ++i)
		{
			if (nc == nc2 && sp == sp2) return i;
			if (line[i] == ' ' || line[i] == "\t")
			{
				sp += 1;
			}
			else
			{
				if (nc == nc2) return i;
				sp = 0;
				nc += 1;
			}
		}
		return line.length;
	};

	let lines = text.split(/\n/);
	if (lines.length > 0 && lines[lines.length-1]==='')
		lines.pop();

	let rpos = 0;
	for (let i = 0; i<lines.length; ++i)
	{
		let l = lines[i];
		if (i < infoobj.cpinfo[0])
			rpos += l.length+1;
		else
		{
			rpos += chars_apply(l, infoobj.cpinfo[1], infoobj.cpinfo[2]);
			break;
		}
	}
	return rpos;
}

function isChange(text, cpos, infoobj)
{
	let info1 = info(text, cpos);
	if (info1.cpinfo && infoobj.cpinfo && info1.cpinfo[0] === infoobj.cpinfo[0] &&
		info1.lines == infoobj.lines)
		return false;
	return true;
}

module.exports = {
	isChange,
	apply,
	info
};
