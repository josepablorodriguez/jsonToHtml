const DEFAULT_OPTIONS = {
	debug: false,
};

export default class jsonToHTML{
	/*region PRIVATE VARS*/
	#debug;
	#jsonStringified;
	#parsedElements = [];
	/*endregion*/
	constructor(options){
		this.update({ ...DEFAULT_OPTIONS, ...options });
	}
	/*region SETTERS*/
	set debug(value){
		this.#debug = value;
	}
	/*endregion*/

	/*region METHODS*/
	update(options){
		Object.entries( options ).forEach(([key, value]) => {
			this[key] = value;
		});
	}
	parse(json){
		let classes = '', word = '', clean_word = '', position = 0,
			level = '', isFunction = false, comment = '';

		this.#jsonStringified = JSON.stringify(json);

		for(let i = 0; i<json.length; i++){
			if((/^:+$/i).test(json[i])) {
				if(word.length > 0) {
					classes = `jth-property ${level}`;
					this.#parsedElements.push(`<div class="${classes}">${word}</div>`);
					if(this.#debug) console.log('property value set');
				}
				word = '';
				classes = 'jth-operator';
				if(this.#debug) console.log('operator value set');
			}
			if((/^[{}\[\]().,;\\]+$/i).test(json[i])) {
				if(word.length > 0) {
					word = word.trimStart();
					clean_word = word.replace(/"/g, '');

					if(word === `"`){
						word = '';
					}
					else if(!isNaN(clean_word) && clean_word.length > 0){
						classes = 'jth-number';
						this.#parsedElements.push(`<div class="${classes}">${clean_word}</div>`);
						if(this.#debug) console.log('number value set');
					}
					else if(clean_word === 'true' || clean_word === 'false'){
						classes = 'jth-boolean';
						this.#parsedElements.push(`<div class="${classes}">${clean_word}</div>`);
						if(this.#debug) console.log('boolean value set');
					}
					else if(clean_word.includes('function')){
						let data = clean_word.split(' ');

						if(data.length === 2){
							isFunction = true;
							classes = 'jth-function';
							this.#parsedElements.push(`<div class="${classes}">${data[0]}</div>`);
							classes = 'jth-function-name';
							this.#parsedElements.push(`<div class="${classes}">${data[1]}</div>`);
							if(this.#debug) console.log('function value set');
						}
					}
					else{
						if(json[i] === '.'){
							classes = `jth-object ${level}`;
							this.#parsedElements.push(`<div class="${classes}">${clean_word}</div>`);
							if(this.#debug) console.log('object value set');
						}
						else if(json[i] === '('){
							classes = `jth-function-call ${level}`;
							this.#parsedElements.push(`<div class="${classes}">${clean_word}</div>`);
							if(this.#debug) console.log('function-call value set');
						}
						else if(json[i] === '}' && isFunction && clean_word.length === 0){
							isFunction = false;
						}
						else {
							classes = 'jth-string';
							this.#parsedElements.push(`<div class="${classes}">'${clean_word}'</div>`);
							if(this.#debug) console.log('string value set');
						}
					}
				}
				word = '';

				classes = 'jth-punctuator';
				if(json[i] === `\\`) { continue; }
				if(json[i] === '.') classes += ' jth-dot';
				if(json[i] === ',') classes += ' jth-comma';
				if(json[i] === ';') classes += ' jth-semicolon';
				if(json[i] === '{') {
					++position;
					level = `jth-level_${position}`;
					classes += ` ${level} jth-curly-bracket jth-opening`;
				}
				if(json[i] === '}') {
					classes += ` ${level} jth-curly-bracket jth-closing`;
					--position;
					level = `jth-level_${position}`;
					this.#parsedElements.push(`<div class="jth-new-line"></div>`);
				}
				if(json[i] === '(' || json[i] === ')'){
					classes = 'jth-punctuator jth-round-bracket';
				}
			}
			if((/^[a-z0-9\-"<>\s#]+$/i).test(json[i])) {
				word += json[i];
				word = word.replace(/</g, '&lt;');
				word = word.replace(/>/g, '&gt;');
				word = word.replace(`""`, `"`);
			}
			if(word.length === 0) {
				this.#parsedElements.push(`<div class="${classes}">${json[i]}</div>`);
				if(this.#debug) console.log('punctuator value set');
				if(json[i] === '{' || json[i] === ',') {
					this.#parsedElements.push(`<div class="jth-new-line"></div>`);
					if(this.#debug) console.log('new_line value set');
				}

				if(json[i] === ';'){
					this.#parsedElements.push(`<div class="jth-new-line"></div>`);
					if(this.#debug) console.log('new_line value set');
				}
			}
			classes = "";
		}
		return this;
	}
	insertInto(element){
		element.innerHTML = '';
		this.#parsedElements.forEach((elem)=>{
			element.innerHTML += elem;
		});
	}
	parsedElements(){
		return this.#parsedElements;
	}
	isDebuging(){
		return this.#debug;
	}
	/*endregion*/
}
