(function() {
  'use strict';
  var adminbookingapp;

  adminbookingapp = angular.module('BBAdminBooking', ['BB', 'BBAdmin.Services', 'BBAdminServices', 'trNgGrid']);

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
  'use strict';
  angular.module('BB.Directives').directive('bbAdminCalendar', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'adminCalendarCtrl'
    };
  });

  angular.module('BB.Controllers').controller('adminCalendarCtrl', function($scope, $element, $controller, $attrs, $modal, BBModel, $rootScope) {
    angular.extend(this, $controller('TimeList', {
      $scope: $scope,
      $attrs: $attrs,
      $element: $element
    }));
    $scope.calendar_view = {
      next_available: false,
      day: false,
      multi_day: false
    };
    $rootScope.connection_started.then(function() {
      return $scope.initialise();
    });
    $scope.initialise = function() {
      if ($scope.bb.item_defaults.pick_first_time) {
        $scope.switchView('next_available');
      } else if ($scope.bb.current_item.defaults.time != null) {
        $scope.switchView('day');
      } else {
        $scope.switchView($scope.bb.item_defaults.day_view || 'multi_day');
      }
      if ($scope.bb.current_item.person) {
        $scope.person_name = $scope.bb.current_item.person.name;
      }
      if ($scope.bb.current_item.resource) {
        return $scope.resource_name = $scope.bb.current_item.resource.name;
      }
    };
    $scope.switchView = function(view) {
      var i, key, len, ref, ref1, slot, value;
      if (view === "day") {
        if ($scope.slots && $scope.bb.current_item.time) {
          ref = $scope.slots;
          for (i = 0, len = ref.length; i < len; i++) {
            slot = ref[i];
            if (slot.time === $scope.bb.current_item.time.time) {
              $scope.highlightSlot(slot, $scope.bb.current_item.date);
              break;
            }
          }
        }
      }
      ref1 = $scope.calendar_view;
      for (key in ref1) {
        value = ref1[key];
        $scope.calendar_view[key] = false;
      }
      return $scope.calendar_view[view] = true;
    };
    return $scope.overBook = function() {
      var new_day, new_timeslot;
      new_timeslot = new BBModel.TimeSlot({
        time: $scope.bb.current_item.defaults.time,
        avail: 1
      });
      new_day = new BBModel.Day({
        date: $scope.bb.current_item.defaults.datetime,
        spaces: 1
      });
      $scope.setLastSelectedDate(new_day.date);
      $scope.bb.current_item.setDate(new_day);
      $scope.bb.current_item.setTime(new_timeslot);
      $scope.bb.current_item.setPerson($scope.bb.current_item.defaults.person);
      $scope.bb.current_item.setResource($scope.bb.current_item.defaults.resource);
      if ($scope.bb.current_item.reserve_ready) {
        return $scope.addItemToBasket().then((function(_this) {
          return function() {
            return $scope.decideNextPage();
          };
        })(this));
      } else {
        return $scope.decideNextPage();
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

  angular.module('BBAdminBooking').controller('adminBookingClients', function($scope, $rootScope, $q, AdminClientService, AlertService, ClientService, ValidatorService, ErrorService, $log, BBModel, $timeout) {
    $scope.validator = ValidatorService;
    $scope.clients = new BBModel.Pagination({
      page_size: 10,
      max_size: 5,
      request_page_size: 10
    });
    $scope.sort_by_options = [
      {
        key: 'first_name',
        name: 'First Name'
      }, {
        key: 'last_name',
        name: 'Last Name'
      }, {
        key: 'email',
        name: 'Email'
      }
    ];
    $scope.sort_by = $scope.sort_by_options[0].key;
    $rootScope.connection_started.then(function() {
      return $scope.clearClient();
    });
    $scope.selectClient = (function(_this) {
      return function(client, route) {
        $scope.setClient(client);
        $scope.client.setValid(true);
        return $scope.decideNextPage(route);
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
          if (err.data && err.data.error === "Please Login") {
            $scope.setLoaded($scope);
            return AlertService.raise('EMAIL_ALREADY_REGISTERED_ADMIN');
          } else if (err.data && err.data.error === "Sorry, it appears that this phone number already exists") {
            $scope.setLoaded($scope);
            return AlertService.raise('PHONE_NUMBER_ALREADY_REGISTERED_ADMIN');
          } else {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          }
        });
      };
    })(this);
    $scope.getClients = function(params, options) {
      if (options == null) {
        options = {};
      }
      $scope.search_triggered = true;
      $timeout(function() {
        return $scope.search_triggered = false;
      }, 1000);
      if (!params || (params && !params.filter_by)) {
        return;
      }
      $scope.params = {
        company: params.company || $scope.bb.company,
        per_page: params.per_page || $scope.clients.request_page_size,
        filter_by: params.filter_by,
        search_by_fields: params.search_by_fields || 'phone,mobile',
        order_by: params.order_by || $scope.sort_by,
        order_by_reverse: params.order_by_reverse,
        page: params.page || 1
      };
      $scope.notLoaded($scope);
      return AdminClientService.query($scope.params).then(function(result) {
        $scope.search_complete = true;
        if (options.add) {
          $scope.clients.add(params.page, result.items);
        } else {
          $scope.clients.initialise(result.items, result.total_entries);
        }
        return $scope.setLoaded($scope);
      });
    };
    $scope.searchClients = function(search_text) {
      var defer, params;
      defer = $q.defer();
      params = {
        filter_by: search_text,
        company: $scope.bb.company
      };
      AdminClientService.query(params).then((function(_this) {
        return function(clients) {
          defer.resolve(clients.items);
          return clients.items;
        };
      })(this));
      return defer.promise;
    };
    $scope.typeHeadResults = function($item, $model, $label) {
      var item, label, model;
      item = $item;
      model = $model;
      label = $label;
      $scope.client = item;
      return $scope.selectClient($item);
    };
    $scope.clearSearch = function() {
      $scope.clients.initialise();
      $scope.typehead_result = null;
      return $scope.search_complete = false;
    };
    $scope.edit = function(item) {
      return $log.info("not implemented");
    };
    $scope.pageChanged = function() {
      var items_present, page_to_load, ref;
      ref = $scope.clients.update(), items_present = ref[0], page_to_load = ref[1];
      if (!items_present) {
        $scope.params.page = page_to_load;
        return $scope.getClients($scope.params, {
          add: true
        });
      }
    };
    return $scope.sortChanged = function(sort_by) {
      $scope.params.order_by = sort_by;
      $scope.params.page = 1;
      return $scope.getClients($scope.params);
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
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        return element.bind('click', function() {
          return scope.open();
        });
      },
      controller: function($scope) {
        return $scope.open = function() {
          return AdminBookingPopup.open();
        };
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdminBooking').directive('bbAdminMoveBooking', function(AdminCompanyService, $log, $compile, $q, PathSvc, $templateCache, $http, BBModel, AdminBookingService, $rootScope) {
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
        $compile(element.contents())(scope);
        return scope.decideNextPage("calendar");
      });
    };
    link = function(scope, element, attrs) {
      var config;
      config = scope.$eval(attrs.bbAdminMoveBooking);
      config || (config = {});
      config.no_route = true;
      config.admin = true;
      config.template || (config.template = "main");
      if (!attrs.companyId) {
        if (config.company_id) {
          attrs.companyId = config.company_id;
        } else if (scope.company) {
          attrs.companyId = scope.company.id;
        }
      }
      if (attrs.companyId) {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.initWidget(config);
          return AdminBookingService.getBooking({
            company_id: company.id,
            id: config.booking_id,
            url: scope.bb.api_url
          }).then(function(booking) {
            var client_prom, new_item, proms;
            scope.company = company;
            scope.bb.moving_booking = booking;
            scope.quickEmptybasket();
            proms = [];
            new_item = new BBModel.BasketItem(booking, scope.bb);
            new_item.setSrcBooking(booking, scope.bb);
            new_item.clearDateTime();
            new_item.ready = false;
            if (booking.$has('client')) {
              client_prom = booking.$get('client');
              proms.push(client_prom);
              client_prom.then((function(_this) {
                return function(client) {
                  return scope.setClient(new BBModel.Client(client));
                };
              })(this));
            }
            Array.prototype.push.apply(proms, new_item.promises);
            scope.bb.basket.addItem(new_item);
            scope.setBasketItem(new_item);
            return $q.all(proms).then(function() {
              $rootScope.$broadcast("booking:move");
              scope.setLoaded(scope);
              return renderTemplate(scope, element, config.design_mode, config.template);
            }, function(err) {
              scope.setLoaded(scope);
              return failMsg();
            });
          });
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
  angular.module('BBAdminBooking').factory('AdminMoveBookingPopup', function($modal, $timeout) {
    return {
      open: function(config) {
        return $modal.open({
          size: 'lg',
          controller: function($scope, $modalInstance, config, $window, AdminBookingOptions) {
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
              merge_resources: AdminBookingOptions.merge_resources,
              merge_people: AdminBookingOptions.merge_people
            }, config.item_defaults);
            return $scope.cancel = function() {
              return $modalInstance.dismiss('cancel');
            };
          },
          templateUrl: 'admin_move_booking_popup.html',
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

(function() {
  angular.module('BBAdminBooking').directive('bbBlockTime', function() {
    return {
      scope: true,
      restrict: 'A',
      controller: function($scope, $element, $attrs, AdminPersonService, AdminResourceService, BBModel, BookingCollections, $rootScope, BBAssets) {
        var blockSuccess, isValid;
        $scope.resources = [];
        BBAssets($scope.bb.company).then(function(assets) {
          return $scope.resources = assets;
        });
        if (!moment.isMoment($scope.bb.to_datetime)) {
          $scope.bb.to_datetime = moment($scope.bb.to_datetime);
        }
        if (!moment.isMoment($scope.bb.from_datetime)) {
          $scope.bb.from_datetime = moment($scope.bb.from_datetime);
        }
        if (!moment.isMoment($scope.bb.to_datetime)) {
          $scope.bb.to_datetime = moment($scope.bb.to_datetime);
        }
        if ($scope.bb.min_date && !moment.isMoment($scope.bb.min_date)) {
          $scope.bb.min_date = moment($scope.bb.min_date);
        }
        if ($scope.bb.max_date && !moment.isMoment($scope.bb.max_date)) {
          $scope.bb.max_date = moment($scope.bb.max_date);
        }
        $scope.hideBlockAllDay = Math.abs($scope.bb.from_datetime.diff($scope.bb.to_datetime, 'days')) > 0;
        if (($scope.bb.current_item.person != null) && ($scope.bb.current_item.person.id != null)) {
          $scope.picked_resource = $scope.bb.current_item.person.id + '_p';
        }
        if (($scope.bb.current_item.resource != null) && ($scope.bb.current_item.resource.id != null)) {
          $scope.picked_resource = $scope.bb.current_item.resource.id + '_r';
        }
        $scope.changeResource = function() {
          var parts;
          if ($scope.picked_resource != null) {
            $scope.resourceError = false;
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
        $scope.blockTime = function() {
          if (!isValid()) {
            return false;
          }
          if (typeof $scope.bb.current_item.person === 'object') {
            return AdminPersonService.block($scope.bb.company, $scope.bb.current_item.person, {
              start_time: $scope.bb.from_datetime,
              end_time: $scope.bb.to_datetime,
              booking: true
            }).then(function(response) {
              return blockSuccess(response);
            });
          } else if (typeof $scope.bb.current_item.resource === 'object') {
            return AdminResourceService.block($scope.bb.company, $scope.bb.current_item.resource, {
              start_time: $scope.bb.from_datetime,
              end_time: $scope.bb.to_datetime,
              booking: true
            }).then(function(response) {
              return blockSuccess(response);
            });
          }
        };
        isValid = function() {
          $scope.resourceError = false;
          if (typeof $scope.bb.current_item.person !== 'object' && typeof $scope.bb.current_item.resource !== 'object') {
            $scope.resourceError = true;
          }
          if ((typeof $scope.bb.current_item.person !== 'object' && typeof $scope.bb.current_item.resource !== 'object') || ($scope.bb.from_datetime == null) || !$scope.bb.to_datetime) {
            return false;
          }
          return true;
        };
        blockSuccess = function(response) {
          $rootScope.$broadcast('refetchBookings');
          return $scope.cancel();
        };
        return $scope.changeBlockDay = function(blockDay) {
          if (blockDay) {
            $scope.bb.from_datetime = $scope.bb.min_date.format();
            return $scope.bb.to_datetime = $scope.bb.max_date.format();
          }
        };
      }
    };
  });

}).call(this);


/*
* @ngdoc service
* @module BB.Services
* @name AdminBookingOptions
*
* @description
* Returns a set of Admin Booking configuration options
 */


/*
* @ngdoc service
* @module BB.Services
* @name AdminBookingOptionsProvider
*
* @description
* Provider
*
* @example
  <example>
  angular.module('ExampleModule').config ['AdminBookingOptionsProvider', (AdminBookingOptionsProvider) ->
    GeneralOptionsProvider.setOption('twelve_hour_format', true)
  ]
  </example>
 */

(function() {
  angular.module('BB.Services').provider('AdminBookingOptions', [
    function() {
      var options;
      options = {
        merge_resources: true,
        merge_people: true,
        day_view: 'multi_day'
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

(function() {
  angular.module('BBAdminBooking').factory('AdminBookingPopup', function($modal, $timeout) {
    return {
      open: function(config) {
        return $modal.open({
          size: 'lg',
          controller: function($scope, $modalInstance, config, $window, AdminBookingOptions) {
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
              merge_resources: AdminBookingOptions.merge_resources,
              merge_people: AdminBookingOptions.merge_people
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
* @name BBAdminBooking.service:BBAssets
* @description
* Gets all the resources for the callendar
 */

(function() {
  angular.module('BBAdminBooking').factory('BBAssets', [
    '$q', function($q) {
      return function(company) {
        var assets, delay, promises;
        delay = $q.defer();
        promises = [];
        assets = [];
        if (company.$has('people')) {
          promises.push(company.getPeoplePromise().then(function(people) {
            var i, len, p;
            for (i = 0, len = people.length; i < len; i++) {
              p = people[i];
              p.title = p.name;
              if (p.identifier == null) {
                p.identifier = p.id + '_p';
              }
              p.group = 'Staff';
            }
            return assets = _.union(assets, people);
          }));
        }
        if (company.$has('resources')) {
          promises.push(company.getResourcesPromise().then(function(resources) {
            var i, len, r;
            for (i = 0, len = resources.length; i < len; i++) {
              r = resources[i];
              r.title = r.name;
              if (r.identifier == null) {
                r.identifier = r.id + '_r';
              }
              r.group = 'Resources ';
            }
            return assets = _.union(assets, resources);
          }));
        }
        $q.all(promises).then(function() {
          assets = _.sortBy(assets, 'name');
          return delay.resolve(assets);
        });
        return delay.promise;
      };
    }
  ]);

}).call(this);


/*
* @ngdoc service
* @name BBAdminBooking.service:ProcessAssetsFilter
* @description
* Returns array of assets from a comma delimited string
 */

(function() {
  angular.module('BBAdminBooking').factory('ProcessAssetsFilter', [
    function() {
      return function(string) {
        var assets;
        assets = [];
        if (typeof string === 'undefined' || string === '') {
          return assets;
        }
        return angular.forEach(string.split(','), function(value) {
          return assets.push(parseInt(decodeURIComponent(value)));
        });
      };
      return assets;
    }
  ]);

}).call(this);

(function() {
  angular.module('BB.Filters').filter('in_the_future', function() {
    return function(slots) {
      var now_tod, tim;
      tim = moment();
      now_tod = tim.minutes() + tim.hours() * 60;
      return _.filter(slots, function(x) {
        return x.time > now_tod;
      });
    };
  });

  angular.module('BB.Filters').filter('tod_from_now', function() {
    return function(tod, options) {
      var hour_string, hours, min_string, mins, now_tod, seperator, str, tim, v, val;
      tim = moment();
      now_tod = tim.minutes() + tim.hours() * 60;
      v = tod - now_tod;
      hour_string = options && options.abbr_units ? "hr" : "hour";
      min_string = options && options.abbr_units ? "min" : "minute";
      seperator = options && angular.isString(options.seperator) ? options.seperator : "and";
      val = parseInt(v);
      if (val < 60) {
        return val + " " + min_string + "s";
      }
      hours = parseInt(val / 60);
      mins = val % 60;
      if (mins === 0) {
        if (hours === 1) {
          return "1 " + hour_string;
        } else {
          return hours + " " + hour_string + "s";
        }
      } else {
        str = hours + " " + hour_string;
        if (hours > 1) {
          str += "s";
        }
        if (mins === 0) {
          return str;
        }
        if (seperator.length > 0) {
          str += " " + seperator;
        }
        str += " " + mins + " " + min_string + "s";
      }
      return str;
    };
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
