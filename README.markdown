Usage
=====

Include keyHandler.js in your document

``` html
  <script src="keyHandler.js"></script>
```

Watch for events.

``` javascript
// Create a new instance of the key handler
keyHandler = new KeyHandler();

// Begin listening for ctrl+shift+a
keyHandler.registerListener('ctrl', 'shift', 'a', function(){
  // do some stuff
});

// Unregister any listener bound to ctrl+shift+a
keyHandler.unregisterListener('ctrl', 'shift', 'a' );
```


