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

if (!Number.prototype.format){
    Number.prototype.format = function() {
        return this.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    };
}

var Day = (function(y,m,d){
    var day = 0,
        data;

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

           var _g = (_y + _b)%7,
               _d = (_f + _g - _e)%7,
               _n = _f + 3 - _d,
               _week;

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
        getData: function(){ return data;},
        setData: function(d){
            if (data === undefined) data = d;
            else{
                data.left += d.left;
                data.right += d.right;
            }
            return this;
        },
        isEqual:function(d){
            return ((d.getDay() == this.getDay()) && (d.getMonth() == this.getMonth()) &&  (d.getYear() == this.getYear()));
        },
        isGreaterThan:function(d){ return ( !this.isEqual(d) && this.getDate() > d.getDate()); },
        isLowerThan:function(d){return (!this.isEqual(d) &&  this.getDate() < d.getDate()); },
        getDaysTo: function(d){ return (d.getDate() - this.getDate()) / (86400000) },
        getWeekOfYear:getWeekOfYear,
        add:function(days){  //Add days to atual day. Negative numbers allowed past days. Return new instance Day
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
    getWeekDays: function(){return week;},
    each: function(callback){return week.each(callback);},
    getDays:function(){
        var w = new Array(),
            days = week.length;
        for(var i=0; i<days; i++) w[i] = week[i].getDay();
        return w;
    },
    getDay: function(i){return (week.length>0 && i < 7 && i >= 0) ? week[i] : undefined;},
    firstDay: function(){return this.getDay(0); },
    lastDay: function(){return this.getDay(6); },
    hasDay: function(day){
        var first = this.firstDay(),
            last = this.lastDay();
        return (day.isGreaterThan(first) && day.isLowerThan(last))
                || day.isEqual(first)
                || day.isEqual(last);

    },
    getWeekOfYear: function(){
        return (numWeek == 0) ? numWeek = day.getWeekOfYear() : numWeek;
    },
    getTotalsWeek: function(){
        var total = {left:0, right:0};
        week.each(function(){
            var data = this.getData();
            if (data){
                total.left += data.left;
                total.right += data.right;
            }
        });
        return total;
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
        getCalendarDay:function(y,m,d){
            var day = Day(y,m,d);
            for (var i=0; i<weeks.length; i++){
                if (weeks[i].hasDay(day)){
                    var offset = weeks[i].firstDay().getDaysTo(day);
                    return weeks[i].getDay(offset);
                }
            }
            return;
        },
        getInitialDay:function(){return day;},
        getWeeks:function(){return weeks;},
        setData: function(data){
            var self = this;
            data.each(function(){
                var day = self.getCalendarDay(this.date);
                if (day) day.setData(this)
            });
            return self;
        },
        getLeftData: function(){
            var leftData = new Array();
            weeks.each(function(){
                var data = this.getTotalsWeek();
                leftData.push(data.left);
            });
            return leftData;
        },
        getRightData: function(){
            var rightData = new Array();
            weeks.each(function(){
                var data = this.getTotalsWeek();
                rightData.push(data.right);
            });
            return rightData;
        },
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





var D3Calendar = (function(container, options){
    var defaults = {
            daysOfWeek: ['L','M','X','J','V','S','D'],
            dayFormat: 'dd/mm/yyyy'
        },
        opt = {},
        calendar,
        //###Create the tooltip div
        div = d3.select("#"+container).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0),
        //###Create the svg canvas
        d3Canvas = d3.select("#"+container).
                      append("svg:svg").
                      attr("width", 460).
                      attr("height", 300);

        $.extend(opt, defaults, options);
        calendar = Calendar(opt);

    var _setDay = function(y,m,d){ calendar = Calendar().setDay(y,m,d); return this;},
        _setData = function(data){
                    calendar.setData(data);
                    return this;
                },
        _display = function (){
        var numWeeks = calendar.getNumWeeks(),
            weeks = calendar.getWeeks(),
            square = 20;

        //Header weekdays
        var yDay = 0
        d3Canvas.selectAll("headerWeek")
          .data(opt.daysOfWeek)
          .enter()
          .append("svg:rect")
          .attr("x", function(datum, index) { return (index*(square+2)); })
          .attr("y", yDay)
          .attr("height", square)
          .attr("width", square)
          .attr("fill", "#BBBBBB")
          .attr("transform", "translate(150,80)")
          .attr("class", "daycell")
          ;

        d3Canvas.selectAll("textH")
          .data(opt.daysOfWeek)
          .enter()
          .append("text")
          .text(function(d) {return d;})
          .attr("x", function(datum, index) { return (index*(square+2))+(square/2); })
          .attr("y", yDay+15)
          .attr("transform", "translate(150,80)")
          .attr("font-size", "13px")
          .attr("text-anchor", "middle")
          .attr("fill","#666666")
          .style("pointer-events", "none")
          ;

        //Days
        weeks.each(function(i){
            var yDay = (i * (square+2)),
                days = this.getWeekDays();

            d3Canvas.selectAll("week"+i)
              .data(days)
              .enter()
              .append("svg:rect")
              .attr("x", function(datum, index) { return (index*(square+2)); })
              .attr("y", yDay)
              .attr("height", square)
              .attr("width", square)
              .attr("fill", "#F6F6F6")
              .attr("transform", "translate(150,100)")
              .attr("class","daycell")
              .attr("title",function(d){ return (d.getData() ) ? d.getData().title : "";})
              .classed("has-data",function(d){ return (d.getData() ) ? "True" : "";})
              .on('click',function(d){
                    var data = d.getData();
                    if (data) location.href = data.url;
                  })
              .on("mouseover", function(d) {
                var data = d.getData(),
                    yOffset = this.transform.animVal.getItem('y').matrix.f,
                    xOffset = this.transform.animVal.getItem('y').matrix.e,
                    $div = $(div[0]),
                    html = (data) ? data.title+'<br/>'+data.left+' '+data.leftUnits+' '+data.right+' '+data.rightUnits : d.toString();

                div.transition()
                    .duration(200)
                    .style("opacity", 1);
                div.html(html);
                div.style("left", (xOffset + this.x.animVal.value)-(square/2) + "px")
                    .style("top", (yOffset + this.y.animVal.value - square/2 - $div.height()) -8  + "px");
              })
              .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        });

        //text
        weeks.each(function(i){
            var yDay = (i * (square+2)),
                days = this.getWeekDays();
            d3Canvas.selectAll("text"+i)
              .data(days)
              .enter()
              .append("text")
              .text(function(d) {return d.getDay();})
              .attr("x", function(datum, index) { return (index * (square + 2)) + (square / 2); })
              .attr("y", yDay + 15)
              .attr("transform", "translate(150,100)")
              .attr("font-size", "12px")
              .attr("text-anchor", "middle")
              .attr("fill","#666666")
              .style("pointer-events", "none")
              .classed("has-data",function(d){ return (d.getData() ) ? "True" : "";})
              ;
        });

        //BARS
        var rightData = calendar.getRightData(),
            leftData = calendar.getLeftData(),
            scalaRight = d3.scale.linear(),
            scalaLeft = d3.scale.linear();

        //Right Bars
        scalaRight
            .range([0,75])
            .domain([0, d3.max(rightData, function(d) { return d; })]);

        d3Canvas.selectAll("text-right")
              .data(rightData)
              .enter()
              .append("text")
              .attr("x", 300)
              .attr("y", function(datum, index) { return (index*(square+2))+113; })
              .transition()
              .duration(1500)
              .ease("linear")
              .attr("transform", "translate(307,100)")
              .text(function(d) {return d.format() + ' km.';})
              .attr("x", function(datum, index) { return scalaRight(datum) + 5; })
              .attr("y", function(datum, index) { return (index*(square+2))+13; })
              .attr("fill", "#000")
              .attr("font-size", "12px")
              .attr("text-anchor", "left")
              .style("pointer-events", "none")
              ;

        d3Canvas.selectAll("bar-right")
              .data(rightData)
              .enter()
              .append("svg:rect")
              .attr("transform", "translate(307,100)")
              .attr("width", 0)
              .attr("fill", "#4D90FE")
              .transition()
              .duration(2000)
              .ease("linear")
              .attr("x", 0)
              .attr("y", function(datum, index) { return (index*(square+2))+1; })
              .attr("height", square-3)
              .attr("width", function(datum, index) { return scalaRight(datum); })
              ;

        //Left Bars
        scalaRight
            .range([0,75])
            .domain([0, d3.max(leftData, function(d) { return d; })]);

        d3Canvas.selectAll("bar-left")
              .data(leftData)
              .enter()
              .append("svg:rect")
              .attr("transform", "translate(145,100)")
              .attr("fill", "#4DFF00")
              .attr("x", 0)
              .attr("width", 0)
              .transition(-1)
              .duration(2000)
              .ease("linear")
              .attr("x", function(datum, index) { return -1 * scalaRight(datum); })
              .attr("y", function(datum, index) { return (index*(square+2))+1; })
              .attr("height", square-3)
              .attr("width", function(datum, index) { return scalaRight(datum); })

              ;

        d3Canvas.selectAll("text-left")
              .data(leftData)
              .enter()
              .append("text")
              .text(function(d) {return d.format() + ' m.';})
              .attr("transform", "translate(145,100)")
              .attr("x", 0)
              .transition()
              .duration(1500)
              .ease("linear")
              .attr("x", function(datum, index) { return -1 * scalaRight(datum) - 5; })
              .attr("y", function(datum, index) { return (index*(square+2))+13; })
              .attr("fill", "#000")
              .attr("font-size", "12px")
              .attr("text-anchor", "end")
              .style("pointer-events", "none")
              ;
        return this;
    };
 return {
    setDay: _setDay,
    getDay: function(y,m,d){},
    setData: _setData,
    display: _display
 };
});
