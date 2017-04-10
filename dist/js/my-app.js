// Initialize your app
var myApp = new Framework7({
        animateNavBackIcon: true,
        init: false //Disable App's automatic initialization
    }
);
const addy = 'http://futballteam.com';
// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});
myApp.onPageInit('login', function (page) {
$$('#login').on('click', function (e) {
    e.preventDefault();
    var email     = $$('#email').val(),
        password = $$('#password').val();
    myApp.showPreloader('Logging in...');

    $$.post(addy+'/v1/index.php/login', {email:email, password: password}, function (data) {
        var res = JSON.parse(data);
        //console.log(res.error);
        if(res.error){
            myApp.hidePreloader();
            myApp.alert(res.message, 'Fuuty');
        }else{

            var user = {};
            user.id = res.id;
            user.name = res.name;
            user.email = email;
            user.password = password;
            user.apikey = res.apiKey;
            user.isAdmin = res.isAdmin;
            setStorage("userData",user);
            myApp.hidePreloader();
            window.location =  'index-2.html';
        }
    });
});
});
myApp.onPageInit('register', function (page) {
    $$('#register').on('click', function (e) {
        e.preventDefault();

        var email     = $$('#email').val(),
            password = $$('#password').val(),
            confirmpassword = $$('#confirmpassword').val();


        if(!email || !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            myApp.alert('Please enter a valid email.', 'Fuuty');
            return;
        }
        if(!password) {
            myApp.alert('Please enter a password.', 'Fuuty');
            return;
        }
        if(!confirmpassword) {
            myApp.alert('Please enter a confirm password.', 'Fuuty');
            return;
        }
        if(password !== confirmpassword) {
            myApp.alert('The passwords do not match.', 'Fuuty');
            return;
        }

        myApp.showPreloader('Creating Account...');

        $$.post(addy+'/v1/index.php/register', {email:email, password: password, name: ''}, function (data) {
            var res = JSON.parse(data);
            //console.log(res.error);
            if(res.error){
                myApp.hidePreloader();
                myApp.alert(res.message, 'Fuuty');
            }else{
                var user = {};
                user.id = res;
                user.name = '';
                user.email = email;
                user.password = password;
                //user.apikey = res.apiKey;
                //user.isAdmin = res.isAdmin;
                setStorage("userData",user);
                myApp.hidePreloader();
                mainView.router.loadPage('profile.html')
            }
        });
    });
});
myApp.onPageInit('profile', function(page) {
    var today = new Date();
    $$('.profile-image').on('click', function(e) {
        document.getElementById("profiler").click();
    });
    $$("#profiler").on('change', function() {
        var formData = new FormData($$('#profile')[0]);
        myApp.showPreloader('Updating Profile...');
        $$.ajax({
            url: 'formprocessing.php',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                var res = JSON.parse(data);
                //console.log(res.error);
                if(res.error){
                    myApp.hidePreloader();
                    myApp.alert(res.message, 'Fuuty');
                }else {

                    $$('#profile-image').attr('src', res.imagesrc)
                    myApp.hidePreloader();
                }
            }
        });
    });
    $$('.dob-datepicker input.select').on('click', function() {
        var thisp = $$(this).parent();
        if(thisp.hasClass('dob-datepicker') && !thisp.hasClass('hide-label')) {
            thisp.addClass('hide-label')
        }
    });
    var pickerInline = myApp.picker({
        input: '#dob-picker-date',
        container: '#dob-picker-date-container',
        toolbar: false,
        rotateEffect: true,
        value: [today.getMonth(), today.getDate(), (today.getFullYear() - 20)],
        onChange: function (picker, values, displayValues) {
            var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
            if (values[1] > daysInMonth) {
                picker.cols[1].setValue(daysInMonth);
            }
        },
        formatValue: function (p, values, displayValues) {
            return displayValues[0] + ' ' + values[1] + ', ' + values[2];
        },
        cols: [
            // Months
            {
                values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
                displayValues: ('January February March April May June July August September October November December').split(' '),
                textAlign: 'left'
            },
            // Days
            {
                values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
            },
            // Years
            {
                values: (function () {
                    var arr = [];
                    for (var i = 1930; i <= today.getFullYear(); i++) { arr.push(i); }
                    return arr;
                })()
            }
        ]
    });
    $$('#createProfile').on('click', function (e) {
        e.preventDefault();

        var nickname     = $$('#nickname').val(),
            position = $$('#position').val(),
            phone = $$('#phone').val(),
            gender = $$('#gender').val(),
            dob = $$('#dob-picker-date').val();
            //Program a custom submit function for the form

        if(!nickname ) {
            myApp.alert('Please enter a nickname.', 'Fuuty');
            return;
        }
        if(position == "Position") {
            myApp.alert('Please select a position.', 'Fuuty');
            return;
        }
        if(!phone){
            myApp.alert('Please enter a telephone nr.', 'Fuuty');
            return;
        }



        myApp.showPreloader('Updating Profile...');
        var res = getStorage("userData");
        $$.post(addy+'/v1/index.php/profile', {tel:phone, userid: res.id, nickname: nickname, position: position, gender:gender, dob:dob}, function (data) {
            // var res = JSON.parse(data);
            //console.log(res.error);
            if(res.error){
                myApp.hidePreloader();
                myApp.alert(res.message, 'Fuuty');
            }else{
                var user = {};
                user.id = res.id;
                user.name = nickname;
                user.email = res.email;
                user.password = res.password;
                user.apikey = res.apiKey;
                user.isAdmin = res.isAdmin;
                user.tel = phone;
                user.nickname = nickname;
                user.position = position;
                user.gender = gender;
                user.dob = dob;
                user.profiler = profiler;
                setStorage("userData",user);
                myApp.hidePreloader();
                window.location =  'index-2.html';
            }
        });

    });
});

