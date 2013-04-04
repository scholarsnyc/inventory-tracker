var $fields = $('#fields'),
    $createField = $('#create-field'),
    $newField = $('#new-field'),
    $newLabel = $('#new-label');
    
$createField.on('click', function(event) {
  event.preventDefault();
  $('<label></label>', { text: $newLabel.val() })
    .appendTo($fields);
  $('<input></input>', { 
      name: $newField.val(),
      type: 'text' })
    .appendTo($fields);
});