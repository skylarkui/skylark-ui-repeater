/**
 * skylark-domx-repeater - The skylark repeater plugin library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx/skylark-domx-repeater/
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-noder","skylark-domx-geom","skylark-domx-velm","skylark-domx-query","skylark-domx-fx","skylark-domx-plugins","skylark-domx-popups/SelectList","skylark-domx-popups/ComboBox","./SearchBox"],function(e,t,i,n,s,a,r,l,o,h,d,c){var p=h.Plugin.inherit({klassName:"Repeater",pluginName:"domx.repeater",options:{dataSource:function(e,t){t({count:0,end:0,items:[],page:0,pages:1,start:0})},defaultView:-1,dropPagingCap:10,staticHeight:-1,views:null,searchOnKeyPress:!1,allowCancel:!0,addons:{views:["table","tile"]}},throb:function(e){return o.throb(this._elm,e)},_construct:function(e,i){this.overrided(e,i);var n,s,a=this;this.$element=l(this._elm),this.$canvas=this.$element.find(".repeater-canvas"),this.$count=this.$element.find(".repeater-count"),this.$end=this.$element.find(".repeater-end"),this.$filters=this.$element.find(".repeater-filters"),this.$loader=this.$element.find(".repeater-loader"),this.$pageSize=this.$element.find(".repeater-itemization .selectlist"),this.$nextBtn=this.$element.find(".repeater-next"),this.$pages=this.$element.find(".repeater-pages"),this.$prevBtn=this.$element.find(".repeater-prev"),this.$primaryPaging=this.$element.find(".repeater-primaryPaging"),this.$search=this.$element.find(".repeater-search").find(".search"),this.$secondaryPaging=this.$element.find(".repeater-secondaryPaging"),this.$start=this.$element.find(".repeater-start"),this.$viewport=this.$element.find(".repeater-viewport"),this.$views=this.$element.find(".repeater-views"),this.$element.on("mousedown.bs.dropdown.data-api",'[data-toggle="dropdown"]',function(e){l(this).plugin("domx.dropdown")}),this.currentPage=0,this.currentView=null,this.isDisabled=!1,this.infiniteScrollingCallback=function(){},this.infiniteScrollingCont=null,this.infiniteScrollingEnabled=!1,this.infiniteScrollingEnd=null,this.infiniteScrollingOptions={},this.lastPageInput=0,this.pageIncrement=0,this.resizeTimeout={},this.stamp=(new Date).getTime()+(Math.floor(100*Math.random())+1),this.storedDataSourceOpts=null,this.syncingViewButtonState=!1,this.viewType=null,this.$filters.plugin("domx.selectlist"),this.$pageSize.plugin("domx.selectlist"),this.$primaryPaging.find(".combobox").plugin("domx.combobox"),this.$search.plugin("lark.searchbox",{searchOnKeyPress:this.options.searchOnKeyPress,allowCancel:this.options.allowCancel}),this.$filters.on("changed.lark.selectlist",function(e,t){a.$element.trigger("filtered.lark.repeater",t),a.render({clearInfinite:!0,pageIncrement:null})}),this.$nextBtn.on("click.lark.repeater",t.proxy(this.next,this)),this.$pageSize.on("changed.lark.selectlist",function(e,t){a.$element.trigger("pageSizeChanged.lark.repeater",t),a.render({pageIncrement:null})}),this.$prevBtn.on("click.lark.repeater",t.proxy(this.previous,this)),this.$primaryPaging.find(".combobox").on("changed.lark.combobox",function(e,t){a.pageInputChange(t.text,t)}),this.$search.on("searched.lark.search cleared.lark.search",function(e,t){a.$element.trigger("searchChanged.lark.repeater",t),a.render({clearInfinite:!0,pageIncrement:null})}),this.$search.on("canceled.lark.search",function(e,t){a.$element.trigger("canceled.lark.repeater",t),a.render({clearInfinite:!0,pageIncrement:null})}),this.$secondaryPaging.on("blur.lark.repeater",function(){a.pageInputChange(a.$secondaryPaging.val())}),this.$secondaryPaging.on("keyup",function(e){13===e.keyCode&&a.pageInputChange(a.$secondaryPaging.val())}),this.$views.find("input").on("change.lark.repeater",t.proxy(this.viewChanged,this)),l(window).on("resize.lark.repeater."+this.stamp,function(){clearTimeout(a.resizeTimeout),a.resizeTimeout=setTimeout(function(){a.resize(),a.$element.trigger("resized.lark.repeater")},75)}),-1!==this.options.defaultView?s=this.options.defaultView:(n=this.$views.find("label.active input"),s=n.length>0?n.val():"table"),this.initViewTypes(function(){a.resize(),a.$element.trigger("resized.lark.repeater"),a.render({changeView:s})})},clear:function(e){var t=e||{};t.preserve?this.infiniteScrollingEnabled&&!t.clearInfinite||u(this.$canvas):this.$canvas.empty();void 0!==t.viewChanged&&t.viewChanged;this._view&&this._view.cleared({options:t})},clearPreservedDataSourceOptions:function(){this.storedDataSourceOpts=null},destroy:function(){var e;return this.$element.find("input").each(function(){l(this).attr("value",l(this).val())}),this.$canvas.empty(),e=this.$element[0].outerHTML,this.$element.find(".combobox").plugin("lark.combobox").destroy(),this.$element.find(".selectlist").plugin("domx.selectlist").destroy(),this.$element.find(".search").plugin("lark.searchbox").destroy(),this.infiniteScrollingEnabled&&l(this.infiniteScrollingCont).infinitescroll("destroy"),this.$element.remove(),l(window).off("resize.lark.repeater."+this.stamp),e},disable:function(){this.$search.plugin("lark.searchbox").disable(),this.$filters.plugin("domx.selectlist").disable(),this.$views.find("label, input").addClass("disabled").attr("disabled","disabled"),this.$pageSize.plugin("domx.selectlist").disable(),this.$primaryPaging.find(".combobox").plugin("domx.combobox").disable(),this.$secondaryPaging.attr("disabled","disabled"),this.$prevBtn.attr("disabled","disabled"),this.$nextBtn.attr("disabled","disabled"),this._view&&this._view.enabled({status:!1}),this.isDisabled=!0,this.$element.addClass("disabled"),this.$element.trigger("disabled.lark.repeater")},enable:function(){this.$search.plugin("lark.searchbox").enable(),this.$filters.plugin("domx.selectlist").enable(),this.$views.find("label, input").removeClass("disabled").removeAttr("disabled"),this.$pageSize.plugin("domx.selectlist").enable(),this.$primaryPaging.find(".combobox").plugin("domx.combobox").enable(),this.$secondaryPaging.removeAttr("disabled"),this.$prevBtn.hasClass("page-end")||this.$prevBtn.removeAttr("disabled"),this.$nextBtn.hasClass("page-end")||this.$nextBtn.removeAttr("disabled"),this.$prevBtn.hasClass("page-end")&&this.$nextBtn.hasClass("page-end")&&this.$primaryPaging.plugin("domx.combobox").disable(),0!==parseInt(this.$count.html(),10)?this.$pageSize.plugin("domx.selectlist").enable():this.$pageSize.plugin("domx.selectlist").disable(),this._view&&this._view.enabled({status:!0}),this.isDisabled=!1,this.$element.removeClass("disabled"),this.$element.trigger("enabled.lark.repeater")},getDataOptions:function(e){var i=e||{};void 0!==i.pageIncrement&&(null===i.pageIncrement?this.currentPage=0:this.currentPage+=i.pageIncrement);var n={};i.dataSourceOptions&&(n=i.dataSourceOptions,i.preserveDataSourceOptions&&(this.storedDataSourceOpts?this.storedDataSourceOpts=t.mixin(this.storedDataSourceOpts,n):this.storedDataSourceOpts=n)),this.storedDataSourceOpts&&(n=t.mixin(this.storedDataSourceOpts,n));var s={view:this.currentView,pageIndex:this.currentPage,filter:{text:"All",value:"all"}};this.$filters.length>0&&(s.filter=this.$filters.plugin("domx.selectlist").selectedItem()),this.infiniteScrollingEnabled||(s.pageSize=25,this.$pageSize.length>0&&(s.pageSize=parseInt(this.$pageSize.plugin("domx.selectlist").selectedItem().value,10)));var a=this.$search&&this.$search.find("input")&&this.$search.find("input").val();return""!==a&&(s.search=a),this._view&&(s=this._view.dataOptions(s)),s=t.mixin(s,n)},infiniteScrolling:function(e,t){var i=this.$element.find(".repeater-footer"),n=this.$element.find(".repeater-viewport"),s=t||{};if(e)this.infiniteScrollingEnabled=!0,this.infiniteScrollingEnd=s.end,delete s.dataSource,delete s.end,this.infiniteScrollingOptions=s,n.css({height:n.height()+i.outerHeight()}),i.hide();else{var a=this.infiniteScrollingCont;delete a.data().infinitescroll,a.off("scroll"),a.removeClass("infinitescroll"),this.infiniteScrollingCont=null,this.infiniteScrollingEnabled=!1,this.infiniteScrollingEnd=null,this.infiniteScrollingOptions={},n.css({height:n.height()-i.outerHeight()}),i.show()}},infiniteScrollPaging:function(e){var t=!0!==this.infiniteScrollingEnd?this.infiniteScrollingEnd:void 0,i=e.page,n=e.pages;this.currentPage=void 0!==i?i:NaN,(!0===e.end||this.currentPage+1>=n)&&this.infiniteScrollingCont.infinitescroll("end",t)},initInfiniteScrolling:function(){var e=this.$canvas.find('[data-infinite="true"]:first');if((e=e.length<1?this.$canvas:e).data("lark.infinitescroll"))e.infinitescroll("enable");else{var i=this,n=t.mixin({},this.infiniteScrollingOptions);n.dataSource=function(e,t){i.infiniteScrollingCallback=t,i.render({pageIncrement:1})},e.infinitescroll(n),this.infiniteScrollingCont=e}},initViewTypes:function(e){for(var t=this._views=[],i=this.options.addons.views,n=0;n<i.length;n++){var s=this.constructor.addons.views[i[n]];if(!s)throw new Error("The view type "+i[n]+" is not defined!");var a=s.ctor;this._views.push(this._views[i[n]]=new a(this))}t.length>0?m.call(this,0,i,e):e()},itemization:function(e){this.$count.html(void 0!==e.count?e.count:"?"),this.$end.html(void 0!==e.end?e.end:"?"),this.$start.html(void 0!==e.start?e.start:"?")},next:function(){this.$nextBtn.attr("disabled","disabled"),this.$prevBtn.attr("disabled","disabled"),this.pageIncrement=1,this.$element.trigger("nextClicked.lark.repeater"),this.render({pageIncrement:this.pageIncrement})},pageInputChange:function(e,t){var i;if(e!==this.lastPageInput){this.lastPageInput=e;var n=parseInt(e,10)-1;i=n-this.currentPage,this.$element.trigger("pageChanged.lark.repeater",[n,t]),this.render({pageIncrement:i})}},pagination:function(e){this.$primaryPaging.removeClass("active"),this.$secondaryPaging.removeClass("active");var t=e.pages;this.currentPage=void 0!==e.page?e.page:NaN;var i=0===t?0:this.currentPage+1;if(t<=this.options.dropPagingCap){this.$primaryPaging.addClass("active");var n=this.$primaryPaging.find(".dropdown-menu");n.empty();for(var s=0;s<t;s++){var a=s+1;n.append('<li data-value="'+a+'"><a href="#">'+a+"</a></li>")}this.$primaryPaging.find("input.form-control").val(i)}else this.$secondaryPaging.addClass("active"),this.$secondaryPaging.val(i);this.lastPageInput=this.currentPage+1+"",this.$pages.html(""+t),this.currentPage+1<t?(this.$nextBtn.removeAttr("disabled"),this.$nextBtn.removeClass("page-end")):(this.$nextBtn.attr("disabled","disabled"),this.$nextBtn.addClass("page-end")),this.currentPage-1>=0?(this.$prevBtn.removeAttr("disabled"),this.$prevBtn.removeClass("page-end")):(this.$prevBtn.attr("disabled","disabled"),this.$prevBtn.addClass("page-end")),0!==this.pageIncrement&&(this.pageIncrement>0?this.$nextBtn.is(":disabled")?this.$prevBtn.focus():this.$nextBtn.focus():this.$prevBtn.is(":disabled")?this.$nextBtn.focus():this.$prevBtn.focus())},previous:function(){this.$nextBtn.attr("disabled","disabled"),this.$prevBtn.attr("disabled","disabled"),this.pageIncrement=-1,this.$element.trigger("previousClicked.lark.repeater"),this.render({pageIncrement:this.pageIncrement})},render:function(e){this.disable();var t=!1,i=e||{};if(i.changeView&&this.currentView!==i.changeView){var n=this.currentView;this.currentView=i.changeView,this.viewType=this.currentView.split(".")[0],this._view=this._views[this.viewType],this.$element.attr("data-currentview",this.currentView),this.$element.attr("data-viewtype",this.viewType),t=!0,i.viewChanged=t,this.$element.trigger("viewChanged.lark.repeater",this.currentView),this.infiniteScrollingEnabled&&this.infiniteScrolling(!1),this._view.selected({prevView:n})}this.syncViewButtonState(),i.preserve=void 0!==i.preserve?i.preserve:!t,this.clear(i),(!this.infiniteScrollingEnabled||this.infiniteScrollingEnabled&&t)&&(this._throbber=this.throb({className:"throbWrap"}));var s=this.getDataOptions(i),a=this.options.dataSource,r=this,l=this._view;a(s,function(e){$.call(r,{data:e,dataOptions:s,options:i,viewChanged:t,viewTypeObj:l})})},resize:function(){for(var e,t,i,n=-1===this.options.staticHeight?this.$element.attr("data-staticheight"):this.options.staticHeight,s=[],a=[],r=this.$element.parentsUntil(":visible"),o=0;o<r.length&&this.$element.is(":hidden");)i=r[o],l(i).is(":hidden")&&(a.push(i.style.display),i.style.display="block",s.push(i)),o++;void 0!==n&&!1!==n&&"false"!==n?(this.$canvas.addClass("scrolling"),t={bottom:this.$viewport.css("margin-bottom"),top:this.$viewport.css("margin-top")},e=("true"===n||!0===n?this.$element.height():parseInt(n,10))-this.$element.find(".repeater-header").outerHeight()-this.$element.find(".repeater-footer").outerHeight()-("auto"===t.bottom?0:parseInt(t.bottom,10))-("auto"===t.top?0:parseInt(t.top,10)),this.$viewport.outerHeight(e)):this.$canvas.removeClass("scrolling");this._view&&this._view.resize({height:this.$element.outerHeight(),width:this.$element.outerWidth()}),s.forEach(function(e,t){e.style.display=a[t]})},renderItems:function(e,t,i){if(e.render)e.render({container:this.$canvas,data:t},i),i(t);else{if(e.before){var n=e.before({container:this.$canvas,data:t});f(this.$canvas,n)}var s=this.$canvas.find('[data-container="true"]:last'),a=s.length>0?s:this.$canvas;if(e.renderItem){var r,l=(e.repeat||"data.items").split("."),o=l[0];if("data"===o||"this"===o){r="this"===o?this:t;for(var h=l.slice(1),d=0;d<h.length;d++){if(void 0===r[h[d]]){r=[],g("WARNING: Repeater unable to find property to iterate renderItem on.");break}r=r[h[d]]}for(var c=0;c<r.length;c++){var p=e.renderItem({container:a,data:t,index:c,subset:r});f(a,p)}}else g('WARNING: Repeater plugin "repeat" value must start with either "data" or "this"')}if(e.after){var u=e.after({container:this.$canvas,data:t});f(this.$canvas,u)}i(t)}},viewChanged:function(e){var t=l(e.target),i=t.val();this.syncingViewButtonState||(this.isDisabled||t.parents("label:first").hasClass("disabled")?this.syncViewButtonState():this.render({changeView:i,pageIncrement:null}))},syncViewButtonState:function(){var e=this.$views.find('input[value="'+this.currentView+'"]');this.syncingViewButtonState=!0,this.$views.find("input").prop("checked",!1),this.$views.find("label.active").removeClass("active"),e.length>0&&(e.prop("checked",!0),e.parents("label:first").addClass("active")),this.syncingViewButtonState=!1},getNestedProperty:function(e,t){return t.replace(/\[(?:'([^']+)'|"([^"]+)"|(\d+))\]|(?:(?:^|\.)([^\.\[]+))/g,function(t,i,n,s,a){var r=a||i||n||s&&parseInt(s,10);t&&e&&(e=e[r])}),e},getDataProperty:function(e,t){var i,n;if(e.dataset?(i=t.replace(/-([a-z])/g,function(e,t){return t.toUpperCase()}),n=e.dataset[i]):e.getAttribute&&(n=e.getAttribute("data-"+t.replace(/([A-Z])/g,"-$1").toLowerCase())),"string"==typeof n){if(/^(true|false|null|-?\d+(\.\d+)?|\{[\s\S]*\}|\[[\s\S]*\])$/.test(n))try{return l.parseJSON(n)}catch(e){}return n}},getItemProperty:function(e,t){var i=this.getDataProperty(e,t);return void 0===i&&(i=e[t]),void 0===i&&(i=this.getNestedProperty(e,t)),i}}),g=function(e){window.console&&window.console.warn&&window.console.warn(e)},u=function e(t){var i=[];t.children().each(function(){var t=l(this),n=t.attr("data-preserve");"deep"===n?(t.detach(),i.push(t)):"shallow"===n&&(e(t),t.detach(),i.push(t))}),t.empty(),t.append(i)},f=function(e,t){var i;t&&("none"!==(i=t.action?t.action:"append")&&void 0!==t.item&&(void 0!==t.container?l(t.container):e)[i](t.item))},v=function(e,t,i){var n=e+1;n<t.length?m.call(this,n,t,i):i()},m=function(e,t,i){t[e].initialize?t[e].initialize.call(this,{},function(){v.call(this,e,t,i)}):v.call(this,e,t,i)},$=function(e){var t=e.data||{};this.infiniteScrollingEnabled?this.infiniteScrollingCallback({}):(this.itemization(t),this.pagination(t));var i=this;this.renderItems(e.viewTypeObj,t,function(t){e.data=t,function(e){var t=e.data||{};this.infiniteScrollingEnabled&&((e.viewChanged||e.options.clearInfinite)&&this.initInfiniteScrolling(),this.infiniteScrollPaging(t,e.options)),this._throbber&&(this._throbber.remove(),this._throbber=null),this.enable(),this.$search.trigger("rendered.lark.repeater",{data:t,options:e.dataOptions,renderOptions:e.options}),this.$element.trigger("rendered.lark.repeater",{data:t,options:e.dataOptions,renderOptions:e.options}),this.$element.trigger("loaded.lark.repeater",e.dataOptions)}.call(i,e)})};return p.addons={},h.register(p),e.attach("domx.Repeater",p)});
//# sourceMappingURL=sourcemaps/Repeater.js.map
