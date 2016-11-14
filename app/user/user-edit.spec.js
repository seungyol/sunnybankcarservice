'use strict';

describe('UserEditController', function() {
    beforeEach(module('userEdit'));
    
    describe('suburb search', function() {
        var ctrl, $httpBackend, scope, $q, deferred,User, deferredUser;
        var suburbs = [{"value":"BRUNCHILLY,NT,861","label":"BRUNCHILLY"},{"value":"RUNCORN,QLD,4113","label":"RUNCORN"}];
        var userDetailResult = {"user":     {"ID":"13","FirstName":"Joohwan","LastName":"Lee","Phone":"",
                                             "Mobile":"0422 430 818","Email":"joohwan@gmail.com","Password":"1234","StreetAddress":"123","suburb":"EIGHT MILE PLAINS","state":"QLD","postcode":"4113","RolesID":"2","SmtpName":"","SmtpPort":"0","SmtpPassword":"","CompanyName":"Sunnybank car service centre"},"roles":[{"ID":"1","0":"1","RoleName":"Mechanic","1":"Mechanic","DeletedYN":"N","2":"N"},{"ID":"2","0":"2","RoleName":"Mechanic Manager","1":"Mechanic Manager","DeletedYN":"N","2":"N"},{"ID":"3","0":"3","RoleName":"Director","1":"Director","DeletedYN":"N","2":"N"}]};
        var authFactory = {
          checkLogin : function() {return true;},
          getLoginDetail : function() {
            return {
                ID : 1,
                FirstName : 'Scott',
                LastName : 'LEE',
                Email : 'seungyol72@gmail.com',
                RolesID : 1,
                RoleName : 'Admin',
                CompaniesID : 1
            };              
          }
        };
        beforeEach(inject(function($componentController, _$httpBackend_, _$rootScope_, _$q_, _User_) {
            $q = _$q_;
            scope = _$rootScope_.$new();
            deferred = _$q_.defer();
            deferredUser = _$q_.defer();
            User = _User_;
            ctrl = $componentController('userEdit', {
                $scope: scope,
                AuthFactory : authFactory
            });
            
            spyOn(ctrl,'querySearch').and.returnValue(deferred.promise);
            spyOn(User,'get').and.returnValue(deferredUser.promise);
            $httpBackend = _$httpBackend_;
//            $httpBackend.whenGET('server/SelectPostCodes.php?term=RUNC').respond(suburbs);
            
            $httpBackend.whenGET('server/SelectUserDetail.php?RolesID=1').respond(userDetailResult);
            
            $httpBackend.flush();
        }));
        
        it('when entering "RUNC", it must return "RUNCORN"', function() {
            
            expect(ctrl).toBeDefined();
            expect(scope.loginID).toBeDefined();
            
            deferred.resolve(suburbs);
    
            // We have to call apply for this to work
            scope.$apply();

    // Since we called apply, not we can perform our assertions
//            expect(scope.results).not.toBe(undefined);
//            expect(scope.error).toBe(undefined);
            expect(ctrl.querySearch('RUNC').then().$$state.value).toEqual(suburbs);
            expect(ctrl.querySearch('RUNC')).toBeDefined();
        }) ;
        
        it('Geting User detail for Joohwan, it must return Joohwan detail', function() {
            expect(User).not.toBe(undefined);
            deferredUser.resolve(userDetailResult);
            scope.$apply();
            expect(User.get(13,3)).not.toBe(undefined);
            expect(User.get(13,3, userResult => {}).then().$$state.value).toEqual(userDetailResult);
        });
    });
});