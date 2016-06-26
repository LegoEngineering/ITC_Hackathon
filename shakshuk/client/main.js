var markers2 = [];
var map;

Template.main.helpers({
  "setMain":function(){
    Session.set("filter", null);
    Session.set("storeRate", "10");
    Session.set("view", "Landing");
    Session.set("selectedIcon", null);
  },
  "loggedIn":function(){
    return Meteor.user();
  },
  "showLanding":function(){
    return Session.equals("view","Landing");
  },
  "showMap":function(){
    return Session.equals("view", "Map");
  },
  "showList":function(){
    return Session.equals("view", "List");
  },
  "showComments":function(){
    return Session.equals("view", "Comments");
  }

});

Template.main.events({
  "click #createUser":function(e){ //creates user. TODO: only have user created if doesnt already exist
    e.preventDefault();
    var username = document.getElementById("username").value;
    if (username != "") {
      Meteor.call("addUser", username, 0);
      Meteor.setTimeout(function(){Meteor.loginWithPassword(username, "test");}, 3000);
    }
  },
  "click #mapButton": function(){
    Session.set("view", "Map");
  },
  "click .dropdown":function(e){
    console.log(e.target.id);
    for (var i = 0; i < markers2.length; i++) {
      markers2[i].setMap(map);
    }
    if (e.target.id == Session.get("filter")){
      Session.set("filter", null);
    }
    else {
      Session.set("filter", e.target.id);
      for (var j = 0; j < markers2.length; j++) {
        console.log(markers2[j]);
        if (markers2[j].icon.name != Session.get("filter")) {
          markers2[j].setMap(null)
        }
      }
    }
  },
  "click .shopButton": function(){
    Session.set("view", "List");
  }

});

Template.mapView.onRendered(function initMap() {
  var myLatLng = {lat: 32.06868, lng: 34.76905};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: myLatLng
  });

  var clothes_icon = {
      url: 'http://gdurl.com/RI3e',
      size: new google.maps.Size(50, 50),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32),
    name: "clothes_icon"
    };

    var gifts_icon = {
      url: 'http://gdurl.com/Qu0e',
      size: new google.maps.Size(50, 50),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32),
      name: "gifts_icon"
    };

    var food_icon = {
      url: 'http://gdurl.com/6WX1',
      size: new google.maps.Size(50, 50),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32),
      name: "food_icon"
    };


  var locations = Stores.find().map(function(u){return u});


    //  [
    //  {title: 'Shuk hacarmel', content: 'Blah', icon: clothes_icon, location: {lat: 32.06868, lng: 34.76905}},
    //  {title: 'Place 1', content: 'Blah', icon: gifts_icon, location: {lat: 32.0686807, lng: 34.7704091}},
    //  {title: 'Place 2', content: 'Blah', icon: gifts_icon, location: {lat: 32.0696693, lng: 34.7703987}},
    //  {title: 'Place 3', content: 'Blah', icon: clothes_icon, location: {lat: 32.0695268, lng: 34.7700604}},
    //  {title: 'Place 4', content: 'Blah', icon: gifts_icon, location: {lat: 32.0694686, lng: 34.7698905}},
    //  {title: 'Place 5', content: 'Blah', icon: gifts_icon, location: {lat: 32.0694726, lng: 34.7699017}},
    //  {title: 'Place 6', content: 'Blah', icon: gifts_icon, location: {lat: 32.0694106, lng: 34.7698328}},
    //  {title: 'Place 7', content: 'Blah', icon: gifts_icon, location: {lat: 32.0693564, lng: 34.7697147}},
    //  {title: 'Place 8', content: 'Blah', icon: clothes_icon, location: {lat: 32.0692761, lng: 34.7695830}},
    //  {title: 'Place 9', content: 'Blah', icon: food_icon, location: {lat: 32.0692419, lng: 34.7695444}},
    //  {title: 'Place 10', content: 'Blah', icon: clothes_icon, location: {lat: 32.0691698, lng: 34.7694296}}
    //];

    for (var i in locations){
      var l = locations[i];
      var icon;
      if (l.category == "Foods"){
        icon = food_icon;
      }
      else if (l.category == "Clothes"){
        icon = clothes_icon;
      }
      else
      icon = gifts_icon;
      addMarker(l.location,l.name, l.category, icon);
      //alert('addedMarker');
    };

//
//
  function showListings() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
//  //
//  //function hideListings() {
//  //  for (var i = 0; i < markers.length; i++) {
//  //    markers[i].setMap(map);
//  //  }
//  //}
//  //


  function addMarker(myLatLng, title, content, icon) {
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: title,
      icon: icon
    });
    markers2.push(marker);
    google.maps.event.addListener(marker, 'click', function(e) {
      console.log(e.target);
      console.log(this);
      jQuery.noConflict();
      Session.set("selectedIcon", this.title);
      $('#myModal').modal("show");
    });

  }

});

Template.mapView.helpers({
  "selectedStore":function(){
    return Stores.findOne({name: Session.get("selectedIcon")});
  },
  "commentsTop":function(){
    return Comments.findOne({storeID: this._id}).comment;
  }
});
Template.rate.helpers({
  "selectedStore":function(){
    return Stores.findOne({_id: Session.get("storeRate")});
  }
});

Template.rate.events({
  "click #submitScore": function(){
    var store = Session.get("storeRate");
    var score = $("#rating").val();
    var comment = document.getElementById("addComment").value;
    if (score != null && store != null) {
      Meteor.call("addScore", store, score);
    }
      if (comment != ""){
        var userID = Meteor.userId();
      Meteor.call("addComment", store, comment, userID);
    }
  }
});

Template.listView.helpers({
  "store":function(){
    if (Session.get("filter")!=null)
    return Stores.find({category: Session.get("filter")});
    else return Stores.find();
  },
  "check":function() {
    var id = "group-3-" + (this.score - 1);
    Meteor.setTimeout(function () {
      console.log(document.getElementById(id));
      $("#" + id).prop("checked", true);
      $('input[name="group-3"]').attr('disabled', true);
    }, 100000);
  }
});

Template.listView.events({
  "click #goToMap": function(){
    Session.set("view", "Map");
  },
  "change #filter":function(e){
    var filter = $(e.target).val();
    console.log(filter);
    Session.set("filter", filter);
  },
  "click #commentButton":function(){
    Session.set("storeRate", this._id);
    Session.set("view", "Comments");
  },

  "click #mapPage":function(){
    Session.set("view","Map");
  }
});

Template.commentView.helpers({
  "comments": function(){
    return Comments.find({storeID: Session.get("storeRate")});
  },
  "user":function(){
  return Meteor.users.findOne({_id: this.userID}).username;
}
});

Template.commentView.events({
  "click #goToList": function(){
    Session.set("view", "List");
  },
  "click #submitScore":function() {
    var store = Session.get("storeRate");
    var score = $('input[name="group-1"]:checked').val();
    var comment = document.getElementById("addComment").value;

    if (score != null && store != null) {
      Meteor.call("addScore", store, score);
    }
    if (comment != "") {
      var userID = Meteor.userId();
      Meteor.call("addComment", store, comment, userID);
    }
    $('input[name="group-1"]').prop('checked', false);
  },
  "click #listPage": function(){
    Session.set("view", "List");
  }
});

