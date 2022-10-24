import jsonToHTML from "./src/jsonToHtmlParser.js";

document.querySelector('button#btn-1').addEventListener('click', ()=>{
	const jsonObject = {
		"property-string": 'this is a string',
		"property-null": null,
		"property-html": '<div><u>Title<u><div><div>Content Here<div>',
		"property-integer": 5000,
		"property-boolean": true,
		"property-function": function greet(){
			console.log('hello!');
			console.log('bye!');
		},
		"property-subNode": {
			"property-string": 'another string',
			"property-boolean": false,
			"property-subNode": {
				"property-integer": 123,
				"property-function": function showAlert(){
					alert('this alert is being showed');
				}
			}
		}
	};
	let element = document.querySelector('code#parseHere');
	let jsonToHtml = new jsonToHTML();
	jsonToHtml.parse( jsonObject ).insertInto(element);
});