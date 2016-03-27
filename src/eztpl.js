/**
 * easy template class (eztpl)
 * @param {string} tpl
 * @param {object} [options]
 * @returns {{}}
 */
var eztpl = function eztpl(tpl, options)
{
	"strict"
	var tpl_obj = {},
		s = (function mergeObject(opts) {
			var defaults = {
					remove_whitespaces: true,
					placeholder: ['::', '::'],
					placeholder_block: ['::=placeholder_name>::', '::<placeholder_name=::'],
					block: ['::>blockname>::', '::<blockname<::'],
					specials: ['__', '__']
				},
				key_name;

			for(key_name in defaults)
			{
				if(defaults.hasOwnProperty(key_name) && opts.hasOwnProperty(key_name)) {
					defaults[key_name] = opts[key_name];
				}
			}
			return defaults;
		})((typeof options === 'object' && options !== null) ? options : {});



	if(s.remove_whitespaces) {
		tpl = tpl.replace(/(\n|\r|\t)*/gm, '');
	}

	/**
	 * create search regular expression
	 * @param {string} search
	 * @returns {RegExp}
	 */
	function getSearchRegex(search)
	{
		return new RegExp(s.placeholder[0] + search + s.placeholder[1], 'gm');
	}

	/**
	 * create placeholder-block regular expression
	 * @param {string} placeholder_name
	 * @returns {RegExp}
	 */
	function getPlaceholderBlockRegex(placeholder_name)
	{
		var start_str	= s.placeholder_block[0].replace('placeholder_name', placeholder_name),
			stop_str	= s.placeholder_block[1].replace('placeholder_name', placeholder_name);

		return new RegExp(start_str + '(.*?)' +  stop_str, 'gm');
	}

	/**
	 * create block regular expression
	 * @param {string} block_name
	 * @returns {RegExp}
	 */
	function getBlockRegex(block_name)
	{
		var start_str	= s.block[0].replace('blockname', block_name),
			stop_str	= s.block[1].replace('blockname', block_name);

		return new RegExp(start_str + '(.*?)' +  stop_str, 'gm');
	}

	/**
	 * create a regular expression for special variables
	 * @param {string} special_name
	 * @returns {RegExp}
	 */
	function getSpecialRegex(special_name)
	{
		return new RegExp(s.specials[0] + special_name + s.specials[1], 'gm');
	}

	/**
	 * sets the delimiter for placeholder
	 * @param {string} start_delimiter
	 * @param {string} end_delimiter
	 */
	tpl_obj.setPlaceholderDelimiter = function eztplSetPlaceholderDelimiter(start_delimiter, end_delimiter) {
		if(typeof start_delimiter === 'string' && typeof end_delimiter === 'string') {
			s.placeholder = [start_delimiter, end_delimiter];
		}
	};

	/**
	 * sets the delimiter for placeholder block
	 * @param {string} start_delimiter
	 * @param {string} end_delimiter
	 */
	tpl_obj.setPlaceholderBlockDelimiter = function eztplSetPlaceholderBlockDelimiter(start_delimiter, end_delimiter) {
		if(typeof start_delimiter === 'string' && typeof end_delimiter === 'string') {
			s.placeholder_block = [start_delimiter, end_delimiter];
		}
	};

	/**
	 * sets the delimiter for block
	 * @param {string} start_delimiter
	 * @param {string} end_delimiter
	 */
	tpl_obj.setBlockDelimiter = function eztplSetBlockDelimiter(start_delimiter, end_delimiter) {
		if(typeof start_delimiter === 'string' && typeof end_delimiter === 'string') {
			s.block = [start_delimiter, end_delimiter];
		}
	};

	/**
	 * replaces search-placeholder with replace in template.
	 * If search is an {object}, it will execute multiple replaces.
	 * If replace is an {array} or {object} eztpl will search for block in the template named search and fills and replaces it.
	 * @param {string|object}	search
	 * @param {*}				[replace]	optional when search is an {object}
	 */
	tpl_obj.replace = function eztplReplace(search, replace) {
		var block_regex,
			block_tpl,
			block_html,
			block_obj,
			i,
			l,
			name,
			has_specials;

		// multi replace
		if(search instanceof Object) {
			for(name in search)
			{
				if(search.hasOwnProperty(name)) {
					tpl_obj.replace(name, search[name]);
				}
			}
		}
		// single replace
		else if('string' == typeof search) {
			// replace block
			if(replace instanceof Array || replace instanceof Object) {
				block_regex = getBlockRegex(search);
				block_tpl = tpl.match(block_regex);

				if(block_tpl) {
					block_tpl = block_tpl[0];
					block_html = '';

					if(block_tpl) {
						has_specials = getSpecialRegex('(index|rindex|even|odd)').test(block_tpl);

						for (i = 0, l = replace.length; i < l; i++)
						{
							block_obj = new eztpl(block_tpl, options);
							block_obj.replace(replace[i]);
							block_html += block_obj.getTpl();

							if(has_specials) {
								block_html = block_html.replace(getSpecialRegex('index'), i + 1);
								block_html = block_html.replace(getSpecialRegex('rindex'), l - i);
								block_html = block_html.replace(getSpecialRegex('even'), (i % 2) ? 0 : 1);
								block_html = block_html.replace(getSpecialRegex('odd'), i % 2);
							}
						}
						tpl = tpl.replace(block_regex, block_html);
						tpl = tpl.replace(getSpecialRegex(search + '_count'), l);
					}
					block_regex = getBlockRegex(search);
					tpl = tpl.replace(block_regex, '$1');
				}
			}
			// replace string
			else {
				block_regex = getPlaceholderBlockRegex(search);
				block_tpl = tpl.match(block_regex);

				if(block_tpl) {
					if(false === replace || '' === replace) {
						tpl = tpl.replace(getPlaceholderBlockRegex(search), '');
					}
					else {
						tpl = tpl.replace(getSearchRegex(search), replace);
						block_regex = getPlaceholderBlockRegex(search);
						tpl = tpl.replace(block_regex, '$1');
					}
				}
				else {
					if(false === replace || '' === replace) {
						tpl = tpl.replace(getSearchRegex(search), '');
						tpl = tpl.replace(block_regex, '');
						tpl = tpl.replace(getBlockRegex(search), '');
					}
					else {
						tpl = tpl.replace(getSearchRegex(search), replace);
						tpl = tpl.replace(block_regex, '$1');
					}
				}

			}
		}
	};

	/**
	 * removes all placeholder or a specific one when placeholder_name is given
	 * @param {string} [placeholder_name]
	 */
	tpl_obj.delPlaceholder = function eztplDelPlaceholder(placeholder_name)
	{
		if('string' === typeof placeholder_name) {
			tpl = tpl.replace(getSearchRegex(placeholder_name), '');
		}
		else {
			tpl = tpl.replace(getSearchRegex('.*?'), '');
		}
	};

	/**
	 * removes all placeholder blocks or a specific one when placeholder_block_name is given
	 * @param {string} [placeholder_block_name]
	 */
	tpl_obj.delPlaceholderBlock = function eztplDelPlaceholderBlock(placeholder_block_name)
	{
		if('string' === typeof placeholder_block_name) {
			tpl = tpl.replace(getPlaceholderBlockRegex(placeholder_block_name), '');
		}
		else {
			tpl = tpl.replace(getPlaceholderBlockRegex('.*?'), '');
		}
	}

	/**
	 * removes all blocks currently present in template or a specific on, when block_name is given
	 * @param {string} [block_name]
	 */
	tpl_obj.delBlock = function eztplDelBlock(block_name)
	{
		if('string' === typeof block_name) {
			tpl = tpl.replace(getBlockRegex(block_name), '');
		}
		else {
			tpl = tpl.replace(getBlockRegex('.*?'), '');
		}
	};

	/**
	 * removes all unreplaced placeholders and blocks
	 */
	tpl_obj.clear = function eztplClear()
	{
		// remove blocks first to save performance
		tpl_obj.delBlock();
		tpl_obj.delPlaceholderBlock();
		tpl_obj.delPlaceholder();
	};

	/**
	 * returns the current state of the template or a block if block_name is given
	 * @returns {string}
	 */
	tpl_obj.getTpl = function eztplGetTpl(block_name)
	{
		var block_regex,
			block_tpl;

		if(block_name) {
			block_regex = getBlockRegex(block_name);
			block_tpl = tpl.match(block_regex)[0];
			return block_tpl.replace(block_regex, '$1');
		}
		return tpl;
	};

	return tpl_obj;
}

if(typeof module === 'object' && typeof module.exports !== 'undefined') {
	module.exports = eztpl;
}
