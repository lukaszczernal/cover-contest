this["CC"] = this["CC"] || {};
this["CC"]["templates"] = this["CC"]["templates"] || {};
this["CC"]["templates"]["card"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"card\">\n  <div class=\"card-img tween\">\n    <div class=\"card-imgWrapper\">\n      <img class=\"card-imgTag\" src=\""
    + alias3(((helper = (helper = helpers.src || (depth0 != null ? depth0.src : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"src","hash":{},"data":data}) : helper)))
    + "\" />\n      <div class=\"card-imgOverlay\"></div>\n    </div>\n  </div>\n  <span class=\"card-title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</span>\n</div>\n";
},"useData":true});
this["CC"]["templates"]["deck"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"swiper\">\n  <div class=\"swiper-queue\">\n  </div>\n  <button id=\"reload\" onclick=\"window.location.reload()\">Reload</button>\n</div>\n";
},"useData":true});
this["CC"]["templates"]["home"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<section class=\"home\">\n\n  <h1 class=\"home-title\">Cover</h1>\n  <h2 class=\"home-title m-subtitle\">Extravaganza</h2>\n  <div class=\"home-poweredby\">\n    <span class=\"home-poweredbyLabel\">Powered by</span>\n    <img class=\"home-poweredbyLogo\" src=\"images/mmlogo.svg\"/>\n  </div>\n  <span class=\"home-instructions\">Judge the covers.</span>\n  <span class=\"home-instructions\">Swipe left or right.</span>\n  <div class=\"home-swipe\">\n    <div class=\"home-swipeArrow\">\n      <img class=\"home-swipeArrowImg\" src=\"images/arrows.svg\"/>\n    </div>\n    <div class=\"home-swipeLabel m-negative\">Nah!</div>\n    <div class=\"home-swipeLabel m-positive\">Yea!</div>\n  </div>\n  <a class=\"home-start btn\">Start</a>\n\n</section>\n";
},"useData":true});
this["CC"]["templates"]["summary"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"summary\">\n  <h1 class=\"summary-title\">Summary</h1>\n  <a class=\"summary-goToDeck btn\">Again</a>\n  <br/>\n  <br/>\n  <a class=\"summary-goToHome btn\">Home</a>\n</div>\n";
},"useData":true});