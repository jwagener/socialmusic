var offset = 0;
var limit = 40;
var x = null;
function loadMoreTracks(path){
//  FB.api('/me/home?&q=soundcloud&limit=' + limit + '&offset=' + offset, function(response) {
  FB.api(path + '&limit=' + limit + '&offset=' + offset, function(response) {

    var posts = response.data;
    //offset += limit;
    var playables = []
    $.each(posts, function(){
      if(this.link && this.link.match(/http\:\/\/soundcloud\.com/)){
        playables.push(this);
      }
    });
    
    $.each(playables, function(){
      $.ajax({
        url:'http://api.soundcloud.com/resolve.js?consumer_key=jwtest&url=' + this.link,
        dataType: 'jsonp', 
        success: function(track){
          var artwork_url = 'http://a1.soundcloud.com/images/fb_placeholder.png';
          if(track.artwork_url){
            artwork_url = track.artwork_url.replace('large', 't300x300');
          }else if(track.user){
            if(!track.user.avatar_url.match(/default_avatar/)){
              artwork_url = track.user.avatar_url.replace('large', 'crop');
            }
          }
          //$('<img src="'+ artwork_url +'" />').data('track', track).data('post', this).appendTo('.container');
          $('<a href="'+ track.permalink_url +'"><img src="'+ artwork_url +'" /></a>').data('track', track).data('post', this).appendTo('.container');
          
          //$('.container').append('<img src="'+ artwork_url +'" />').data('track', track);
        } 
      });
      
    });		    
  });
};


$(function(){
  loadMoreTracks('/search?q=soundcloud');
  $('img').live('click', function(){
    console.log($(this).data('track'));
  });
  $('a.more').click(function(){
    loadMoreTracks();
  });
	$('a.fbconnect').click(function(){
		FB.login(function(){
		  $('.container').html('');
		  loadMoreTracks('/me/home?q=soundcloud');
		}, {perms:'read_stream,publish_stream,offline_access'});
	});
});