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
        const containerEl =
            typeof el === "string" ? document.querySelector(el) : el;

        // If el is not defined
        if (containerEl === null) {
            console.log(
                new Error(
                    `Modal container ${containerEl} element cannot be found`
                )
            );
        }

        const defaults = {
            nameSpace: "badger-modal",
            get activeClass() {
                return `${this.nameSpace}--active`;
            },

            backgroundSelector: "body",
            get backgroundClass() {
                return `${this.nameSpace}-background`;
            },
            get backgroundActiveClass() {
                return `${this.backgroundClass}--active`;
            },
            get initalizedClass() {
                return `${this.nameSpace}--initalized`;
            },
            get triggerClass() {
                return `.js-${this.nameSpace}-trigger`;
            },

            openOnLoad: false,
        };

        // Merging options with defaults
        this.settings = Object.assign({}, defaults, options);

        // Setting up data
        this.container = containerEl;
        this.containerId = this.container.getAttribute("id");
        this.backgroundEl =
            this.settings.backgroundSelector !== undefined
                ? document.querySelector(
                      this.settings.backgroundSelector
                  )
                : console.log(
                      new Error`your background element ${
                          this.settings.backgroundSelector
                      } cannont be found`
                  );           
        this.triggers =
            this.settings.triggerClass !== undefined
                ? Array.from(
                      document.querySelectorAll(
                          this.settings.triggerClass
                      )
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
        this.container.setAttribute("aria-modal", true);
        this.container.setAttribute("role", "dialog");

        // @REVIEW: aria-labelledby needs to be in here as fallback...
    }

    addListeners() {
        // on click of trigger
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', e => {
                e.preventDefault();

                this.toggleModal();
            });
        });
    }

    _finishInitialization() {
        this.container.classList.add(this.settings.initalizedClass);
    }

    _toggleBackground(toggle = true) {
        if(toggle) {
            this.backgroundEl.classList.add(this.settings.backgroundActiveClass);
        } else {
            this.backgroundEl.classList.remove(
                this.settings.backgroundActiveClass
            );
        }
    }

    toggleModal() {
        if(this.state) {
            this.closeModal();
        } else {
            this.openModal();
        }
    }

    openModal() {
        // Update modals state
        this.state = true;

        // Set background to be visible
        this._toggleBackground();

        // Add class to modal
        this.container.classList.add(this.settings.activeClass);
    }

    closeModal() {
        // Update modals state
        this.state = false;

        // Set background to be visible
        this._toggleBackground(false);

        // Add class to modal
        this.container.classList.remove(
            this.settings.activeClass
        );
    }
}

// Export
export default BadgerModal;
