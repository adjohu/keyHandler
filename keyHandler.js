var KeyboardHandler = function(){
  // Reference to the current object.
  // Simplest way to get around the scope issues with the key events
  var self = this;

  // Array of listeners
  this.listeners = [];

  // This object will contain a map of keycodes to key names
  this.keyMap = {};
  
  // Array of keys which are currently down
  this.currentKeys = [];


  /*
   * Class to create a new instance of a listener
   * Should be called with new
   */
  this.Listener = function(keys, callback){
    // Keys should be uppercase and sorted
    this.keys = keys.sort().join(',').toUpperCase().split(',');
    this.callback = callback;
  };
  

  /* 
   * Init function 
   */
  this.init = function(){
    // Observe key events on window
    window.onkeydown = this.keyDown;
    window.onkeyup = this.keyUp;

    // Loop through the KeyboardEvent object and populate keyMap object
    for( var keyName in KeyboardEvent ){
      var keyCode = KeyboardEvent[keyName];

      keyName = keyName.replace('DOM_VK_','');
      this.keyMap[keyCode] = keyName;
    }
  };

  /*
   * Takes an event, gets keyname and finds it in array.
   * Calls a callback function with the first parameter
   * as the index of keycode in array.
   *
   * @e key up/down event
   * @callback function(idx, keyName)
   */
  this.handleKeyEvent = function(e, callback){
    console.log(e);
    var keyCode = e.keyCode;
    var keyName = self.keyMap[keyCode];
    var idx = self.currentKeys.indexOf( keyName );
    callback(idx, keyName);
  };


  /*
   * KeyDown & KeyUp events
   *
   * These add and remove keys from currentKeys array
   */
  this.addKey = function(keyName){
    if( keyName == 'CAPS_LOCK') return; // Fuck capslock

    self.currentKeys.push( keyName );
  };

  this.keyDown = function(e){
    self.handleKeyEvent(e, function(idx, keyName){
      if( idx === -1 ){
        self.addKey( keyName );
      }
    });

    console.log(self.currentKeys);
    return self.runListenersMatchingCurrentKeys();
  };

  this.keyUp = function(e){
    var keyCode = e.keyCode;
    var keyName = self.keyMap[keyCode];

    self.handleKeyEvent(e, function(idx){
      if( idx > -1 ){
        self.currentKeys.splice( idx, 1 );
      }
    });

    console.log(self.currentKeys);
  };



  /* 
   * Run a listener
   */
  this.runListener = function(listener){
    return listener.callback();
  }

  /*
   * Find any listeners that match the passed keys
   * @any string paramter - key name
   * returns array of listeners
   */
  this.findMatchingListeners = function(){
    var keys = [];
    var listeners = [];
    
    // Loop through arguments, sort em, join with ,
    for( var i=0; i<arguments.length; i++ ){
      keys.push( arguments[i].toUpperCase() );
    }
    keys = keys.sort().join(',');

    // Loop through listeners, join their keys with ',' and check if match
    for( var i=0; i<this.listeners.length; i++ ){
      var listener = this.listeners[i];
      if( listener.keys.join(',') === keys ){
        listeners.push( listener );
      }
    }

    return listeners;
  };

  /*
   * Runs any listeners that match the current keys down
   */
  this.runListenersMatchingCurrentKeys = function(){
    var listeners = this.findMatchingListeners.apply( this, this.currentKeys );
    var continuePropagation = true;

    for( var i=0; i<listeners.length; i++){
      var listener = listeners[i];
      if( this.runListener( listener ) == false ) continuePropagation = false; 
    }

    return continuePropagation;
  };


  /*
   * Add a listener function to call if keys down match 
   * @any string parameter - key name
   * @function parameter - called when all keys specified are down.
   *  return false to stop propagation
   */
  this.registerListener = function(){
    var keys = [];
    var callback;

    for( var i=0; i<arguments.length; i++ ){
      arg = arguments[i];
      switch( typeof arg ){
        case 'string':
          keys.push( arg );
          break;

        case 'function':
          callback = arg; 
          break;
      }
    }

    if( keys.length > 0 && typeof callback === 'function' ){
      var listener = new this.Listener(keys, callback);
      this.listeners.push( listener );
    }
  };

  this.unregisterListener = function(){
    var matchingListeners = this.findMatchingListeners.apply(this, arguments);
    console.log( matchingListeners );
    for( var i=0; i<matchingListeners.length; i++ ){
      var matchingListener = matchingListeners[i];
      console.log( this.listeners.indexOf(matchingListener) );
      this.listeners.splice( this.listeners.indexOf(matchingListener), 1);
    }
  }


  this.init();
};
