function toggleContentService(key){
    $(".service-description").hide();
    $(`li[data-service-value="${key}"]`).show();
};

$(".service-title").click(function(){
    $(".service-title").removeClass("active");
    $(this).addClass("active");

    let activeKey = $(this).data('serviceKey');
    console.log(activeKey);
    
    toggleContentService(activeKey);
});


function fillTestimonialsContent(slideNum){
    $.getJSON('user-reviews.json', function(json){
      $(".testimonials-block__info-review").html(json[slideNum].comment);
      $(".testimonials-block__user-name").html(json[slideNum].user_name);
      $(".testimonials-block__user-pos").html(json[slideNum].user_title);
    })
}

$('.testimonials-slicker-for').on('beforeChange', function(event, slick, currentSlide, nextSlide){
  fillTestimonialsContent(nextSlide);
});

$(document).ready(function(){
    let activeKey = $(".service-title.active").data('serviceKey');
    toggleContentService(activeKey);

    $('.testimonials-slicker-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.testimonials-slicker-nav'
    });
    
    $('.testimonials-slicker-nav').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '.testimonials-slicker-for',
        focusOnSelect: true
    });

    $('.testimonials-slicker-nav').css({"max-width":"330px"});
    
    let currentSlide = $('.testimonials-slicker-for').slick('slickCurrentSlide');
    fillTestimonialsContent(currentSlide);
});
