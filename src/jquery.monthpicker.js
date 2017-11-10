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
      
      buttons.nextYear.removeClass('disabled');
      
      data.year--;
      if(data.minYear && data.minYear > data.year) {
      	data.year++;
        return $(this).addClass('disabled');
      }
      else {
      	$(this).removeClass('disabled');
      }
      
      title.text(data.year);
      container.data('month-picker', data).find('.active').removeClass('active');
    });
    
    buttons.nextYear.click(function(e) {
    	var container = buttons.nextYear.parents('.mp-container');
      var input = container.siblings('input');
      var title = container.find('.mp-title');
      var data = container.data('month-picker');
      
      buttons.prevYear.removeClass('disabled');
      
      data.year++;
      if(data.maxYear && data.maxYear < data.year) {
        data.year--;
        return $(this).addClass('disabled');
      }
      else {
      	$(this).removeClass('disabled');
      }
      
      title.text(data.year);
      container.data('month-picker', data).find('.active').removeClass('active');
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
  
  function setEvents(element, container, options) {
  	if($.fn.mask) element.mask('00/0000')
  
  	element.focus(function(e) {
    	container.show();
    });
    
    container.parent().click(function(e) {
    	e.stopPropagation();
    });
    
    element.change(function() {
    	var currContainer = $(this).siblings('.mp-container');
    	var value = $(this).val().split('/');
      var month = parseInt(value[0]) - 1;
      var year = value[1];
      
      if(options.onChange) options.onChange(value[0], value[1]);
      
      if(month > 11) month = 11;
      if(month < 0) month = 0;
      
      if(year.length < 4) return;
      currContainer.data('month-picker', {
      	year: year,
        month: month
      });
      
      currContainer.find('.mp-month-button').each(function() {
      	var self = $(this);
      	if(parseInt(self.data('month')) == month) {
        	self.addClass('active');
        } else {
        	self.removeClass('active');
        }
      });
      currContainer.find('.mp-title').text(year);
      month = month + 1;
      var monthTxt = month < 10 ? '0' + month.toString() : month.toString();
      element.val(monthTxt + '/' + year);
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
      element.val(monthTxt + '/' + data.year);
      
      if(options.onChange) options.onChange(monthTxt, data.year);
      
      $(this).parents('.mp-container').data('month-picker', data).hide();
    });
  }

  $.fn.monthPicker = function(options) {
  	if(options.monthLabels && options.monthLabels.length == 12) months = options.monthLabels;
  
    var inputElement = this;
    var currDate = new Date();
    var inputContainer = $('<div class="mp-input-container"></div>');
    var containerElement = $('<div class="mp-container"></div>');
    var headerElement = genMpHeader(currDate);
    var monthButtons = genMonthButtons();
    
    containerElement.data('month-picker', {
    	year: currDate.getFullYear(),
      month: currDate.getMonth(),
      minYear: options.minYear || null,
      maxYear: options.maxYear || null
    });
    
    if(options.icon) inputContainer.append('<i class="' + options.icon + '"></i>')
    
    containerElement.append(headerElement);
    containerElement.append(monthButtons);
    inputContainer.append(containerElement);
    inputContainer.insertBefore(inputElement);
    inputContainer.append(inputElement);
    
    setEvents(inputElement, containerElement, options);
  }
})($ || JQuery);