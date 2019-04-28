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
        const modalEl =
            typeof el === "string" ? document.querySelector(el) : el;

        // If el is not defined
        if (modalEl === null) {
            console.log(
                new Error(`Modal container ${modalEl} element cannot be found`)
            );
        }

        const defaults = {
            nameSpace: "badger-modal",
            get activeClass() {
                return `${this.nameSpace}--active`;
            },

            get containerClass() {
                return `${this.nameSpace}-container`;
            },
            get containerSelector() {
                return `.js-${this.containerClass}`;
            },
            get containerActiveClass() {
                return `${this.containerClass}--active`;
            },
            get initalizedClass() {
                return `${this.nameSpace}--initalized`;
            },
            get triggerClass() {
                return `.js-${this.nameSpace}-trigger`;
            },

            openOnLoad: false
        };

        // Merging options with defaults
        this.settings = Object.assign({}, defaults, options);

        // Setting up data
        this.modalEl = modalEl;
        this.containerId = this.modalEl.getAttribute("id");
        this.containerEl =
            this.settings.containerSelector !== undefined
                ? document.querySelector(this.settings.containerSelector)
                : console.log(
                      new Error`your container element ${
                          this.settings.containerSelector
                      } cannont be found`()
                  );
        this.triggers =
            this.settings.triggerClass !== undefined
                ? Array.from(
                      document.querySelectorAll(this.settings.triggerClass)
                  )
                : undefined;
        this.state = this.settings.openOnLoad || false;

        this.init();
    }

    init() {
        // Sets up ID, aria attrs
        // this.#setupAttributes();
        this._setupAttributes();

        this.addListeners();

        this._finishInitialization();
    }

    // #setupAttributes() {
    _setupAttributes() {
        this.modalEl.setAttribute("aria-modal", true);
        this.modalEl.setAttribute("role", "dialog");

        // @REVIEW: aria-labelledby needs to be in here as fallback...
    }

    addListeners() {
        // on click of trigger
        this.triggers.forEach(trigger => {
            trigger.addEventListener("click", e => {
                e.preventDefault();

                const triggerElement = trigger.nodeName;
                const modalSelector = (triggerElement === 'A' ? trigger.getAttribute("href") : trigger.getAttribute("data-badger-modal-id"));


                this.toggleModal(modalSelector);
            });
        });
    }

    _finishInitialization() {
        this.modalEl.classList.add(this.settings.initalizedClass);
    }

    _toggleContainer(toggle = true) {
        if (toggle) {
            this.containerEl.classList.add(this.settings.containerActiveClass);
        } else {
            this.containerEl.classList.remove(
                this.settings.containerActiveClass
            );
        }
    }

    _checkIfBadgerModal(selector) {
        const modal = document.querySelector(selector);

        return (
            (modal !== null &&
                modal.classList.contains(this.settings.initalizedClass)) ||
            false
        );
    }

    // @TODO:
    // ** General **
    // How would you like your modal position?
    // Aside from

    // ** JS **
    // Move focus after closing modal
    // Moving focus on open to next focusable element inside modal
    // When tabbing inside modal then moving focus from last focusable element to next focusable element

    toggleModal(modalSelector) {
        // debugger;

        if (this._checkIfBadgerModal(modalSelector)) {
            if (this.state) {
                this.closeModal(modalSelector);
            } else {
                this.openModal(modalSelector);
            }
        }
    }

    openModal() {
        // Update modals state
        this.state = true;

        // Set container to be visible
        this._toggleContainer();

        // Make container active
        this.containerEl.classList.add(this.settings.containerActiveClass);

        // Add class to modal
        this.modalEl.classList.add(this.settings.activeClass);
    }

    closeModal() {
        // Update modals state
        this.state = false;

        // Set container to be visible
        this._toggleContainer(false);

        this.containerEl.classList.remove(this.settings.containerActiveClass);

        // Add class to modal
        this.modalEl.classList.remove(this.settings.activeClass);
    }

    get getModalStatus() {
        return this.state;
    }
}

// Export
export default BadgerModal;
