this["CC"] = this["CC"] || {};
this["CC"]["templates"] = this["CC"]["templates"] || {};
this["CC"]["templates"]["card"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"card\">\r\n  <div class=\"card-img tween\">\r\n    <div class=\"card-imgWrapper\">\r\n      <img class=\"card-imgTag\" src=\""
    + alias3(((helper = (helper = helpers.src || (depth0 != null ? depth0.src : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"src","hash":{},"data":data}) : helper)))
    + "\" />\r\n      <div class=\"card-imgOverlay\"></div>\r\n    </div>\r\n  </div>\r\n  <span class=\"card-title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</span>\r\n</div>\r\n";
},"useData":true});
this["CC"]["templates"]["deck"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"swiper\">\r\n  <div class=\"swiper-queue\">\r\n  </div>\r\n  <button id=\"reload\" onclick=\"window.location.reload()\">Reload</button>\r\n</div>\r\n";
},"useData":true});