test( "Week of the Year", function() {
    var oct_week = [30,1,2,3,4,5,6],
        dec_week = [31,1,2,3,4,5,6],
        jul_week = [29,30,31,1,2,3,4];
    
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
});

test( "Days Test", function() {
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
});


test( "Calendar Test", function() {
    ok(Calendar().getNumWeeks() == 4, "Default config");
    ok(Calendar({numWeeks:5}).getNumWeeks() == 5, "Parameter Config");
    ok(Calendar().setDay('01/10/2013').firstDay().toString() == '09/09/2013',"Set Day test");
    ok(Calendar().setDay('01/10/2013').lastDay().toString() == '06/10/2013',"Set Day test");
    
    
    ok(Calendar().setDay('01/10/2013').moveNextWeek().firstDay().toString() == '16/09/2013',"MoveNextWeek test");
    ok(Calendar().setDay('01/10/2013').moveNextWeek().lastDay().toString() == '13/10/2013',"MoveNextWeek test");
    
    ok(Calendar().setDay('01/10/2013').movePrevWeek().firstDay().toString() == '02/09/2013',"MovePrevWeek test");
    ok(Calendar().setDay('01/10/2013').movePrevWeek().lastDay().toString() == '29/09/2013',"MovePrevWeek test");
});
