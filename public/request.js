const simpleBar = new SimpleBar(document.getElementById('bodyId'), {
    autoHide: false
})

$('#managerDropdown').dropdown({
    clearable: false,
    fullTextSearch: true,
    allowAdditions: true,
    ignoreDiacritics: true,
    forceSelection: true
  })

$('#fromCalendar').calendar({
    type: 'date',
    endCalendar: $('#toCalendar'),
    popupOptions: {
        position: 'left center',
        lastResort: 'bottom center',
        prefer: 'opposite',
        hideOnScroll: false
    }
  })

$('#toCalendar').calendar({
    type: 'date',
    startCalendar: $('#fromCalendar'),
    popupOptions: {
        position: 'right center',
        lastResort: 'bottom center',
        prefer: 'opposite',
        hideOnScroll: false
    }
  })

$('#submitBtn').on('click', function(e) {
    e.preventDefault()
    $('#confirmModal').modal({
        transition: 'fly up'
    }).modal('show')
})

let resturlaubYearLabel = $('#resturlaubYEARlabel')
let dt = new Date()
const yearNow = dt.getYear() + 1900
resturlaubYearLabel.text('Resturlaub ' + yearNow)

// Fill full name into Name field on load
$(document).ready(() => {

    $('.ui.search.selection.dropdown').css('width','100%')

    var $form = $('#requestForm')

    let fullname = window.sessionStorage.getItem('user')
    fullname = JSON.parse(fullname)
    emailAddress = fullname.mail
    fullname = fullname.displayName

    $form.form('set values', { 
        name : fullname,  
        email : emailAddress 
    })

    fetch('/request/managers', {
        method: 'POST',
        credentials: 'include',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then(response => response.json())
    .then(data => {
        // console.log(JSON.stringify(data))
        
        data.forEach((manager) => {
            $('#managerDropdown').append('<option value="'+manager.email+'">'+manager.name+'</option>')
        })

        const userGroups = user.memberOf

        userGroups.forEach((group) => {
            // if(group.includes('CN=Billing')) {
                // select = document.getElementById('managerDropdown')
                // for(var i = 0;i < select.options.length;i++){
                    // if(select.options[i].value == 'BILLING_MANAGER@COMPANY.COM' ){
                        // select.options[i].selected = true;
                    // }
                // }
            // } else if(group.includes('CN=Technik')) {
                // select = document.getElementById('managerDropdown')
                // for(var i = 0;i < select.options.length;i++){
                    // if(select.options[i].value == 'TECHNIK_MANAGER@COMPANY.COM' ){
                        // select.options[i].selected = true;
                    // }
                // }
            // }
        })
    })
    .catch(error => console.error(error))

})

$('#jahresurlaubInsgesamt').blur(() => {
    const $form = $('.ui.form')
    const resturlaubVorjahrVal = parseFloat($form.form('get value', 'resturlaubVorjahr').replace(',', '.'))
    const jahresurlaubInsgesamtVal = parseFloat($form.form('get value', 'jahresurlaubInsgesamt').replace(',', '.'))
    const sumVal = resturlaubVorjahrVal + jahresurlaubInsgesamtVal
    $form.form('set values', { restjahresurlaubInsgesamt : sumVal })
})

$('#beantragt').blur(() => {
    const $form = $('.ui.form')
    const resturlaubInsgesamtVal = parseFloat($form.form('get value', 'restjahresurlaubInsgesamt').replace(',', '.'))
    const beantragtVal = parseFloat($form.form('get value', 'beantragt').replace(',', '.'))
    const sumVal = resturlaubInsgesamtVal - beantragtVal
    $form.form('set values', { resturlaubJAHR : sumVal })
})

$('#modalSubmitBtn').on('click', function() {

    var $form = $('#requestForm')

    const resturlaubVorjahrVal = parseFloat($form.form('get value', 'resturlaubVorjahr').replace(',', '.'))
    $form.form('set values', { resturlaubVorjahr : resturlaubVorjahrVal})

    const jahresurlaubInsgesamtVal = parseFloat($form.form('get value', 'jahresurlaubInsgesamt').replace(',', '.'))
    $form.form('set values', { jahresurlaubInsgesamt : jahresurlaubInsgesamtVal})

    const restjahresurlaubInsgesamtVal = parseFloat($form.form('get value', 'restjahresurlaubInsgesamt').replace(',', '.'))
    $form.form('set values', { restjahresurlaubInsgesamt : restjahresurlaubInsgesamtVal})

    const beantragtVal = parseFloat($form.form('get value', 'beantragt').replace(',', '.'))
    $form.form('set values', { beantragt : beantragtVal })

    const resturlaubJAHRVal = parseFloat($form.form('get value', 'resturlaubJAHR').replace(',', '.'))
    $form.form('set values', { resturlaubJAHR : resturlaubJAHRVal})


    // check all required fields have values
    console.log($('.ui.form').form('is valid'))
    $('.ui.form').form('validate form')
})

$('#modalCancelBtn').on('click', function() {
    $('#confirmModal').modal('hide')
})

$('.ui.form')
.form({
fields: {
    name: {
    identifier: 'name',
    rules: [
        {
        type   : 'minLength[5]',
        prompt : 'Please enter your name'
        }
    ]
    },
    email: {
    identifier: 'email',
    rules: [
        {
        type   : 'email',
        prompt : 'Please enter a valid email address'
        }
    ]
    },
    restUrlaubvorJahr: {
    identifier: 'resturlaubVorjahr',
    rules: [
        {
        type   : 'regExp[/^[0-9]*(.)[0-9]*$/]',
        prompt : 'Please enter vacation days left from last year'
        }
    ]
    },
    jahresUrlaubinsgesamt: {
    identifier: 'jahresurlaubInsgesamt',
    rules: [
        {
        type   : 'regExp[/^[0-9]*(.)[0-9]*$/]',
        prompt : 'Please enter the number of vacation days youve earned this year'
        }
    ]
    },
    restjahresUrlaubinsgesamt: {
    identifier: 'restjahresurlaubInsgesamt',
    rules: [
        {
        type   : 'regExp[/^[0-9]*(.)[0-9]*$/]',
        prompt : 'Please enter days available this year (Left over from last year + gained this year).'
        }
    ]
    },
    beantragt: {
    identifier: 'beantragt',
    rules: [
        {
        type   : 'regExp[/^[0-9]*(.)[0-9]*$/]',
        prompt : 'Please enter the amount of days requested.'
        }
    ]
    },
    restUrlaubleft: {
    identifier: 'resturlaubJAHR',
    rules: [
        {
        type   : 'regExp[/^[0-9]*(.)[0-9]*$/]',
        prompt : 'Please enter the number of days now left for this year.'
        }
    ]
    },
    fromDate: {
    identifier: 'fromDate',
    rules: [
        {
        type   : 'minLength[5]',
        prompt : 'Please enter date you want vacation FROM.'
        }
    ]
    },
    toDate: {
    identifier: 'toDate',
    rules: [
        {
        type   : 'minLength[5]',
        prompt : 'Please enter date you want vacation TO.'
        }
    ]
    },
    manager: {
    identifier: 'manager',
    rules: [
        {
        type   : 'minLength[5]',
        prompt : 'You must select a manager to approve your vacation request.'
        }
    ]
    }
},
onSuccess: function(evt, fields) {

    var $form = $('#requestForm')
    allFields = $form.form('get values')
    console.log(allFields)
    console.log(JSON.stringify(allFields))

    fetch('/request/submit', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(allFields), 
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then(response => response.json())
    .then(data => {
        // console.log(JSON.stringify(data))

        if(data.affectedRows > 0) {
            $('body').toast({
                    title: 'Vacation Requested!',
                    message: 'Successfully requested vacation. You will be notified as soon as your manager responds.',
                    class : 'green',
                    position: 'bottom right',
                    displayTime: 5000,
                    className: {
                        toast: 'ui message'
                    },
                    transition: {
                        showMethod   : 'fly right',
                        showDuration : 1000,
                        hideMethod   : 'fly left',
                        hideDuration : 1000
                    }
                });
        }
    })
    .catch(error => console.error(error))
},
onFailure: function(err, fields) {

}
});

$('#clearBtn').on('click', function() {
    $('#requestForm').form('clear');
});

// Show or hide the sticky footer button
simpleBar.getScrollElement().addEventListener('scroll', function(){
    if ($(this).scrollTop() > 200) {
        $('.go-top').fadeIn(600);
    } else {
        $('.go-top').fadeOut(600);
    }
});

// Animate the scroll to top
$('.go-top').click(function(event) {
    event.preventDefault();
    let bodyscrollTop = simpleBar.getScrollElement()
    $('#newvacaheader')[0].scrollIntoView({ behavior: 'smooth' })
})

$('.ui.accordion').accordion()

$('#monthsInput').on('keyup', (e) => {
    let months = $('#monthsInput').val()
    months = Math.abs(Math.floor(26 * (months / 12)))
    months += ' days available'
    $('#monthsResult').text(months)
})

$('#yearsInput').on('keyup', (e) => {
    let years = parseInt($('#yearsInput').val())
    let days = ''

    if(years < 2) {
        days = 26
    } else if (years == 2){
        days = 27
    } else if (years == 3) {
        days = 28
    } else if (years == 4) {
        days = 29
    } else if (years >= 5) {
        days = 30
    }

    days = days + ' days available'
    $('#yearsResult').text(days)
})

$(window).on('load', function() {
  var win = $(this)
  console.log(`width: ${win.width()}`)
  if (win.width() < 1000) {
    console.log(`width2: ${win.width()}`)

    $('#fromCalendar').calendar({
        popupOptions: {
            position: 'top center'
        }
    })
    $('#toCalendar').calendar({
        popupOptions: {
            position: 'top center'
        }
    })
  } 
})
