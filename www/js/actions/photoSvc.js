(function() {
    'use strict';

    angular
        .module('babyTracker')
        .factory('photoSvc', photoSvc);

    photoSvc.$inject = ['userSvc', '$q', '$firebaseArray', 'config', '$firebaseObject'];

    function photoSvc(userSvc, $q, $firebaseArray, config, $firebaseObject) {
        var ref = new Firebase(config.dbUrls.base + "photos");
        var service = {
            ref: ref,
            addAlbum: addAlbum,
            deleteAlbum: deleteAlbum,
            getAlbums: getAlbums,
            addPhotoAlbum: addPhotoAlbum,
            deletePhotoAlbum: deletePhotoAlbum,
            getAlbum: getAlbum,
            getAlbumPhotos: getAlbumPhotos,
            getAlbumTitle: getAlbumTitle,
            addReactionToPhoto: addReactionToPhoto
        };

        return service;
        function addAlbum(childId, title, photos) {
            var obj = {
                title: title,
                photos: photos
            }
            return $firebaseArray(ref.child(childId)).$add(obj);
        }

        function deleteAlbum() {

        }

        function addPhotoAlbum() {

        }

        function deletePhotoAlbum() {

        }

        function getAlbums(childId) {
            return $firebaseArray(ref.child(childId)).$loaded();
        }

        function getAlbumTitle(childId, albumId) {
            return $firebaseObject(ref.child(childId).child(albumId).child('title')).$loaded();
        }

        function getAlbum(childId, albumId) {
            return $firebaseObject(ref.child(childId).child(albumId)).$loaded();
        }

        function getAlbumPhotos(childId, albumId) {
            return $firebaseArray(ref.child(childId).child(albumId).child("photos"));

        }

        function addReactionToPhoto(childId, albumId, index, reac, uid) {
          var deferred = $q.defer();
          userSvc.getUserProfile(uid).then(function(usr) {
            var reaction = {
              uid: uid,
              userName: usr.firstName + " " + usr.lastName,
              profileImage: usr.profileImage,
              photoInDatabase: usr.photoInDatabase,
              dateCreated: Firebase.ServerValue.TIMESTAMP,
              message: reac
            }
            var refMes = ref.child(childId).child(albumId).child('photos').child(index).child("reactions").push(reaction, function(err) {
                if(!err) {
                    deferred.resolve(reac);
                } else {
                    deferred.reject(err);
                }
            });
        }, function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
        }
    }
})();
