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
	#isString(str){
		if(str.charAt(0) === '!') return false;
		if(!str.includes(' ')) return false;
		if(!isNaN) return false;
		return true;
	}
	update(options){
		Object.entries( options ).forEach(([key, value]) => {
			this[key] = value;
		});
	}
	parse(json){
		let classes = '', word = '', clean_word = '', position = 0,
			isNumber = false, isFunction = false, isString = false,
			level = '', comment = '', prevElement = '';

		json = JSON.stringify(json);
		this.#jsonStringified = json;

		for(let i = 0; i<json.length; i++){
			//OPERATORS
			if((/^[:=*]+$/i).test(json[i])) {

				clean_word = word.replace(/"/g, '').trimStart().trimEnd();
				if(word.length > 0) {
					if(json[i] === ':'){
						classes = `jth-property ${level}`;
						this.#parsedElements.push(`<span class="${classes}">${word}</span>`);
						if(this.#debug) console.log('property value set');
						word = '';
						classes = 'jth-operator jth-colon';
					}
					else if(json[i] === '=' && isFunction && isNaN(clean_word)){
						let data = clean_word.split(' ');
						if(data.length === 2){
							classes = `jth-keyword ${level}`;
							this.#parsedElements.push(`<span class="${classes}">${data[0]}</span>`);
							if(this.#debug) console.log('keyword value set');
							classes = 'jth-variable';
							this.#parsedElements.push(`<span class="${classes}">${data[1]}</span>`);
							if(this.#debug) console.log('variable value set');
						}
						word = '';
						classes = 'jth-operator jth-equals';
					}
					else if(json[i] === '*' && isFunction){
						if(isNumber && !isNaN(clean_word)){
							classes = 'jth-number';
							this.#parsedElements.push(`<span class="${classes}">${clean_word}</span>`);
							if(this.#debug) console.log('number value set');
						}
						else{
							classes = 'jth-variable';
							this.#parsedElements.push(`<span class="${classes}">${clean_word}</span>`);
							if(this.#debug) console.log('variable value set');
						}
						word = '';
						classes = 'jth-operator jth-multiply';
					}
					if(this.#debug) console.log('operator value set');
				}
			}
			//PUNCTUATORS
			if((/^[{}\[\]().,;\\]+$/i).test(json[i])) {
				if(word.length > 0) {
					word = word.trimStart();
					clean_word = word.replace(/"/g, '');

					if(word === `"`){
						word = '';
					}
					else if(!isNaN(clean_word) && clean_word.length > 0){
						classes = 'jth-number'; isNumber = true;
						this.#parsedElements.push(`<span class="${classes}">${clean_word}</span>`);
						if(this.#debug) console.log('number value set');
					}
					else if(clean_word === 'true' || clean_word === 'false'){
						classes = 'jth-boolean';
						this.#parsedElements.push(`<span class="${classes}">${clean_word}</span>`);
						if(this.#debug) console.log('boolean value set');
					}
					else if(clean_word.includes('function')){
						let data = clean_word.split(' ');
						if(data.length === 2){
							isFunction = true;
							classes = 'jth-function';
							this.#parsedElements.push(`<span class="${classes}">${data[0]}</span>`);
							classes = 'jth-function-name';
							this.#parsedElements.push(`<span class="${classes}">${data[1]}</span>`);
							if(this.#debug) console.log('function value set');
							word = '';
						}
					}
					else{
						if(isString && !isFunction){
							word += json[i];
						}
						else{
							if(json[i] === '.'){
								classes = 'jth-object';
								if(!prevElement.includes('jth-round-bracket jth-opening'))
									classes += ` ${level}`;
								this.#parsedElements.push(`<span class="${classes}">${clean_word}</span>`);
								if(this.#debug) console.log('object value set');
							}
							else if(json[i] === '('){
								if(clean_word.length === 0 && prevElement.includes('new-line'))
									this.#parsedElements.pop();
								else{
									classes = `jth-function-call ${level}`;
									this.#parsedElements.push(`<span class="${classes}">${clean_word}</span>`);
									if(this.#debug) console.log('function-call value set');
								}
							}
							else if(json[i] === ')'){
								if(!this.#isString(word)){
									if(prevElement.includes('jth-dot')) {
										classes = 'jth-function-call';
										this.#parsedElements.push(`<span class="${classes}">${clean_word}</span>`);
									}
									else if(prevElement.includes('jth-multiply')){
										classes = 'jth-variable';
										this.#parsedElements.push(`<span class="${classes}">${clean_word}</span>`);
									}
									else{
										classes = `jth-object`;
										this.#parsedElements.push(`<span class="${classes}">${clean_word}</span>`);
										if(this.#debug) console.log('object value set');
									}
								}
							}
							else {
								if(clean_word.length > 0) {
									if(prevElement.includes('jth-dot')) {
										classes = 'jth-function-call';
										this.#parsedElements.push(`<span class="${classes}">${clean_word}</span>`);
									}
									else{
										classes = 'jth-string';
										this.#parsedElements.push(`<span class="${classes}">'${clean_word}'</span>`);
									}
									if (this.#debug) console.log('string value set');
								}
							}
							word = '';
						}
					}
				}

				if(!isString || isFunction){
					if(!isString) word = '';
					classes = 'jth-punctuator';
					if(json[i] === `\\`) { continue; }
					if(json[i] === '.') classes += ' jth-dot';
					if(json[i] === ',') classes += ' jth-comma';
					if(json[i] === ';') classes += ' jth-semicolon';
					//if(json[i] === '=') classes += ' jth-equals';
					if(json[i] === '{') {
						++position;
						level = `jth-lvl_${position}`;
						classes += ` ${level} jth-curly-bracket jth-opening`;
					}
					if(json[i] === '}') {
						classes += ` ${level} jth-curly-bracket jth-closing`;
						--position;
						level = `jth-lvl_${position}`;
						this.#parsedElements.push(`<span class="jth-new-line"></span>`);
						if(isFunction && clean_word.length === 0) isFunction = false;
					}
					if(json[i] === '('){
						classes = 'jth-punctuator jth-round-bracket jth-opening';
					}
					if(json[i] === ')'){
						classes = 'jth-punctuator jth-round-bracket jth-closing';
					}
				}
				if(isNumber){
					if(json[i] === '.'){
						classes = 'jth-number jth-dot';
						this.#parsedElements.push(`<span class="${classes}">${json[i]}</span>`);
						word = '';
					}
					if(json[i] === ';') {
						isNumber = false;
						word = '';
					}
				}
			}
			//TEXT -- adds characters to string
			if((/^[a-zñ0-9\-"<>_¡!¿?\s#=:]+$/i).test(json[i])) {
				word += json[i];
				if(json[i] === `"`)
					isString = !isString;

				word = word.replace(/</g, '&lt;');
				word = word.replace(/>/g, '&gt;');
				word = word.replace(`""`, `"`);

				if(word === ':') word = '';
				if(word === '=' && isFunction) word = '';
			}
			if(word.length === 0) {
				this.#parsedElements.push(`<span class="${classes}">${json[i]}</span>`);
				if(this.#debug) console.log('punctuator value set');
				if(json[i] === '{' || json[i] === ',' || json[i] === ';') {
					this.#parsedElements.push(`<span class="jth-new-line"></span>`);
					if(this.#debug) console.log('new_line value set');
				}
				
				if(json[i] === '.' && isNumber){
					this.#parsedElements.pop();
					isNumber = false;
				}
			}
			classes = "";
			prevElement = this.#parsedElements[(this.#parsedElements.length - 1)];
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
	isDebugging(){
		return this.#debug;
	}

	/*endregion*/
}