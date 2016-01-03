/*
 *  jquery-circular - v1.0.1
 *  A jQuery Circle Chart
 *  http://www.circular.cabcom13.de
 *
 *  Made by Sven Schmalfuß
 *  Under MIT License
 */
(function($){
 "use strict";
    
  $.fn.circular = function(options) {
    // support multiple elements
    if (this.length > 1){
        this.each(function() { 
            $(this).circular(options);
        });
        return this;
    }
    var _this = this;
    var raf =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    window.requestAnimationFrame = raf;  
    
    
      
    var defaults = {
        style: 'full',
        radius: 150,
        targetpercent: 0,
        initPercentValue:0,
        velocity: 10,
        background: 'rgba(21,21,21,.05)',
        'border-radius':1,
        'border-color': 'rgba(21,21,21,0)',
        'border-style': 'solid',
        text: 'Verfügbar',
        state_percent: 0,
        infocircle: {
            'background-color': '#FFFFFF',
            'shadow-color': 'rgba(21, 21, 21,.3)',
            blur: 5,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            'font-size': '13px',
            'font-family': 'Arial',
            color: '#212121',
            'text-align': "center",
            showIndicator: true
        },
        datacircle:{
            innercolor: '#AAD138',
            outercolor: '#83A324',
        },

        onSuccess: function(){
            
        },
        onInit: function(){
        
        },
        onDraw: function(){
            
        },
        onDestroy: function(){
            
        }
         

    };
    
 options = $.extend({}, defaults, options); 
    
    
    // private variables
    var $el = $(this);
    var size;
    var ctx = $el[0].getContext("2d");
    var centerX = $el[0].width / 2;
    var centerY = $el[0].height / 2;
    var radius = options.radius;
    if(options.style === 'half'){
        size = Math.PI;
    } else {
        size = Math.PI*2;
    }
    
    var initPercentValue = options.initPercentValue;
    var centercircle = (radius / 2);
    var radius1 = ((radius - centercircle) * initPercentValue / 100) + centercircle;
    var state_percent;
    var globalID;
    var animator = function(){
            
            globalID = requestAnimationFrame(animator);

            options.state_percent = Math.round(100*((radius1-centercircle)*2)/radius) ;
            options.onDraw(options.state_percent);    
            if(options.state_percent === options.targetpercent){
                 cancelAnimationFrame(globalID);
                 options.onSuccess(options.state_percent);
            } else {
                
                if(options.targetpercent < options.state_percent){
                    radius1 = radius1 - (0.125)* options.velocity;
                } else{
                    radius1 = radius1 + (0.125)*options.velocity;
                }
                
                //
            }     
            
            ctx.globalCompositeOperation = 'source-over';
            ctx.clearRect(0, 0, $el[0].height, $el[0].width); // clear canvas  
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, size, true);
            ctx.closePath();

            ctx.fillStyle = options.background;
            ctx.strokeStyle = options["border-color"];
            ctx.lineWidth = options["border-radius"];
        
            if(options["border-style"] === 'dashed'){
               ctx.setLineDash([10,5,10,5]); 
            } else if(options["border-style"] === 'dotted'){
                ctx.setLineDash([2,2,2,2]); 
            } else {
                ctx.setLineDash([0,0,0,0]);
            }
            
            if(options["border-radius"] !== 0){
                ctx.stroke();
            }
            ctx.fill();            

            // DATA CIRCLE
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius1 , 0, size, true); // outer (filled)
            ctx.arc(centerX, centerY, centercircle, 0, size, true); // outer (unfills it)
            ctx.closePath();
                    ctx.lineWidth=2;
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = options.datacircle.outercolor;
            ctx.stroke();
            var grd = ctx.createRadialGradient(centerX, centerY, 75, centerX, centerY, 150);
            grd.addColorStop(0, options.datacircle.innercolor);
            grd.addColorStop(1, options.datacircle.outercolor);

            ctx.fillStyle = grd;

            ctx.shadowColor = 'transparent';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, centercircle, 0, size, true);
            ctx.closePath();
            ctx.fillStyle = options.infocircle["background-color"];
            ctx.shadowColor = options.infocircle["shadow-color"];
            ctx.shadowBlur = options.infocircle.blur;
            ctx.shadowOffsetX = options.infocircle.shadowOffsetX;
            ctx.shadowOffsetY = options.infocircle.shadowOffsetY;
            ctx.fill();
  

            ctx.beginPath();
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY =0;
            ctx.font = options.infocircle["font-size"]+' '+ options.infocircle["font-family"];
            ctx.fillStyle = options.infocircle.color;
            ctx.textAlign = options.infocircle["text-align"];
            if(options.style === 'half'){
                ctx.fillText(options.text.toUpperCase(), centerX, centerY-(options.radius/5));
            } else {
                ctx.fillText(options.text.toUpperCase(), centerX, centerY);
            }
            ctx.closePath();


                ctx.font = "bold 15px Arial";
                ctx.fillStyle = "#212121";

                ctx.textAlign = "center";
                if(options.style === 'half'){
                     ctx.fillText(options.state_percent+'%', centerX, centerY-(options.radius/5)+20);   
                } else {
                    ctx.fillText(options.state_percent+'%', centerX, centerY+20);  
                }

    };  
    
    var draw = function() {
            ctx.clearRect(0, 0, $el[0].height, $el[0].width); // clear canvas  
            ctx.globalCompositeOperation = 'source-over';
            options.state_percent = initPercentValue;
         
            ctx.clearRect(0, 0, $el[0].height, $el[0].width); // clear canvas  
            ctx.beginPath();
            var x = ctx.arc(centerX, centerY, radius, 0, size, true);
            ctx.closePath();
            ctx.fillStyle = options.background;
            ctx.strokeStyle = options["border-color"];
            ctx.lineWidth = options["border-radius"];
    

            if(options["border-style"] === 'dashed'){
               ctx.setLineDash([10,5,10,5]); 
            } else if(options["border-style"] === 'dotted'){
                ctx.setLineDash([2,2,2,2]); 
            } else {
                ctx.setLineDash([0,0,0,0]);
            }
            if(options["border-radius"] !== 0){
                ctx.stroke();
            }
            
            ctx.fill();            

            // DATA CIRCLE
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius1, 0, size, true); // outer (filled)
            ctx.arc(centerX, centerY, centercircle, 0, size, true); // outer (unfills it)
            ctx.closePath();
            ctx.lineWidth=0;
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = options.datacircle.outercolor;
            //ctx.stroke();
            // create radial gradient
            var grd = ctx.createRadialGradient(centerX, centerY, 75, centerX, centerY, 150);
            // light blue
            grd.addColorStop(0, options.datacircle.innercolor);
            // dark blue
            grd.addColorStop(1, options.datacircle.outercolor);

            ctx.fillStyle = grd;
            
            ctx.fill();

            ctx.beginPath();
            ctx.arc(centerX, centerY, centercircle, 0, size, true);
            ctx.closePath();
            ctx.fillStyle = options.infocircle["background-color"];
            ctx.shadowColor = options.infocircle["shadow-color"];
            ctx.shadowBlur = options.infocircle.blur;
            ctx.shadowOffsetX = options.infocircle.shadowOffsetX;
            ctx.shadowOffsetY = options.infocircle.shadowOffsetY;
            ctx.fill();

            ctx.beginPath();
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY =0;
            ctx.font = options.infocircle["font-size"]+' '+ options.infocircle["font-family"];
            ctx.fillStyle = options.infocircle.color;
            ctx.textAlign =options.infocircle["text-align"];
            if(options.style === 'half'){
                ctx.fillText(options.text.toUpperCase(), centerX, centerY-(options.radius/5));
            } else {
                ctx.fillText(options.text.toUpperCase(), centerX, centerY);
            }
            
            ctx.closePath();

            ctx.shadowBlur = 0;
            ctx.font = "bold 15px Arial";
            ctx.fillStyle = "#212121";
            ctx.textAlign = "center";  
   
            if(options.style === 'half'){
                 ctx.fillText(initPercentValue+'%', centerX, centerY-(options.radius/5)+20);   
            } else {
                ctx.fillText(initPercentValue+'%', centerX, centerY+20);  
            }
        
             
            options.onInit.call();
    };
    
    
    this.destroy = function(){
        ctx.clearRect(0, 0, $el[0].height, $el[0].width); // clear canvas  
        options.onDestroy();
    };
    // public methods        
    this.initialize = function() {
       draw();
         return this.bind('onSuccess' , function(){
               return options.state_percent;
         });  
    };
    this.getStat = function(){
        return options.state_percent;
    };

    this.setBar = function(key) {
        options.targetpercent = key; 
        cancelAnimationFrame(globalID);
        animator();
    };
    

    
    return this.initialize();
};
})(jQuery);
