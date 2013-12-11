$(document).ready(function(){
    var data=[
        { date: '21/10/2013',
          left: 975,
          right: 52.3,
          leftUnits:'m.',
          rightUnits:'km.',
          url: 'http://gpxlog.hol.es',
          title: 'test title for 10/09/2013'},
        { date: '01/10/2013',
          left: 1075,
          right: 48.54,
          leftUnits:'m.',
          rightUnits:'km.',
          url: 'http://gpxlog.hol.es',
          title: 'Lorem ipsum lorem ipsum'},
        { date: '02/10/2013',
          left: 1105,
          right: 39.54,
          leftUnits:'m.',
          rightUnits:'km.',
          url: 'http://gpxlog.hol.es',
          title: 'test title'},
        { date: '05/10/2013',
          left: 1115,
          right: 39.54,
          leftUnits:'m.',
          rightUnits:'km.',
          url: 'http://gpxlog.hol.es',
          title: 'test title'},
        { date: '10/10/2013',
          left: 1315,
          right: 69.54,
          leftUnits:'m.',
          rightUnits:'km.',
          url: 'http://gpxlog.hol.es',
          title: 'test title'},
        { date: '16/10/2013',
          left: 1715,
          right: 75.54,
          leftUnits:'m.',
          rightUnits:'km.',
          url: 'http://gpxlog.hol.es',
          title: 'test title'},
        { date: '19/10/2013',
          left: 115,
          right: 55.54,
          leftUnits:'m.',
          rightUnits:'km.',
          url: 'http://gpxlog.hol.es',
          title: 'test title'},
          ];

    var calendar = D3Calendar('d3-calendar',
                        {daysOfWeek: ['A','B','C','D','E','F','G'],
                         dayFormat:'yyyy-mm-dd'}
                    );
    calendar.setDay('22/10/2013').setData(data).display();
});
