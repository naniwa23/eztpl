describe('dynamically change placeholder delimiter', function testBasicTemplateFunctions() {

	it('replace a simple placeholder', function() {
		var tpl = new eztpl('Hello {name}!');

		tpl.setPlaceholderDelimiter('{', '}');
		tpl.replace('name', 'you');

		expect(tpl.getTpl()).toBe('Hello you!');
	});



	it('replace a simple placeholder block', function() {
		var tpl = new eztpl('<pl_block name="name">Hello ::name::!</pl_block>');

		tpl.setPlaceholderBlockDelimiter('<pl_block name="placeholder_name">', '<\\/pl_block>');
		tpl.replace('name', 'you');

		expect(tpl.getTpl()).toBe('Hello you!');
	});



	it('replace a simple placeholder block where variable is false', function() {
		var tpl = new eztpl('<pl_block name="name">Hello ::name::!</pl_block>');

		tpl.setPlaceholderBlockDelimiter('<pl_block name="placeholder_name">', '<\\/pl_block>');
		tpl.replace('name', false);

		expect(tpl.getTpl()).toBe('');
	});


	it('replace a simple block', function() {
		var tpl = new eztpl('I like eztpl <block name="very">very </block>much.');

		tpl.setBlockDelimiter('<block name="blockname">', '<\\/block>');
		tpl.replace('very', [{x:0},{x:0},{x:0}]);

		expect(tpl.getTpl()).toBe('I like eztpl very very very much.');
	});



	it('replace with "stacked" placeholder types', function() {
		var tpl = new eztpl('I am ::name::!');

		tpl.replace('name', '/*title*|title|*title*/(name)');
		tpl.setPlaceholderBlockDelimiter('\\/\\*placeholder_name\\*', '\\*placeholder_name\\*\\/');
		tpl.setPlaceholderDelimiter('\\|', '\\|');
		tpl.replace('title', 'Dr. ');
		tpl.setPlaceholderDelimiter('\\(', '\\)');
		tpl.replace('name', 'Who');

		expect(tpl.getTpl()).toBe('I am Dr. Who!');
	});
});