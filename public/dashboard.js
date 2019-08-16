const calEl = document.getElementById('calEl')

let calendar = new FullCalendar.Calendar(calEl, {
    plugins: [ 'dayGrid', 'googleCalendar' ],
    googleCalendarApiKey: 'GS_CAL_APIKEY',
    events: {
        googleCalendarId: 'shared_calendar_id_mail@group.calendar.google.com'
    },
    height: 600
})

calendar.render()
