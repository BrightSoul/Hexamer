'use strict';

var Confettiful = function Confettiful(el) {
  this.el = el;
  this.containerEl = null;

  this.confettiFrequency = 3;
  this.confettiColors = ['#fce18a', '#ff726d', '#b48def', '#f4306d'];
  this.confettiAnimations = ['slow', 'medium', 'fast'];
  this.stopAfterMilliseconds = 2000;

  this._setupElements();
  this._renderConfetti();
};

Confettiful.prototype._setupElements = function () {
  var containerEl = document.createElement('div');
  var elPosition = this.el.style.position;

  if (elPosition !== 'relative' || elPosition !== 'absolute') {
    this.el.style.position = 'relative';
  }

  containerEl.classList.add('confetti-container');

  this.el.appendChild(containerEl);
  this.el.classList.add('active');
  this.containerEl = containerEl;
};

Confettiful.prototype._renderConfetti = function () {
    var _this = this;
    _this.confettiStartedAt = (new Date()).getTime();
    _this.confettiInterval = setInterval(function () {
    var confettiEl = document.createElement('div');
    var confettiSize = Math.floor(Math.random() * 5) + 15 + 'px';
    var confettiBackground = _this.confettiColors[Math.floor(Math.random() * _this.confettiColors.length)];
    var confettiLeft = Math.floor(Math.random() * _this.el.offsetWidth) + 'px';
    var confettiAnimation = _this.confettiAnimations[Math.floor(Math.random() * _this.confettiAnimations.length)];

    confettiEl.classList.add('confetti', 'confetti--animation-' + confettiAnimation);
    confettiEl.style.left = confettiLeft;
    confettiEl.style.width = confettiSize;
    confettiEl.style.height = confettiSize;
    confettiEl.style.backgroundColor = confettiBackground;

    confettiEl.removeTimeout = setTimeout(function () {
      confettiEl.parentNode.removeChild(confettiEl);
    }, 3000);

    _this.containerEl.appendChild(confettiEl);
    if ((new Date()).getTime() > _this.stopAfterMilliseconds + _this.confettiStartedAt) {
        clearInterval(_this.confettiInterval);
		setTimeout(function() {
		_this.el.classList.remove('active');
		}, 3000);
    }
  }, 25);
};