/**
 * Interactive form and chart events / logic.
 *
 * Things I could do:
 *   Add legends to the charts.
 *   Improve form styles.
 *   Save birthday in local storage and prepopulate on refresh.
 * 	 Allow for people to change charts via a form in the title?
 * 	 Test on devices / browsers.
 * 	 Confirm that it's accurate down to the hour, etc.
 * 	 Improve valdiation (no days above 31, or even month-specific validation).
 */
(function() {
  var unit = document.getElementById('unit').textContent.toLowerCase(),
      yearEl = document.getElementById('year'),
      monthEl = document.getElementById('month'),
      dayEl = document.getElementById('day'),
      items = document.querySelectorAll('.life li'),
      itemCount,
      COLOR = 'red',
      KEY = {
        UP: 38,
        DOWN: 40
      };

  // Set listeners
  yearEl.addEventListener('input', _handleDateChange);
  yearEl.addEventListener('keydown', _handleUpdown);
  yearEl.addEventListener('blur', _unhideValidationStyles);
  monthEl.addEventListener('change', _handleDateChange);
  dayEl.addEventListener('input', _handleDateChange);
  dayEl.addEventListener('blur', _unhideValidationStyles);

  // Ensure the month is unselected by default.
  monthEl.selectedIndex = -1;

  // Event Handlers
  function _handleDateChange(e) {
    if (_dateIsValid()) {
      itemCount = calculateElapsedTime('years');
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
      var currentDate = Date.now(),
          dateOfBirth = _getDateOfBirth(),
          diff = currentDate - dateOfBirth,
          elapsedTime;

      switch (unit) {
        case 'days':
          elapsedTime = Math.round(diff/(1000*60*60*24));
          break;
        case 'weeks':
          elapsedTime = Math.round(diff/(1000*60*60*24*7));
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
