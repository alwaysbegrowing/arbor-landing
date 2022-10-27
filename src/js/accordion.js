var accordion = (function () {
  var $accordion = $(".js-accordion");
  var $accordion_header = $accordion.find(".js-accordion-header");
  var $accordion_item = $(".js-accordion-item");

  // default settings
  var settings = {
    // animation speed
    speed: 400,

    // close all other accordion items if true
    oneOpen: false,
  };

  return {
    // pass configurable object literal
    init: function ($settings) {
      $accordion_header.on("click", function () {
        accordion.toggle($(this));
      });

      $.extend(settings, $settings);

      // ensure only one accordion is active if oneOpen is true
      if (settings.oneOpen && $(".js-accordion-item.active").length > 1) {
        $(".js-accordion-item.active:not(:first)").removeClass("active");
      }

      // reveal the active accordion bodies
      $(".js-accordion-item.active").find("> .js-accordion-body").show();
    },
    toggle: function ($this) {
      if (
        settings.oneOpen &&
        $this[0] !=
          $this
            .closest(".js-accordion")
            .find("> .js-accordion-item.active > .js-accordion-header")[0]
      ) {
        $this
          .closest(".js-accordion")
          .find("> .js-accordion-item")
          .removeClass("active")
          .find(".js-accordion-body")
          .slideUp();
      }
      // show/hide the clicked accordion item
      $this.closest(".js-accordion-item").toggleClass("active");

      if ($(".js-accordion-item.active").index() == 0) {
        $(".faq_img-wrap").hide();
        $(".faq_img-wrap.is--1").show();
      } else if ($(".js-accordion-item.active").index() == 1) {
        $(".faq_img-wrap").hide();
        $(".faq_img-wrap.is--2").show();
      } else if ($(".js-accordion-item.active").index() == 2) {
        $(".faq_img-wrap").hide();
        $(".faq_img-wrap.is--3").show();
      } else {
        $(".faq_img-wrap").hide();
        $(".faq_img-wrap.is--0").show();
      }

      $this.next().stop().slideToggle(settings.speed);
    },
  };
})();
$(document).ready(function () {
  accordion.init({ speed: 300, oneOpen: true });
  $(".faq_img-wrap").hide();
  setTimeout(function () {
    $(".js-accordion-item:first > .js-accordion-header").trigger("click");
  }, 10);
});
