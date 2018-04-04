$(document).ready(function(){
    $('.owl-main').owlCarousel({
        items: 2
    });

    $('.owl-nested').owlCarousel({
        items: 1,
        nav: true,
        touchDrag: false,
        pullDrag: false
    });

    $('#destroy').on("click", function() {
        $('.owl-nested').owlCarousel('destroy');
        $('.owl-main').owlCarousel('destroy');
    });
});