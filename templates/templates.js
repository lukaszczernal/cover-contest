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
    return "<div class=\"swiper\">\n  <div class=\"swiper-queue\"></div>\n  <div id=\"instructions\"></div>\n</div>\n";
},"useData":true});
this["CC"]["templates"]["home"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<section class=\"home\">\n\n  <div class=\"home-title\">\n    <h1 class=\"home-titleText\">Cover</h1>\n    <h2 class=\"home-titleText m-subtitle\">Extravaganza</h2>\n    <div class=\"home-poweredby\">\n      <span class=\"home-poweredbyLabel\">Powered by</span>\n      <img class=\"home-poweredbyLogo\" src=\"images/mmlogo.svg\"/>\n    </div>\n  </div>\n\n  <div class=\"home-instructions\">\n    <span class=\"home-instructionsText\">Judge the covers.</span>\n    <span class=\"home-instructionsText\">Swipe left or right.</span>\n  </div>\n\n  <div class=\"home-start\">\n    <a class=\"btn\">Start</a>\n  </div>\n\n</section>\n";
},"useData":true});
this["CC"]["templates"]["instructions"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"instructions m-center\">\n  <div class=\"instructions-swipeArrow\">\n    <div class=\"instructions-swipeArrowImgParent\">\n      <div class=\"instructions-swipeArrowImgChild\">\n        <img class=\"instructions-swipeArrowImg\" src=\"images/arrows.svg\"/>\n      </div>\n    </div>\n  </div>\n  <div class=\"instructions-swipeLabels\">\n    <div class=\"home-swipeLabel m-negative\">Nah!</div>\n    <div class=\"home-swipeLabel m-positive\">Yea!</div>\n  </div>\n</div>\n";
},"useData":true});
this["CC"]["templates"]["summary"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <li class=\"summary-item\">\n                <img class=\"summary-itemImg\" src=\""
    + alias3(((helper = (helper = helpers.src || (depth0 != null ? depth0.src : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"src","hash":{},"data":data}) : helper)))
    + "\"/>\n                <div class=\"summary-itemText\">\n                    <span class=\"summary-itemTitle\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</span>\n                    <div class=\"summary-itemRating\">\n                        <span>You:</span>\n                        <span>"
    + alias3(((helper = (helper = helpers.rating || (depth0 != null ? depth0.rating : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"rating","hash":{},"data":data}) : helper)))
    + "</span>\n                        <span>Avg:</span>\n                        <span>N/A</span>\n                    </div>\n                </div>\n            </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"summary\">\n    <h1 class=\"summary-title\">Summary</h1>\n\n    <ul class=\"summary-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.collection : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n\n    <div class=\"summary-controls\">\n        <a class=\"summary-controlsBtn goToDeck btn\">Again</a>\n        <a class=\"summary-controlsBtn goToHome btn\">Home</a>\n    </div>\n\n</div>\n";
},"useData":true});