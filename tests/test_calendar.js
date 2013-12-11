var data=[
        { date: '10/09/2013',
          left: 1315,
          right: 69.54,
          url: 'http://gpxlog.hol.es',
          title: 'test title for '},
        { date: '12/09/2013',
          left: 1005,
          right: 35.62,
          url: 'http://gpxlog.hol.es',
          title: 'test title'},
        { date: '23/09/2013',
          left: 975,
          right: 52.3,
          url: 'http://gpxlog.hol.es',
          title: 'test title'},
        { date: '28/09/2013',
          left: 1075,
          right: 48.54,
          url: 'http://gpxlog.hol.es',
          title: 'test title'},
        { date: '02/10/2013',
          left: 1105,
          right: 39.54,
          url: 'http://gpxlog.hol.es',
          title: 'test title'},
        { date: '05/10/2013',
          left: 1115,
          right: 39.54,
          url: 'http://gpxlog.hol.es',
          title: 'test title'},

          ];

test( "Week of the Year", function() {
    var oct_week = [30,1,2,3,4,5,6],
        dec_week = [31,1,2,3,4,5,6],
        jul_week = [29,30,31,1,2,3,4],
        Week = D3Calendar().Week,
        Day = D3Calendar().Day;

    deepEqual( Week(2013,10,1).getDays(), oct_week, "October 2013. Three params!" );
    deepEqual( Week(2012,12,31).getDays(), dec_week, "December 2012. Three params!" );
    deepEqual( Week(2013,7,30).getDays(), jul_week, "July 2013. Three params!" );

    deepEqual( Week(2013,40).getDays(), oct_week, "October 2013, week number!" );
    deepEqual( Week(2013,1).getDays(), dec_week,  "December 2012, week number!" );
    deepEqual( Week(2013,31).getDays(), jul_week, "December 2012, week number!" );

    deepEqual( Week('01/10/2013').getDays(), oct_week, "October 2013. String date!" );
    deepEqual( Week('31-12-2012').getDays(), dec_week, "December 2012. String date!" );
    deepEqual( Week('30/07/2013').getDays(), jul_week, "July 2013. String date!" );
    ok(Week('01/10/2013').getWeekOfYear() == 40, 'week of year');

    ok(Week('01/10/2013').firstDay().toString() == '30/09/2013', 'First day of week');
    ok(Week('01/10/2013').lastDay().toString() == '06/10/2013', 'Last day of week');


    ok(Week('01/10/2013').hasDay(Day('02/10/2013')), 'Day is in week');
    ok(Week('01/10/2013').hasDay(Day('06/10/2013')), 'Day is in week. Last Day');
    ok(Week('01/10/2013').hasDay(Day('30/09/2013')), 'Day is in week. First Day');
    ok(Week('01/10/2013').hasDay(Day('09/10/2013')) == false, "Day isn't in week");
});

test( "Days Test", function() {
    var Day = D3Calendar().Day;
    ok(Day('01/01/2013').getWeekOfYear() == 1, "First week of year");
    ok(Day('01/10/2013').getWeekOfYear() == 40, "40 week of year");
    ok(Day('12/09/2013').getWeekOfYear() == 37, "37 week of year");
    ok(Day(2013,11,24).getWeekOfYear() == 47, "47 week of year");

    ok(Day('01/01/2013').toString() == '01/01/2013', "toString")
    ok(Day(2013,11,24).toString() == '24/11/2013', "toString");

    var today = new Date(),
        day = (today.getDate() < 10) ? '0'+today.getDate() : today.getDate()+'',
        month = today.getMonth() + 1,
        month = (month < 10) ? '0'+month : month+'',
        str = day+'/'+month+'/'+today.getFullYear();

    ok(Day().toString() == str, "Today");

    var d1 = Day('01/01/2013'),
        d2 = Day('01/10/2013'),
        d3 = Day('01/10/2014'),
        d4 = Day('05/10/2013');

    ok( d1.isEqual(d2) == false, 'Test not equal');
    ok( d1.isEqual(d1), 'Test equal');

    ok( d1.isGreaterThan(d1) == false, 'Great than --> False');
    ok( d1.isGreaterThan(d4) == false, 'Great than --> False');
    ok( d3.isGreaterThan(d1) , 'Great than --> True. By Year');
    ok( d2.isGreaterThan(d1) , 'Great than --> True. By Month');
    ok( d4.isGreaterThan(d2) , 'Great than --> True. By Day');

    ok( d1.isLowerThan(d1) == false, 'Lower than --> False');
    ok( d1.isLowerThan(d4), 'Lower than --> True');
    ok( d2.isLowerThan(d3), 'Lower than --> True');

    ok( d2.getDaysTo(d4) == 4, 'days to');
    ok( d4.getDaysTo(d2) == -4, 'days to');
    ok( d4.getDaysTo(d4) == 0, 'Same day');
});


test( "Calendar Test", function() {
    var Calendar = D3Calendar().Calendar,
        calendar = Calendar().setDay('01/10/2013');
    ok(Calendar().getNumWeeks() == 4, "Default config");
    ok(D3Calendar({numWeeks:5}).Calendar().getNumWeeks() == 5, "Parameter Config");
    ok(calendar.firstDay().toString() == '09/09/2013',"Set Day test");
    ok(calendar.lastDay().toString() == '06/10/2013',"Set Day test");

    ok(calendar.getCalendarDay('12/09/2013').toString() == '12/09/2013',"Set Day test");
    ok(calendar.getCalendarDay('08/09/2013') === undefined,"Set Day test");

    calendar.setData(data);
    ok(calendar.getCalendarDay('23/09/2013').getData().date == '23/09/2013',"Test set Data. Test Date value");
    ok(calendar.getCalendarDay('10/09/2013').getData().left == 1315,"Test set Data. Test left value");
    ok(calendar.getCalendarDay('02/10/2013').getData().right == 39.54,"Test set Data. Test right value");

    ok(calendar.getWeeks()[0].getTotalsWeek().left == 2320,"Test Data. Total week left");
    ok(calendar.getWeeks()[0].getTotalsWeek().right == 105.16,"Test Data. Total week right");

    var leftData = [2320, 0, 2050, 2220],
        rightData = [105.16, 0, 100.84, 79.08];

    deepEqual( calendar.getLeftData(), leftData, "Left Data Weeks Calendar" );
    deepEqual( calendar.getRightData(), rightData, "Right Data Weeks Calendar" );

    ok(calendar.moveNextWeek().firstDay().toString() == '16/09/2013',"MoveNextWeek test");
    ok(calendar.lastDay().toString() == '13/10/2013',"MoveNextWeek test");

    ok(Calendar().setDay('01/10/2013').movePrevWeek().firstDay().toString() == '02/09/2013',"MovePrevWeek test");
    ok(Calendar().setDay('01/10/2013').movePrevWeek().lastDay().toString() == '29/09/2013',"MovePrevWeek test");
});

test( "Day Format Test", function() {
    var Day = D3Calendar('',{dayFormat: 'yyyy-mm-dd'}).Day;
    ok(Day('01/01/2013').toString() == '2013-01-01',"Format day: yyyy-mm-dd");
    ok(Day('01/01/2013').toURI() == '2013-01-01',"toUri with Format day: yyyy-mm-dd");
    Day = D3Calendar('',{dayFormat: 'd-m-yy'}).Day;
    ok(Day('01/01/2013').toString() == '1-1-13',"Format day: d-m-yy");
    ok(Day('01/01/2013').toURI() == '2013-01-01',"toUri with Format day: d-m-yy");
});
