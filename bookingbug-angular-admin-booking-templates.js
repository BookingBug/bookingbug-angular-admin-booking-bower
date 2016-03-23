angular.module("BBAdminBooking").run(["$templateCache", function($templateCache) {$templateCache.put("admin_booking_popup.html","<div class=\"modal-header\">\r\n  <button type=\"button\" class=\"close\" ng-click=\"cancel()\">&times;</button>\r\n</div>\r\n<div class=\"modal-body\" style=\"min-height: 200px\">\r\n  <div id=\"bb\" bb-admin-booking=\"{{config}}\"></div>\r\n</div>\r\n");
$templateCache.put("calendar.html","<div calendar-admin>\r\n  <div class=\"col-md-12 section1\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12 cal-subheader panel\">\r\n        <p> A booking at an unavailable has been detected, please choose the next available slots below or select book anyway. This is normally caused by one or both of the following reasons.\r\n        <p>\r\n        <i class=\"fa fa-arrow-right\"></i>&nbsp; The Person/resource is not currently available at that time<br>\r\n        <i class=\"fa fa-arrow-right\"></i>&nbsp; The time selected does not matched the normal time step for that service<br>\r\n        <i class=\"fa fa-arrow-right\"></i>&nbsp; The Person/resource is booked already<br>\r\n        <button class=\"btn btn-sm btn-default col-md-2 col-md-offset-10\" ng-click=\"switchWeekView()\">{{name_switch}}</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"row section2\">\r\n    <div class=\"col-md-8\" ng-if=\"week_view\">\r\n      <div class=\"calendar-cal-admin panel\">\r\n\r\n        <div bb-times ng-init=\"checkStepTitle(\'Select a time\')\" class=\"bb-time\">\r\n            <div class=\"bb-calendar-navigation\">\r\n              <button type=\"button\" class=\"btn btn-link pull-left cal-dateheader-btn\" ng-click=\"subtract(\'days\',1)\">\r\n                <span class=\"glyphicon glyphicon-chevron-left pull-left\" aria-hidden=\"true\"></span>\r\n                <span class=\"hidden-xs\">Previous Day</span>\r\n              </button>\r\n              <button type=\"button\" class=\"btn btn-link pull-right cal-dateheader-btn\" ng-click=\"add(\'days\',1)\">\r\n                <span class=\"glyphicon glyphicon-chevron-right pull-right\" aria-hidden=\"true\" ></span>\r\n                <span class=\"hidden-xs\">Next Day</span>\r\n              </button>\r\n            </div>\r\n\r\n            <div>\r\n            <div class=\"cal-dateheader\">\r\n              <h2 class=\"bb-section-title text-center hidden-xs\">{{format_date(\'Do MMM YYYY\')}}</h2>\r\n              <h2 class=\"bb-section-title text-center hidden-sm hidden-md hidden-lg\">{{format_date(\'Do MMM\')}}</h2>\r\n              <div ng-show=\"!slots || (slots && slots.length == 0)\" class=\"bb-service-unavailable\">\r\n                <p>\r\n                  No Service Available\r\n                </p>\r\n              </div>\r\n            </div>\r\n            <div ng-if=\"slots\">\r\n\r\n              <div accordion close-others=\"false\">\r\n                <!-- Morning -->\r\n                <div class=\"acc-cal-admin\">\r\n                  <div bb-accordian-range-group=\"{range: [360, 720], slots: slots, collaspe_when_time_selected: true}\"ng-init=\"setFormDataStoreId($index)\" class=\"accordian-group\">\r\n                    <div accordion-group is-open=\"is_open\" ng-disabled=\"!has_availability && !is_selected\" ng-class=\"{\'expanded\': is_open, \'selected\': is_selected}\">\r\n                      <div accordion-heading>\r\n                        <div class=\"panel-header-cal-admin\">\r\n                              <div class=\"fa fa-angle-double-down pull-left\" ng-show=\"has_availability && !is_open\"></div>Morning<div class=\"fa fa-angle-double-down pull-right\" ng-show=\"has_availability && !is_open\"></div>\r\n                              <div class=\"fa fa-angle-double-up pull-left\" ng-hide=\"has_availability && !is_open\"></div><div class=\"fa fa-angle-double-up pull-right\" ng-hide=\"has_availability && !is_open\"></div>\r\n                          <p class=\"selected-time\" ng-show=\"is_selected && !is_open\">\r\n                            <small>{{selected_slot.time_12}}</small>\r\n                          </p>\r\n                        </div>\r\n                      </div>\r\n\r\n                      <div class=\"row\" ng-if=\"has_availability\">\r\n                        <div ng-if=\"slot.avail > 0\" class=\"bb-time-slot\" ng-class=\"{\'selected\': slot.selected, \'disabled\': slot.disabled}\" ng-repeat=\"slot in accordian_slots\">\r\n                          <button type=\"button\" class=\"btn btn-primary btn-block btn-dropdown-cal-admin\" ng-click=\"selectSlot(slot)\">\r\n                            <span>{{slot.time_12}}</span>\r\n                          </button>\r\n                        </div>\r\n                      </div>\r\n\r\n                    </div>\r\n                  </div>\r\n                <div>\r\n                <!-- Afternoon -->\r\n                <div bb-accordian-range-group=\"{range: [720, 1080], slots: slots, collaspe_when_time_selected: true}\"ng-init=\"setFormDataStoreId($index)\" class=\"accordian-group\">\r\n                  <div accordion-group is-open=\"is_open\" ng-disabled=\"!has_availability && !is_selected\" ng-class=\"{\'expanded\': is_open, \'selected\': is_selected}\">\r\n                    <div accordion-heading>\r\n                      <div class=\"panel-header-cal-admin\">\r\n                            <div class=\"fa fa-angle-double-down pull-left\" ng-show=\"has_availability && !is_open\"></div>Afternoon<div class=\"fa fa-angle-double-down pull-right\" ng-show=\"has_availability && !is_open\"></div>\r\n                            <div class=\"fa fa-angle-double-up pull-left\" ng-hide=\"has_availability && !is_open\"></div><div class=\"fa fa-angle-double-up pull-right\" ng-hide=\"has_availability && !is_open\"></div>\r\n                        <p class=\"selected-time\" ng-show=\"is_selected && !is_open\">\r\n                        <p class=\"selected-time\" ng-show=\"is_selected && !is_open\">\r\n                          <small>{{selected_slot.time_12}}</small>\r\n                        </p>\r\n                      </div>\r\n                    </div>\r\n\r\n                    <div class=\"row\" ng-if=\"has_availability\">\r\n                      <div ng-if=\"slot.avail > 0\" ng-repeat=\"slot in accordian_slots\" class=\"bb-time-slot\" ng-class=\"{\'selected\': slot.selected, \'disabled\': slot.disable}\" >\r\n                        <button type=\"button\" class=\"btn btn-primary btn-dropdown-cal-admin btn-block\" ng-click=\"selectSlot(slot)\">\r\n                          <span>{{slot.time_12}}</span>\r\n                        </button>\r\n                      </div>\r\n                    </div>\r\n\r\n                  </div>\r\n                </div>\r\n                <!-- Evening -->\r\n                <div bb-accordian-range-group=\"{range: [1080, 1200], slots: slots, collaspe_when_time_selected: true}\"ng-init=\"setFormDataStoreId($index)\" class=\"accordian-group\">\r\n                  <div accordion-group is-open=\"is_open\" ng-disabled=\"!has_availability && !is_selected\" ng-class=\"{\'expanded\': is_open, \'selected\': is_selected}\" disabled=\"disabled\">\r\n                    <div accordion-heading>\r\n                      <div class=\"panel-header-cal-admin\">\r\n                            <div class=\"fa fa-angle-double-down pull-left\" ng-show=\"has_availability && !is_open\"></div>Evening<div class=\"fa fa-angle-double-down pull-right\" ng-show=\"has_availability && !is_open\"></div>\r\n                            <div class=\"fa fa-angle-double-up pull-left\" ng-hide=\"has_availability && !is_open\"></div><div class=\"fa fa-angle-double-up pull-right\" ng-hide=\"has_availability && !is_open\"></div>\r\n                        <!-- <p ng-hide=\"is_selected || (is_open && has_availability)\">\r\n                          <small>{{accordian_slots.length}} available</small>\r\n                        </p> -->\r\n                        <p class=\"selected-time\" ng-show=\"is_selected && !is_open\">\r\n                          <small>{{selected_slot.time_12}}</small>\r\n                        </p>\r\n                      </div>\r\n                    </div>\r\n\r\n                    <ul class=\"row\" ng-if=\"has_availability\">\r\n                      <li ng-if=\"slot.avail > 0\" ng-repeat=\"slot in accordian_slots\" class=\"bb-time-slot\" ng-class=\"{\'selected\': slot.selected, \'disabled\': slot.disabled}\">\r\n                        <button type=\"button\" class=\"btn btn-primary btn-block btn-dropdown-cal-admin\" ng-click=\"selectSlot(slot)\">\r\n                          <span >{{slot.time_12}}</span>\r\n                        </button>\r\n                      </li>\r\n                    </ul>\r\n\r\n                  </div>\r\n                </div>\r\n              </div>\r\n\r\n            </div>\r\n\r\n          </div>\r\n\r\n        </div>\r\n\r\n\r\n      </div>\r\n      <div class=\"clearfix hidden-xs\">\r\n      </div>\r\n    </div>\r\n    </div>\r\n    </div>\r\n    <div class=\"widget-wrapper col-md-4\" ng-if=\"week_view\">\r\n      <div>\r\n          <div class=\"header-top\">\r\n           <h2>Information</h2>\r\n          </div>\r\n      </div>\r\n      <ul>\r\n          <li class=\"bb-confirmation-summary-item col-sm-12\" ng-if=\"bb.current_item.service.name\">\r\n            <div class=\"bb-summary-label\">\r\n              <i class=\"fa fa-map-marker pull-left\"></i>\r\n            </div>\r\n            <div class=\"bb-summary-value\"><span>{{bb.current_item.service.name}}</span>\r\n            </div>\r\n          </li>\r\n          <li class=\"bb-confirmation-summary-item col-sm-12\" ng-if=\"bb.current_item.resource.name\">\r\n            <div class=\"bb-summary-label\">\r\n              <i class=\"fa fa-user pull-left\"></i>\r\n            </div>\r\n            <div class=\"bb-summary-value\"><span>{{bb.current_item.resource.name}}</span>\r\n            </div>\r\n          </li>\r\n          <li class=\"bb-confirmation-summary-item col-sm-12\" ng-if=\"bb.current_item.person.name\">\r\n            <div class=\"bb-summary-label\">\r\n              <i class=\"fa fa-user pull-left\"></i>\r\n            </div>\r\n            <div class=\"bb-summary-value\"><span>{{bb.current_item.person.name}}</span>\r\n            </div>\r\n          </li>\r\n          <li class=\"bb-confirmation-summary-item col-sm-12\" ng-if=\"bb.current_item.date\">\r\n            <div class=\"bb-summary-label\">\r\n              <i class=\"fa fa-calendar pull-left\"></i>\r\n            </div>\r\n            <div class=\"bb-summary-value\"><span>{{bb.current_item.date.date | datetime: \'dddd MMMM Do\':false}}</span>\r\n            </div>\r\n          </li>\r\n          <li class=\"bb-confirmation-summary-item col-sm-12\" ng-if=\"bb.current_item.time\">\r\n            <div class=\"bb-summary-label\">\r\n              <i class=\"fa fa-clock-o pull-right\"></i>\r\n            </div>\r\n            <div class=\"bb-summary-value\">\r\n              <span>{{bb.current_item.start_datetime() | datetime: \'h[:]mma\':false }}</span>\r\n            </div>\r\n          </li>\r\n          <li class=\"bb-confirmation-summary-item col-sm-12\" ng-if=\"bb.current_item.duration\">\r\n            <div class=\"bb-summary-label\">\r\n              <i class=\"fa fa-clock-o pull-left\"></i>\r\n            </div>\r\n            <div class=\"bb-summary-value\">\r\n              <span>{{bb.current_item.duration | time_period}}</span>\r\n            </div>\r\n          </li>\r\n          <li class=\"bb-confirmation-summary-item col-sm-12\" ng-if=\"bb.current_item.price\">\r\n            <div class=\"bb-summary-label\">\r\n              Price:\r\n            </div>\r\n            <div class=\"bb-summary-value\">\r\n              <span>{{bb.current_item.price | currency}}</span>\r\n            </div>\r\n          </li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n\r\n\r\n\r\n\r\n  <div bb-page ng-if=\"!week_view\">\r\n  <!--   <div bb-people></div> -->\r\n\r\n  <div bb-time-ranges=\"{selected_day: today}\" class=\"calendar\" ng-show=\"days\">\r\n\r\n    <div class=\"month-header hidden-xs\">\r\n      <h2 class=\"month-heading\">{{pretty_month_title(\'MMMM\', \'YYYY\')}}</h2>\r\n    </div>\r\n\r\n    <div class=\"visible-xs\" class=\"form-group\">\r\n      <label class=\"sr-only\" for=\"date\">Date</label>\r\n      <div class=\"input-group date-picker\">\r\n        <!-- date format: http://docs.angularjs.org/api/ng.filter:date\" -->\r\n        <input type=\"text\" ng-model=\"selected_date\" class=\"form-control\"\r\n          bb-datepicker-popup=\"DD/MM/YYYY\"\r\n          datepicker-popup=\"dd/MM/yyyy\"\r\n          is-open=\"opened\"\r\n          min-date=\"today\"\r\n          on-date-change=\"selectedDateChanged()\"\r\n          datepicker-options=\"{\'starting-day\': 1, \'show-button-bar\': false}\"\r\n          show-weeks=\"false\"\r\n          show-button-bar=\"false\"\r\n          ng-readonly=\"true\"\r\n          name=\"date\"\r\n          id=\"date\"\r\n          placeholder=\"&mdash; Any Date &mdash;\"/>        \r\n        <span class=\"input-group-btn\" ng-click=\"$event.preventDefault(); $event.stopPropagation(); opened=!opened;\">\r\n          <button class=\"btn btn-default\" type=\"submit\" title=\"Pick date\">\r\n            <span class=\"fa fa-calendar-o\"></span>\r\n          </button>\r\n        </span>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"cal-custom\">\r\n      <ul class=\"week row\">\r\n\r\n        <li class=\"day navigation hidden-xs\">\r\n          <button type=\"button\" class=\"btn btn-icon visible-xs\" ng-click=\"subtract(\'days\', 1)\" ng-disabled=\"!is_subtract_valid || !isLoaded\">\r\n            <span class=\"glyphicon glyphicon-chevron-left\"></span>\r\n          </button>\r\n          <button type=\"button\" class=\"btn btn-icon visible-sm\" ng-click=\"subtract(\'days\', 3)\" ng-disabled=\"!is_subtract_valid || !isLoaded\">\r\n            <span class=\"glyphicon glyphicon-chevron-left\"></span>\r\n          </button>\r\n          <button type=\"button\" class=\"btn btn-icon visible-md\" ng-click=\"subtract(\'days\', 5)\" ng-disabled=\"!is_subtract_valid || !isLoaded\">\r\n            <span class=\"glyphicon glyphicon-chevron-left\"></span>\r\n          </button>\r\n          <button type=\"button\" class=\"btn btn-icon visible-lg\" ng-click=\"subtract(\'days\', 7)\" ng-disabled=\"!is_subtract_valid || !isLoaded\">\r\n            <span class=\"glyphicon glyphicon-chevron-left\"></span>\r\n          </button>\r\n          <span ng-show=\"!is_subtract_valid || !isLoaded\">&nbsp;</span>\r\n        </li>\r\n\r\n        <li class=\"day cal-col-{{$index + 1}}\" ng-repeat=\"day in days\" ng-class=\"{\'past\': day.date.isBefore(moment(),\'day\')}\">\r\n          <div class=\"day-header row\">\r\n            <span class=\"col-xs-2 previous visible-xs\">\r\n              <button type=\"button\" class=\"btn btn-icon\" ng-click=\"subtract(\'days\', 1)\" ng-disabled=\"day.date.isSame(moment(),\'day\') || !isLoaded\">\r\n                <span class=\"glyphicon glyphicon-chevron-left\"></span>\r\n              </button>\r\n            </span>\r\n            <h3 class=\"day-heading col-xs-8 col-sm-12\">\r\n              <span class=\"visible-xs\">{{day.date | datetime: \"ddd\"}} <strong>{{day.date | datetime: \"D\"}} </strong>{{day.date | datetime: \"MMM\"}}</span>\r\n              <span class=\"hidden-xs\">{{day.date | datetime: \"ddd\"}} <strong>{{day.date | datetime: \"D\"}} </strong></span>\r\n            </h3>\r\n            <span class=\"col-xs-2 next visible-xs\">\r\n              <button type=\"button\" class=\"btn btn-icon visible-xs pull-right\" ng-click=\"add(\'days\', 1)\" ng-disabled=\"!isLoaded\">\r\n                <span class=\"glyphicon glyphicon-chevron-right\"></span>\r\n              </button>\r\n              </button>\r\n            </span>\r\n          </div>\r\n\r\n          <div class=\"times\">\r\n\r\n            <!-- if time list has slots -->\r\n            <div accordion close-others=\"false\">\r\n\r\n              <!-- MORNING TIME RANGE -->\r\n              <div bb-accordian-range-group=\"{heading: \'Morning\', range: [0, 720], slots: day.slots, collaspe_when_time_selected: true}\" ng-init=\"setFormDataStoreId($index)\" class=\"accordian-group\">\r\n              </div>\r\n\r\n              <!-- AFTERNOON TIME RANGE -->\r\n              <div bb-accordian-range-group=\"{heading: \'Afternoon\', range: [720, 1020], slots: day.slots, collaspe_when_time_selected: true}\" ng-init=\"setFormDataStoreId($index)\" class=\"accordian-group\">\r\n              </div>\r\n\r\n              <!-- EVENING TIME RANGE -->\r\n              <div bb-accordian-range-group=\"{heading: \'Evening\', range: [1020, 1440], slots: day.slots, collaspe_when_time_selected: true}\" ng-init=\"setFormDataStoreId($index)\" class=\"accordian-group\">\r\n              </div>\r\n\r\n            </div>\r\n\r\n          </div>\r\n\r\n        </li>\r\n\r\n        <li class=\"day navigation hidden-xs\">\r\n          <button type=\"button\" class=\"btn btn-icon visible-sm\" ng-click=\"add(\'days\', 3)\" ng-disabled=\"!isLoaded\">\r\n            <span class=\"glyphicon glyphicon-chevron-right\"></span>\r\n          </button>\r\n          <button type=\"button\" class=\"btn btn-icon visible-md\" ng-click=\"add(\'days\', 5)\" ng-disabled=\"!isLoaded\">\r\n            <span class=\"glyphicon glyphicon-chevron-right\"></span>\r\n          </button>\r\n          <button type=\"button\" class=\"btn btn-icon visible-lg\" ng-click=\"add(\'days\', 7)\" ng-disabled=\"!isLoaded\">\r\n            <span class=\"glyphicon glyphicon-chevron-right\"></span>\r\n          </button>\r\n        </li>\r\n      </ul>\r\n    </div>\r\n\r\n  </div>\r\n\r\n\r\n  </div>\r\n\r\n  <div class=\"row section3\">\r\n    <div class=\"col-sm-2\">\r\n      <button type=\"button\" class=\"btn btn-default btn-block\" bb-debounce ng-click=\"loadPreviousStep()\" ng-show=\"bb.current_step > 1\">Back</button>\r\n    </div>\r\n    <div class=\"cal-modal\">\r\n      <div class=\"col-md-6 col-md-offset-4\">\r\n        <button type=\"button\" class=\"btn btn-danger btn-block\" ng-click=\"bookAnyway()\">Book Anyway!</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n");
$templateCache.put("check_items.html","<div bb-item-details ng-init=\"checkStepTitle(\'Booking Summary\')\">\r\n\r\n  <div bb-include=\"_basket_item_summary\">\r\n  </div>\r\n\r\n  <form name=\"booking_form\" class=\"form-horizontal\" role=\"form\" bb-form>\r\n\r\n    <div class=\"bb-subcontent\">\r\n\r\n      <div bb-custom-booking-text class=\"bb-message-node\">\r\n        <div ng-repeat=\"msg in messages\" ng-bind-html=\"msg\"></div>\r\n      </div>\r\n\r\n      <div ng-show=\"item_details.hasQuestions\" class=\"question-node\">\r\n        <div ng-form=\"booking_questions_form\" role=\"form\" novalidate>\r\n          <h3 class=\"booking-form-header\">Questions</h3>\r\n\r\n          <div ng-repeat=\"question in item_details.questions\" bb-question-line ng-show=\"question.currentlyShown\">\r\n            <div class=\"form-group\" ng-class=\"{\'has-error\': booking_questions_form[\'q\' + question.id].$invalid && (booking_questions_form[\'q\' + question.id].dirty || booking_form.submitted)}\">\r\n              <label bb-question-label=\"question\" class=\"control-label col-sm-offset-1 col-sm-3\" ng-show=\"question.name\" for=\"{{question.id}}\"\r\n              >{{question.name}}<span ng-show=\"question.required\">*</span>:\r\n              </label>\r\n              <div class=\"col-sm-5\">\r\n                <input bb-question=\"question\"/>\r\n                <br/>\r\n                <small ng-show=\"question.help_text\">{{question.help_text}}<hr/></small>\r\n              </div>\r\n              <div class=\"col-sm-offset-4 messages\">\r\n                <div class=\"error-message\" ng-show=\"question.required.$invalid && booking_form.submitted\">\r\n                  This field is required\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n      </div>\r\n\r\n      <div class=\"question-node\">\r\n        <label for=\"notes\">Booking Notes (optional):</label>\r\n        <span>\r\n          <textarea ng-model=\"item.private_note\" name=\"note\" id=\"note\" rows=\"3\" class=\"form-question form-control\"></textarea><br>\r\n         </span>\r\n      </div>\r\n      \r\n    \r\n\r\n    </div>\r\n\r\n    <div class=\"bb-step-navigation\">\r\n      <div class=\"row\">\r\n        <div class=\"col-sm-9 col-sm-push-3 text-right\">\r\n          <button type=\"submit\" class=\"btn btn-primary pull-right\" ng-click=\"confirm(booking_form)\">Book</button>\r\n        </div>\r\n        <div class=\"col-sm-3 col-sm-pull-9\">\r\n          <button type=\"button\" class=\"btn btn-default pull-left\" ng-click=\"loadPreviousStep()\" ng-show=\"bb.current_step > 1\">Back</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n  </form>\r\n\r\n\r\n</div>");
$templateCache.put("client.html","<div bb-admin-booking-clients>\r\n  <div class=\"page-subheader-var\">\r\n    <h4>Search for a customer or create a new one</h4>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"admin-typehead-wrapper\">\r\n      <div class=\"input-group\">\r\n      <input class=\"admin-typehead input form-control\" ng-model=\"typehead_result\" placeholder=\"Search Email or Name\" typeahead=\"item.name for item in searchClients($viewValue)\" typeahead-template-url=\"_typeahead.html\" typeahead-loading=\"loadingLocations\" typeahead-no-results=\"noResults\" class=\"form-control\" typeahead-on-select=\"typeHeadResults($item, $modal, $label)\">\r\n      <span class=\"input-group-btn\">\r\n        <button class=\"btn btn-primary form-control-btn btn-search-anyway\" ng-click=\"getClients(null, typehead_result)\"><i class=\"fa fa-search\"></i></button>\r\n      </span>\r\n    </div>\r\n    </div>\r\n  </div>\r\n  <div ng-if=\"search_triggered\" class=\"search-results\">\r\n    <button class=\"btn-link pull-right\" style=\"margin-bottom: 10px;\" ng-click=\"clearSearch()\">Clear Results</button>\r\n    <div class=\"clearfix\"></div>\r\n    <div ng-repeat=\"item in clients | startFrom: (pagination.current_page - 1) * pagination.page_size | limitTo: pagination.page_size\">\r\n      <div class=\"typehead-client-wrapper row\">\r\n        <div class=\"col-sm-10\">\r\n          <span ng-show=\"item.name\" style=\"font-weight: bold; font-size: 20px;\">{{item.name}}</span>\r\n          <br /><span ng-show=\"item.email\"><i class=\"fa fa-envelope-o\"></i> </span>{{item.email}}</span>\r\n          <br /><span ng-show=\"item.phone\"><i class=\"fa fa-phone\"></i> </span>{{item.phone}}</span>\r\n        </div>\r\n        <div class=\"col-sm-2\">\r\n          <button class=\"btn btn-primary btn-block\" ng-click=\"selectClient(item);\">Select</button>\r\n        </div>\r\n        <div class=\"clearfix\">\r\n\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <pagination total-items=\"pagination.num_items\"\r\n      ng-model=\"pagination.current_page\" items-per-page=\"pagination.page_size\"\r\n      max-size=\"pagination.max_size\" boundary-links=\"true\" rotate=\"false\"\r\n      num-pages=\"pagination.num_pages\"></pagination>\r\n  </div>\r\n  <div ng-show=\"client.name\">\r\n    <div class=\"panel panel-default\">\r\n      <div class=\"panel-heading\">\r\n        <span style=\"font-family: proxbold;\">{{client.name}}</span>\r\n        <i class=\"fa fa-times panel-client-close\" ng-click=\"client = null\"></i>\r\n      </div>\r\n      <div class=\"panel-body\">\r\n        <p ng-show=\"client.id\"><span style=\"font-family: proxbold;\">ID: </span>{{client.id}}</p>\r\n        <p ng-show=\"client.email\"><span style=\"font-family: proxbold;\">Email: </span>{{client.email}}</p>\r\n        <p ng-show=\"client.phone\"><span style=\"font-family: proxbold;\">Phone: </span>{{client.phone}}</p>\r\n        <button class=\"btn btn-primary pull-right\" ng-click=\"selectClient(client)\">Select</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <hr />\r\n<div ng-hide=\"clients || client.name\" class=\"admin-create-client\">\r\n  <h3>Create New Customer</h3>\r\n  <div ng-form name=\"client_form\" class=\"form-horizontal admin-form-submit\" role=\"form\" novalidate>\r\n    <div class=\"form-group\" ng-class=\"{\'has-error\': client_form.first_name.$invalid && client_form.submitted}\">\r\n      <label for=\"first_name\" class=\"control-label col-sm-4\">First Name*:</label>\r\n      <div class=\"col-sm-5\">\r\n        <input type=\"text\" name=\"first_name\" id=\"first_name\" ng-model=\"client.first_name\" class=\"form-control\" ng-required=\"!client.email && !client.last_name\"/>\r\n      </div>\r\n        <div class=\"col-sm-offset-4 messages\">\r\n         <div class=\"error-message\" ng-show=\"client_form.first_name.$invalid && client_form.submitted\">\r\n           Please enter a first name\r\n         </div>\r\n        </div>\r\n        <div class=\"col-sm-offset-4 messages\">\r\n         <div ng-hide=\"client_form.first_name.$invalid && client_form.submitted\">\r\n           *Please enter a first and last name or email address\r\n        </div>\r\n\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"form-group\" ng-class=\"{\'has-error\': client_form.last_name.$invalid && client_form.submitted}\">\r\n      <label for=\"last_name\" class=\"control-label col-sm-4\">Last Name:</label>\r\n      <div class=\"col-sm-5\">\r\n        <input type=\"text\" name=\"last_name\" id=\"last_name\" ng-required=\"!client.first_name && !client.email\" ng-model=\"client.last_name\" class=\"form-control\"/>\r\n      </div>\r\n\r\n      <div class=\"col-sm-offset-4 messages\">\r\n        <div class=\"error-message\" ng-show=\"client_form.last_name.$invalid && client_form.submitted\">\r\n          Please enter a last name\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"form-group\" ng-class=\"{\'has-error\': client_form.email.$invalid && client_form.submitted}\">\r\n      <label for=\"email\" class=\"control-label col-sm-4\">E-mail*:</label>\r\n      <div class=\"col-sm-5\">\r\n        <input type=\"email\" name=\"email\" id=\"email\" ng-required=\"!client.first_name && !client.last_name\" ng-model=\"client.email\" class=\"form-control\"/>\r\n      </div>\r\n\r\n      <div class=\"col-sm-offset-4 messages\">\r\n        <div class=\"error-message\" ng-show=\"client_form.email.$invalid && client_form.submitted\">       \r\n          Please enter a valid email address\r\n        </div>        \r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"form-group\" ng-class=\"{\'has-error\': client_form.mobile.$invalid && client_form.submitted}\">\r\n      <label for=\"mobile\" class=\"control-label col-sm-4\">Mobile:</label>\r\n      <div class=\"col-sm-5\">\r\n        <input type=\"text\" name=\"mobile\" id=\"mobile\" ng-model=\"client.mobile\" class=\"form-control\"/>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"form-group\" ng-class=\"{\'has-error\': client_form.phone.$invalid && client_form.submitted}\">\r\n      <label for=\"phone\" class=\"control-label col-sm-4\">Phone:</label>\r\n      <div class=\"col-sm-5\">\r\n        <input type=\"text\" name=\"phone\" id=\"phone\" ng-model=\"client.phone\" class=\"form-control\"/>\r\n      </div>\r\n    </div>\r\n\r\n    <div ng-show=\"bb.company_settings.ask_address\">\r\n       <div class=\"form-group\" ng-class=\"{\'has-error\': client_form.address1.$invalid && ((client_form.address1.$dirty && !client_form.address1.$focused) || booking_form.submitted)}\">\r\n          <label for=\"address1\" class=\"control-label col-sm-4\">Address:</label>\r\n          <div class=\"col-sm-5\">\r\n            <input type=\"text\" name=\"address1\" id=\"address1\" ng-model=\"client.address1\" class=\"form-control\"/>\r\n          </div>\r\n          <div class=\"col-sm-3 messages\">\r\n            <div class=\"error-message\" ng-show=\"client_form.address1.$invalid && booking_form.submitted\">\r\n              Please enter your address\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"form-group\" ng-class=\"{\'has-error\': client_form.address2.$invalid && ((client_form.address2.$dirty && !client_form.address2.$focused) || booking_form.submitted)}\">\r\n          <label for=\"address2\" class=\"control-label col-sm-4\"></label>\r\n          <div class=\"col-sm-5\">\r\n            <input type=\"text\" name=\"address2\" id=\"address2\" ng-model=\"client.address2\" class=\"form-control\"/>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"form-group\" ng-class=\"{\'has-error\': client_form.address3.$invalid && ((client_form.address3.$dirty && !client_form.address3.$focused) || booking_form.submitted)}\">\r\n          <label for=\"address3\" class=\"control-label col-sm-4\">Town:</label>\r\n          <div class=\"col-sm-5\">\r\n            <input type=\"text\" name=\"address3\" id=\"address3\" ng-model=\"client.address3\" class=\"form-control\"/>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"form-group\" ng-class=\"{\'has-error\': client_form.address4.$invalid && booking_form.submitted}\">\r\n          <label for=\"address4\" class=\"control-label col-sm-4\">County:</label>\r\n          <div class=\"col-sm-5\">\r\n            <input type=\"text\" name=\"address4\" id=\"address4\" ng-model=\"client.address4\" class=\"form-control\"/>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"form-group\" ng-class=\"{\'has-error\': client_form.postcode.$invalid && ((client_form.postcode.$dirty && !client_form.postcode.$focused) || booking_form.submitted)}\">\r\n          <label for=\"postcode\" class=\"control-label col-sm-4\">Postcode:</label>\r\n          <div class=\"col-sm-5\">\r\n            <input type=\"text\" name=\"postcode\" id=\"postcode\" ng-model=\"client.postcode\" class=\"form-control\"/>\r\n          </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div bb-client-details ng-show=\"client_details.hasQuestions\">\r\n      <div class=\"form-group\" ng-repeat=\"question in client_details.questions\" ng-if=\"question.currentlyShown\" bb-question-line ng-class=\"{ \'check\': question.detail_type == \'check\', \'has-error\': question.required && client_form.submitted}\">\r\n        <label ng-hide=\"question.detail_type == \'check\'\" for=\"{{question.id}}\" class=\"control-label col-sm-4\">{{question.name}}<span ng-show=\"question.required\">*</span></label>\r\n        <div ng-show=\"question.detail_type == \'check\'\" class=\"col-sm-4 hidden-xs\">&nbsp;</div>\r\n        <div class=\"col-sm-5\">\r\n          <input bb-question=\"question\"/>\r\n        </div>\r\n        <div class=\"col-sm-offset-4 messages\">\r\n          <div class=\"error-message\" ng-show=\"question.required && client_form.submitted\">\r\n            This field is required\r\n          </div>\r\n        </div>\r\n      </div>\r\n  \r\n    </div>\r\n\r\n  </div>\r\n  <button type=\"submit\" class=\"btn btn-primary col-sm-offset-7 col-sm-2\" ng-click=\"validator.validateForm(client_form) && createClient()\" bb-debounce>Create Customer</button>\r\n</div>\r\n");
$templateCache.put("quick_pick.html","<div class=\"bb-quick-pick\" bb-wait-for=\"quickEmptybasket()\" bb-wait-var=\"all_done\" ng-if=\"all_done\" bb-form-data-store bb-page>\r\n\r\n  <div ng-form name=\"appointment-booking-form\">\r\n\r\n    <h1>Make a Booking</h1>\r\n\r\n    <div bb-services>\r\n      <div class=\"form-group\">\r\n        <label>Service</label>\r\n        \r\n        <!-- TODO use display_name -->\r\n        <select id=\"service\" ng-model=\"service\" ng-options=\"s.name for s in bookable_services | orderBy: \'name\'\" class=\"form-control\">\r\n          <option value=\"\">-- select a service --</option>\r\n        </select>\r\n        \r\n      </div>\r\n    </div>\r\n    \r\n    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"checkReady() && routeReady()\" bb-debounce ng-disabled=\"!bb.current_item.service\">Book</button>\r\n\r\n  </div>\r\n\r\n  <hr>\r\n\r\n  <div ng-form name=\"block_time_form\" class=\"bb-block-time\" bb-block-time>\r\n\r\n    <h1>Block Time</h1>\r\n\r\n    <div class=\"form-group\">\r\n      <label>For</label>\r\n      <p ng-show=\"bb.current_item.person.name\">\r\n        {{bb.current_item.person.name}}\r\n      </p>\r\n      <p ng-show=\"bb.current_item.resource.name\">\r\n        {{bb.current_item.resource.name}}\r\n      </p>\r\n    </div>\r\n\r\n    <div class=\"form-group\">\r\n      <label>From</label>\r\n      <div bb-date-time-picker=\"block_time.from\"></div>\r\n    </div>\r\n\r\n    <div class=\"form-group\">\r\n      <label>To</label>\r\n      <div bb-date-time-picker=\"block_time.to\"></div>\r\n    </div>\r\n\r\n    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"blockTime()\" bb-debounce ng-disabled=\"false\">Block Time</button>\r\n\r\n\r\n  </div>\r\n\r\n</div>\r\n");
$templateCache.put("_datetime_picker.html","<div class=\"row bb-date-picker\">\r\n  <div class=\"col-sm-4\">\r\n    <div class=\"input-group\">       \r\n      <input type=\"text\" ng-model=\"datetime.date\" class=\"form-control\"\r\n        bb-datepicker-popup=\"DD/MM/YYYY\"\r\n        on-date-change=\"selectedDateChanged()\"\r\n        datepicker-popup=\"dd/MM/yyyy\"\r\n        is-open=\"opened\"\r\n        min-date=\"today\"\r\n        datepicker-options=\"{\'starting-day\': 1, \'show-button-bar\': false}\"\r\n        show-weeks=\"false\"\r\n        show-button-bar=\"false\"\r\n        ng-readonly=\"false\"\r\n      />\r\n      <span class=\"input-group-btn\" ng-click=\"$event.preventDefault(); $event.stopPropagation(); opened=!opened;\">\r\n        <button class=\"btn btn-default\" type=\"submit\" title=\"Select date\"><span class=\"fa fa-calendar-o\"></span></button>\r\n      </span>\r\n    </div>\r\n  </div>\r\n  <div class=\"col-sm-4\">\r\n    <div timepicker ng-model=\"datetime.time\" ng-change=\"changed()\" hour-step=\"1\" minute-step=\"5\" show-meridian=\"false\"></div>\r\n  </div>\r\n</div>");
$templateCache.put("_typeahead.html","<div class=\"typeahead_match\">\r\n  <div class=\"match_name\">{{match.label}}</div>\r\n  <div class=\"match_email\">{{match.model.email}}</div>\r\n</div>");}]);