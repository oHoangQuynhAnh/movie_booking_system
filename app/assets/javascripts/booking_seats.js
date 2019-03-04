$(document).on('turbolinks:load', function() {
  window.onload = window.localStorage.clear();
  $('#select_cinema').on('change', function(){
    $('#locationp').text($("#select_cinema option:selected").text());
    $.ajax({
      url: 'filter_auditoria',
      type: "GET",
      data: {cinema_id: $(this).val()}
    }).done(function(response){
      var auditoria = response["auditoria"];
      $('#select_auditorium').children().remove();
      for(var i=0; i< auditoria.length; i++){
        $("#select_auditorium").append('<option value="' + auditoria[i]["id"] + '">' + auditoria[i]["name"] + '</option>');
      }
    })
  });

  $('#select_auditorium').on('change', function(){
    $('#auditoriump').text($("#select_auditorium option:selected").text());
    $('.order-date').children().remove();
    $('.order-date span').remove();
    localStorage.setItem('auditorium_id', $(this).val());
    $.ajax({
      url: 'get_schedules',
      type: "GET",
      data: {auditorium_id: $(this).val()}
    }).done(function(response){
      var schedules = response["schedules"];
      if(response['schedules'].length === 0 ) {
        $('.order-date').append('<span>Chưa có lịch chiếu</span>');
      } else {
        for(let i=0; i< schedules.length; i++){
          let start_time = formatDate(schedules[i]['start_time'])
          console.log(schedules[i]['id'])
          $('.order-date').append('<li value=' + schedules[i]['id'] +
            '><a href="javascript:;"><i><b>' + start_time + '</b></i></a></li>');
        }
      }
    })
    $.ajax({
      url: 'get_auditorium_id_from_client',
      type: "POST",
      data: {auditorium_id: localStorage.getItem('auditorium_id')}
    }).done(function(){
      console.log('sent');
    })
  })

  $('#msform').on('click', '.order-date a', function(){
    $('#select-info-movie').remove();
    var animating;
    localStorage.setItem('schedule_id', $(this).parent().val());
    $('#timep').text($(this).text());
    $('.zoom-button').removeClass('display-none');
    $.ajax({
      url: 'get_schedule_id_from_client',
      type: "POST",
      data: {schedule_id: localStorage.getItem('schedule_id')}
    }).done(function(){
      console.log('sent');
    })


    if (animating) return false;
    animating = true;
    current_fs = $(this).parent();
    next_fs = $('.seat-content');
    next_fs.show();
    current_fs.animate({
      opacity: 0
    }, {
      step: function(now, mx) {
        scale = 1 - (1 - now) * 0.2;
        left = (now * 50) + "%";
        opacity = 1 - now;
        current_fs.css({
          'transform': 'scale(' + scale + ')'
        });
        next_fs.css({
          'left': left,
          'opacity': opacity
        });
      },
      duration: 800,
      complete: function() {
        current_fs.hide();
        animating = false;
      },
      easing: 'easeInOutBack'
    });
  })

  $('#select_movie').on('change', function(){
    $('#moviep').text($("#select_movie option:selected").text());
    $('.order-date').children().remove();
    $.ajax({
      url: 'get_schedules',
      type: "GET",
      data: {
        movie_id: $(this).val(),
        auditorium_id: $('#select_auditorium').val()
      }
    }).done(function(response){
      var schedules = response["schedules"];
      console.log(response['schedules']);
      for(let i=0; i< schedules.length; i++){
        let start_time = formatDate(schedules[i]['start_time'])
        $('.order-date').append('<li value=' + schedules[i]['id'] +
          '><a href="javascript:;"><i><b>' + start_time + '</b></i></a></li>');
      }
    })
  });
  var area = document.querySelector('.table');
  var controller = panzoom(area, {zoomDoubleClickSpeed: 1,
    maxZoom: 1.5,
    minZoom: 1})

  $('#submit-booking').click(function(){
    $('#form-seat').submit();
  })
  var currentZoom = 1
  $('#zoom-in').click(function(){
    currentZoom += 0.1;
    $('.table').css({ transform: 'scale(' + currentZoom + ')' })
  });
  $('#zoom-out').click(function(){
    currentZoom -= 0.1;
    $('.table').css({ transform: 'scale(' + currentZoom + ')' })
  });

  $('.seat-map table tr td').on('click', function(e){
    if(e.target.type == 'checkbox'){
      if($(this).is(':checked')) $(this).attr('checked', false);
      else $(this).attr('checked', true);
      return;
    } else {
      if($(this).find('input:checkbox').is(':checked')){
        $(this).find('input:checkbox').attr('checked', false);
        $(this).removeClass('red-highlight');
        $('#selected-seats li:contains(' + $(this).text() + ')').remove();
      }
      else {
        $(this).find('input:checkbox').attr('checked', true);
        $(this).addClass('red-highlight');
        $('#selected-seats').append('<li>' + $(this).text() + '</li>');
        $('#counter').text($('#selected-seats li').length)
      }
    }
  });

  $('#select_cinema_booking').on('change', function(){
    $('#locationp').text($("#select_cinema_booking option:selected").text());
    $.ajax({
      url: '/filter_auditoria',
      type: "GET",
      data: {cinema_id: $(this).val()}
    }).done(function(response){
      var auditoria = response["auditoria"];
      $('#select_auditorium_booking').children().remove();
      for(var i=0; i< auditoria.length; i++){
        $("#select_auditorium_booking").append('<option value="' + auditoria[i]["id"] + '">' + auditoria[i]["name"] + '</option>');
      }
    })
  });

  $('#select_auditorium_booking').on('change', function(){
    $('#auditoriump').text($("#select_auditorium_booking option:selected").text());
    $('.order-date').children().remove();
    $('.order-date span').remove();
    localStorage.setItem('auditorium_id', $(this).val());
    $.ajax({
      url: '/get_schedules',
      type: "GET",
      data: {auditorium_id: $(this).val(),
        movie_id: window.location.href.split('=')[1]}
    }).done(function(response){
      var schedules = response["schedules"];
      if(response['schedules'].length === 0 ) {
        $('.order-date').append('<span>Chưa có lịch chiếu</span>');
      } else {
        for(let i=0; i< schedules.length; i++){
          let start_time = formatDate(schedules[i]['start_time'])
          $('.order-date').append('<li value=' + schedules[i]['id'] +
            '><a href="javascript:;"><i><b>' + start_time + '</b></i></a></li>');
        }
      }
    })
    $.ajax({
      url: '/get_auditorium_id_from_client',
      type: "POST",
      data: {auditorium_id: localStorage.getItem('auditorium_id')}
    }).done(function(){
      console.log('sent');
    })
  })

  $('#msform').on('click', '.order-date a', function(){
    $('.select-info-movie').addClass('display-none');
    localStorage.setItem('schedule_id', $(this).parent().val());
    $('#timep').text($(this).text());
    $('.zoom-button').removeClass('display-none');
    $.ajax({
      url: '/get_schedule_id_from_client',
      type: "POST",
      data: {schedule_id: localStorage.getItem('schedule_id')}
    }).done(function(){
      console.log('sent');
    })
  })

  $('#submit-booking-movie').click(function(){
    $('#form-seat').submit();
  })
});

function formatDate(d) {
  var myDate = new Date(d);
  var hrs = ((myDate.getHours() > 12) ? myDate.getHours()-12 : myDate.getHours());
  var amPM = ((myDate.getHours() >= 12) ? "PM" : "AM");
  if (hrs==0) hrs = 12;
  var formattedDate = (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear() + " " + hrs + ":" + myDate.getMinutes() + " " + amPM;
  return formattedDate;
}
