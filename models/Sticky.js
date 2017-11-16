var mongoose = require('mongoose');

var StickySchema = new mongoose.Schema({
    text: String,
    top: Number,
    left: Number,
    color: {type: String, default: '#ffc'},
    height: Number,
    width: Number,
});

StickySchema.methods.changeColor = function(color, cb) {
    this.color = color;
    this.save(cb);
};

StickySchema.methods.changeSize = function(height, width, cb) {
    this.height = height;
    this.width = width;
    this.save(cb);
};

StickySchema.methods.changeLoc = function(top, left, cb) {
    this.top = top;
    this.left = left;
    this.save(cb);
};

StickySchema.methods.changeText = function(text, cb) {
    this.text = text;
    this.save(cb);
};

mongoose.model('Sticky', StickySchema);