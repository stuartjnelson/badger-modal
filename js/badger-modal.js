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
            get initializedClass() {
                return `${this.nameSpace}--initialized`;
            },
            get triggerClass() {
                return `.js-${this.nameSpace}-trigger`;
            },
            get firstFocusElClass() {
                return `js-${this.nameSpace}-first-focusable`;
            },
            get lastFocusElClass() {
                return `js-${this.nameSpace}-last-focusable`;
            },
            
            escClose: true,
            clickOffModalClose: true,
            openOnLoad: false,
            onOpenFocusOnElement: '',
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

        this.currentModalTrigger = null;

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
        this.modalEl.setAttribute("tabIndex", "0");

        // @REVIEW: aria-labelledby needs to be in here as fallback...
    }

    addListeners() {
        // on click of trigger
        this.triggers.forEach(trigger => {
            trigger.addEventListener("click", e => {
                e.preventDefault();

                const triggerElement = trigger.nodeName;
                const modalSelector =
                    triggerElement === "A"
                        ? trigger.getAttribute("href")
                        : trigger.getAttribute("data-badger-modal-id");

                this.toggleModal(modalSelector);
            });
        });

        // Adding eventListener to close modal when using esc key
        if (this.settings.escClose) {
            this._closeModalWithEscapeKey();
        }

        // Adding eventListener to close modal when clicking outside modal
        if (this.settings.clickOffModalClose) {
            this._closeModalWhenClickOutside();
        }
    }

    _finishInitialization() {
        this.modalEl.classList.add(this.settings.initializedClass);
    }

    _toggleContainer(toggle = true) {
        if (toggle) {
            this.containerEl.classList.add(this.settings.containerActiveClass);
        } else {
            this.containerEl.classList.remove(this.settings.containerActiveClass);
        }
    }

    _checkIfBadgerModal(selector) {
        const modal = document.querySelector(selector);

        return (
            (modal !== null &&
                modal.classList.contains(this.settings.initializedClass)) ||
            false
        );
    }

    _closeModalWithEscapeKey() {
        document.onkeydown = evt => {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
                this.closeModal();
            }
        };
    }

    _closeModalWhenClickOutside() {
        // https://gomakethings.com/checking-event-target-selectors-with-event-bubbling-in-vanilla-javascript/
        // @TODO: Review if should be using event bubbling here and in other places...

        // 1. Adding click listener to modal container
        this.containerEl.addEventListener('click', (event) => {
            // 2. Checking if the element that has been clicked is the modal container
            if (event.target.classList.contains(this.settings.containerActiveClass)) {
                // 3. If it is the modal container then close the modal 
                this.closeModal();
            }
        });
    }

    _setupFocusableListener() {
        // 1. Adding keydown listener
        document.addEventListener('keydown', (event) => {
            // 2. If key being used is the tab key then first method
            if(event.keyCode === 9) {
                this._keepFocusInsideModal(event);
            }
        });
    }

    _removeFocusableListener() {
        document.removeEventListener('keydown', this._setupFocusableListener());
    }

    _keepFocusInsideModal(event) {
        // 1. Getting all focusable elements from inside modal
        // https://github.com/scottaohara/accessible_modal_window/blob/master/index.js
        const focusable = this.modalEl.querySelectorAll(
            'button:not([hidden]):not([disabled]), [href]:not([hidden]), input:not([hidden]):not([type="hidden"]):not([disabled]), select:not([hidden]):not([disabled]), textarea:not([hidden]):not([disabled]), [tabindex="0"]:not([hidden]):not([disabled]), summary:not([hidden]), [contenteditable]:not([hidden]), audio[controls]:not([hidden]), video[controls]:not([hidden])'
        );
        
        // 2. Adding class to first and last focusable element inside the active modal
        // @TODO: Check here that modal is active?
        // @TODO: Should these selectors be removed when closing...
        const firstFocusable = focusable[0];
        firstFocusable.classList.add(this.settings.firstFocusElClass);

        const lastFocusable = focusable[focusable.length - 1];
        lastFocusable.classList.add(this.settings.lastFocusElClass);


        // 3. Checking if activeElement is the last focusable element.
        //    If it is and shift key is not being used (not cycling reverse tab order)
        //    then focus on the first focusable element inside active modal. 
        if ( document.activeElement.classList.contains(this.settings.lastFocusElClass) ) {
            if ( event.keyCode === 9 && !event.shiftKey ) {
                event.preventDefault();
                firstFocusable.focus();
            }
        }

        // 4. Checking if activeElement is the first focusable element.
        //    If it is and shift key is being used (cycling reverse tab order)
        //    then focus on the last focusable element inside active modal.
        if ( document.activeElement.classList.contains(this.settings.firstFocusElClass) ) {
            if ( event.keyCode === 9 && event.shiftKey ) {
                event.preventDefault();
                lastFocusable.focus();
            }
        }
    }


    toggleModal(modalSelector) {
        if (this._checkIfBadgerModal(modalSelector)) {
            if (this.state) {
                this.closeModal(modalSelector);
            } else {
                this.currentModalTrigger = modalSelector;

                this.openModal(modalSelector);
            }
        }
    }

    openModal() {
        // Update modals state
        this.state = true;

        // Setting up cycling of focus inside active modal
        this._setupFocusableListener();

        // Set container to be visible
        this._toggleContainer();

        this.modalEl.setAttribute("tabIndex", "-1");

        // Add class to modal
        this.modalEl.classList.add(this.settings.activeClass);

        // Moving focus to the modal
        if (this.settings.onOpenFocusOnElement.length) {
            const focusEl = this.modalEl.querySelector(this.settings.onOpenFocusOnElement);
            
            // Checking `focusEl` exists
            if(focusEl !== null) {
                focusEl.focus();
            } else {
                this.modalEl.focus();    
            }
        } else {
            this.modalEl.focus();
        }
    }

    closeModal() {
        // Update modals state
        this.state = false;

        // Removing keydown event listener
        this._removeFocusableListener();

        // Hiding container
        this._toggleContainer(false);

        // Removing tabindex from modal
        this.modalEl.setAttribute("tabIndex", "0");

        // Remove class from modal
        this.modalEl.classList.remove(this.settings.activeClass);

        // Move focus to trigger element
        if(this.currentModalTrigger !== null) {
            // debugger;
            // Move focus to trigger
            document.querySelector('.js-badger-modal-trigger').focus();

            // Resetting currentModalTrigger
            this.currentModalTrigger = null
        } else {
            const body = document.body;

            body.tabIndex = -1;

            // Move focus to body
            body.focus();
        }
    }

    // get getModalStatus() {
    getModalStatus() {
        return this.state;
    }
}

// Export
export default BadgerModal;
