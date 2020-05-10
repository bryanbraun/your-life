/**
 * Interactive form and chart events / logic.
 */
(function() {
  var yearEl = document.getElementById('year'),
      monthEl = document.getElementById('month'),
      dayEl = document.getElementById('day'),
      unitboxEl = document.getElementById('unitbox'),
      unitText = document.querySelector('.unitbox-label').textContent.toLowerCase(),
      items = document.querySelectorAll('.chart li'),
      itemCount,
      COLOR = 'red',
      KEY = {
        UP: 38,
        DOWN: 40
      };

  // Set listeners
  unitboxEl.addEventListener('change', _handleUnitChange);
  yearEl.addEventListener('input', _handleDateChange);
  yearEl.addEventListener('keydown', _handleUpdown);
  yearEl.addEventListener('blur', _unhideValidationStyles);
  monthEl.addEventListener('change', _handleDateChange);
  dayEl.addEventListener('input', _handleDateChange);
  dayEl.addEventListener('blur', _unhideValidationStyles);

  // Ensure the month is unselected by default.
  monthEl.selectedIndex = -1;

  // Event Handlers
  function _handleUnitChange(e) {
    window.location = '' + e.currentTarget.value + '.html';
  }

  function _handleDateChange(e) {
    if (_dateIsValid()) {
      itemCount = calculateElapsedTime();
      _repaintItems(itemCount);
    } else {
      _repaintItems(0);
    }
  }

  function _handleUpdown(e) {
    var newNum;
    // A crossbrowser keycode option.
    thisKey = e.keyCode || e.which;
    if (e.target.checkValidity()) {
      if (thisKey === KEY.UP) {
        newNum = parseInt(e.target.value, 10);
        e.target.value = newNum += 1;
        // we call the date change function manually because the input event isn't
        // triggered by arrow keys, or by manually setting the value, as we've done.
        _handleDateChange();
      } else if (thisKey === KEY.DOWN) {
        newNum = parseInt(e.target.value, 10);
        e.target.value = newNum -= 1;
        _handleDateChange();
      }
    }
  }

  function _unhideValidationStyles(e) {
    e.target.classList.add('touched');
  }

  function calculateElapsedTime() {
      var currentDate = new Date(),
          dateOfBirth = _getDateOfBirth(),
          diff = currentDate.getTime() - dateOfBirth.getTime(),
          elapsedTime;

      switch (unitText) {
        case 'days':
          elapsedTime = Math.round(diff/(1000*60*60*24));
          break;
        case 'weeks':
          elapsedTime = Math.round(diff/(1000*60*60*24*7));
          break;
        case 'months':
          // Months are tricky, being variable length, so I opted for the average number
          // of days in a month as a close-enough approximation.
          elapsedTime = Math.round(diff/(1000*60*60*24*30.4375));
          break;
        case 'years':
          elapsedTime = Math.round(diff/(1000*60*60*24*365.25));
          break;
      }

      return elapsedTime || diff;
  }

  function _dateIsValid() {
    return monthEl.checkValidity() && dayEl.checkValidity() && yearEl.checkValidity();
  }

  function _getDateOfBirth() {
    return new Date(yearEl.value, monthEl.value, dayEl.value);
  }

  function _repaintItems(number) {
    for (var i = 0; i < items.length; i++) {
      if (i < number) {
        items[i].style.backgroundColor = COLOR;
      } else {
        items[i].style.backgroundColor = '';
      }
    }
  }
})();
