# eztpl

A simple and easy to use template class for javascript. _eztpl_ can be used in every environment, be a browser, server (eg. with nodejs) or anything else.

## install in nodejs

```
npm install eztpl
```

After that you can easily use it:
```javascript
var eztpl = require('eztpl');

var tpl_class = new eztpl('My ::template::');
```


## Usage

### load a template
```javascript
var tpl = new eztpl(template_string, options);
```
### default template placeholder

eztpl has three different kinds of placeholders (can be set via options object).

1. string placeholder

   ```
   ::placeholder_name::
   ```

   "placeholder_name" will be replaced with the string given.

2. placeholder block

   A block that will be shown or removed depending on the value of the given for "placeholder_name".

   ```
   ::=placeholder_name>::some content::<placeholder_name=::
   ```

   _placeholder\_name_ must be given. And when it is not _false_ or an empty string, the content between the opening and closing delimiter will be shown (in this case "some content").
   When _placeholder\_name_ is _false_ or an empty string the complete block will be removed.

3. repeating block

   ```
   ::>blockname>::block content::<blockname<::
   ```
   When the value of "blockname" is an array, the content of this block will be repeated for each array entry. Therefor a new instance of eztpl will be created for the block content and the content of the array entry will be applied via .replace-Methode.
   In other words, you are able to replace other template placeholder in this block directly (even other repeating blocks).


#### options

 * _remove\_whitespaces (_boolean, default: true)_

   removes all line breaks and tabs after template is loaded.

 * _placeholder_ (_array_, default: ['::', '::'])

   simple string placeholder delimiter

 * _placeholder\_block_ (_array_, default: ['::=placeholder_name>::', '::<placeholder_name=::'])

   placeholder block delimiter. The string "placeholder_name" will be replaced with the current placeholder name

 * _block_ (_array_, default: ['::>blockname>::', '::<blockname<::'])

   repeating block delimiter. The sting "blockname" will be replaced with the current repeating block name.

 * _specials_ (_array_, default: ['\_\_', '\_\_'])

   sets special variables start and end delimiter. Special variables are dynamically changing variables for repeating blocks, like
   * "index" (index number of current entry)
   * "rindex" (reverse index number of current entry)
   * "even"	(will be 1 or 0, 1 for an even entry number and 0 for odd)
   * "odd" (same as even, but inverted)
   * "count" (entry count for a repeating block)

     **Caution**: this is a variable that will be prefixed with the current block name, eg.:

     blockname = "my_block" --> eztpl will look for "\_\_my\_block_count\_\_" and not just "\_\_count\_\_"


### Methods

#### replace(search[, replace])

The main method of eztpl, it replaces any placeholder stated above.
You can use it with two arguments, where _search_ is the placeholder name and _replace_ the value, that should be inserted.

The order of replaces is irrelevant, but if you need to replace for example "id" for the contact entry and also replace the "id" of that contacts phone numbers, you should replace the phone numbers first and after that the contact id.

##### string placeholder

```javascript
// instantiate eztpl with a template string
var tpl = new eztpl('My ::template:: ::string::'),
 result;

// replace placeholder 'template' with 'first'
tpl.replace('template', 'first');

// replace placeholder 'string' with 'test'
tpl.replace('string', 'test');

// "My first test"
result = tpl.getTpl();
```

You can get the same results when you pass an _object_ as first arguments.

```javascript
// instantiate eztpl with a template string
var tpl = new eztpl('My ::template:: ::string::'),
  result;

// replace placeholder 'template' and 'string" in template
tpl.replace({
  'template': 'first',
  'string': 'test'
});

// "My first test"
result = tpl.getTpl();
```

##### placeholder block

```javascript
// instantiate eztpl with a template string
var tpl = new eztpl('Dear ::name::::=middlename>::::middlename::::<middlename=::::surname::'),
 result;

// replace string placeholder 'name' with 'John'
tpl.replace('name', 'John');

// replace string placeholder 'surname' with 'Miller'
tpl.replace('surname', 'Miller');

// replace placeholder block 'middlename' with 'Maria '
tpl.replace('middlename', 'Maria ');

// "Dear John Maria Miller"
result = tpl.getTpl();




// or with this placeholder block removed



// instantiate eztpl with a template string
var tpl = new eztpl('Dear ::name::::=middlename>::::middlename::::<middlename=::::surname::'),
 result;

// replace string placeholder 'name' with 'John'
tpl.replace('name', 'John');

// replace string placeholder 'surname' with 'Miller'
tpl.replace('surname', 'Miller');

// removes complete placeholder block 'middlename', because value is empty
tpl.replace('middlename', '');

// "Dear John Miller"
result = tpl.getTpl();
```


##### repeating block

```javascript
// instantiate eztpl with a template string
var tpl = new eztpl("Wishing list:\n\n::>wish>::* ::count:: ::wish_name::::<wish<::\n"),
  result;

// replace placeholder 'template' and 'string" in template
tpl.replace('wish',[
   {
       'count': 1,
       'wish_name': 'car'
   },
   {
      'count': 3,
      'wish_name': 'coffee'
   },
   {
      'count': 2,
      'wish_name': 'donuts'
   }
]);

// "Wishing list:
//
// * 1 car
// * 3 coffee
// * 2 donuts"
result = tpl.getTpl();
```


##### all together

```javascript
// instantiate eztpl with a template string
var tpl = new eztpl("Wishing list for ::name::::=middlename>::::middlename::::<middlename=::::surname:::\n\n::>wish>::* ::count:: ::wish_name::::<wish<::\n"),
  result;

// replace placeholder 'template' and 'string" in template
tpl.replace({
  'wish': [
      {
          'count': 1,
          'wish_name': 'car'
      },
      {
         'count': 3,
         'wish_name': 'coffee'
      },
      {
         'count': 2,
         'wish_name': 'donuts'
      }
   ],
   'name':       'John',
   'middlename': '',
   'surname':    'Miller'
});

// "Wishing list for John Miller:
//
// * 1 car
// * 3 coffee
// * 2 donuts"
result = tpl.getTpl();
```

