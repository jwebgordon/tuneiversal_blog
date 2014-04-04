// Generated by CoffeeScript 1.7.1
(function() {
  var BlogView, PlayerView, Post, PostView, Posts,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Tuneiversal = {
    Models: {},
    Collections: {},
    Views: {}
  };

  Post = (function(_super) {
    __extends(Post, _super);

    function Post() {
      return Post.__super__.constructor.apply(this, arguments);
    }

    return Post;

  })(Backbone.Model);

  Posts = (function(_super) {
    __extends(Posts, _super);

    function Posts() {
      return Posts.__super__.constructor.apply(this, arguments);
    }

    Posts.prototype.model = Post;

    return Posts;

  })(Backbone.Collection);

  PostView = (function(_super) {
    __extends(PostView, _super);

    function PostView() {
      return PostView.__super__.constructor.apply(this, arguments);
    }

    PostView.prototype.el = $(".post.item");

    PostView.prototype.events = {
      "click .play-track": "play"
    };

    PostView.prototype.initialize = function() {
      this.model.view = this;
      return console.log("post_view initialize " + (this.model.get("title")));
    };

    PostView.prototype.play = function() {
      console.log("clicked play " + (this.model.get("title")));
      this.song_ready = new $.Deferred();
      $.ajax(this.model.get("url"), {
        type: "GET",
        success: (function(_this) {
          return function(data, textStatus, jqXHR) {
            var body;
            body = "<div id='body-mock'>" + data.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/g, "") + "</div>";
            console.log($(body).find(".youtube-url").text());
            _this.model.set({
              youtube_url: $(body).find(".youtube-url").text()
            });
            return _this.song_ready.resolve();
          };
        })(this),
        error: (function(_this) {
          return function(jqXHR, textStatus, errorThrown) {
            return console.log("error");
          };
        })(this)
      });
      return this.song_ready.done((function(_this) {
        return function() {
          return console.log(_this.model.get("youtube_url"));
        };
      })(this));
    };

    return PostView;

  })(Backbone.View);

  BlogView = (function(_super) {
    __extends(BlogView, _super);

    function BlogView() {
      return BlogView.__super__.constructor.apply(this, arguments);
    }

    BlogView.prototype.el = $("body");

    BlogView.prototype.initialize = function() {
      var firstScript, tag;
      this.render();
      tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(tag, firstScript);
      Tuneiversal.Collections.Posts = new Posts;
      return _.each($(".post.item"), function(el) {
        var post_model, post_view;
        post_model = new Post({
          title: $(el).find("h3.post-title").text(),
          url: $(el).find(".play-track").data("url")
        });
        Tuneiversal.Collections.Posts.add(post_model);
        return post_view = new PostView({
          model: post_model,
          el: el
        });
      });
    };

    BlogView.prototype.render = function() {};

    return BlogView;

  })(Backbone.View);

  Tuneiversal.Views.blog_view = new BlogView;

  PlayerView = (function(_super) {
    __extends(PlayerView, _super);

    function PlayerView() {
      return PlayerView.__super__.constructor.apply(this, arguments);
    }

    PlayerView.prototype.el = $(".player-container");

    PlayerView.prototype.events = {
      "click .play-button": "play_pause",
      "click .stop-button": "stop",
      "click .next-button": "next_track"
    };

    PlayerView.prototype.cue = [];

    PlayerView.prototype.initialize = function() {
      var that;
      that = this;
      return window.playerReady.done((function(_this) {
        return function() {
          return Tuneiversal.yPlayer = new YT.Player("youtube-embed", {
            height: "200",
            width: "200",
            videoId: "M7lc1UVf-VE",
            events: {
              "onReady": that.player_ready,
              "onStateChange": that.player_state_change
            }
          });
        };
      })(this));
    };

    PlayerView.prototype.player_ready = function() {
      return console.log("player_ready");
    };

    PlayerView.prototype.player_state_change = function() {
      var current_state;
      current_state = Tuneiversal.yPlayer.getPlayerState();
      if (current_state === 1) {
        return $(".play-button").css("background-image", "url('http://www.tuneiversal.com/hs-fs/hub/160982/file-630196930-png/images/player_controls/pause.png')");
      } else {
        return $(".play-button").css("background-image", "url('http://www.tuneiversal.com/hs-fs/hub/160982/file-625113038-png/images/player_controls/play.png')");
      }
    };

    PlayerView.prototype.play_pause = function() {
      var current_state;
      console.log("play_pause called");
      current_state = Tuneiversal.yPlayer.getPlayerState();
      if (current_state === 1) {
        return Tuneiversal.yPlayer.pauseVideo();
      } else if (current_state === 2) {
        return Tuneiversal.yPlayer.playVideo();
      }
    };

    PlayerView.prototype.stop = function() {
      return Tuneiversal.yPlayer.stopVideo();
    };

    PlayerView.prototype.next_track = function() {};

    return PlayerView;

  })(Backbone.View);

  Tuneiversal.Views.player_view = new PlayerView;

}).call(this);