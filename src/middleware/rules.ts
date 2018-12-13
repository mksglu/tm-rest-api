function getProperty(propertyName, object) {
  var parts = propertyName.split(".");
  var length = parts.length;
  var property = object || this;
  for (var i = 0; i < length; i++) {
    property = property[parts[i]];
  }
  return property;
}

const rules = {
  rules: {
    editor: {
      users: {
        get: true,
        post: true
      },
      folder: {
        datasheet: {
          post: true,
          get: true,
          delete: true,
          put: true
        },
        template: {
          post: false
        }
      }
    },
    viewer: {
      folders: {
        get: true
      }
    }
  },
  canAccess: function(role, route, method) {
    method = method.toLowerCase();
    route = route.replace(/^\/+|\/+$/gm, "").split("/");

    if (role === "admin") return true;

    let obj = this.rules[role];

    if (!obj) return false;

    var response = false;
    var objectReferancePath = "";
    for (var i = 0; i < route.length; i++) {
      var currentRoute = route[i];
      objectReferancePath += objectReferancePath.length > 0 ? "." + currentRoute : currentRoute;
      var valueOfField = getProperty(objectReferancePath, obj);
      if (valueOfField !== undefined && valueOfField[method] !== undefined) {
        response = valueOfField[method];
      }
    }
    return response;
  }
};
export default rules;
