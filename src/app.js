angular.module('sysen.toolbelt', ['sysen.toolbelt.services', 'sysen.toolbelt.directives', 'sysen.toolbelt.tpls']);
angular.module('sysen.toolbelt.services', ['toolbelt.platform']);
angular.module('sysen.toolbelt.directives', ['toolbelt.growl', 'toolbelt.infiniteScroll', 'toolbelt.markdown', 'toolbelt.navbar', 'toolbelt.scroll', 'toolbelt.strength']);
angular.module('sysen.toolbelt.tpls', ['toolbelt.growl.tpl', 'toolbelt.strength.tpl']);