myApp.onPageInit('index1', function(page) {
    var id = getID(),key = getAPIKEY(),result;
    return $$.ajax({
        type: "POST",
        url: addy+"/v1/index.php/player/"+id+"/matchs",
        beforeSend: function( xhr ) {
            xhr.setRequestHeader ("authorization",  key);
        },
        success: function (data) {
            var template,templateScript,html;
            if(data==0){
                var html = "Welcome to Futy, search for a club to join or create your own Club!";
                $('.container').append(html);
            }else{
                console.log(data);
                $.each(data, function( key, value ) {
                    // console.log([data][key]['matchowner'],id)
                    if(data[key]['matchowner']==id){
                        var templateScript =  Handlebars.templates.adminMatchCard;
                        var html = templateScript(data[key]);
                        $('.container').append(html);
                    }else{
                        var templateScript =  Handlebars.templates.userConfirmedMatchCard;
                        var html = templateScript(data[key]);
                        $('.container').append(html);
                    }
                });

            }


        },
        error: function (errormessage) {
            console.log(errormessage);
        }
    });
});
function setStorage(StorageKey, StorageValue){
    var storage = window.localStorage;
    storage.setItem(StorageKey, JSON.stringify(StorageValue));
}
function getStorage(StorageKey){
    var storage = window.localStorage;
    return JSON.parse(storage.getItem(StorageKey));
}
function getID(){
    var usr = getStorage("userData");
    return usr.id;
}
function getAPIKEY(){
    var usr = getStorage("userData");
    return usr.apikey;
}
$$('.detail-list').on('click', function (e) {
    e.preventDefault();
    var $this = $$(this);
    $this.siblings().removeClass('active');
    $this.addClass('active');
    if ($this.hasClass('list')) {
            $$(this).closest('.page-content').addClass('list');
    } else {
            $$(this).closest('.page-content').removeClass('list');
    }
});
$$('.club-card').on('click', function (e) {
    e.preventDefault();
    var $this = $$(this);
    $this.toggleClass('expanded');
});
myApp.init();
