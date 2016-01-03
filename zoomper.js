(function() {

// shim for browsers that don't support dataset
var getData = function(elt, key) {
    if('dataset' in elt) {
        return elt.dataset[key];
    }
    else {
        return elt.getAttribute(['data', key].join('-'));
    }
}

var Zoomper = function(elt, small, large) {         
    this.elt = elt;
    this.smallImg = small;
    this.largeImg = large;
    this.frameSize = {'width': parseInt(elt.style.width), 'height': parseInt(elt.style.height)};
    this.mode = 'out';
    this.cursorStates = {'in': 'zoom-out', 'out': 'zoom-in'};
    this.initComplete = false;
}
Zoomper.prototype = {
    positionZoom: function(evt) {
        var diff = {'x': evt.offsetX / this.frameSize.width, 'y': evt.offsetY / this.frameSize.height};
        this.elt.style.backgroundPosition = [diff.x * 100, '%', ' ', diff.y * 100, '%'].join('');
    },
    listenHover: function() {
        var _this = this;
        this.elt.addEventListener('mousemove', function(evt) {
            if(_this.mode === 'out') return;
            _this.positionZoom(evt);
        });
    },
    unlistenHover: function() {
        this.elt.style.backgroundPosition = 'center center';
        this.elt.removeEventListener('mousemove');
    },
    zoomState: function(mode) { // 'in' || 'out'
        if(mode === 'in') {
            this.elt.style.backgroundImage = 'url(' + this.largeImg + ')';
            this.listenHover();
            this.elt.style.backgroundPosition = '200px 20px';
            this.elt.style.cursor = this.cursorStates.in;
        }
        else {
            this.elt.style.backgroundImage = 'url(' + this.smallImg + ')';
            this.unlistenHover();
            this.elt.style.cursor = this.cursorStates.out;
        }
    },
    zoomStateToggle: function() {
        this.mode = this.mode === 'in' ? 'out' : 'in';
        this.zoomState(this.mode);              
    },
    loadImagesCB: function(cb) {
        var toLoad = [this.smallImg, this.largeImg],
            loaded = 0,
            checkComplete = function() {
                loaded++;
                if(toLoad.length === loaded) cb();
            }
        for(var i = 0; i < toLoad.length; i++) {
            var img = new Image;
            img.onload = checkComplete;
            img.src = toLoad[i];
        }
    },
    init: function() {
        var _this = this;
        _this.elt.style.backgroundRepeat = 'no-repeat';
        _this.zoomState('out');
        _this.elt.addEventListener('click', function(evt) { 
            _this.zoomStateToggle(); 
            _this.positionZoom(evt);
        });           
        return _this;
    }
}

var zoomper = function(elt) {
    return new Zoomper(elt, getData(elt, 'small'), getData(elt, 'large')).init();
}

})();
