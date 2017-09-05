;(function($){
  //构造函数
 function Tab(tab){
    var that=this; 
    //保存单个 tab实例
     this.tab=tab;
     //默认配置参数
     this.config={
     	 'triggerType':'mouseover',
     	 'effect'     :'default',
     	 //默认显示第几个
     	 'invoke'     :1,
     	 //是否开启自动轮播
     	 'auto'       :false
     }
     //如果存在配置参数扩展
     if(this.getConfig()){
 	  	$.extend(this.config,this.getConfig());
     }
      
      //保存tab标签列表   对应的内容列表
      this.tabPanes=this.tab.find('.tab-pane');
      this.contentItems=this.tab.find('div.tab-content div.content-item');
      //保存配置参数
      var config=this.config;
   	 if(config.triggerType=='click'){
   	 	this.tabPanes.on(config.triggerType,function(e){
   	 			e.preventDefault();
	  //标记切换 以及 内容隐藏 
            that.invoke($(this));
            //console.log($(this));
   	 	})
   	 }else if(config.triggerType=='mouseover'||config.triggerType!="click"){
   	 		this.tabPanes.on("mouseover",function(e){
   	 			e.preventDefault();
 			that.invoke($(this));
	 	})
   	 }else{
   	 	alert('出错了！！');
   	 }


   	 //自动切换功能
   	 // console.log(config.auto);
   	 if(config.auto){
   	 	//定义一个全局定时器
   	 	this.timer =null;
   	 	//计数器  
   	 	this.loop  =0;
   	 	this.autoPlay();
   	 	this.tab.hover(function(){
   	 	    window.clearInterval(that.timer);
   	 	},function(){
   	 		that.autoPlay();
   	 	})
         // this.tab.mouseover(function(){window.clearInterval(that.timer);});
         // this.tab.mouseout(function(){that.autoPlay();});

   	 }


   	 //设置默认显示第几个tab
   	 if(config.invoke>1){
   	 	this.invoke(this.tabPanes.eq(config.invoke-1));
   	 }

 }
  
 // 原型 一般存放各种方法
  Tab.prototype={

  		//自动间隔时间切换
  		autoPlay:function(){
			var that  =this;
			tabPanes  =this.tabPanes,
			tabLength =tabPanes.length,
			config    =that.config; 
			that.timer=window.setInterval(function(){
				that.loop++;
				// console.log(that.loop);
				// console.log(tabLength);
				if(that.loop>=tabLength){
					that.loop=0;
				};
				// console.log('定时器启动');

				tabPanes.eq(that.loop).trigger(that.config.triggerType);
                //如绑定的是 mouseover 时间 则解开一下注释
				if (config.auto) {
                  that.tab.trigger("mouseout");
                   //	that.tab.unbind();
               	}

			},config.auto);

  		},


	   //事件驱动函数
       invoke:function(currentTab){
       		var that=this;
			/**
			执行Tab
			的选中状态，当前选中的要加上active(标记为白底)
	        切换对应的tab内容 ，根据配置参数的 effect 的值(default/fade)
			**/
		   var index=currentTab.index();
	       //tab选中状态
	       currentTab.addClass('active').siblings().removeClass('active');
	       var effect=this.config.effect;
	       var conItems=this.contentItems;
	       if(effect=='default'||effect===null||effect!='fade'){
	       		conItems.eq(index).addClass('current').siblings().removeClass('current');
			}else if(effect==='fade'){
				conItems.eq(index).stop().fadeIn(500).siblings().stop().fadeOut(500);
			}
              
			//如何配置了自动切换，记得做同步 index与loop
			if(this.config.auto){
				this.loop=index;
			}

       },
       getConfig:function(){
       	//获取tab elem节点上的data-config
        var  config=this.tab.attr('data-config');
          if(config&&config!=""){
         	 return $.parseJSON(config);
          }else{
          	return null;
          }
       }

     };
	  Tab.init=function(tabs){
	   	  var that=this;
	   	  tabs.each(function(){
	   	  	new that($(this));
	   	  })
	   }


    //注册成jquery方法
     $.fn.extend({
     	tab:function(){
     		this.each(function(){
     			new Tab($(this));
     		})
     		return this;
     	}
     });


    window.Tab=Tab;
})(jQuery)