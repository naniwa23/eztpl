describe('basic template functions', function testBasicTemplateFunctions() {

	it('replace a simple placeholder', function() {
		var tpl = new eztpl('Hello ::name::!');

		tpl.replace('name', 'you');

		expect(tpl.getTpl()).toBe('Hello you!');
	});



	it('replace a simple placeholder block', function() {
		var tpl = new eztpl('::=name>::Hello ::name::!::<name=::');

		tpl.replace('name', 'you');

		expect(tpl.getTpl()).toBe('Hello you!');
	});



	it('replace a simple placeholder block where variable is false', function() {
		var tpl = new eztpl('::=name>::Hello ::name::!::<name=::');

		tpl.replace('name', false);

		expect(tpl.getTpl()).toBe('');
	});



	it('replace a simple block', function() {
		var tpl = new eztpl('I like eztpl ::>very>::very ::<very<::much.');

		tpl.replace('very', [{},{},{}]);

		expect(tpl.getTpl()).toBe('I like eztpl very very very much.');
	});



	it('replace a simple block with placeholder inside', function() {
		var tpl = new eztpl('I like ::>like_block>::::like::::<like_block<::.');

		tpl.replace('like_block', [{like: 'pizza'}, {like: ', sunny weather'}, {like: ' and chocolate'}]);

		expect(tpl.getTpl()).toBe('I like pizza, sunny weather and chocolate.');
	});



	it('remove a placeholder', function() {
		var tpl = new eztpl('Hello ::title:: ::name::!');

		tpl.replace('name', 'John');
		tpl.delPlaceholder('title');

		expect(tpl.getTpl()).toBe('Hello  John!');
	});



	it('remove all placeholders', function() {
		var tpl = new eztpl('Hello ::title:: ::name::!');

		tpl.delPlaceholder();

		expect(tpl.getTpl()).toBe('Hello  !');
	});



	it('remove a block', function() {
		var tpl = new eztpl('You have ::cnt:: ::>new_block>::new ::<new_block<::messages!');

		tpl.replace('cnt', 123);
		tpl.delBlock('new_block');

		expect(tpl.getTpl()).toBe('You have 123 messages!');
	});



	it('remove all blocks', function() {
		var tpl = new eztpl('You have ::cnt:: ::>new_block>::new ::<new_block<::messages!');

		tpl.replace('cnt', 123);
		tpl.delBlock();

		expect(tpl.getTpl()).toBe('You have 123 messages!');
	});

	it('get block content', function() {
		var tpl = new eztpl('You have ::cnt:: ::>new_block>::new ::<new_block<::messages!');

		expect(tpl.getTpl('new_block')).toBe('new ');
	});
});