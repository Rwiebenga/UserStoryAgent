// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

getLocation();

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(useLocation);
    }
};

function populateSelectBox(originalCountryName, countryName) {
    
    var $dropdown = $("#dropdown");
    
    //$dropdown.append('<option value="currentLocation">Huidige locatie</option>');
    $dropdown.append($("<option />").val(countryName).text(originalCountryName));
    //console.log(originalCountryName);
    $('.search-results').append("<div class='search-country hidden' attr-country-name='" + countryName+"'>" + originalCountryName + "</div>");
}

$("#dropdown").change(function () {
    $('.close-btn').removeClass('active');
    $('.search-bar').removeClass('active');
    $('.search-bar').val('');
    if ($("#dropdown").children("option").filter(":selected").val() == "currentLocation") {
        getLocation();
    } else {
        
        getEmbassyInformation($(this).val());
    }
    $("html, body").animate({ scrollTop: 0 }, "slow");
});

$('.search-bar').focus(function () {
    $('.search-bar').val('');
    $('.close-btn').removeClass('active');
    $('.search-bar').removeClass('active');
    $(".search-country").addClass('hidden');
});

$('.close-btn').click(function () {
    $('.search-bar').val('');
    $('.search-bar').focus();
    
});

$('.search-bar').keyup(function () {
    $('.search-bar').addClass('active');
    $('.close-btn').addClass('active');
    var searchWord = $(this).val().toLowerCase();
    $(".search-country").addClass('hidden');
    $(".search-country").each(function () {
        var countryName = $(this).text().toLowerCase();
        if (countryName.indexOf(searchWord) !== -1) {
            $(this).removeClass('hidden');
        }
    });

    if ($(this).val() != "") {
       
        $('.navbar .search .search-bar').css('background-image', 'url("../images/police_icon.png") !important;')
    }
});

$(document).on('click', '.search-country', function () {
    var countryName = $(this).attr('attr-country-name');
    $('.search-bar').val($(this).text());
    $(".search-country").addClass('hidden');


    $(".pb-3").fadeOut(50, function () {
        getEmbassyInformation(countryName);
        $('.pb-3').fadeIn(50);
    });

});


function getEmbassyInformation(countryName) {
    $('.search-country').remove();

    $.getJSON("/Data/embassies.json", function (mydata) {
        //console.log(mydata);
        var embassies = mydata.embassies;
        //console.log('countryname = '+countryName);
        $.each(embassies, function (i, item) {
            
            //
            populateSelectBox(item.original_country_name, item.country_name);
            if (item.country_name == countryName) {

                $('.country-name').html(item.original_country_name + ' (' + item.country_number + ')');

                $('.fire-dept .number').html(item.fire.split(" ")[0]);
                $('.fire-dept').attr('href', 'tel:' + item.fire.split(" ")[0]);

                $('.police-dept .number').html(item.police.split(" ")[0]);
                $('.police-dept').attr('href', 'tel:' + item.police.split(" ")[0]);
                
                $('.ambulance-dept .number').html(item.ambulance.split(" ")[0]);
                $('.ambulance-dept').attr('href', 'tel:' + item.ambulance);

                $('.embassy-dept .number').html(item.phone_embassy.split("\n")[0]);
                $('.embassy-dept').attr('href', 'tel:' + item.phone_embassy.split("\n")[0]);

                if (item.e_mail_embassy != "") {
                    $('.e-mail').parent().css('display', 'block');
                } else {
                    $('.e-mail').parent().css('display', 'none');
                }
                if (item.opening_hours_embassy != "") {
                    $('.opening-times').parent().css('display', 'block');
                } else {
                    $('.opening-times').parent().css('display', 'none');
                }
                if (item.name_embassador != "") {
                    $('.name-embassador').parent().css('display', 'block');
                } else {
                    $('.name-embassador').parent().css('display', 'none');
                }
                if (item.address_embassy != "") {
                    $('.address-embassy').parent().css('display', 'block');
                    $('#map').css('display', 'block');
                } else {
                    $('.address-embassy').parent().css('display', 'none');
                    $('#map').css('display', 'none');
                }

                if (item.e_mail_embassy != "" && item.opening_hours_embassy != "" && item.name_embassador != "" && item.address_embassy != "") {
                    $('.embassy-information').css('display', 'block');
                } else {
                    $('.embassy-information').css('display', 'none');
                }


                $('.e-mail').html('<a href="mailto:' + item.e_mail_embassy+'">' + item.e_mail_embassy+'</a>');
                $('.opening-times').html(item.opening_hours_embassy);
                $('.name-embassador').html(item.name_embassador);
                $('.address-embassy').html(item.address_embassy);
                $('.country-title-bar img').attr('src', item.flag.replace('23px', '100px'));

                var address = item.address_embassy;
               
                initMap(address + ',' +item.original_country_name);

            }
        });
        disableEmptyNumbers();
    });
    
    
    
};



function disableEmptyNumbers() {
    $('.number').each(function () {
        //console.log($(this).text());
        if ($(this).text() == "nvt" || $(this).text() == "") {
            $(this).parent().parent().addClass('disabled');
        } else {
            $(this).parent().parent().removeClass('disabled');
        }
    });
}

function useLocation(position) {
    

    $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&key=AIzaSyBCt_EBdFQETts8o0j34gox7GEC_ttnxTk&language=nl-NL', function (data) {
        //data is the JSON string
        // console.log(data.results[0].address_components);
        data.results[0].address_components
        var address_components = data.results[0].address_components;
        $.each(address_components, function (i, item) {

            $.each(item, function (x, subitem) {

                if (subitem[0] == "country") {
                    //console.log(item.long_name);
                    $('.country-name').html(item.long_name);
                    countryName = item.long_name.toLowerCase();
                    //countryName = "algerije";
                    getEmbassyInformation(countryName);
                }
            });
        });

    });

    
};


var geocoder;
var map;

function initMap(address) {
    //console.log(address);
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: { lat: -34.397, lng: 150.644 }
    });
    geocoder = new google.maps.Geocoder();
    codeAddress(geocoder, map, address);
}

function codeAddress(geocoder, map, address) {

    geocoder.geocode({ 'address': address }, function (results, status) {
        //console.log(results);
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;