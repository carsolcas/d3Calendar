test( "Week of the Year", function() {
    var oct_week = [30,1,2,3,4,5,6],
        dec_week = [31,1,2,3,4,5,6],
        jul_week = [29,30,31,1,2,3,4];
    
    deepEqual( Week(2013,10,1).getWeekDays().toArray(), oct_week, "October 2013. Three params!" );
    deepEqual( Week(2012,12,31).getWeekDays().toArray(), dec_week, "December 2012. Three params!" );
    deepEqual( Week(2013,7,30).getWeekDays().toArray(), jul_week, "July 2013. Three params!" );
    
    deepEqual( Week(2013,40).getWeekDays().toArray(), oct_week, "October 2013, week number!" );
    deepEqual( Week(2013,1).getWeekDays().toArray(), dec_week,  "December 2012, week number!" );
    deepEqual( Week(2013,31).getWeekDays().toArray(), jul_week, "December 2012, week number!" );

    deepEqual( Week('01/10/2013').getWeekDays().toArray(), oct_week, "October 2013. String date!" );
    deepEqual( Week('31-12-2012').getWeekDays().toArray(), dec_week, "December 2012. String date!" );
    deepEqual( Week('30/07/2013').getWeekDays().toArray(), jul_week, "July 2013. String date!" );

});

test( "Days Test", function() {
    ok( Day('01/01/2013').getWeekOfYear() == 1, "First week of year" );
    ok( Day('01/10/2013').getWeekOfYear() == 40, "40 week of year" );
    ok( Day('12/09/2013').getWeekOfYear() == 37, "37 week of year" );
    ok( Day(2013,11,24).getWeekOfYear() == 47, "47 week of year" );

    ok(Day('01/01/2013').toString() == '01/01/2013', "toString")
    ok(Day(2013,11,24).toString() == '24/11/2013', "toString " );
});

c = new Calendar(2013,10,1);
test( "Function Days test", function() {
    ok( c.getDayOfWeek() == 2, "Correct day of week!" );
    ok( c.getDay() == 1, "Correct day!" );
    ok( c.getMonth() == 10, "Correct Month!" );
    ok( c.getYear() == 2013, "Correct year!" );
});
