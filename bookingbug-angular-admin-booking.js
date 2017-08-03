'use strict';

angular.module('BBAdminBooking', ['BB', 'BBAdmin.Services', 'BBAdminServices', 'trNgGrid']);

angular.module('BBAdminBooking.Directives', []);

angular.module('BBAdminBooking.Services', ['ngResource', 'ngSanitize']);

angular.module('BBAdminBooking.Controllers', ['ngLocalData', 'ngSanitize']);
'use strict';

angular.module('BBAdminBooking').config(function ($logProvider) {
    'ngInject';

    $logProvider.debugEnabled(true);
});
'use strict';

angular.module('BBAdminBooking').run(function ($rootScope, $log, DebugUtilsService, $bbug, $document, $sessionStorage, FormDataStoreService, AppConfig, BBModel) {
    'ngInject';

    BBModel.Admin.Login.$checkLogin().then(function () {
        if ($rootScope.user && $rootScope.user.company_id) {
            if (!$rootScope.bb) {
                $rootScope.bb = {};
            }
            return $rootScope.bb.company_id = $rootScope.user.company_id;
        }
    });
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.Collection.Client = function (_window$Collection$Ba) {
    _inherits(Client, _window$Collection$Ba);

    function Client() {
        _classCallCheck(this, Client);

        return _possibleConstructorReturn(this, _window$Collection$Ba.apply(this, arguments));
    }

    Client.prototype.checkItem = function checkItem(item) {
        var _window$Collection$Ba2;

        return (_window$Collection$Ba2 = _window$Collection$Ba.prototype.checkItem).call.apply(_window$Collection$Ba2, [this].concat(Array.prototype.slice.call(arguments)));
    };

    return Client;
}(window.Collection.Base);

angular.module('BB.Services').provider("ClientCollections", function () {
    return {
        $get: function $get() {
            return new window.BaseCollections();
        }
    };
});
'use strict';

angular.module('BBAdminBooking').component('bbAdminResourcesDropdown', {
    bindings: {
        formCtrl: '<'
    },
    controller: 'BBAdminResourcesDropdownCtrl',
    controllerAs: '$bbAdminResourcesDropdownCtrl',
    require: {
        $bbCtrl: '^^bbAdminBooking'
    },
    templateUrl: 'admin-booking/admin_resources_dropdown.html'
});

var BBAdminResourcesDropdownCtrl = function BBAdminResourcesDropdownCtrl(BBAssets, $rootScope, $scope) {
    'ngInject';

    var _this = this;

    var resource = void 0;
    this.pickedResource = null;
    this.resources = [];
    this._resourceChangedUnSubscribe = null;

    this.$onInit = function () {
        _this.changeResource = changeResource;

        BBAssets.getAssets(_this.$bbCtrl.$scope.bb.company).then(setLoadedResources);
        _this._resourceChangedUnSubscribe = $scope.$on('bbAdminResourcesDropdown:resourceChanged', resourceChangedListener);
    };

    this.$onDestroy = function () {
        _this._resourceChangedUnSubscribe();
    };

    var resourceChangedListener = function resourceChangedListener(event) {
        if (_this.pickedResource == null) {
            delete _this.$bbCtrl.$scope.bb.current_item.resource;
            delete _this.$bbCtrl.$scope.bb.current_item.person;
            return;
        }

        var type = _this.pickedResource.split('_')[1];
        for (var resourceKey = 0; resourceKey < _this.resources.length; resourceKey++) {
            resource = _this.resources[resourceKey];
            if (resource.identifier === _this.pickedResource) {
                if (type === 'p') {
                    _this.$bbCtrl.$scope.bb.current_item.person = resource;
                    _this.pickedResource = resource;
                    delete _this.$bbCtrl.$scope.bb.current_item.resource;
                } else if (type === 'r') {
                    _this.$bbCtrl.$scope.bb.current_item.resource = resource;
                    _this.pickedResource = resource;
                    delete _this.$bbCtrl.$scope.bb.current_item.person;
                }
                break;
            }
        }
    };

    /**
     * @param {Array} resources
     */
    var setLoadedResources = function setLoadedResources(resources) {
        _this.resources = resources;
        setCurrentResource();
    };

    var setCurrentResource = function setCurrentResource() {
        if (_this.$bbCtrl.$scope.bb.current_item.person != null && _this.$bbCtrl.$scope.bb.current_item.person.id != null) {
            _this.pickedResource = _this.$bbCtrl.$scope.bb.current_item.person;
            _this.pickedResource.identifier = _this.$bbCtrl.$scope.bb.current_item.person.id + '_p';
        } else if (_this.$bbCtrl.$scope.bb.current_item.resource != null && _this.$bbCtrl.$scope.bb.current_item.resource.id != null) {
            _this.pickedResource = _this.$bbCtrl.$scope.bb.current_item.resource;
            _this.pickedResource.identifier = _this.$bbCtrl.$scope.bb.current_item.resource.id + '_r';
        }
    };

    var changeResource = function changeResource() {
        $rootScope.$broadcast('bbAdminResourcesDropdown:resourceChanged');
    };
};

angular.module('BBAdminBooking').controller('BBAdminResourcesDropdownCtrl', BBAdminResourcesDropdownCtrl);
'use strict';

angular.module('BB.Directives').directive('bbAdminCalendar', function () {

    return {
        restrict: 'AE',
        replace: true,
        scope: true,
        controller: 'BBAdminCalendarCtrl'
    };
});

var BBAdminCalendarCtrl = function BBAdminCalendarCtrl($scope, $element, $controller, $attrs, BBModel, $rootScope) {

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

    $rootScope.connection_started.then(function () {
        return $scope.initialise();
    });

    $scope.initialise = function () {
        // set default view
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

    $scope.$on('slotChanged', function (event, date) {
        $scope.$emit('slotChanged:updateModalTitle', date);
    });

    $scope.switchView = function (view) {

        if (view === "day") {
            if ($scope.slots && $scope.bb.current_item.time) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Array.from($scope.slots)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var slot = _step.value;

                        if (slot.time === $scope.bb.current_item.time.time) {
                            $scope.highlightSlot(slot, $scope.bb.current_item.date);
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }

        // reset views
        for (var key in $scope.calendar_view) {
            $scope.calendar_view[key] = false;
        }

        // set new view
        return $scope.calendar_view[view] = true;
    };

    $scope.pickTime = function (slot) {
        $scope.bb.current_item.setDate({
            date: slot.datetime
        });
        $scope.bb.current_item.setTime(slot);

        $scope.setLastSelectedDate(slot.datetime);
        if ($scope.bb.current_item.reserve_ready) {
            return $scope.addItemToBasket().then(function () {
                return $scope.decideNextPage();
            });
        } else {
            return $scope.decideNextPage();
        }
    };

    $scope.pickOtherTime = function () {
        return $scope.availability_conflict = false;
    };

    $scope.setCloseBookings = function (bookings) {
        return $scope.other_bookings = bookings;
    };

    return $scope.overBook = function () {

        var new_timeslot = new BBModel.TimeSlot({
            time: $scope.bb.current_item.defaults.time,
            avail: 1
        });
        var new_day = new BBModel.Day({
            date: $scope.bb.current_item.defaults.datetime,
            spaces: 1
        });

        $scope.setLastSelectedDate(new_day.date);
        $scope.bb.current_item.setDate(new_day);

        $scope.bb.current_item.setTime(new_timeslot);

        $scope.bb.current_item.setPerson($scope.bb.current_item.defaults.person);
        $scope.bb.current_item.setResource($scope.bb.current_item.defaults.resource);

        if ($scope.bb.current_item.reserve_ready) {
            return $scope.addItemToBasket().then(function () {
                return $scope.decideNextPage();
            });
        } else {
            return $scope.decideNextPage();
        }
    };
};

angular.module('BB.Controllers').controller('BBAdminCalendarCtrl', BBAdminCalendarCtrl);

angular.module('BB.Directives').directive('bbAdminCalendarConflict', function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: true,
        controller: BBAdminCalendarConflictCtrl
    };
});

var BBAdminCalendarConflictCtrl = function BBAdminCalendarConflictCtrl($scope, $element, $controller, $attrs, BBModel, bbAnalyticsPiwik, $window) {
    'ngInject';

    if (bbAnalyticsPiwik.isEnabled()) setPiwik();

    function setPiwik() {
        var category = "Availability Conflict";
        var title = "Pop Up";
        bbAnalyticsPiwik.push(['trackEvent', [category], title]);
    }

    var time = $scope.bb.current_item.defaults.time;
    var duration = $scope.bb.current_item.duration;


    var start_datetime = $scope.bb.current_item.defaults.datetime;

    // caclulate the max and min time we need to book around based on the service pre and post time
    var service = $scope.bb.current_item.service;

    var min_time = start_datetime.clone().add(-(service.pre_time || 0), 'minutes');
    var max_time = start_datetime.clone().add(duration + (service.post_time || 0), 'minutes');

    var st = time - 30;
    var en = time + duration + 30;

    var ibest_earlier = 0;
    var ibest_later = 0;

    $scope.allow_overbook = $scope.bb.company.settings.has_overbook;

    if ($scope.slots) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = Array.from($scope.slots)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var slot = _step2.value;

                if (time > slot.time) {
                    ibest_earlier = slot.time;
                    $scope.best_earlier = slot;
                }
                if (ibest_later === 0 && slot.time > time) {
                    ibest_later = slot.time;
                    $scope.best_later = slot;
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    }

    // I actaully think this time is available - just it's not on a schedule step that matches
    if (ibest_earlier > 0 && ibest_later > 0 && ibest_earlier > time - duration && ibest_later < time + duration) {
        $scope.step_mismatch = true;
    }

    $scope.checking_conflicts = true;

    /**
     * @returns {Number}
     */
    var getCurrentPersonId = function getCurrentPersonId() {
        if ($scope.bb.current_item.person != null) {
            return $scope.bb.current_item.person.id;
        }
        if ($scope.bb.current_item.defaults.person != null) {
            return $scope.bb.current_item.defaults.person.id;
        }
    };

    var params = {
        src: $scope.bb.company,
        person_id: getCurrentPersonId(),
        resource_id: $scope.bb.current_item.defaults.resource ? $scope.bb.current_item.defaults.resource_id : undefined,
        start_date: $scope.bb.current_item.defaults.datetime.format('YYYY-MM-DD'),
        start_time: sprintf("%02d:%02d", st / 60, st % 60),
        end_time: sprintf("%02d:%02d", en / 60, en % 60)
    };

    BBModel.Admin.Booking.$query(params).then(function (bookings) {
        if (bookings.items.length > 0) {
            $scope.nearby_bookings = _.filter(bookings.items, function (x) {
                return $scope.bb.current_item.defaults.person && x.person_id === $scope.bb.current_item.defaults.person.id || $scope.bb.current_item.defaults.resources && x.resources_id === $scope.bb.current_item.defaults.resources.id;
            });
            $scope.overlapping_bookings = _.filter($scope.nearby_bookings, function (x) {
                var b_st = moment(x.datetime).subtract(-(x.pre_time || 0), "minutes");
                var b_en = moment(x.end_datetime).subtract(x.post_time || 0, "minutes");
                return b_st.isBefore(max_time) && b_en.isAfter(min_time);
            });
            if ($scope.nearby_bookings.length === 0) {
                $scope.nearby_bookings = false;
            }
            if ($scope.overlapping_bookings.length === 0) {
                $scope.overlapping_bookings = false;
            }
        }

        if (!$scope.overlapping_bookings && $scope.bb.company.$has('external_bookings')) {
            // no overlappying bookings - try external bookings
            params = {
                start: $scope.bb.current_item.defaults.datetime.format('YYYY-MM-DD'),
                end: $scope.bb.current_item.defaults.datetime.clone().add(1, 'day').format('YYYY-MM-DD'),
                person_id: $scope.bb.current_item.defaults.person ? $scope.bb.current_item.defaults.person.id : undefined,
                resource_id: $scope.bb.current_item.defaults.resource ? $scope.bb.current_item.defaults.resource_id : undefined
            };
            $scope.bb.company.$get('external_bookings', params).then(function (collection) {
                bookings = collection.external_bookings;
                if (bookings && bookings.length > 0) {
                    return $scope.external_bookings = _.filter(bookings, function (x) {
                        x.start_time = moment(x.start);
                        x.end_time = moment(x.end);
                        if (!x.title) {
                            x.title = "Blocked";
                        }
                        return x.start_time.isBefore(max_time) && x.end_time.isAfter(min_time);
                    });
                }
            });
        }

        return $scope.checking_conflicts = false;
    }, function (err) {
        return $scope.checking_conflicts = false;
    });
};
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

(function () {

    angular.module('BBAdminBooking').directive('bbAdminBookingClients', function () {
        return {
            restrict: 'AE',
            replace: false,
            scope: true,
            controller: AdminBookingClientsCtrl,
            templateUrl: 'admin_booking_clients.html'
        };
    });

    function AdminBookingClientsCtrl($rootScope, $scope, $q, $log, $translate, $timeout, AlertService, ValidatorService, BBModel, LoadingService, AdminBookingOptions) {
        'ngInject';

        $scope.emailPattern = ValidatorService.getEmailPattern();

        $scope.admin_options = AdminBookingOptions;
        $scope.clients = new BBModel.Pagination({ page_size: 10, max_size: 5, request_page_size: 10 });
        var loader = LoadingService.$loader($scope);

        $scope.sort_by_options = [{ key: 'first_name', name: $translate.instant('ADMIN_BOOKING.CUSTOMER.SORT_BY_FIRST_NAME') }, { key: 'last_name', name: $translate.instant('ADMIN_BOOKING.CUSTOMER.SORT_BY_LAST_NAME') }, { key: 'email', name: $translate.instant('ADMIN_BOOKING.CUSTOMER.SORT_BY_EMAIL') }];

        $scope.sort_by = $scope.sort_by_options[0].key;

        $rootScope.connection_started.then(function () {
            return $scope.clearClient();
        });

        //only select client using space or return keys
        $scope.typeAheadSelectIf = function ($event) {
            var result = false;
            if ($event.keyCode === 13 || $event.keyCode === 32) {
                result = true;
            }
            return result;
        };

        $scope.selectClient = function (client, route) {
            $scope.setClient(client);
            $scope.client.setValid(true);
            return $scope.decideNextPage(route);
        };

        $scope.createClient = function (route) {

            loader.notLoaded();

            // we need to validate the client information has been correctly entered here
            if ($scope.bb && $scope.bb.parent_client) {
                $scope.client.parent_client_id = $scope.bb.parent_client.id;
            }

            if ($scope.client_details) {
                $scope.client.setClientDetails($scope.client_details);
            }

            return BBModel.Client.$create_or_update($scope.bb.company, $scope.client).then(function (client) {
                loader.setLoaded();
                return $scope.selectClient(client, route);
            }, function (err) {

                if (err.data && err.data.error === "Please Login") {
                    loader.setLoaded();
                    return AlertService.raise('EMAIL_IN_USE');
                } else if (err.data && err.data.error === "Sorry, it appears that this phone number already exists") {
                    loader.setLoaded();
                    return AlertService.raise('PHONE_NUMBER_IN_USE');
                } else {
                    return loader.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
                }
            });
        };

        $scope.getClients = function (params, options) {

            if (options == null) {
                options = {};
            }
            $scope.search_triggered = true;

            $timeout(function () {
                return $scope.search_triggered = false;
            }, 1000);

            if (!params || params && !params.filter_by) {
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
            if (AdminBookingOptions.use_default_company_id) {
                $scope.params.default_company_id = $scope.bb.company.id;
            }

            $scope.notLoaded($scope);

            return BBModel.Admin.Client.$query($scope.params).then(function (result) {

                $scope.search_complete = true;

                if (options.add) {
                    $scope.clients.add(params.page, result.items);
                } else {
                    $scope.clients.initialise(result.items, result.total_entries);
                }

                return loader.setLoaded();
            });
        };

        $scope.searchClients = function (search_text) {
            var defer = $q.defer();
            var params = {
                filter_by: search_text,
                company: $scope.bb.company
            };
            if (AdminBookingOptions.use_default_company_id) {
                params.default_company_id = $scope.bb.company.id;
            }
            BBModel.Admin.Client.$query(params).then(function (clients) {
                return defer.resolve(clients.items);
            });
            return defer.promise;
        };

        $scope.typeHeadResults = function ($item, $model, $label) {

            var item = $item;
            $scope.client = item;

            return $scope.selectClient($item);
        };

        $scope.clearSearch = function () {
            $scope.clients.initialise();
            $scope.typeahead_result = null;
            return $scope.search_complete = false;
        };

        $scope.edit = function (item) {
            return $log.info("not implemented");
        };

        $scope.pageChanged = function () {
            var _Array$from = Array.from($scope.clients.update()),
                _Array$from2 = _slicedToArray(_Array$from, 2),
                items_present = _Array$from2[0],
                page_to_load = _Array$from2[1];

            if (!items_present) {
                $scope.params.page = page_to_load;
                return $scope.getClients($scope.params, { add: true });
            }
        };

        $scope.sortChanged = function (sort_by) {
            $scope.params.order_by = sort_by;
            $scope.params.page = 1;
            return $scope.getClients($scope.params);
        };
    }
})();
'use strict';

angular.module('BBAdminBooking').directive('bbAdminBooking', function (BBModel, $log, $compile, $q, PathSvc, $templateCache, $http) {

    var getTemplate = function getTemplate(template) {
        var partial = template ? template : 'main';
        return $templateCache.get(partial + '.html');
    };

    var renderTemplate = function renderTemplate(scope, element, design_mode, template) {
        return $q.when(getTemplate(template)).then(function (template) {
            element.html(template).show();
            if (design_mode) {
                element.append('<style widget_css scoped></style>');
            }
            return $compile(element.contents())(scope);
        });
    };

    var link = function link(scope, element, attrs) {
        var config = scope.$eval(attrs.bbAdminBooking);
        if (!config) {
            config = {};
        }
        config.admin = true;
        if (!attrs.companyId) {
            if (config.company_id) {
                attrs.companyId = config.company_id;
            } else if (scope.company) {
                attrs.companyId = scope.company.id;
            }
        }
        if (attrs.companyId) {
            return BBModel.Admin.Company.$query(attrs).then(function (company) {
                scope.company = company;
                scope.initWidget(config);
                return renderTemplate(scope, element, config.design_mode, config.template);
            });
        }
    };

    return {
        link: link,
        controller: 'BBCtrl',
        controllerAs: '$bbCtrl',
        scope: true
    };
});
'use strict';

angular.module('BBAdminBooking').directive('bbAdminBookingPopup', function (AdminBookingPopup) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {

            return element.bind('click', function () {
                return scope.open();
            });
        },
        controller: function controller($scope) {

            return $scope.open = function () {
                return AdminBookingPopup.open();
            };
        }
    };
});
'use strict';

angular.module('BBAdminBooking').directive('bbAdminMemberBookingsTable', function ($uibModal, $log, $rootScope, $compile, $templateCache, ModalForm, BBModel, Dialog, AdminMoveBookingPopup) {

    var controller = function controller($document, $scope, $uibModal) {

        $scope.loading = true;

        if (!$scope.fields) {
            $scope.fields = ['date_order', 'details'];
        }

        $scope.$watch('member', function (member) {
            if (member != null) {
                return getBookings($scope, member);
            }
        });

        $scope.edit = function (id) {
            var booking = _.find($scope.booking_models, function (b) {
                return b.id === id;
            });
            return booking.$getAnswers().then(function (answers) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Array.from(answers.answers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var answer = _step.value;

                        booking['question' + answer.question_id] = answer.value;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return ModalForm.edit({
                    model: booking,
                    title: 'Booking Details',
                    templateUrl: 'edit_booking_modal_form.html',
                    success: function success(response) {
                        if (typeof response === 'string') {
                            if (response === "move") {
                                var item_defaults = { person: booking.person_id, resource: booking.resource_id };
                                return AdminMoveBookingPopup.open({
                                    item_defaults: item_defaults,
                                    company_id: booking.company_id,
                                    booking_id: booking.id,
                                    success: function success(model) {
                                        return updateBooking(booking);
                                    },
                                    fail: function fail(model) {
                                        return updateBooking(booking);
                                    }
                                });
                            }
                        } else {
                            return updateBooking(booking);
                        }
                    }
                });
            });
        };

        var updateBooking = function updateBooking(b) {
            return b.$refetch().then(function (b) {
                b = new BBModel.Admin.Booking(b);
                var i = _.indexOf($scope.booking_models, function (b) {
                    return b.id === id;
                });
                $scope.booking_models[i] = b;
                return $scope.setRows();
            });
        };

        $scope.cancel = function (id) {
            var _booking = _.find($scope.booking_models, function (b) {
                return b.id === id;
            });

            var modalInstance = $uibModal.open({
                templateUrl: 'member_bookings_table_cancel_booking.html',
                controller: function controller($scope, $uibModalInstance, booking) {
                    $scope.booking = booking;
                    $scope.booking.notify = true;
                    $scope.ok = function () {
                        return $uibModalInstance.close($scope.booking);
                    };
                    return $scope.close = function () {
                        return $uibModalInstance.dismiss();
                    };
                },

                scope: $scope,
                resolve: {
                    booking: function booking() {
                        return _booking;
                    }
                }
            });

            return modalInstance.result.then(function (booking) {
                $scope.loading = true;
                var params = { notify: booking.notify };
                return booking.$post('cancel', params).then(function () {
                    var i = _.findIndex($scope.booking_models, function (b) {
                        console.log(b);
                        return b.id === booking.id;
                    });
                    $scope.booking_models.splice(i, 1);
                    $scope.setRows();
                    return $scope.loading = false;
                });
            });
        };

        $scope.setRows = function () {
            return $scope.bookings = _.map($scope.booking_models, function (booking) {
                return {
                    id: booking.id,
                    date: moment(booking.datetime).format('YYYY-MM-DD'),
                    date_order: moment(booking.datetime).format('x'),
                    datetime: moment(booking.datetime),
                    details: booking.full_describe
                };
            });
        };

        var getBookings = function getBookings($scope, member) {
            var params = {
                start_date: $scope.startDate.format('YYYY-MM-DD'),
                start_time: $scope.startTime ? $scope.startTime.format('HH:mm') : undefined,
                end_date: $scope.endDate ? $scope.endDate.format('YYYY-MM-DD') : undefined,
                end_time: $scope.endTime ? $scope.endTime.format('HH:mm') : undefined,
                company: $rootScope.bb.company,
                url: $rootScope.bb.api_url,
                client_id: member.id,
                skip_cache: true
            };

            return BBModel.Admin.Booking.$query(params).then(function (bookings) {
                var now = moment().unix();
                if ($scope.period && $scope.period === "past") {
                    $scope.booking_models = _.filter(bookings.items, function (x) {
                        return x.datetime.unix() < now;
                    });
                } else if ($scope.period && $scope.period === "future") {
                    $scope.booking_models = _.filter(bookings.items, function (x) {
                        return x.datetime.unix() > now;
                    });
                } else {
                    $scope.booking_models = bookings.items;
                }
                $scope.setRows();
                return $scope.loading = false;
            }, function (err) {
                $log.error(err.data);
                return $scope.loading = false;
            });
        };

        if (!$scope.startDate) {
            $scope.startDate = moment();
        }

        $scope.orderBy = $scope.defaultOrder;
        if ($scope.orderBy == null) {
            $scope.orderBy = 'date_order';
        }

        $scope.now = moment();

        if ($scope.member) {
            return getBookings($scope, $scope.member);
        }
    };

    return {
        controller: controller,
        templateUrl: 'admin_member_bookings_table.html',
        scope: {
            apiUrl: '@',
            fields: '=?',
            member: '=',
            startDate: '=?',
            startTime: '=?',
            endDate: '=?',
            endTime: '=?',
            defaultOrder: '=?',
            period: '@'
        }
    };
});
'use strict';

angular.module('BBAdminBooking').directive('bbAdminMoveBooking', function ($log, $compile, $q, PathSvc, $templateCache, $http, BBModel, $rootScope) {

    var getTemplate = function getTemplate(template) {
        var partial = template ? template : 'main';
        return $templateCache.get(partial + '.html');
    };

    var renderTemplate = function renderTemplate(scope, element, design_mode, template) {
        return $q.when(getTemplate(template)).then(function (template) {
            element.html(template).show();
            if (design_mode) {
                element.append('<style widget_css scoped></style>');
            }
            $compile(element.contents())(scope);
            return scope.decideNextPage("calendar");
        });
    };

    var link = function link(scope, element, attrs) {

        var config = scope.$eval(attrs.bbAdminMoveBooking);
        if (!config) {
            config = {};
        }
        config.no_route = true;
        config.admin = true;
        if (!config.template) {
            config.template = "main";
        }
        if (!attrs.companyId) {
            if (config.company_id) {
                attrs.companyId = config.company_id;
            } else if (scope.company) {
                attrs.companyId = scope.company.id;
            }
        }
        if (attrs.companyId) {
            return BBModel.Admin.Company.$query(attrs).then(function (company) {
                scope.initWidget(config);
                return company.getBooking(config.booking_id).then(function (booking) {
                    scope.company = company;
                    scope.bb.moving_booking = booking;
                    scope.quickEmptybasket();
                    var proms = [];
                    var new_item = new BBModel.BasketItem(booking, scope.bb);
                    new_item.setSrcBooking(booking, scope.bb);
                    new_item.clearDateTime();
                    new_item.ready = false;

                    if (booking.$has('client')) {
                        var client_prom = booking.$get('client');
                        proms.push(client_prom);
                        client_prom.then(function (client) {
                            return scope.setClient(new BBModel.Client(client));
                        });
                    }

                    Array.prototype.push.apply(proms, new_item.promises);
                    scope.bb.basket.addItem(new_item);
                    scope.setBasketItem(new_item);

                    return $q.all(proms).then(function () {
                        $rootScope.$broadcast("booking:move");
                        scope.setLoaded(scope);
                        return renderTemplate(scope, element, config.design_mode, config.template);
                    }, function (err) {
                        scope.setLoaded(scope);
                        return failMsg();
                    });
                });
            });
        }
    };

    return {
        link: link,
        controller: 'BBCtrl',
        controllerAs: '$bbCtrl'
    };
});
'use strict';

angular.module('BBAdminBooking').factory('AdminMoveBookingPopup', function ($uibModal, $timeout, $document) {

    return {
        open: function open(_config) {
            var modal = $uibModal.open({
                size: 'lg',
                controller: function controller($scope, $uibModalInstance, config, $window, AdminBookingOptions) {
                    $scope.Math = $window.Math;
                    if ($scope.bb && $scope.bb.current_item) {
                        delete $scope.bb.current_item;
                    }
                    $scope.config = angular.extend({
                        clear_member: true,
                        template: 'main'
                    }, config);
                    if ($scope.company) {
                        if (!$scope.config.company_id) {
                            $scope.config.company_id = $scope.company.id;
                        }
                    }
                    $scope.config.item_defaults = angular.extend({
                        merge_resources: AdminBookingOptions.merge_resources,
                        merge_people: AdminBookingOptions.merge_people
                    }, config.item_defaults);
                    $scope.cancel = function () {
                        return $uibModalInstance.dismiss('cancel');
                    };
                },

                templateUrl: 'admin_move_booking_popup.html',
                resolve: {
                    config: function config() {
                        return _config;
                    }
                }
            });
            return modal.result.then(function (result) {
                // success
                if (_config.success) {
                    _config.success();
                }
                return result;
            }, function (err) {
                if (_config.fail) {
                    _config.fail();
                }
                return err;
            });
        }
    };
});
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var BBBlockTimeCtrl = function BBBlockTimeCtrl($scope, $element, $attrs, BBModel, BookingCollections, $rootScope, BBAssets) {
    'ngInject';

    // All options (resources, people) go to the same select

    $scope.resources = [];
    $scope.resourceError = false;

    BBAssets.getAssets($scope.bb.company).then(function (assets) {
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

    $scope.all_day = false;

    $scope.hideBlockAllDay = Math.abs($scope.bb.from_datetime.diff($scope.bb.to_datetime, 'days')) > 0;

    if ($scope.bb.company_settings && $scope.bb.company_settings.$has('block_questions')) {
        $scope.bb.company_settings.$get("block_questions", {}).then(function (details) {
            return $scope.block_questions = new BBModel.ItemDetails(details);
        });
    }

    $scope.blockTime = function (form) {
        if (form == null) {
            console.error('blockTime requires form as first argument');
            return false;
        }

        form.$setSubmitted();

        if (form.$invalid || !isValid()) {
            return false;
        }

        $scope.loading = true;

        var params = {
            start_time: $scope.bb.from_datetime,
            end_time: $scope.bb.to_datetime,
            booking: true,
            allday: $scope.all_day
        };

        if ($scope.block_questions) {
            params.questions = $scope.block_questions.getPostData();
        }

        if (_typeof($scope.bb.current_item.person) === 'object') {
            // Block call
            return BBModel.Admin.Person.$block($scope.bb.company, $scope.bb.current_item.person, params).then(function (response) {
                return blockSuccess(response);
            });
        } else if (_typeof($scope.bb.current_item.resource) === 'object') {
            // Block call
            return BBModel.Admin.Resource.$block($scope.bb.company, $scope.bb.current_item.resource, params).then(function (response) {
                return blockSuccess(response);
            });
        }
    };

    var isValid = function isValid() {
        $scope.resourceError = false;
        if (_typeof($scope.bb.current_item.person) !== 'object' && _typeof($scope.bb.current_item.resource) !== 'object') {
            $scope.resourceError = true;
        }

        if (_typeof($scope.bb.current_item.person) !== 'object' && _typeof($scope.bb.current_item.resource) !== 'object' || $scope.bb.from_datetime == null || !$scope.bb.to_datetime) {
            return false;
        }

        return true;
    };

    var blockSuccess = function blockSuccess(response) {
        $rootScope.$broadcast('refetchBookings');
        $scope.loading = false;
        // Close modal window
        return $scope.cancel();
    };

    $scope.changeBlockDay = function (blockDay) {
        return $scope.all_day = blockDay;
    };
    //   if blockDay
    //     $scope.bb.from_datetime = $scope.bb.min_date.format()
    //     $scope.bb.to_datetime = $scope.bb.max_date.format()
};

angular.module('BBAdminBooking').directive('bbBlockTime', function () {
    return {
        scope: true,
        restrict: 'A',
        controller: BBBlockTimeCtrl
    };
});
'use strict';

angular.module('BB.Directives').directive('selectFirstSlot', function () {
    return {
        link: function link(scope, el, attrs) {
            return scope.$on('slotsUpdated', function (e, basket_item, slots) {
                // -------------------------------------
                // Only show TimeSlots in the future!
                // -------------------------------------
                slots = _.filter(slots, function (slot) {
                    return slot.datetime.isAfter(moment());
                });
                // --------------------------------------
                // Select the first available TimeSlot
                // --------------------------------------
                if (slots[0]) {
                    scope.bb.selected_slot = slots[0];
                    scope.bb.selected_date = scope.selected_date;
                    var hours = slots[0].datetime.hours();
                    var minutes = slots[0].datetime.minutes();
                    scope.bb.selected_date.hour(hours).minutes(minutes).seconds(0);
                    scope.highlightSlot(slots[0], scope.selected_day);
                }
                return function () {
                    var result = [];
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = Array.from(slots)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var slot = _step.value;

                            if (!slot.selected) {
                                result.push(slot.hidden = true);
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    return result;
                }();
            });
        }
    };
});
'use strict';

angular.module('BB.Filters').filter('in_the_future', function () {
    return function (slots) {

        var tim = moment();
        var now_tod = tim.minutes() + tim.hours() * 60;
        return _.filter(slots, function (x) {
            return x.time > now_tod;
        });
    };
});

angular.module('BB.Filters').filter('tod_from_now', function () {
    return function (tod, options) {

        var str = void 0;
        var tim = moment();
        var now_tod = tim.minutes() + tim.hours() * 60;

        var v = tod - now_tod;

        var hour_string = options && options.abbr_units ? "hr" : "hour";
        var min_string = options && options.abbr_units ? "min" : "minute";
        var seperator = options && angular.isString(options.seperator) ? options.seperator : "and";

        var val = parseInt(v);
        if (val < 60) {
            return val + ' ' + min_string + 's';
        }
        var hours = parseInt(val / 60);
        var mins = val % 60;
        if (mins === 0) {
            if (hours === 1) {
                return '1 ' + hour_string;
            } else {
                return hours + ' ' + hour_string + 's';
            }
        } else {
            str = hours + ' ' + hour_string;
            if (hours > 1) {
                str += "s";
            }
            if (mins === 0) {
                return str;
            }
            if (seperator.length > 0) {
                str += ' ' + seperator;
            }
            str += ' ' + mins + ' ' + min_string + 's';
        }

        return str;
    };
});
"use strict";

angular.module("BBAdminBooking").config(function ($translateProvider) {
    "ngInject";

    var translations = {
        ADMIN_BOOKING: {
            ASSETS: {
                RESOURCES_GROUP_LABEL: "@:COMMON.TERMINOLOGY.RESOURCES",
                STAFF_GROUP_LABEL: "@:COMMON.TERMINOLOGY.STAFF"
            },
            CALENDAR: {
                STEP_HEADING: "Select a time",
                TIME_NOT_AVAILABLE_STEP_HEADING: "Time not available",
                ANY_PERSON_OPTION: "Any person",
                ANY_RESOURCE_OPTION: "Any resource",
                BACK_BTN: "@:COMMON.BTN.BACK",
                SELECT_BTN: "@:COMMON.BTN.SELECT",
                CALENDAR_PANEL_HEADING: "@:COMMON.TERMINOLOGY.CALENDAR",
                NOT_AVAILABLE: "Time not available: {{time | datetime: 'lll':true}}",
                CONFLICT_EXISTS: "There\'s an availability conflict",
                CONFLICT_EXISTS_WITH_PERSON: "with {{person_name}}",
                CONFLICT_EXISTS_IN_RESOURCE: "in {{resource_name}}",
                CONFLICT_RESULT_OF: "This can be the result of:",
                CONFLICT_REASON_ALREADY_BOOKED: "The Staff/Resource being booked or blocked already",
                CONFLICT_REASON_NOT_ENOUGH_TIME: "Not enough available time to complete the booking before an existing one starts",
                CONFLICT_REASON_OUTSIDE: "The selected time being outside of the {{booking_time_step | time_period}} booking time step for {{service_name}}.",
                CONFLICT_ANOTHER_TIME_OR_OVERBOOK: "You can either use the calendar to choose another time or overbook.",
                DAY_VIEW_BTN: "Day",
                DAY_3_VIEW_BTN: "3 day",
                DAY_5_VIEW_BTN: "5 day",
                DAY_7_VIEW_BTN: "7 day",
                FIRST_FOUND_VIEW_BTN: "First available",
                TIME_SLOT_WITH_COUNTDOWN: "{{datetime | datetime: 'LT':true}} (in {{time | tod_from_now}})",
                NOT_FOUND: "No availability found",
                NOT_FOUND_TRY_DIFFERENT_TIME_RANGE: "No availability found, try a different time-range",
                OVERBOOK_WARNING: "Overbooking ignores booking time step and availability constraints to make a booking.",
                FILTER_BY_LBL: "Filter by",
                PREV_DAY_BTN: "Previous Day",
                NEXT_DAY_BTN: "Next Day",

                SELECT_A_TIME_FOR_BOOKING: "Select a time for the booking.",
                OVERLAPPING_BOOKINGS: "The following bookings look like they are clashing with this requested time",
                NEARBY_BOOKINGS: "The following nearby bookings might be clashing with this requested time",
                EXTERNAL_BOOKINGS: "The following external calendar bookings look like they are clashing with this requested time",

                EXTERNAL_BOOKING_DESCRIPTION: "{{title}} from {{from | datetime: 'lll':true}} to {{to | datetime: 'lll':true}}",
                ALTERNATIVE_TIME_NO_OVERBOOKING: "It looks like the booking step that service was configured for doesn't allow that time. You can select an alternative time, or you can try booking the requested time anyway, however making double bookings is not allowed by your business configuration settings",
                ALTERNATIVE_TIME_ALLOW_OVERBOOKING: "The following external calendar bookings look like they are clashing with this requested time",

                CLOSEST_TIME_NO_OVERBOOKING: "Looks like that time wasn\'t available. This could just be because it would be outside of their normal schedule. This was the closest time I found. You can select an alternative time, or you can try booking the requested time anyway, however double bookings aren\'t allowed by your company configuration settings",
                CLOSEST_TIME_ALLOW_OVERBOOKING: "Looks like that time wasn\'t available. This could just be because it would be outside of their normal schedule. This was the closest time I found. You can select an alternative time, or you can try booking the requested time anyway",

                CLOSEST_EARLIER_TIME_BTN: "Closest Earlier: {{closest_earlier | datetime: 'LT':true}}",
                CLOSEST_LATER_TIME_BTN: "Closest Later: {{closest_later | datetime: 'LT':true}}",
                REQUESTED_TIME_BTN: "Requested Time: {{requested_time | datetime: 'LT':true}}",
                FIND_ANOTHER_TIME_BTN: "Find another time",
                MORNING_HEADER: "@:COMMON.TERMINOLOGY.MORNING",
                AFTERNOON_HEADER: "@:COMMON.TERMINOLOGY.AFTERNOON",
                EVENING_HEADER: "@:COMMON.TERMINOLOGY.EVENING"
            },
            CUSTOMER: {
                CUSTOMER: "Customer",
                BACK_BTN: "@:COMMON.BTN.BACK",
                SEARCH_BTN: 'Search for customer',
                CLEAR_BTN: "@:COMMON.BTN.CLEAR",
                CREATE_HEADING: "Create Customer",
                CREATE_BTN: "Create Customer",
                CREATE_ONE_INSTEAD_BTN: "Create one instead",
                EMAIL_LBL: "@:COMMON.TERMINOLOGY.EMAIL",
                FIRST_NAME_LBL: "@:COMMON.TERMINOLOGY.FIRST_NAME",
                LAST_NAME_LBL: "@:COMMON.TERMINOLOGY.LAST_NAME",
                MOBILE_LBL: "@:COMMON.TERMINOLOGY.MOBILE",
                NO_RESULTS_FOUND: "No results found",
                NUM_CUSTOMERS: "{CUSTOMERS_NUMBER, plural, =0{no customers} =1{one customer} other{{CUSTOMERS_NUMBER} customers}} found",
                SEARCH_BY_PLACEHOLDER: "Search by email or name",
                STEP_HEADING: "Select a customer",
                SELECT_BTN: "@:COMMON.BTN.SELECT",
                SORT_BY_LBL: "Sort by",
                SORT_BY_EMAIL: "@:COMMON.TERMINOLOGY.EMAIL",
                SORT_BY_FIRST_NAME: "@:COMMON.TERMINOLOGY.FIRST_NAME",
                SORT_BY_LAST_NAME: "@:COMMON.TERMINOLOGY.LAST_NAME",
                ADDRESS1_LBL: "@:COMMON.TERMINOLOGY.ADDRESS1",
                ADDRESS1_VALIDATION_MSG: "Please enter an address",
                ADDRESS3_LBL: "@:COMMON.TERMINOLOGY.ADDRESS3",
                ADDRESS4_LBL: "@:COMMON.TERMINOLOGY.ADDRESS4",
                POSTCODE_LBL: "@:COMMON.TERMINOLOGY.POSTCODE"
            },
            QUICK_PICK: {
                BLOCK_STAFF_OR_RESOURCE: "Block time for person/resource",
                BLOCK_TIME_TAB_HEADING: "Block time",
                BLOCK_WHOLE_DAY: "Block whole day",
                MAKE_BOOKING_TAB_HEADING: "Make booking",
                FOR: "For",
                PERSON_LABEL: "@:COMMON.TERMINOLOGY.PERSON",
                PERSON_DEFAULT_OPTION: "Any Person",
                RESOURCE_LABEL: "@:COMMON.TERMINOLOGY.RESOURCE",
                RESOURCE_DEFAULT_OPTION: "Any Resource",
                FROM_LBL: "From",
                SERVICE_LABEL: 'Select a service',
                SERVICE_DEFAULT_OPTION: "-- select --",
                SERVICE_REQUIRED_MSG: 'Please select a service',
                STAFF_RESOURCE_REQUIRED_MSG: "Please select a person/resource",
                TO_LBL: "To",
                YES_OPTION: "@:COMMON.BTN.YES",
                NO_OPTION: "@:COMMON.BTN.NO",
                NEXT_BTN: "@:COMMON.BTN.NEXT",
                BLOCK_TIME_BTN: "Block Time",
                FIELD_REQUIRED: "@:COMMON.FORM.FIELD_REQUIRED"
            },
            BOOKINGS_TABLE: {
                CANCEL_BTN: "@:COMMON.BTN.CANCEL",
                DETAILS_BTN: "@:COMMON.BTN.DETAILS",
                DATE_HEADING: "Date/Time",
                DETAILS_HEADING: "Description",
                ACTION_HEADING: "Actions"
            },
            ADMIN_MOVE_BOOKING: {
                CANCEL_CONFIRMATION_HEADING: "Your booking has been cancelled.",
                HEADING: "Your {{service_name}} booking",
                CUSTOMER_NAME_LBL: "@:COMMON.TERMINOLOGY.NAME",
                PRINT_BTN: "@:COMMON.TERMINOLOGY.PRINT",
                EMAIL_LBL: "@:COMMON.TERMINOLOGY.EMAIL",
                SERVICE_LBL: "@:COMMON.TERMINOLOGY.SERVICE",
                WHEN_LBL: "@:COMMON.TERMINOLOGY.WHEN",
                PRICE_LBL: "@:COMMON.TERMINOLOGY.PRICE",
                CANCEL_BOOKING_BTN: "@:COMMON.BTN.CANCEL_BOOKING",
                MOVE_BOOKING_BTN: "Move booking",
                BOOK_WAITLIST_ITEMS_BTN: "Book Waitlist Items"
            },
            CHECK_ITEMS: {
                BOOKINGS_QUESTIONS_HEADING: "Booking Questions",
                PRIVATE_BOOKING_NOTES_HEADING: "Private Notes",
                BOOK_BTN: "@:COMMON.BTN.BOOK",
                BACK_BTN: "@:COMMON.BTN.BACK"
            },
            CONFIRMATION: {
                TITLE: "@:COMMON.TERMINOLOGY.CONFIRMATION",
                BOOKING_CONFIRMATION: "Booking is now confirmed.",
                EMAIL_CONFIRMATION: "An email has been sent to {{customer_name}} with the details below.",
                WAITLIST_CONFIRMATION: "You have successfully made the following bookings.",
                PRINT_BTN: "@:COMMON.TERMINOLOGY.PRINT",
                PURCHASE_REF_LBL: "Reference",
                CUSTOMER_LBL: "@:COMMON.TERMINOLOGY.BOOKING_REF",
                SERVICE_LBL: "@:COMMON.TERMINOLOGY.SERVICE",
                DATE_TIME_LBL: "@:COMMON.TERMINOLOGY.DATE_TIME",
                TIME_LBL: "@:COMMON.TERMINOLOGY.TIME",
                PRICE_LBL: "@:COMMON.TERMINOLOGY.PRICE",
                CLOSE_BTN: "@:COMMON.BTN.CLOSE"
            },
            MODAL: {
                CLOSE_BTN: "@:COMMON.BTN.CLOSE"
            }
        }
    };

    $translateProvider.translations("en", translations);
});
'use strict';

/**
 * @ngdoc service
 * @module BB.Services
 * @name AdminBookingOptions
 *
 * @description
 * Returns a set of Admin Booking configuration options
 */

/**
 * @ngdoc service
 * @module BB.Services
 * @name AdminBookingOptionsProvider
 *
 * @description
 * Provider
 *
 *
 * @example
 <pre>
     angular.module('ExampleModule').config ['AdminBookingOptionsProvider', (AdminBookingOptionsProvider) ->
        GeneralOptionsProvider.setOption('twelve_hour_format', true)
     ]
 </pre>
 */
angular.module('BB.Services').provider('AdminBookingOptions', function () {
    // This list of default options is meant to grow
    var options = {
        merge_resources: true,
        merge_people: true,
        day_view: 'multi_day',
        mobile_pattern: null,
        use_default_company_id: false
    };

    this.setOption = function (option, value) {
        if (options.hasOwnProperty(option)) {
            options[option] = value;
        }
    };

    this.$get = function () {
        return options;
    };
});
'use strict';

(function () {

    angular.module('BBAdminBooking').factory('AdminBookingPopup', adminBookingPopup);

    function adminBookingPopup($uibModal) {

        return {
            open: function open(_config) {

                return $uibModal.open({
                    size: 'lg',
                    controller: AdminBookingPopupCtrl,
                    templateUrl: 'admin_booking_popup.html',
                    resolve: {
                        config: function config() {
                            return _config;
                        }
                    }
                });
            }
        };

        function AdminBookingPopupCtrl($rootScope, $scope, $uibModalInstance, config, $window, AdminBookingOptions) {
            'ngInject';

            var updateModalTitle = function updateModalTitle(event, date) {
                return $scope.config.title = date.datetime.format('LLLL');
            };
            var updateModalTitleHandler = $scope.$on('slotChanged:updateModalTitle', updateModalTitle);
            $scope.$on('$destroy', function () {
                return updateModalTitleHandler();
            });

            $scope.Math = $window.Math;

            if ($scope.bb && $scope.bb.current_item) {
                delete $scope.bb.current_item;
            }

            $scope.config = angular.extend({
                clear_member: true,
                template: 'main'
            }, config);

            if ($scope.company) {
                if (!$scope.config.company_id) {
                    $scope.config.company_id = $scope.company.id;
                }
            }

            $scope.config.item_defaults = angular.extend({
                merge_resources: AdminBookingOptions.merge_resources,
                merge_people: AdminBookingOptions.merge_people
            }, config.item_defaults);

            $scope.cancel = function () {
                return $uibModalInstance.dismiss('cancel');
            };
        }
    }
})();
'use strict';

/**
 * @ngdoc service
 * @name BBAdminBooking.service:BBAssets
 * @description
 * Gets all the resources for the callendar
 */
var BBAssets = function BBAssets(BBModel, $q, $translate) {
    'ngInject';

    var getAssets = function getAssets(company) {
        var delay = $q.defer();
        var promises = [];
        var assets = [];
        // If company setup with people add people to select
        if (company.$has('people')) {
            promises.push(BBModel.Admin.Person.$query({ company: company, embed: "immediate_schedule" }).then(function (people) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Array.from(people)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var p = _step.value;

                        p.title = p.name;
                        // this is required in case the item comes from the cache and the item.id has been manipulated
                        if (p.identifier == null) {
                            p.identifier = p.id + '_p';
                        }
                        p.group = $translate.instant('ADMIN_BOOKING.ASSETS.STAFF_GROUP_LABEL');
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return assets = _.union(assets, people);
            }));
        }

        // If company is setup with resources add them to select
        if (company.$has('resources')) {
            promises.push(BBModel.Admin.Resource.$query({
                company: company,
                embed: "immediate_schedule"
            }).then(function (resources) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = Array.from(resources)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var r = _step2.value;

                        r.title = r.name;
                        // this is required in case the item comes from the cache and the item.id has been manipulated
                        if (r.identifier == null) {
                            r.identifier = r.id + '_r';
                        }
                        r.group = $translate.instant('ADMIN_BOOKING.ASSETS.RESOURCES_GROUP_LABEL');
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return assets = _.union(assets, resources);
            }));
        }

        // Resolve all promises together
        $q.all(promises).then(function () {
            assets.sort(function (a, b) {
                if (a.type === "person" && b.type === "resource") {
                    return -1;
                }
                if (a.type === "resource" && b.type === "person") {
                    return 1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                return 0;
            });
            return delay.resolve(assets);
        });

        return delay.promise;
    };

    return {
        getAssets: getAssets
    };
};

angular.module('BBAdminBooking').factory('BBAssets', BBAssets);
'use strict';

/*
 * @ngdoc service
 * @name BBAdminBooking.service:ProcessAssetsFilter
 * @description
 * Returns array of assets from a comma delimited string
 */
angular.module('BBAdminBooking').factory('ProcessAssetsFilter', function () {
    return function (string) {
        var assets = [];

        if (typeof string === 'undefined' || string === '') {
            return assets;
        }

        return angular.forEach(string.split(','), function (value) {
            return assets.push(parseInt(decodeURIComponent(value)));
        });
    };
});