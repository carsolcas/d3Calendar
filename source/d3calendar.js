var Day = (function(y,m,d){
    var day = 0;

    if (m == undefined){ //One parameter string with data 11/10/2013 or 11-10-2013
        var p_date = y;
        if(p_date.match(/\//)) p_date = p_date.replace(/\//g,"-",p_date);
        p_date = p_date.split("-");
        day = new Date(eval(p_date[2]), eval(p_date[1])-1, eval(p_date[0]) );
    }
    else if (d == undefined) //if third parameter is null then params: year, week number of year
        day = new Date(y, 0, 1 + (m - 1) * 7);
    else  //normal parameters
        day = new Date(y, m-1, d);

    function lpad(num, width, char) {
      char = char || '0';
      num = num + '';
      return num.length >= width ? num : new Array(width - num.length + 1).join(char) + num;
    }

    return{
        getDate:function(){return day;},  //Return Date object
        getDay:function(){return day.getDate();},
        getMonth:function(){return day.getMonth()+1;},
        getYear:function(){return day.getFullYear();},
        getDayOfWeek:function(){return (day.getDay() == 0) ? 7 : day.getDay();},
        getWeekOfYear:function(){
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
           
        },
        add:function(days){  //Add days to atual day. Negative numbers allowed to past days. Return new instance Day
            return Day(this.getYear(), this.getMonth(), this.getDay()+days);
        },
        toString:function(){return lpad(this.getDay(),2)+'/'+lpad(this.getMonth(),2)+'/'+this.getYear();},
        toURI:function(){return encodeURIComponent(this.getYear()+'-'+lpad(this.getMonth(),2)+'-'+lpad(this.getDay(),2));}
    }
});
   
var Week = (function(y,m,d){
    var day = 0,
        week = [];
    day = Day(y,m,d);
    
 return {
    getWeekDays:function(){
        var dayOfWeek = day.getDayOfWeek(),
            offset = 0;
            week = new Array();
        for (var i=1; i<=7; i++){
            offset = i-dayOfWeek;
            week.push(Day(day.getYear(), day.getMonth(), day.getDay()+offset));
        }
        return this;
    },
    toArray:function(){
        var w = new Array(),
            days = week.length;
        for(var i=0; i<days; i++) w[i] = week[i].getDay();
        return w;
    },
    firstDay:function(){return (week.length>0) ? week[0] : undefined;},
    lastDay:function(){return (week.length>0) ? week[6] : undefined;}
 };
});

var Calendar = function(year, month, day){
    this.date = new Date(year, month-1, day);
}

Calendar.prototype ={
    getDay:function(){return this.date.getDate();},
    getMonth:function(){return this.date.getMonth()+1;},
    getYear:function(){return this.date.getFullYear();},
    getDayOfWeek:function(){
        return (this.date.getDay() == 0) ? 7 : this.date.getDay();
    },
    getActualWeek:function(offsetWeek){
        var dayOfWeek = this.getDayOfWeek(),
            week = new Array(),
            offset = 0;
        for (var i=1; i<=7; i++){
            offset = i-dayOfWeek;
            var d = new Date(this.getYear(), this.date.getMonth(), this.getDay()+offset).getDate();
            week.push(d);
        }
        return week;
    }
}
