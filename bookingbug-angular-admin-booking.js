(function() {
  'use strict';
  var adminbookingapp;

  adminbookingapp = angular.module('BBAdminBooking', ['BB', 'BBAdmin.Services', 'trNgGrid']);

  angular.module('BBAdminBooking').config(function($logProvider) {
    return $logProvider.debugEnabled(true);
  });

  angular.module('BBAdminBooking.Directives', []);

  angular.module('BBAdminBooking.Services', ['ngResource', 'ngSanitize', 'ngLocalData']);

  angular.module('BBAdminBooking.Controllers', ['ngLocalData', 'ngSanitize']);

  adminbookingapp.run(function($rootScope, $log, DebugUtilsService, FormDataStoreService, $bbug, $document, $sessionStorage, AppConfig, AdminLoginService) {
    return AdminLoginService.checkLogin().then(function() {
      if ($rootScope.user && $rootScope.user.company_id) {
        $rootScope.bb || ($rootScope.bb = {});
        return $rootScope.bb.company_id = $rootScope.user.company_id;
      }
    });
  });

}).call(this);

(function() {
  var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  window.Collection.Client = (function(_super) {
    __extends(Client, _super);

    function Client() {
      return Client.__super__.constructor.apply(this, arguments);
    }

    Client.prototype.checkItem = function(item) {
      return Client.__super__.checkItem.apply(this, arguments);
    };

    return Client;

  })(window.Collection.Base);

  angular.module('BB.Services').provider("ClientCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdminBooking').directive('bbAdminBookingClients', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'adminBookingClients'
    };
  });

  angular.module('BBAdminBooking').controller('adminBookingClients', function($scope, $rootScope, $q, AdminClientService, ClientDetailsService, AlertService, ClientService, ValidatorService) {
    $scope.validator = ValidatorService;
    $scope.clientDef = $q.defer();
    $scope.clientPromise = $scope.clientDef.promise;
    $scope.per_page = 20;
    $scope.total_entries = 0;
    $scope.clients = [];
    $scope.searchClients = false;
    $scope.newClient = false;
    $scope.no_clients = false;
    $scope.search_error = false;
    $scope.showSearch = (function(_this) {
      return function() {
        $scope.searchClients = true;
        return $scope.newClient = false;
      };
    })(this);
    $scope.showClientForm = (function(_this) {
      return function() {
        $scope.search_error = false;
        $scope.no_clients = false;
        $scope.searchClients = false;
        $scope.newClient = true;
        return $scope.clearClient();
      };
    })(this);
    $scope.selectClient = (function(_this) {
      return function(client, route) {
        $scope.search_error = false;
        $scope.no_clients = false;
        $scope.setClient(client);
        $scope.client.setValid(true);
        return $scope.decideNextPage(route);
      };
    })(this);
    $scope.checkSearch = (function(_this) {
      return function(search) {
        if (search.length >= 3) {
          $scope.search_error = false;
          return true;
        } else {
          $scope.search_error = true;
          return false;
        }
      };
    })(this);
    $scope.createClient = (function(_this) {
      return function(route) {
        $scope.notLoaded($scope);
        if ($scope.bb && $scope.bb.parent_client) {
          $scope.client.parent_client_id = $scope.bb.parent_client.id;
        }
        if ($scope.client_details) {
          $scope.client.setClientDetails($scope.client_details);
        }
        return ClientService.create_or_update($scope.bb.company, $scope.client).then(function(client) {
          $scope.setLoaded($scope);
          return $scope.selectClient(client, route);
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    $scope.getClients = function(currentPage, filterBy, filterByFields, orderBy, orderByReverse) {
      var clientDef, params;
      AlertService.clear();
      $scope.no_clients = false;
      $scope.search_error = false;
      clientDef = $q.defer();
      params = {
        company: $scope.bb.company,
        per_page: $scope.per_page,
        filter_by: filterBy,
        filter_by_fields: filterByFields,
        order_by: orderBy,
        order_by_reverse: orderByReverse
      };
      if (currentPage) {
        params.page = currentPage + 1;
      }
      return $rootScope.connection_started.then(function() {
        $scope.notLoaded($scope);
        if (!$rootScope.bb.api_url && $scope.bb.api_url) {
          $rootScope.bb.api_url = $scope.bb.api_url;
        }
        return AdminClientService.query(params).then((function(_this) {
          return function(clients) {
            $scope.clients = clients.items;
            $scope.setLoaded($scope);
            $scope.setPageLoaded();
            $scope.total_entries = clients.total_entries;
            return clientDef.resolve(clients.items);
          };
        })(this), function(err) {
          $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          return clientDef.reject(err);
        });
      });
    };
    return $scope.edit = function(item) {
      return console.log(item);
    };
  });

}).call(this);

(function() {
  angular.module('BBAdminBooking').directive('bbAdminBooking', function(AdminCompanyService, $log, $compile, $q, PathSvc, $templateCache, $http) {
    var getTemplate, link, renderTemplate;
    getTemplate = function(template) {
      var fromTemplateCache, partial, src;
      partial = template ? template : 'main';
      fromTemplateCache = $templateCache.get(partial);
      if (fromTemplateCache) {
        return fromTemplateCache;
      } else {
        src = PathSvc.directivePartial(partial).$$unwrapTrustedValue();
        return $http.get(src, {
          cache: $templateCache
        }).then(function(response) {
          return response.data;
        });
      }
    };
    renderTemplate = function(scope, element, design_mode, template) {
      return $q.when(getTemplate(template)).then(function(template) {
        element.html(template).show();
        if (design_mode) {
          element.append('<style widget_css scoped></style>');
        }
        return $compile(element.contents())(scope);
      });
    };
    link = function(scope, element, attrs) {
      var config;
      config = scope.$eval(attrs.bbAdminBooking);
      config || (config = {});
      config.admin = true;
      if (!attrs.companyId) {
        if (config.company_id) {
          attrs.companyId = config.company_id;
        } else if (scope.company) {
          attrs.companyId = scope.company.id;
        }
      }
      if (attrs.companyId) {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          scope.initWidget(config);
          return renderTemplate(scope, element, config.design_mode, config.template);
        });
      }
    };
    return {
      link: link,
      controller: 'BBCtrl'
    };
  });

}).call(this);

(function() {
  angular.module('BBAdminBooking').directive('bbAdminBookingPopup', function(AdminBookingPopup) {
    var controller, link;
    controller = function($scope) {
      return $scope.open = function() {
        return AdminBookingPopup.open();
      };
    };
    link = function(scope, element, attrs) {
      return element.bind('click', function() {
        return scope.open();
      });
    };
    return {
      link: link,
      controller: controller
    };
  });

}).call(this);

(function() {
  angular.module('BBAdminBooking').factory('AdminBookingPopup', function($modal, $timeout) {
    return {
      open: function(config) {
        return $modal.open({
          controller: function($scope, $modalInstance, config) {
            $scope.config = angular.extend({
              company_id: $scope.company.id,
              item_defaults: {
                merge_resources: true,
                merge_people: true
              },
              clear_member: true,
              template: 'main'
            }, config);
            return $scope.cancel = function() {
              return $modalInstance.dismiss('cancel');
            };
          },
          templateUrl: 'admin_booking_popup.html',
          scope: $scope,
          resolve: {
            config: function() {
              return config;
            }
          }
        });
      }
    };
  });

}).call(this);
