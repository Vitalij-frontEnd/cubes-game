/*model*/
function GameModel(configs) {
    this.configs = $.extend({
        container: $('#zone'),
        size: 4,
        similar: 2,
        timeStartShow: 2000,
        timeLimit: 2
    }, configs);
    this.compareAr = [];
    this.arrColors = [];
    this.arrProp = [];
    this.successArr = [];
};
GameModel.prototype = {
    _createArrColors: function () {
        var a1 = [],
                a2 = (this.configs.size * this.configs.size) / this.configs.similar;
        for (var j = 0; j < a2; j++) {
            a1.push("#" + Math.random().toString(16).slice(2, 8));
        }
        for (var i = 0; i < this.configs.similar; i++) {
            this.arrColors = a1.concat(this.arrColors);
        }
        this.arrColors.sort(function () {
            return Math.random() - 0.5;
        });
    },
    _buildArr: function () {
        for (var i = 0; i < this.configs.size * this.configs.size; i++) {
            $("<div/>", {
                'style': "background-color: " + this.arrColors[i] + ";",
                "class": "square"
            }).appendTo(this.configs.container);
        }
        this.items = $('.square');
    },
    _setCubeWidth: function () {
        var itemW = this.items.outerWidth(true),
                zoneW = itemW * this.configs.size;
        $(this.configs.container).css({
            width: zoneW
        });
    },
    _compareItems: function () {
        if (this._checkOnSimilar()) {
            if (this.arrProp.length === this.configs.similar) {
                for (var i in this.arrProp) {
                    this.successArr.push(1);
                }
                this.arrProp = [];
            }
        } else {
            for (var i in this.arrProp) {
                this._refreshDifferent(this.items.eq(this.arrProp[i]));
            }
            this.arrProp = [];
        }
    },
    _setColorItem: function (clicked) {
        var index = clicked.index();
        if (this.arrProp.indexOf(index) === -1) {
            this.arrProp.push(index);
        }
        clicked.css({
            'background-color': this.arrColors[index]
        }).addClass('is-visible');
    },
    _checkOnSimilar: function () {
        for (var i = 1; this.arrProp.length > i; i++) {
            if (this.arrColors[this.arrProp[0]] !== this.arrColors[this.arrProp[i]]) {
                return false;
            }
        }
        return true;
    },
    _refreshDifferent: function (diffItem) {
        setTimeout(function () {
            $(diffItem).css('background-color', '').removeClass('is-visible');
        }, 450);
    },
    _refreshAfterStart: function () {
        var items = this.items;
        setTimeout(function () {
            items.css({
                'background-color': ''
            });
        }, this.configs.timeStartShow);
    },
    _refreshGame: function () {
        this.clickOnElement;
        this.arrProp = [];
        this.successArr = [];
        this.arrColors = [];
        this.items.remove();
        this._createArrColors();
        this._buildArr();
        this._refreshAfterStart();
        clearInterval(globalInterval);
        $('#timerIndicator').css({
            'width': '100%',
            'background-color': 'green'
        });
        this._setTimeLimit();
    },
    _buttonStatus: function () {
        $('.startGame').attr('disabled', 'disabled');
        $('.refreshGame').removeAttr('disabled');
    },
    _setTimeLimit: function () {
        var a = this.configs.timeLimit,
                b = a * 60 * 100,
                c = 100 / b,
                d = 0,
                e = 0,
                f = $('#timerIndicator'),
                g = $('#timer'),
                self = this;
        setTimeout(function () {
            globalInterval = setInterval(function () {
                e += c;
                d = 100 - e;
                f.css({
                    'width': d + '%'
                });
                if (d > 0) {
                    f.css({
                        'background-color': '#ca4100'
                    });
                }
                if (d > 25) {
                    f.css({
                        'background-color': '#e46c33'
                    });
                }
                if (d > 50) {
                    f.css({
                        'background-color': '#b9981e'
                    });
                }
                if (d > 75) {
                    f.css({
                        'background-color': 'green'
                    });
                }
                if (d < 0) {
                    self._pastLimitedTime();
                }
            }, 10);
        }, this.configs.timeStartShow);
        g.css('visibility', 'visible');

    },
    _pastLimitedTime: function () {
        if (confirm('Press ok to play again')) {
            $('#timerIndicator').css({
                'width': '100%',
                'background-color': 'green'
            });
            this._refreshGame();
            clearInterval(globalInterval);
        } else {
            clearInterval(globalInterval);
            $(document).off('click', '.square');
            $('.refreshGame').attr('disabled', 'disabled');
        }
    },
    _endGame: function () {
        if (this.successArr.length === (this.configs.size * this.configs.size)) {
            if (confirm('Finish, play again?')) {
                this._refreshGame();
            } else {
                clearInterval(globalInterval);
                $(document).off('click', '.square');
                $('.refreshGame').attr('disabled', 'disabled');
            }
        }
    }
};


function GameController() {
    _model = new GameModel({
        container: $('#zone'),
        size: 3,
        similar: 3,
        timeStartShow: 2000,
        timeLimit: 1 //minutes
    });
    this.startGame = function () {
        _model._buttonStatus();
        _model._createArrColors();
        _model._buildArr();
        _model._setCubeWidth();
        _model._refreshAfterStart();
        _model._setTimeLimit();
    };
    this.refreshGame = function () {
        _model._refreshGame();
    };
    this.clickOnElement = function () {
        $(document).on('click', '.square', function () {
            var $thisItem = $(this);
            _model._setColorItem($thisItem);
            _model._compareItems();
            _model._endGame();
        });
    };
}
GameController.prototype.init = function () {
    var self = this;
    $('.startGame').on('click', function () {
        self.startGame();
    });
    $('.refreshGame').on('click', function () {
        self.refreshGame();
    });
    self.clickOnElement();
};

var globalInterval;
$(document).ready(function () {
    new GameController().init();
});
