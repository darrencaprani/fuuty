 utilityfuncs = function() {

var addy = 'http://futballteam.com',
    getID = function(){
        var usr = getStorage("userData");
        return usr.id;
    },
     getAPIKEY = function(){
        var usr = getStorage("userData");
        return usr.apikey;
     },
//
//$('.navi').on( "click", function() {
//    var usr = getStorage("userData");
//    populate($("#"+ $(this).attr('data-activates')),usr.isAdmin);
//}).sideNav({
//        menuWidth: 300, // Default is 240
//        edge: 'left', // Choose the horizontal origin
//        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
//        draggable: true // Choose whether you can drag to open on touch screens
//    }
//);


    setStorage = function(StorageKey, StorageValue){
        var storage = window.localStorage;
        storage.setItem( StorageKey , JSON.stringify(StorageValue) );
        console.log('data stored');
    },
    getStorage = function(StorageKey){
        var storage = window.localStorage;
        return JSON.parse( storage.getItem( StorageKey ) );

    },
    GetPitchList = function (type){
    var id = getID();var key = getAPIKEY();var result;
    return $.ajax({
        type: "POST",
        url: addy+"/v1/index.php/player/"+id+"/pitches",
        beforeSend: function( xhr ) {
            xhr.setRequestHeader ("authorization",  key);
        },
        success: function (data) {
            if(type =="table"){
                var templateScript =  Handlebars.templates.pitchlist;
                var html = templateScript(data);
                $('.container').append(html);
            }else{
                var templateScript =  Handlebars.templates.pitchdropdown;
                var html = templateScript(data);
                $('#pitch').append(html);
                $('#pitch').material_select();
            }
        },
        error: function (errormessage) {
            console.log(errormessage);
        }
    });
},
    setupNav = function(){
        var usr = getStorage("userData"), templateScript;
        //console.log(usr.isAdmin);
        if(usr.isAdmin==0){
            templateScript = Handlebars.templates.nav_user;
        }else{
            templateScript = Handlebars.templates.nav_admin;
        }
        $('#navigation').append(templateScript);
    },
    getAllMatchs = function(){
    var id = getID(),key = getAPIKEY(),result;
    return $.ajax({
        type: "POST",
        url: addy+"/v1/index.php/matches/all",
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
                        var templateScript =  Handlebars.templates.userMatchCard;
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
}
    , getUserMatchs = function(){
    var id = getID(),key = getAPIKEY(),result;
    return $.ajax({
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
    },
    getClubs = function(){
    var id = getID(),key = getAPIKEY(),result, templateScript,html;

    console.log(key);
    return $.ajax({
        type: "POST",
        url: addy+"/v1/index.php/player/"+id+"/clubs",
        beforeSend: function( xhr ) {
            xhr.setRequestHeader ("authorization",  key);
        },
        success: function (data) {
            if(data==0){
                html = "Welcome to Futy, search for a club to join or create your own Club!";
                $('.container').append(html);
            }else{
                $.each( data, function( key, value ) {
                    if(value.ownerid==id){
                        templateScript = Handlebars.templates.cards_admin_view;
                        html = templateScript(data[key]);
                        $('.container').append(html);
                    }else{
                        templateScript = Handlebars.templates.cards_user_view;
                        html = templateScript(data[key]);
                        $('.container').append(html);
                    }
                });

            }


        },
        error: function (errormessage) {
            console.log(errormessage);
        }
    });
}
//create club
//$('.CreateClub').on( "submit", function( event ) {
//    event.preventDefault();
//    var clubName = $( this ).find('input[name="clubName"]').val();
//    var clubRules = $( this ).find('textarea[name="clubRules"]').val();
//    var clubCity = $( this ).find('input[name="clubCity"]').val();
//    var id = getID();var key = getAPIKEY();
//    $.ajax({
//        type: "POST",
//        url: addy+"/v1/index.php/createClub",
//        beforeSend: function( xhr ) {
//            xhr.setRequestHeader ("authorization",  key);
//        },
//        data: {clubName:clubName,clubRules:clubRules,clubCity:clubCity,usrid:id},
//        success: function (ClubID) {
//            // console.log(ClubID);
//            //  console.log('yes');
//            var res = getStorage("userData");
//            var user = {};
//            user.id = res.id;
//            user.name = res.name;
//            user.apikey = key;
//            user.isAdmin = ClubID;
//
//            setStorage("userData",user);
//            router('dashboard.html');
//        },
//        error: function (errormessage) {
//            console.log(errormessage)
//
//        }
//    });
//
//});
//login
//$('#loginButton').on('click', function () {
//    var email     = $('.loginForm').find('input[name="email"]').val();
//    var password  = $('.loginForm').find('input[name="password"]').val();
//    $.post(addy+'/v1/index.php/login', {email:email, password: password}, function (data) {
//        var res = data;
//        //console.log(res.error);
//        if(res.error){
//            var $toastContent = $('<span>Login failed. Incorrect credentials</span>');
//            Materialize.toast($toastContent, 5000);
//        }else{
//
//            var user = {};
//            user.id = res.id;
//            user.name = res.name;
//            user.email = email;
//            user.password = password;
//            user.apikey = res.apiKey;
//            user.isAdmin = res.isAdmin;
//            setStorage("userData",user);
//            console.log(res);
//            var user = user.name;
//            var $toastContent = $(user+'Logged in successfully');
//            router('dashboard.html');
//        }
//    });
//
//});


//pitch
//$('#savepitch').on( "submit", function( event ) {
//    event.preventDefault();
//    var lat           = $( this ).find('input[name="lat"]').val();
//    var lon           = $( this ).find('input[name="lon"]').val();
//    var pitchaddress  = $( this ).find('input[name="pitchaddress"]').val();
//    var pitchname     = $( this ).find('input[name="pitchname"]').val();
//    var id = getID();var key = getAPIKEY();
//    //      console.log(key,lat,lon,pitchaddress,pitchname,id);
//    $.ajax({
//        type: "POST",
//        url: addy+"/v1/index.php/pitch/add",
//        beforeSend: function( xhr ) {
//            xhr.setRequestHeader ("authorization",  key);
//        },
//        data: {lat:lat,lon:lon,address:pitchaddress,name:pitchname,userid:id},
//        success: function (msg) {
//            Materialize.toast('Pitch saved!', 4000);
//            window.location.replace("pitch.html");
//            console.log(msg);
//        },
//        error: function (errormessage) {
//            console.log(errormessage)
//        }
//    });
//
//});
//create match
//$('.setupMatch').on( "submit", function( event ) {
//    event.preventDefault();
//    var datetime = $( this ).find('input[name="datetime"]').val();
//    var noplayers = $( this ).find('#noplayers').val();
//    var pitch = $( this ).find('#pitch').val();
//    var cost = $( this ).find('input[name="cost"]').val();
//    var res = getStorage("userData");
//    //console.log(res);
//    //console.log(key,datetime,noplayers,pitch,cost);
//    $.ajax({
//        type: "POST",
//        url: addy+"/v1/index.php/setupMatch",
//        beforeSend: function( xhr ) {
//            xhr.setRequestHeader ("authorization",  res.apikey);
//        },
//        data: {clubid:res.isAdmin,noplayers:noplayers,cost:cost,date:datetime,pitchid:pitch,matchowner:res.id},
//        success: function (matchID) {
//            console.log(matchID);
//            var $toastContent = $('<span>Match been created!</span>');
//            Materialize.toast($toastContent, 5000);
//        },
//        error: function (errormessage) {
//
//            Materialize.toast(errormessage, 5000);
//            console.log(errormessage)
//
//        }
//    });
//
//});
//register

//$('.Registerform').on( "submit", function( event ) {
//    event.preventDefault();
//    var name = $( this ).find('#name').val();
//    var password = $( this ).find('input[name="password"]').val();
//    var rpassword = $( this ).find('input[name="rpassword"]').val();
//    var email = $( this ).find('input[name="email"]').val();
//
//    //console.log(name,dob,position,password,email);
//    $.ajax({
//        type: "POST",
//        url: addy+"/v1/index.php/register",
//        data: {name:name,password:password,email:email},
//        success: function (userID) {
//            var user = {};
//            user.id = userID;
//            user.name = name;
//            user.email = email;
//            user.password = password;
//            setStorage("userData",user);
//
//            var $toastContent = $('<span>You have been registered</span>');
//            router('profile.html');
//        },
//        error: function (errormessage) {
//            Materialize.toast(errormessage, 5000);
//            console.log(errormessage)
//
//        }
//    });
//
//});
//search clubs
//$('form.search').bind('submit', function(e){
//    e.preventDefault();
//    var term = $( this ).find('input[name="search"]').val(), id = getID();
//    //alert(term);
//    var res = getStorage("userData");
//    $.ajax({
//        type: "POST",
//        url: addy+"/v1/index.php/search",
//        beforeSend: function( xhr ) {
//            xhr.setRequestHeader ("authorization",  res.apikey);
//        },
//        data: {term:term},
//        success: function (data) {
//            var results =data.length;
//            $('.container').empty();
//            $('.navi').sideNav('hide');
//            $.each( data, function( key, value ) {
//                var templateScript,html;
//                console.log("owner"+value.ownerid);
//                if(value.ownerid==id){
//                }else{
//                    templateScript = Handlebars.templates['cards_search'];
//                    var html = templateScript(data[key]);
//                    $('.container').append(html);
//                }
//            });
//            var $toastContent = $('<span>Search Completed</span>');
//            Materialize.toast($toastContent, 5000);
//
//        },
//        error: function (errormessage) {
//
//            Materialize.toast(errormessage, 5000);
//            console.log(errormessage)
//
//        }
//    });
//
//});
//upqte profile

//$('.updateProfile').on( "submit", function( event ) {
//    event.preventDefault();
//    var dob = $( this ).find('input[name="dob"]').val();
//    var position = $( this ).find('#position').val();
//    var tel = $( this ).find('#tel').val();
//
//    var res = getStorage("userData");
//    $.ajax({
//        type: "POST",
//        url: addy+"/v1/index.php/profile",
//        data: {dob:dob,position:position,tel:tel,userid:res.id},
//        success: function (userID) {
//            var $toastContent = $('<span>You have been registered</span>');
//            console.log(userID)
//            var $toastContent = $('<span>You have been registered</span>');
//            router('dashboard.html');
//        },
//        error: function (errormessage) {
//            console.log(errormessage)
//
//        }
//    });
//
//});

//join club
//$(document).on('click','.joinClub',function(){
//    event.preventDefault();
//    var clubID = $(this).attr( "data-clubid" ),
//        id = getID(),res = getStorage("userData");
//
//    $.ajax({
//        type: "POST",
//        url: addy+"/v1/index.php/club/"+clubID+"/join",
//        data: {userid:id},
//        beforeSend: function( xhr ) {
//            xhr.setRequestHeader ("authorization",  res.apikey);
//        },
//        success: function () {
//            var $toastContent = $('<span>You are Proud member of</span>');
//            //console.log(userID)
//            Materialize.toast($toastContent, 5000);
//
//        },
//        error: function (errormessage) {
//
//            // Materialize.toast(errormessage, 5000);
//            console.log(errormessage)
//
//        }
//    });
//
//
//});


//jget club members
//$(document).on('click','.getmembers',function(){
//    event.preventDefault();
//    var clubID = $(this).attr( "data-clubid" ),
//        id = getID(),res = getStorage("userData"),newDiv;
//
//    $.ajax({
//        type: "POST",
//        url: addy+"/v1/index.php/club/view/"+clubID+"/members",
//        beforeSend: function( xhr ) {
//            xhr.setRequestHeader ("authorization",  res.apikey);
//        },
//        success: function (data) {
//            console.log(data);
//
//            $.each( data, function( key, value ) {
//                newDiv += '<li class="collection-item avatar"><img src="https://pbs.twimg.com/profile_images/1119269505/0509071614Peter_Griffin.jpg" alt="" class="circle"><p class="title"><b>'+value.name+'</b></p><p>Position: <b>'+value.position+'</b></p><p>Memeber since: <b>'+value.createdAt+'</b></p> <a href="tel:'+value.tel+'" class="secondary-content"><i class="material-icons">telephone</i></a></li>';
//            });
//
//            $('.collection').empty().append(newDiv);
//            $('#modal').modal('open');
//
//        },
//        error: function (errormessage) {
//
//            // Materialize.toast(errormessage, 5000);
//            console.log(errormessage)
//
//        }
//    });
//
//
//});
};