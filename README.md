controller-training [![Build Status](https://travis-ci.org/ealtenho/controller-training.svg?branch=master)](https://travis-ci.org/ealtenho/controller-training)
===================

**Detect manipulation of DOM APIs from controllers to encourage AngularJS best practices**

[AngularJS](https://angularjs.org/) provides a framework for separating the implementation of a web application into logical components. This separation of concerns is important for code development, maintenance and especially testing. With modular code, it is easy to implement unit tests.

However, it is not immediately apparent to the learner how an application's logic should be split into these logical components. For example, many applications built without Angular rely on javascript for heavy manipulation of the DOM including dynamically adding and removing elements from the page. Naturally, a programmer beginning to use Angular might want to use similar javascript manipulation in their controllers. As the controllers provide the logic for the views, this could seem to be a correct usage. However, AngularJS allows all such manipulation to occur through Angular directives in the views themselves. In fact, manipulation of DOM APIs from the controller violates the modularity between the controller and view and is against the AngularJS best practices.

To help users recognize the violation of this best practice, controller-training throws errors when DOM APIs are manipulated in Angular controllers.

Implementation
--------------

The implementation of controller-training has two pieces.

1. First, a service patches all relevant DOM APIs in order to throw the error message indicating controller manipulation. This is accomplished by patching the prototypes of `Element`, `Node`, and `EventTarget` with the function as well as patching the properties of individual elements when they are created using the `document.create()` method.

2. Second, the service is used to decorate the `$controller` service of AngularJS. Hence, when a controller is used, the controller-training service is called as well. To handle asynchronous uses of `$controller`, the `zone.js` library is used to create a zone for that interaction with the controller.