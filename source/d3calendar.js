//Add each function to Array Object

if (!Array.prototype.each){
    Array.prototype.each = function(callback){
        if (!callback) return;

        for (var i=0; i<this.length; i++){
            if (typeof this[i] === 'object' )
                callback.call(this[i], i);
            else
                callback(this[i], i);
        }
        return true;
    }
}

var Day = (function(y,m,d){
    var day = 0;

    //no params --> today
    if (y == undefined) day = new Date();
    
    //One parameter string with data 11/10/2013 or 11-10-2013
    else if (m == undefined){ 
        var p_date = y;
        if(p_date.match(/\//)) p_date = p_date.replace(/\//g,"-",p_date);
        p_date = p_date.split("-");
        day = new Date(eval(p_date[2]), eval(p_date[1])-1, eval(p_date[0]) );
    }
    //if third parameter is null then params: year, week number of year
    else if (d == undefined) day = new Date(y, 0, 1 + (m - 1) * 7);

    //normal parameters
    else day = new Date(y, m-1, d);

    function lpad(num, width, char) {
      char = char || '0';
      num = num + '';
      return num.length >= width ? num : new Array(width - num.length + 1).join(char) + num;
    }

    function getWeekOfYear(){
            var month = day.getMonth(),
            _y = (month == 0 || month == 1) ? day.getFullYear()-1 : day.getFullYear(),
            _b = Math.floor(_y/4)-Math.floor(_y/100)+Math.floor(_y/400),
            _c = Math.floor((_y-1)/4)-Math.floor((_y-1)/100)+Math.floor((_y-1)/400),
            _s = _b - _c,
            _e = (month == 0 || month == 1) ? 0 : _s+1,
            _f = (month == 0 || month == 1) ? (day.getDate()-1 + (31 * month)) : day.getDate()+Math.floor(((153*(day.getMonth()-2))+2)/5)+58+_s;
        
           _g = (_y + _b)%7;
           _d = (_f + _g - _e)%7;
           _n = _f + 3 - _d;
           
           if (_n < 0)
              week =   53 - Math.floor((_g - _s) / 5);
           else if (_n>(364 + _s))
              _week = 1;
           else
              _week = Math.floor(_n/7)+1;
           return _week;
           
        }

    return{
        getDate:function(){return day;},  //Return Date object
        getDay:function(){return day.getDate();},
        getMonth:function(){return day.getMonth()+1;},
        getYear:function(){return day.getFullYear();},
        getDayOfWeek:function(){return (day.getDay() == 0) ? 7 : day.getDay();},
        getWeekOfYear:getWeekOfYear,
        add:function(days){  //Add days to atual day. Negative numbers allowed to past days. Return new instance Day
            return Day(this.getYear(), this.getMonth(), this.getDay()+days);
        },
        toString:function(){return lpad(this.getDay(),2)+'/'+lpad(this.getMonth(),2)+'/'+this.getYear();},
        toURI:function(){return encodeURIComponent(this.getYear()+'-'+lpad(this.getMonth(),2)+'-'+lpad(this.getDay(),2));}
    }
});


var Week = (function(y,m,d){
    var day = 0,
        week = [],
        numWeek = 0;

    day = (typeof y === 'object') ? y : Day(y,m,d);

    var dayOfWeek = day.getDayOfWeek();
    for (var i=1; i<=7; i++){
        week.push(day.add( i-dayOfWeek ));
    }
        
 return {
    getWeekDays:function(){return week;},
    each:function(callback){return week.each(callback);},
    getDays:function(){
        var w = new Array(),
            days = week.length;
        for(var i=0; i<days; i++) w[i] = week[i].getDay();
        return w;
    },
    firstDay:function(){return (week.length>0) ? week[0] : undefined;},
    lastDay:function(){return (week.length>0) ? week[6] : undefined;},
    getWeekOfYear:function(){
        return (numWeek == 0) ? numWeek = day.getWeekOfYear() : numWeek;
    }
 };
});


var Calendar = (function(options){
    var defaults = {
            numWeeks: 4,
            firstDayOfWeek: 'M'
        },
        settings = {},
        weeks = new Array(),
        day = Day();
        $.extend(settings, defaults, options);

        function _calculateWeeks(){
            weeks = new Array();
            var year = day.getYear(),
                nw = day.getWeekOfYear();
            for (var i=0; i< settings.numWeeks; i++){
                weeks.push(Week(year,nw-i));
            }
            weeks.reverse();
        }

        _calculateWeeks();
        
 return {
        getNumWeeks:function(){return settings.numWeeks;},
        setDay:function(y,m,d){ day = Day(y,m,d); _calculateWeeks(); return this;},
        getDay:function(d){ return day;},
        getWeeks:function(){return weeks;},
        each:function(callback){return weeks.each(callback);},
        movePrevWeek:function(){
            var tmp = new Array();
            tmp.push(Week(this.firstDay().add(-7)));
            weeks = tmp.concat(weeks.slice(0,-1));
            return this;
        },
        moveNextWeek:function(){
            weeks = weeks.slice(1);
            weeks.push(Week(this.lastDay().add(7)));

            return this;
        },
        firstDay:function(){return (weeks.length>0) ? weeks[0].firstDay() : undefined;},
        lastDay:function(){return (weeks.length>0) ? weeks[weeks.length-1].lastDay() : undefined;},
        toString:function(){
            weeks.each(function(){
                var week = '';
                this.each(function(){week += this.getDay()+ ' ';});
                console.log(week);
                });
        }
    };
});
