(function () {
    'use strict';

    /**
     * EXAMPLE MODULE
     *
     * description of the default module
     */


    /**
     * CONSTRUCTOR
     * initialises the object
     */
    class BadgerModal {
        constructor(el, options) {
            this.el = el;

            const defaults = {
                nameSpace: 'badger-modal',
                get activeClass() { return  `${this.nameSpace}--active` }
            };

            // Merging options with defaults
            this.settings = Object.assign({}, defaults, options);

            this.init();
        }

        init() {
            this.addListeners();

            console.log(this.settings.activeClass );
        }

        addListeners() { }

        _privateMethod() { }
    }

    new BadgerModal();

}());
