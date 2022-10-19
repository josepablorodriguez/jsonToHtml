# JSON to HTML Parser
JSON to HTML Parser is a light-weight library to present a JSON object as you see it un your IDE or console.log() in an HTML element.

## Installation
You can currently fork the library, clone it, or download it.

## Usage
The information it can parse is limited, it currently handles string, html, integers and functions.

### HTML
Your **index.html** file

```html
<!doctype html>
<html lang="en">
<head>
    <link rel="stylesheet" href="src/jsonToHtmlParser.css"> <!-- where the jsonToHtml .css file is located -->
    <script type="module" defer src="script.js"></script>
    <title>JSON to HTMl Parser DEMO</title>
</head>
<body>
<main>
    <button id="btn-1">Parse</button>
    <pre><code id="code"></code></pre>
</main>
</body>
</html>
```
JSON to HTML Parser is a module library, for that reason the type of the script tag is **module** instead of **text/javascript**.
### Javascript
Your **script.js** file
```javascript
import jsonToHtmlParser from "./jsonToHtmlParser.js"; // where your jsonToHtmlParser.js file is located

document.querySelector('button#btn-1').addEventListener('click', ()=>{
	// create a JSON Object
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
	// get the element where you want to present the JSON into.
	let element = document.querySelector('code#parseHere'),
        // instantiate the parser.
        jsonToHtml = new jsonToHtmlParser();
	// parse the JSON into HTML elements and insert them into the Element.
	jsonToHtml.parse( jsonObject ).insertInto(element);
});
```

## Demo
[Go to Demo [under construction]](https://google.com)

## Roadmap
These are some future features you can expect from the JSON to HTML Parser library:
1. Live demo. (*paste your JSON content into a textarea and parse it into HTML*)
2. Floating-point properties.
3. Array properties.
4. Code structure inside functions.


## Sources
JSON to HTML Parser was created from scratch by necessity and now is available for you.

### License
[MIT](https://choosealicense.com/licenses/mit/)