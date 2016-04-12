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
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.Collection.Client = (function(superClass) {
    extend(Client, superClass);

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
  angular.module('BB.Directives').directive('calendarAdmin', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'calendarAdminCtrl'
    };
  });

  angular.module('BB.Controllers').controller('calendarAdminCtrl', function($scope, $element, $controller, $attrs, $modal, BBModel) {
    $scope.adult_count = 0;
    $scope.show_child_qty = false;
    $scope.show_price = false;
    angular.extend(this, $controller('TimeList', {
      $scope: $scope,
      $attrs: $attrs,
      $element: $element
    }));
    $scope.week_view = false;
    $scope.name_switch = "switch to week view";
    $scope.switchWeekView = function() {
      if ($scope.week_view) {
        $scope.week_view = false;
        return $scope.name_switch = "switch to day view";
      } else {
        $scope.week_view = true;
        return $scope.name_switch = "switch to week view";
      }
    };
    return $scope.bookAnyway = function() {
      $scope.new_timeslot = new BBModel.TimeSlot({
        time: $scope.current_item.defaults.time,
        avail: 1
      });
      return $scope.selectSlot($scope.new_timeslot);
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

  angular.module('BBAdminBooking').controller('adminBookingClients', function($scope, $rootScope, $q, AdminClientService, ClientDetailsService, AlertService, ClientService, ValidatorService, ErrorService, $log, PaginationService) {
    $scope.validator = ValidatorService;
    $scope.clientDef = $q.defer();
    $scope.clientPromise = $scope.clientDef.promise;
    $scope.per_page = 20;
    $scope.total_entries = 0;
    $scope.clients = [];
    $scope.search_clients = false;
    $scope.newClient = false;
    $scope.no_clients = false;
    $scope.search_error = false;
    $scope.search_text = null;
    $scope.pagination = PaginationService.initialise({
      page_size: 10,
      max_size: 5
    });
    $scope.showSearch = (function(_this) {
      return function() {
        $scope.search_clients = true;
        return $scope.newClient = false;
      };
    })(this);
    $scope.showClientForm = (function(_this) {
      return function() {
        $scope.search_error = false;
        $scope.no_clients = false;
        $scope.search_clients = false;
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
      return function() {
        if ($scope.search_text && $scope.search_text.length >= 3) {
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
      $scope.search_triggered = true;
      $scope.no_clients = false;
      $scope.search_error = false;
      clientDef = $q.defer();
      params = {
        company: $scope.bb.company,
        per_page: $scope.per_page,
        filter_by: filterBy != null ? filterBy : $scope.search_text,
        filter_by_fields: filterByFields,
        order_by: orderBy,
        order_by_reverse: orderByReverse
      };
      if (currentPage) {
        params.page = currentPage + 1;
      }
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
          PaginationService.update($scope.pagination, $scope.clients.length);
          return clientDef.resolve(clients.items);
        };
      })(this));
    };
    $scope.searchClients = function(search_text) {
      var clientDef, params;
      clientDef = $q.defer();
      params = {
        filter_by: search_text,
        company: $scope.bb.company
      };
      AdminClientService.query(params).then((function(_this) {
        return function(clients) {
          clientDef.resolve(clients.items);
          return clients.items;
        };
      })(this));
      return clientDef.promise;
    };
    $scope.typeHeadResults = function($item, $model, $label) {
      var item, label, model;
      item = $item;
      model = $model;
      label = $label;
      $scope.client = item;
    };
    $scope.clearSearch = function() {
      $scope.clients = null;
      return $scope.search_triggered = false;
    };
    return $scope.edit = function(item) {
      return $log.info("not implemented");
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
  angular.module('BBAdminBooking').directive('bbBlockTime', function() {
    return {
      scope: true,
      restrict: 'A',
      controller: function($scope, $element, $attrs, AdminPersonService, uiCalendarConfig) {
        $scope.resources = [];
        if ($scope.bb.current_item.company.$has('people')) {
          $scope.bb.current_item.company.getPeoplePromise().then(function(people) {
            var i, len, p;
            for (i = 0, len = people.length; i < len; i++) {
              p = people[i];
              p.title = p.name;
              p.identifier = p.id + '_p';
              p.group = 'Staff';
            }
            return $scope.resources = _.union($scope.resources, people);
          });
        }
        if ($scope.bb.current_item.company.$has('resources')) {
          $scope.bb.current_item.company.getResourcesPromise().then(function(resources) {
            var i, len, r;
            for (i = 0, len = resources.length; i < len; i++) {
              r = resources[i];
              r.title = r.name;
              r.identifier = r.id + '_r';
              r.group = 'Resources ';
            }
            return $scope.resources = _.union($scope.resources, resources);
          });
        }
        if (($scope.bb.current_item.person != null) && ($scope.bb.current_item.person.id != null)) {
          $scope.picked_resource = $scope.bb.current_item.person.id + '_p';
        }
        if (($scope.bb.current_item.resource != null) && ($scope.bb.current_item.resource.id != null)) {
          $scope.picked_resource = $scope.bb.current_item.resource.id + '_r';
        }
        $scope.changeResource = function() {
          var parts;
          if ($scope.picked_resource != null) {
            parts = $scope.picked_resource.split('_');
            return angular.forEach($scope.resources, function(value, key) {
              if (value.identifier === $scope.picked_resource) {
                if (parts[1] === 'p') {
                  $scope.bb.current_item.person = value;
                } else if (parts[1] === 'r') {
                  $scope.bb.current_item.resource = value;
                }
              }
            });
          }
        };
        return $scope.blockTime = function() {
          return AdminPersonService.block($scope.bb.company, $scope.bb.current_item.person, {
            start_time: $scope.config.from_datetime,
            end_time: $scope.config.to_datetime
          }).then(function(response) {
            uiCalendarConfig.calendars.resourceCalendar.fullCalendar('refetchEvents');
            return $scope.cancel();
          });
        };
      }
    };
  });

}).call(this);


/***
* @ngdoc directive
* @name BBAdminBooking.directive:bbDateTimePicker
* @scope
* @restrict A
*
* @description
* DateTime picker that combines date & timepicker and consolidates 
* the Use of Moment.js in the App and Date in the pickers 
*
* @param {object}  date   A moment.js date object
* @param {boolean}  showMeridian   Switch to show/hide meridian (optional, default:false)
* @param {number}  minuteStep Step for the timepicker (optional, default:10)
 */

(function() {
  angular.module('BBAdminBooking').directive('bbDateTimePicker', function(PathSvc) {
    return {
      scope: {
        date: '=',
        showMeridian: '=?',
        minuteStep: '=?'
      },
      restrict: 'A',
      templateUrl: function(element, attrs) {
        return PathSvc.directivePartial("_datetime_picker");
      },
      controller: function($scope, $filter, $timeout, GeneralOptions) {
        if (!$scope.minuteStep || typeof $scope.minuteStep === 'undefined') {
          $scope.minuteStep = GeneralOptions.calendar_minute_step;
        }
        if (!$scope.showMeridian || typeof $scope.showMeridian === 'undefined') {
          $scope.showMeridian = GeneralOptions.twelve_hour_format;
        }
        $scope.$watch('datetimeWithNoTz', function(newValue, oldValue) {
          var assembledDate;
          newValue = new Date(newValue);
          if ((newValue != null) && moment(newValue).isValid()) {
            assembledDate = moment();
            assembledDate.set({
              'year': parseInt(newValue.getFullYear()),
              'month': parseInt(newValue.getMonth()),
              'date': parseInt(newValue.getDate()),
              'hour': parseInt(newValue.getHours()),
              'minute': parseInt(newValue.getMinutes()),
              'second': 0
            });
            $scope.date = assembledDate.format();
          }
        });
        return $scope.datetimeWithNoTz = $filter('clearTimezone')(moment($scope.date).format());
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdminBooking').factory('AdminBookingPopup', function($modal, $timeout) {
    return {
      open: function(config) {
        return $modal.open({
          size: 'lg',
          controller: function($scope, $modalInstance, config, $window) {
            var base;
            $scope.Math = $window.Math;
            if ($scope.bb && $scope.bb.current_item) {
              delete $scope.bb.current_item;
            }
            $scope.config = angular.extend({
              clear_member: true,
              template: 'main'
            }, config);
            if ($scope.company) {
              (base = $scope.config).company_id || (base.company_id = $scope.company.id);
            }
            $scope.config.item_defaults = angular.extend({
              merge_resources: true,
              merge_people: false
            }, config.item_defaults);
            return $scope.cancel = function() {
              return $modalInstance.dismiss('cancel');
            };
          },
          templateUrl: 'admin_booking_popup.html',
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


/*
* @ngdoc service
* @module BBAdminBooking
* @name GeneralOptions
*
* @description
* Returns a set of General configuration options
 */


/*
* @ngdoc service
* @module BBAdminBooking
* @name GeneralOptionsProvider
*
* @description
* Provider 
*
* @example
  <example>
  angular.module('ExampleModule').config ['GeneralOptionsProvider', (GeneralOptionsProvider) ->
    GeneralOptionsProvider.setOption('twelve_hour_format', true)
  ]
  </example>
 */

(function() {
  angular.module('BBAdminBooking').provider('GeneralOptions', [
    function() {
      var options;
      options = {
        twelve_hour_format: false,
        calendar_minute_step: 10
      };
      this.setOption = function(option, value) {
        if (options.hasOwnProperty(option)) {
          options[option] = value;
        }
      };
      this.$get = function() {
        return options;
      };
    }
  ]);

}).call(this);
