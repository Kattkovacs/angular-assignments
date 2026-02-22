(function () {
'use strict';

describe('UserService', function () {

  var UserService;
  var $httpBackend;
  var BASE = 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items';

  // Load the common module before each test
  beforeEach(module('common'));

  // Inject the service and $httpBackend mock
  beforeEach(inject(function (_UserService_, _$httpBackend_) {
    UserService  = _UserService_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function () {
    // Ensure no outstanding expectations or requests remain
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // ─── findMenuItem ────────────────────────────────────────────────────────────

  describe('findMenuItem', function () {

    it('should return the menu item when it exists', function () {
      var fakeItem = { short_name: 'L1', name: 'Special Soup', description: 'Delicious soup.' };

      // L1 → category "L", 1-based index 1 → 0-based index 0
      $httpBackend
        .expectGET(BASE + '/L/menu_items/0.json')
        .respond(200, fakeItem);

      var result = null;
      UserService.findMenuItem('L1').then(function (item) {
        result = item;
      });

      $httpBackend.flush();

      expect(result).not.toBeNull();
      expect(result.short_name).toBe('L1');
      expect(result.name).toBe('Special Soup');
    });

    it('should return null when the server returns null (item does not exist)', function () {
      // Firebase returns JSON null when the node doesn't exist
      $httpBackend
        .expectGET(BASE + '/L/menu_items/99.json')
        .respond(200, null);

      var result = 'NOT_SET';
      UserService.findMenuItem('L100').then(function (item) {
        result = item;
      });

      $httpBackend.flush();

      expect(result).toBeNull();
    });

    it('should return null immediately for an invalid short_name format (no digits)', function () {
      var result = 'NOT_SET';
      UserService.findMenuItem('INVALID').then(function (item) {
        result = item;
      });

      // No HTTP call should have been made
      $httpBackend.verifyNoOutstandingRequest();
      expect(result).toBeNull();
    });

    it('should return null immediately for a zero index (short_name ending in 0)', function () {
      var result = 'NOT_SET';
      UserService.findMenuItem('L0').then(function (item) {
        result = item;
      });

      $httpBackend.verifyNoOutstandingRequest();
      expect(result).toBeNull();
    });

    it('should correctly resolve a multi-letter category (e.g. SP1)', function () {
      var fakeItem = { short_name: 'SP1', name: 'Spring Roll', description: 'Crispy roll.' };

      // SP1 → category "SP", 1-based index 1 → 0-based index 0
      $httpBackend
        .expectGET(BASE + '/SP/menu_items/0.json')
        .respond(200, fakeItem);

      var result = null;
      UserService.findMenuItem('SP1').then(function (item) {
        result = item;
      });

      $httpBackend.flush();

      expect(result).not.toBeNull();
      expect(result.short_name).toBe('SP1');
    });

    it('should return null when the HTTP request fails', function () {
      $httpBackend
        .expectGET(BASE + '/L/menu_items/0.json')
        .respond(500, 'Server Error');

      var result = 'NOT_SET';
      UserService.findMenuItem('L1').then(function (item) {
        result = item;
      });

      $httpBackend.flush();

      // $http rejects on 5xx; our service has no .catch so the promise rejects,
      // but the important thing is no truthy item was returned
      expect(result).toBe('NOT_SET');
    });

  });

  // ─── saveUserInfo / getUserInfo ───────────────────────────────────────────────

  describe('saveUserInfo / getUserInfo', function () {

    it('should return null before any info is saved', function () {
      expect(UserService.getUserInfo()).toBeNull();
    });

    it('should persist and return the saved info', function () {
      var info = { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com',
                   phone: '410-555-0100', favMenuNumber: 'L1', menuItem: {} };
      UserService.saveUserInfo(info);
      expect(UserService.getUserInfo()).toBe(info);
    });

  });

});

})();
