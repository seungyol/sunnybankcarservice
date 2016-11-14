angular.module('commonApp').service('User', ['$resource', function($resource) {
    var UserDetails = $resource('server/SelectUserDetail.php');
    this.get = function(id, roleId, callback) {
        return UserDetails.get({ID: id, RolesID: roleId}, callback);        
    };
    
    var SaveUser = $resource('server/ManageUser.php',{},{save: {method: 'POST', headers: {'Content-Type' :'application/x-www-form-urlencoded;charset=utf-8'}}});
    this.save = function(data, callback) {
        return SaveUser.save(data, callback);
    };
}]);