(function () {
    'use strict';
    var app = angular.module('mobApp');
    app.factory('ChatService', ChatService);
    /*ngInject*/
    function ChatService($q, $http, ENV, CommonServices) {
        var serviceBase = ENV.apiUrl;



        //Get Messages
        function getMessages(conversationID) {
            var deferred = $q.defer();
            var url = ENV.apiUrl + 'Chats?conversationID=' + conversationID;

            $http.get(url, { cache: false }).success(function (data) {
                deferred.resolve(data);

            }).error(function (err) {
                deferred.reject();

                CommonServices.showAlert(JSON.stringify(err));
                //CommonServices.showError(MessageService.networkErrorMessage);
            });
            return deferred.promise;
        }

        //Get Conversation by USr and JobID
        function getConversation(jobid, userid) {
            var deferred = $q.defer();
            var url = ENV.apiUrl + 'Conversations?jobID=' + jobid + '&userID=' + userid;
            $http.get(url, { cache: false }).success(function (data) {
                deferred.resolve(data);

            }).error(function (err) {
                deferred.reject();

                CommonServices.showAlert(JSON.stringify(err));
                //CommonServices.showError(MessageService.networkErrorMessage);
            });
            return deferred.promise;
        }



        //Send Message
        function sendMessage(message) {
            console.log(message);
            var defferred = $q.defer();

            var url = serviceBase + "Chats?userID=" + CommonServices.getUserId() + '&toUser=' + message.toUser;
            $http.post(url, message).success(function (data) {
                //CommonServices.showAlert("Job Created Successfully!!");
                defferred.resolve(data);
            }).error(function (error) {

                CommonServices.showAlert(JSON.stringify(error));
                defferred.reject();
            });

            return defferred.promise;
        }

        return {
            getMessages: getMessages,
            sendMessage: sendMessage,
            getConversation: getConversation

        }

    }

})();