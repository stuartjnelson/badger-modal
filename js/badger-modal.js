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
            activeClass: '-item-active',
        };

        // Merging options with defaults
        this.settings = Object.assign({}, defaults, options);

        this.init();
    }

    init() {
        this.addListeners();

        console.log('Testing using Rollup');
    }

    addListeners() { }

    _privateMethod() { }
}


// Export
export default BadgerModal;