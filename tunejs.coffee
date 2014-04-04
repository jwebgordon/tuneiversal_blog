window.Tuneiversal = 
	Models: {}
	Collections: {}
	Views: {}

class Post extends Backbone.Model

class Posts extends Backbone.Collection
	model: Post

class PostView extends Backbone.View

	el: $ ".post.item"	

	events:
		"click .play-track": "play"

	initialize: ->
		@model.view = @
		console.log "post_view initialize #{@model.get("title")}"

	play: ->
		console.log "clicked play #{@model.get("title")}"
		@song_ready = new $.Deferred()
		$.ajax @model.get("url"),
			type: "GET"
			success: (data, textStatus, jqXHR) =>
				body = "<div id='body-mock'>" + data.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/g, "") + "</div>"
				@model.set youtube_url: $(body).find(".youtube-url").text()
				@song_ready.resolve()
			error: (jqXHR, textStatus, errorThrown) =>
				console.log("error")
		@song_ready.done () =>
			console.log @model.get("youtube_url")


class BlogView extends Backbone.View
	el: $ "body"

	initialize: ->
		@render()
		tag = document.createElement "script"
		tag.src = "https://www.youtube.com/iframe_api"
		firstScript = document.getElementsByTagName("script")[0]
		firstScript.parentNode.insertBefore tag, firstScript

		Tuneiversal.Collections.Posts = new Posts
		# posts = $ ".post.item"
		# for post, i in posts
		# 	post_model = new Post
		# 		title: posts.eq(i).find("h3.post-title").text()
		# 		url:  posts.eq(i).find(".play-track").data("url")
		# 	Tuneiversal.Collections.Posts.add post_model
		# 	post_view = new PostView model: post_model
		_.each $(".post.item"), (el) ->
			post_model = new Post
				title: $(el).find("h3.post-title").text()
				url:  $(el).find(".play-track").data("url")
			Tuneiversal.Collections.Posts.add post_model
			post_view = new PostView model: post_model, el: el

	render: ->
		# posts = $ ".post.item"
		# for post in posts
		# 	new PostView
Tuneiversal.Views.blog_view = new BlogView

class PlayerView extends Backbone.View
	el: $ ".player-container"
	events:
		"click .play-button": "play_pause"
		"click .stop-button": "stop"
		"click .next-button": "next_track"

	cue: []

	initialize: ->
		that = @
		window.playerReady.done () =>
			Tuneiversal.yPlayer = new YT.Player "youtube-embed",
				height: "200"
				width: "200"
				videoId: "M7lc1UVf-VE"
				events:
					"onReady": that.player_ready
					"onStateChange": that.player_state_change

	player_ready: ->
		console.log "player_ready"

	player_state_change: ->
		current_state = Tuneiversal.yPlayer.getPlayerState()
		if current_state == 1
			$(".play-button").css("background-image", "url('http://www.tuneiversal.com/hs-fs/hub/160982/file-630196930-png/images/player_controls/pause.png')")
		else
			$(".play-button").css("background-image", "url('http://www.tuneiversal.com/hs-fs/hub/160982/file-625113038-png/images/player_controls/play.png')")

	play_pause: ->
		console.log "play_pause called"
		current_state = Tuneiversal.yPlayer.getPlayerState()
		if current_state == 1
			Tuneiversal.yPlayer.pauseVideo()
		else if current_state == 2
			Tuneiversal.yPlayer.playVideo()

	stop: ->
		Tuneiversal.yPlayer.stopVideo()

	next_track: ->


Tuneiversal.Views.player_view = new PlayerView




	





