fabric.util.object.extend(fabric.Text.prototype, {
    letterSpace: 0,
    _renderChars: function (method, ctx, chars, left, top) {
        if (!this.letterSpace) {
            ctx[method](chars, left, top);
            return;
        }
        var characters = String.prototype.split.call(chars, '');
      if(this.textAlign == 'left'){
          var charShift = 0;
            for (var i = 0; i < chars.length; i++) {
                if (i > 0) {
                    charShift += this.letterSpace + ctx.measureText(chars.charAt(i - 1)).width;
                }
                ctx[method](chars.charAt(i), left + charShift, top);
            }    
        }else if(this.textAlign == 'right'){
            
            characters.reverse();
            chars = characters.join('');
          var charShift = 0;
            for (var i = 0; i < chars.length; i++) {
                if (i > 0) {
                    charShift += this.letterSpace + ctx.measureText(chars.charAt(i - 1)).width;
                }
                ctx[method](chars.charAt(i), left - charShift, top);
            }    
        }else if(this.textAlign == 'center'){
            
            var totalWidth = 0;
            for (var i = 0; i < characters.length; i++) {
                totalWidth += (ctx.measureText(characters[i]).width + this.letterSpace);
            }
            var currentPosition = left - (totalWidth / 2);
            
            
          var charShift = 0;
            for (var i = 0; i < chars.length; i++) {
                if (i > 0) {
                    charShift += this.letterSpace + ctx.measureText(chars.charAt(i - 1)).width;
                }
                ctx[method](chars.charAt(i), currentPosition + left + charShift, top);
            }    
        }
        
    },
    _getLineWidth: function (ctx, lineIndex) {
        var lineLength = this._textLines[lineIndex].length;
        var additionalSpaceSum = 0;
        if (lineLength > 0) {
            additionalSpaceSum = this.letterSpace * (lineLength - 1);
        }
        this.__lineWidths[lineIndex] = ctx.measureText(this._textLines[lineIndex]).width + additionalSpaceSum;
        return this.__lineWidths[lineIndex];
    },
    _renderExtended: function (ctx) {
        this.clipTo && fabric.util.clipContext(this, ctx);
        this.extendedRender = true;
        this._renderTextBackground(ctx);
        this._renderText(ctx);

        this._renderTextDecoration(ctx);
        this.clipTo && ctx.restore();
    }
});