It is also possible to nest blocks;

```html
<script id="my_contacts" type="text/template">
   <h1>My contacts</h1>

   ::>contacts>::<div>
   <h2>::name::</h2>

   Phone numbers:
   <ul>
      ::>phone_numbers>::<li>::phone_number::</li>::<phone_numbers<::
   </ul>
   </div>::<contacts<::
</script>
```

```javascript
var tmpl_string = document.getElementById('my_contacts').innerHTML,
    tpl = new eztpl(tmpl_string),
    result;

tpl.replace({
  'contacts': [
      {
          'name': 'Barrack Obama',
          'phone_numbers': [
              {
                   phone_number: '02-345-6789'
              }
          ]
      },
      {
           'name': 'John Doe',
           'phone_numbers': [
               {
                    phone_number: '09-876-5432'
               },
               {
                    phone_number: '09-182-7364'
               }
           ]
       }
   ]
});

result = tpl.getTpl();
```

_result_ will be:

```html
<h1>My contacts</h1>

<div>
   <h2>Barrack Obama</h2>

   Phone numbers:
   <ul>
      <li>02-345-6789</li>
   </ul>
</div>
<div>
   <h2>John Doe</h2>

   Phone numbers:
   <ul>
      <li>09-876-5432</li>
      <li>09-182-7364</li>
   </ul>
</div>
```


### delPlaceholder([placeholder_name])

removes a string placeholder. If no argument is passed it will remove all string placeholder.

```javascript
// instantiate eztpl with a template string
var tpl = new eztpl('My ::=template>::::template:: ::<template=::::string::'),
  result;

// removes placeholder 'template'
tpl.delPlaceholderBlock('template');

// replace placeholder 'template' and 'string" in template
tpl.replace({
  'template': 'first',
  'string': 'test'
});

// "My test"
result = tpl.getTpl();
```


### delPlaceholderBlock([placeholder_block_name])

removes a placeholder block. If no argument is passed it will remove all placeholder blocks.

```javascript
// instantiate eztpl with a template string
var tpl = new eztpl('My ::template:: ::string::'),
  result;

// removes placeholder 'template'
tpl.delPlaceholder('template');

// replace placeholder 'template' and 'string" in template
tpl.replace({
  'template': 'first',
  'string': 'test'
});

// "My  test"
result = tpl.getTpl();
```


### delBlock([block_name])

removes a repeating block. If no argument is passed it will remove all repeating block.

```javascript
// instantiate eztpl with a template string
var tpl = new eztpl("Wishing list for ::name::::=middlename>::::middlename::::<middlename=::::surname:::\n\n::>wish>::* ::count:: ::wish_name::::<wish<::\n"),
  result;

// removes block 'wish' completely
tpl.delBlock('wish');

tpl.replace({
  'wish': [
      {
          'count': 1,
          'wish_name': 'car'
      },
      {
         'count': 3,
         'wish_name': 'coffee'
      },
      {
         'count': 2,
         'wish_name': 'donuts'
      }
   ],
   'name':       'John',
   'middlename': '',
   'surname':    'Miller'
});

// "Wishing list for John Miller:"
result = tpl.getTpl();
```


### clear()

removes all template placeholders and blocks.

```javascript
// instantiate eztpl with a template string
var tpl = new eztpl("Wishing list for ::name::::=middlename>::::middlename::::<middlename=::::surname:::\n\n::>wish>::* ::count:: ::wish_name::::<wish<::\n"),
  result;

// remove all placeholder and blocks
tpl.clear();

// "Wishing list for :"
result = tpl.getTpl();
```


### getTpl([block_name])

returns the current state of the template.
If _block\_name_ is given, the content of the repeating block is returned.



### setPlaceholderDelimiter(start, end)

sets new delimiter for string placeholder.

This method awaits two arguments, a starting delimiter and an ending delimiter.

Both arguments are used in a regular expression, so special characters have to be escaped.

```javascript
tpl.setPlaceholderDelimiter('\{', '\}');
```

Above example will set the string placeholder delimiter to curled braces, so instead of '::name::', '{name}' will now be replaced.

This method can be executed at any time, means you can change the delimiters while handling a template.




### setPlaceholderBlockDelimiter(start, end)

sets new delimiter for placeholder blocks.

This method awaits two arguments, a starting delimiter and an ending delimiter.

Both arguments are used in a regular expression, so special characters have to be escaped.

The string "_placeholder\_name_" will be replaced with the name of the current placeholder block. You can use it in both arguments.

```javascript
tpl.setPlaceholderBlockDelimiter('<placeholder_block name="placeholder_name">', '<\\/placeholder_block>');
```

Above example will set the placeholder blocks delimiter to '<placeholder_block name="placeholder_name">' and '</placeholder>'.

This method can be executed at any time, means you can change the delimiters while handling a template.




### setBlockDelimiter(start, end)

sets new delimiter for repeating blocks.

This method awaits two arguments, a starting delimiter and an ending delimiter.

Both arguments are used in a regular expression, so special characters have to be escaped.

The string "_blockname_" will be replaced with the name of the current block. You can use it in both arguments.

```javascript
tpl.setBlockDelimiter('<block_blockname>', '<\\/block_blockname>');
```

Above example will set the placeholder blocks delimiter to '<block_blockname>' and '</block__blockname>', means if the block is called 'wish', it will look for '<block_wish>' and '</block_wish>';

This method can be executed at any time, means you can change the delimiters while handling a template.



