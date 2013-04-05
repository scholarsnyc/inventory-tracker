$(document).ready(function(){
  var $fields = $('#fields'),
      $createField = $('#create-field'),
      $createType = $('#create-type'),
      $itemTypes = $('#item-types')
      $newField = $('#new-field'),
      $newLabel = $('#new-label')
      $messages = $('#messages'),
      $uniqueFields = $('.uniqueField');
  
  if (window.Modernizr.localstorage) {
    loadLocalFields();
    loadLocalTypes();
  }
  
  $('.field-removeable').each(function(index, element){
    $element = $(element);
    addRemoveButtonToRemoveableField($element);
  });
    
  $createField.on('click', function(event) {
    event.preventDefault();
    createField($newLabel.val(), $newField.val());
  });
  
  $createType.on('click', function(event) {
    event.preventDefault();
    createType($newLabel.val());
  });
  
  $('#create-item').on('submit', function(event){
    event.preventDefault();
    
    var data = {};
    
    $(this).find('input, select').each(function(index, element){
      var $el = $(element);
      if ( $el.val() !== "" ) {
        data[$el.attr('name')] = $el.val();
      }
    });
    
    $.ajax({
      type: "POST",
      url: '/create',
      data: data,
      success: function(){
        newMessage('Item #' + data._id + ' has been successfully saved.');
        clearUniqueData();
      },
      error: function(xhr, status, err) {
        newMessage('Error: ' + err + ' (' + status + ').', 'error');
      }
    });
  });
  
  $('.remove-field').on('click', function(event) {
    var $field = $(this).closest('.field');
    var fieldName = $field.children('input').first().attr('name');
    
    removeFieldLocally(fieldName);
    $field.remove();
  })
  
  var validator = new FormValidator('create-item', [{
      name: '_id',
      rules: 'required|callback_check_inventory_tag'
    }, {
      name: 'assetTag',
      rules: 'callback_check_asset_tag'
    }], function(errors, event) {
      if (errors.length > 0) {
        newMessage(value.message, 'error');
      }
  });

  validator.registerCallback('check_inventory_tag', function(value) {
    if ( value.match(/^3SCAC[\d\+\$\-\*\%\.\/]{10}$/) ) {
      return true;
    }  
    return false;
  })
  .setMessage('check_inventory_tag', 'You must use a valid inventory tag. ' +
    '(Example: 3SCAC070006912)'
  );
    
  validator.registerCallback('check_asset_tag', function(value) {
    if ( value.match(/^DOE-/) || value === "") {
      return true;
    }
    return false;
  })
  .setMessage('check_asset_tag', 'You must use a valid asset tag. ' + 
    'Those typically start with "DOE-".'
  );

  function newMessage (message, type) {
    type = type || 'info';
    
    var $message = $('<div></div>', {
      'class': 'alert alert-' + type,
      'data-dismiss': 'alert',
      'style': 'margin-top: 1em;'
    });
    
    $('<li></li>', {text: message }).appendTo($message);
    
    $message.appendTo($messages);
  
    return $message;
  }
  
  function clearUniqueData () {
    $uniqueFields.each(function(index, element){
      $(element).val('');
    });
  }

  function createField (label, name, skipLocalSave) {
    var $field = $('<div></div>', {
      class: 'field field-removeable'
    });
  
    var $label = $('<label></label>', { text: label })
      .appendTo($field);
      
    var $name = $('<input></input>', { 
        name: name,
        type: 'text' })
      .appendTo($field);
      
    addRemoveButtonToRemoveableField($field);
    $field.appendTo($fields);
  
    
    if (!skipLocalSave) { 
      saveFieldLocally(label, name);
      newMessage(label + ' added to item properties.', 'info');
    }
  
    return $field;
  }
  
  function createType(type, skipLocalSave) {
    var $option = $('<option></option>', { text: type }).appendTo($itemTypes);
    
    if (!skipLocalSave) { 
      saveTypeLocally(type);
      newMessage(type + ' added to item types.', 'info');
    }
    
    return $option
  }

  function saveFieldLocally(label, name) {
    if (!Modernizr.localstorage) return false;
  
    if (localStorage.inventoryFields) {
      var currentFields = JSON.parse(localStorage.inventoryFields);
    } else {
      var currentFields = {};
    }
  
    currentFields[name] = label;
    localStorage['inventoryFields'] = JSON.stringify(currentFields);
  }
  
  function removeFieldLocally(name) {
    if (!Modernizr.localstorage) return false;
    
    if (localStorage.inventoryFields) {
      var currentFields = JSON.parse(localStorage.inventoryFields);
    } else {
      return;
    }
    
    console.log('Removing ' + name + ' (Inside remove function)');
    delete currentFields[name];
    console.log(currentFields);
    localStorage['inventoryFields'] = JSON.stringify(currentFields);
  }
  
  function saveTypeLocally(type) {
        if (!Modernizr.localstorage) return false;
      
        if (localStorage.inventoryTypes) {
          var currentTypes = JSON.parse(localStorage.inventoryTypes);
        } else {
          var currentTypes = [];
        }
      
        currentTypes.push(type);
        localStorage['inventoryTypes'] = JSON.stringify(currentTypes);
      }
  
  function loadLocalFields() {
    var localFields = JSON.parse(localStorage.inventoryFields);
    
    for (field in localFields) {
      if (Object.hasOwnProperty.call(localFields, field)) {
        createField(localFields[field], field, true)
      }
    }
  }
  
  function loadLocalTypes() {
    if (localStorage.inventoryTypes) {
      var localTypes = JSON.parse(localStorage.inventoryTypes);
      
      localTypes.forEach(function(type){
        createType(type, true);
      });
    }
  }
  
  function addRemoveButtonToRemoveableField($field) {
    if ($field.find('span')[0]) return $field;
    
    var $label = $field.find('label');
    
    var removeButton = $('<span></span>', {
      html: '<i class="icon-thumbs-down"></i>',
      class: 'remove-field',
      style: 'margin-left: 0.5em;'
    }).appendTo($label);
    
    return $field;
  }
});