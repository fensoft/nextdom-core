/* This file is part of Jeedom.
*
* Jeedom is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* Jeedom is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
*/

/* This file is part of NextDom.
*
* NextDom is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* NextDom is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with NextDom. If not, see <http://www.gnu.org/licenses/>.
*
* @Support <https://www.nextdom.org>
* @Email   <admin@nextdom.org>
* @Authors/Contributors: Sylvaner, Byackee, cyrilphoenix71, ColonelMoutarde, edgd1er, slobberbone, Astral0, DanoneKiD
*/

/* JS file for all that talk about GUI */

/* Tooltip activation */
(function($) {
    $(function() {
        $(document).tooltip({ selector: '[data-toggle="tooltip"]' });
    });
})(jQuery);

/**
 * Search input field activation on dedicated pages
 *
 * @param calcul true if you want to calcul dynamicly the height of menu
 */
 function sideMenuResize(calcul) {
     var lists = document.getElementsByTagName("li");
     if (calcul==true) {
         $(".sidebar-menu").css("height", "none");
         for (var i = 0; i < lists.length; ++i) {
             if (lists[i].getAttribute("id") !== undefined && lists[i].getAttribute("id") !== null) {
                 if (lists[i].getAttribute("id").match("side")) {
                     var liIndex=lists[i].getAttribute("id").slice(-1);
                     lists[i].getElementsByClassName("treeview-menu")[0].style.maxHeight=$(window).height()-50-70-(44*liIndex)+"px";
                 }
             }
         }
     } else {
         var goOnTopButton = document.getElementById("bt_goOnTop");
         var sidemenuBottomPadding = 0;
         var sidemenuDoubleHeaderPadding = 0;
         // If bt_goOnTop visible
         if (goOnTopButton !== undefined && goOnTopButton !== null) {
             if (goOnTopButton.style.display == "block") {
                 sidemenuBottomPadding = 75;
             }
         }

         // If double header because of little resolution
         if ($(window).width() < 768) {
             sidemenuDoubleHeaderPadding = 50;
         }

         // Height adjustement
         $(".sidebar-menu").css("height", $(window).height()-50-70-sidemenuBottomPadding-sidemenuDoubleHeaderPadding);
         for (var i = 0; i < lists.length; ++i) {
             if (lists[i].getAttribute("id") !== undefined && lists[i].getAttribute("id") !== null) {
                 if (lists[i].getAttribute("id").match("side")) {
                     lists[i].getElementsByClassName("treeview-menu")[0].style.maxHeight="none";
                 }
             }
         }
     }
 }

 /**
  * Limitation overflow menu sidebar
  *
  */
 function limitTreeviewMenu () {
     var maxHeight = 0;
     $(".sidebar-menu").children(".treeview").each(function() {
         maxHeight = window.innerHeight - document.getElementById($(this).attr('id')).offsetTop - 44 - 48 - 30;
         $(this).children(".treeview-menu").css("max-height", maxHeight);
     });
 }

 /**
  * Fullscreen management
  *
  */
 function toggleFullScreen() {
     if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
         if (document.documentElement.requestFullScreen) {
             document.documentElement.requestFullScreen();
         } else if (document.documentElement.mozRequestFullScreen) {
             document.documentElement.mozRequestFullScreen();
         } else if (document.documentElement.webkitRequestFullScreen) {
             document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
         }
         $('#togglefullscreen').removeClass('fa-expand').addClass('fa-compress');
     } else {
         if (document.cancelFullScreen) {
             document.cancelFullScreen();
         } else if (document.mozCancelFullScreen) {
             document.mozCancelFullScreen();
         } else if (document.webkitCancelFullScreen) {
             document.webkitCancelFullScreen();
         }
         $('#togglefullscreen').removeClass('fa-compress').addClass('fa-expand');
     }
 }

 /**
  * Actionbar (header) position and size adjustement
  *
  * @param init true for first display
  */
 function setHeaderPosition(init) {
     var headerHeight = 15;
     var alertHeaderHeight = 0;
     var alertHeaderMargin = 0;
     var headerSize;
     var paddingSideClose;
     if ($(window).width() < 768) {
         headerSize = 100;
         if ($('body').hasClass("sidebar-open")) {
             paddingSideClose = 245;
         } else {
             paddingSideClose = 15;
         }
     } else {
         headerSize = 50;
         if ($('body').hasClass("sidebar-collapse")) {
             paddingSideClose = 65;
         } else {
             paddingSideClose = 245;
         }
     }
     if ($('*').hasClass("alert-header")) {
         alertHeaderHeight = $('.alert-header').height();
         alertHeaderMargin = 15;
     }
     if ($('*').hasClass("content-header")) {
         var scrollLimit = 14 + alertHeaderHeight;
         $(".content-header").each(function() {
             var container = $(this).parent();
             if (!container.hasClass("ui-dialog-content") && !container.parent().hasClass("ui-dialog-content")) {
                 if (init || container.css("display")!="none") {
                     if (container.css("display")=="none") {
                         container.show();
                         headerHeight = container.children('.content-header').height();
                         container.hide();
                     } else {
                         headerHeight = container.children('.content-header').height();
                     }
                     if (document.documentElement.scrollTop > scrollLimit) {
                         container.children(".content-header").css("top", headerSize - 15);
                         container.children("#dashboard-content").css("padding-top", headerHeight + 15);
                         container.children(".content").css("padding-top", headerHeight + 30);
                         container.children(".content-header").children("div").removeClass('scroll-shadow').addClass('fixed-shadow');
                     } else {
                         var scrollValue = document.documentElement.scrollTop;
                         container.children(".content-header").css("top", headerSize - scrollValue + alertHeaderHeight + alertHeaderMargin);
                         container.children("#dashboard-content").animate({"padding-top" : headerHeight + 15 - alertHeaderMargin});
                         container.children(".content").animate({ "padding-top" : headerHeight + 30 - alertHeaderMargin}, {duration: 500});
                         container.children(".content-header").children("div").removeClass('fixed-shadow').addClass('scroll-shadow');
                     }
                     container.children(".content-header").show();
                 }
                 $(this).css("padding-right", paddingSideClose);
             }
         });
         $("#dashboard-header").css("padding-right", paddingSideClose);
     } else {
         $("#dashboard-content").css("padding-top", 15);
         $(".content").css("padding-top", 15);
     }
 }

 /**
  * Automatically adjust pages to paste to the NextDom theme
  *
  */
 function adjustNextDomTheme() {
     // tabs adjustement
     $("#div_pageContainer").css('padding-top', '');
     if (!$('#div_pageContainer .nav-tabs').parent().hasClass('nav-tabs-custom')) {
         $('#div_pageContainer .nav-tabs').parent().addClass('nav-tabs-custom');
     }
     if (!$('.ui-widget-content').find('.nav-tabs').parent().hasClass("nav-tabs-custom")) {
         $('.ui-widget-content').find('.nav-tabs').parent().addClass("nav-tabs-custom");
     }
     if ($('#div_pageContainer').find('.row-overflow').children(".row").length != 0) {
         $('#div_pageContainer').find('.row-overflow').removeClass('row');
     }

     // containers adjustement
     var needContent = $("#div_pageContainer").children("section").length == 0 && $("#div_pageContainer").children().children("section").length == 0 && (getUrlVars('p') != 'plan') && (getUrlVars('p') != 'view') && (getUrlVars('p') != 'plan3d');
     if (needContent) {
         if (!$('#div_pageContainer').hasClass('content')) {
             $('#div_pageContainer').addClass('content');
         }

     } else {
         if ($('#div_pageContainer').hasClass('content')) {
             $('#div_pageContainer').removeClass('content');
         }
         $("#div_pageContainer").css('margin-left','');
         $("#div_pageContainer").css('margin-right','');
     }

     // icons adjustement
     $('#div_pageContainer').find('.fas.fa-sign-in').each(function () {
         $(this).removeClass('fa-sign-in').addClass('fa-sign-in-alt');
     });
 }

 /**
  * Custom loading wait spinner display
  */
 function showLoadingCustom() {
     if ($.mobile) {
         $('#div_loadingSpinner').show()
     } else {
         if ($('#jqueryLoadingDiv').length == 0) {
             if (typeof nextdom_waitSpinner != 'undefined' && isset(nextdom_waitSpinner) && nextdom_waitSpinner != '') {
                 $('body').append('<div id="jqueryLoadingDiv"><div class="loadingImg"><i class="fas ' + nextdom_waitSpinner + ' fa-spin icon_theme_color"></i></div></div>');
             } else {
                 $('body').append('<div id="jqueryLoadingDiv"><div class="loadingImg"><i class="fas fa-sync-alt fa-spin icon_theme_color"></i></div></div>');
             }
         }
         $('#jqueryLoadingDiv').show();
         $('.blur-div').addClass('blur');
         $('.content').addClass('blur');
     }
 };

 /**
  * Custom loading wait spinner hidding
  */
 function hideLoadingCustom() {
     if ($.mobile) {
         $('#div_loadingSpinner').hide()
     } else {
         $('#jqueryLoadingDiv').hide();
         $('.blur-div').removeClass('blur');
         $('.content').removeClass('blur');
     }
 };
