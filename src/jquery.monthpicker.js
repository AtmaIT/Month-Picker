(function($){
	var months = [
  	'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];
  
  function genMpHeader(currDate) {
    var header = $('<div class="mp-header"></div>');    
    var buttons = {
    	prevYear: $('<button type="button" class="mp-header-button prev"> &laquo; </div>'),
      nextYear: $('<button type="button" class="mp-header-button next"> &raquo; </div>')
		};
    
    buttons.prevYear.click(function(e) {
    	var container = buttons.nextYear.parents('.mp-container');
      var title = container.find('.mp-title');
      var data = container.data('month-picker');
            
      data.year--;
      disableYearButtons(buttons.prevYear, buttons.nextYear, data);
      
      title.text(data.year);
      container.data('month-picker', data).find('.active').removeClass('active');
      disableMonthButtons(container.find('.mp-month-button'), data);
    });
    
    buttons.nextYear.click(function(e) {
    	var container = buttons.nextYear.parents('.mp-container');
      var input = container.siblings('input');
      var title = container.find('.mp-title');
      var data = container.data('month-picker');
      
      
      data.year++;
      disableYearButtons(buttons.prevYear, buttons.nextYear, data);  
      
      title.text(data.year);
      container.data('month-picker', data).find('.active').removeClass('active');
      disableMonthButtons(container.find('.mp-month-button'), data);
    });
    
    var headerTitle = $('<span class="mp-title"></span>').text(currDate.getFullYear());
    
    header.append(buttons.prevYear);
    header.append(headerTitle);
    header.append(buttons.nextYear);
    
    return header;
  }
  
  function genMonthButtons() {
  	var buttonsContainer = $('<div class="mp-buttons-container"></div>');
  	months.forEach(function(item, index) {
    	var button = $('<button type="button" class="mp-month-button"></button>').text(item).data('month', index);
    	buttonsContainer.append(button);
    })
    return buttonsContainer;
  }

  function disableYearButtons(prevButton, nextButton, data) {
    nextButton.prop('disabled', false);
    prevButton.prop('disabled', false);
                  
    if(data.minYear && data.minYear == data.year) prevButton.prop('disabled', true);
    else prevButton.prop('disabled', false);

    if(data.maxYear && data.maxYear == data.year) nextButton.prop('disabled', true);
    else nextButton.prop('disabled', false);
  }

  function disableMonthButtons(buttons, options) {
    buttons.each(function() {
      var self = $(this);
      var month = self.data('month') + 1;
      if(options.minMonth && options.minYear && options.year == options.minYear && month < options.minMonth) self.prop('disabled', true);
      else if(options.maxMonth && options.maxYear && options.year == options.maxYear && month > options.maxMonth) self.prop('disabled', true);
      else self.prop('disabled', false);
    });
  }

  function setActiveMonth(buttons, options) {
    buttons.each(function() {
      var self = $(this);
      if(parseInt(self.data('month')) == options.month) self.addClass('active');
      else self.removeClass('active');
    });
  }

  function validateDate(month, year, options) {
    if(month > 11) month = 11;
    if(month < 0) month = 0;  

    if(options.minMonth && options.minYear && options.year == options.minYear && month < options.minMonth) month = options.minMonth - 1;
    else if(options.maxMonth && options.maxYear && options.year == options.maxYear && month > options.maxMonth) month = options.maxMonth - 1;

    if(year.length == 4 && options.maxYear && options.maxYear < year) year = options.maxYear;
    else if(year.length == 4 && options.minYear && options.minYear > year) year = options.minYear;

    return { year, month };
  }

  function maskDate(key, value, separator) {    
    if(key == 8) return value;
    if(key < 96 && key > 57) return value;
    if(key > 105 || key < 48) return value;

    value = value.replace(/\D/g,'');
    var count = value.length;

    if(count >= 3) value = value.substr(0, 2) + separator + value.substr(2, 4);
    return value;
  }

  function updateDate(element, options) {
    var currContainer = element.siblings('.mp-container');
    var data = currContainer.data('month-picker');
    var separator = options.separator || '/';
    var value = element.val().split(separator);

    var validatedDate = validateDate(parseInt(value[0]) - 1, value[1], data);      
    if(options.onChange) options.onChange(value[0], value[1]);
          
    
    if(validatedDate.year.length < 4) return;
    data.year = validatedDate.year;
    data.month = validatedDate.month;
    currContainer.data('month-picker', data);
    
    disableMonthButtons(currContainer.find('.mp-month-button'), data);
    setActiveMonth(currContainer.find('.mp-month-button'), data);
    
    currContainer.find('.mp-title').text(validatedDate.year);
    validatedDate.month++;
    var monthTxt = validatedDate.month < 10 ? '0' +validatedDate.month.toString() : validatedDate.month.toString();
    element.val(monthTxt + separator + validatedDate.year);
  }
  
  function setEvents(element, container, options) {
    var separator = options.separator || '/';

  	element.keyup(function(event) {
      var value = maskDate(event.which || event.keyCode, event.target.value, separator);
      if(!value) return false;

      element.val(value);
      if(value.length == 6 + (options.separator ? options.separator.length : 1)) updateDate(element, options);    
    });
  
  	element.focus(function(e) {
    	container.show();
    });
    
    container.parent().click(function(e) {
    	e.stopPropagation();
    });
    
    $('body').click(function() {
    	container.hide();
    });
    
    container.find('.mp-month-button').click(function() {
    	var month = $(this).data('month');
      var data = $(this).parents('.mp-container').data('month-picker');
      data.month = month;
      month++;
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      
      var monthTxt = month < 10 ? '0' + month : month;
      element.val(monthTxt + separator + data.year);
      
      if(options.onChange) options.onChange(monthTxt, data.year);
      
      $(this).parents('.mp-container').data('month-picker', data).hide();
    });
  }

  $.fn.monthPicker = function(options) {
    options = options || {};
  	if(options.monthLabels && options.monthLabels.length == 12) months = options.monthLabels;
  
    var inputElement = this;
    var currDate = new Date();
    var inputContainer = $('<div class="mp-input-container"></div>');
    var containerElement = $('<div class="mp-container ' + (options.containerClass || '') + '"></div>');
    var headerElement = genMpHeader(currDate);
    var monthButtons = genMonthButtons();
    var data = {
    	year: options.initialDate ? parseInt(options.initialDate.split(options.separator || '/')[1]) : currDate.getFullYear(),
      month: options.initialDate ? parseInt(options.initialDate.split(options.separator || '/')[0]) - 1 : currDate.getMonth(),
      minYear: options.minYear || null,
      minMonth: options.minMonth || null,
      maxYear: options.maxYear || null,
      maxMonth: options.maxMonth || null
    };

    containerElement.data('month-picker', data);
    if(options.icon) inputContainer.append('<i class="' + options.icon + '"></i>')
    
    containerElement.append(headerElement);
    containerElement.append(monthButtons);
    inputContainer.append(containerElement);
    inputContainer.insertBefore(inputElement);
    inputContainer.append(inputElement);
    
    setEvents(inputElement, containerElement, options);
    disableYearButtons(headerElement.find('button.prev'), headerElement.find('button.next'), data);
    disableMonthButtons(monthButtons.find('button'), data);
    
    if(options.initialDate) {
      inputElement.val(options.initialDate);
      updateDate(inputElement, data);
    }
  }
})($ || JQuery);