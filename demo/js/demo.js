$(document).ready(function(){
    var data=[
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
        { date: '10/10/2013',
          left: 1315,
          right: 69.54,
          url: 'http://gpxlog.hol.es',
          title: 'test title'},
          ];

    D3Calendar('d3-calendar').setData(data).display();
});
