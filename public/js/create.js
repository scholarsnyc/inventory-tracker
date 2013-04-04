$(document).ready(function(){
  var $fields = $('#fields'),
      $createField = $('#create-field'),
      $newField = $('#new-field'),
      $newLabel = $('#new-label')
      $messages = $('#messages');
    
  $createField.on('click', function(event) {
    event.preventDefault();
    $('<label></label>', { text: $newLabel.val() })
      .appendTo($fields);
    $('<input></input>', { 
        name: $newField.val(),
        type: 'text' })
      .appendTo($fields);
  });
  
  var validator = new FormValidator('create-item', [{
      name: '_id',
      rules: 'required|callback_check_inventory_tag'
    }, {
      name: 'assetTag',
      rules: 'callback_check_asset_tag'
    }], function(errors, event) {
      if (errors.length > 0) {
        
        if ( $errors ) $errors.remove();
                
        var $errors = $('<div></div>', {
          'class': 'alert alert-error',
          'data-dismiss': 'alert',
          'style': 'margin-top: 1em;'
        });
        
        $.each(errors, function(index, value) {
          $('<li></li>', { text: value.message })
            .appendTo($errors);
        });
        
        $errors.appendTo($messages);
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

});