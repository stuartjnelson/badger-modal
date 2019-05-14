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

                escClose: true,
                clickOffModalClose: true,
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
        }

        // @TODO:
        // https://developer.paciellogroup.com/blog/2018/06/the-current-state-of-modal-dialog-accessibility/
        // ** General **
        // Aside from open, closing, toggling and modal state, whatother methods would you use?
        // How would you expect a modal to be positioned by default?
        // How would you want to position your modal? * Adding class to modal * Custom CSS * Other

        // ** JS **
        // When open move focus to the modal itself
        // Disable being able to `tab` to any content that isnt the modal when it is open
        // Move focus after closing modal to element that opened it. If this isn't
        // possible then move focus to somewhere logical...

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

            this.modalEl.setAttribute("tabIndex", "-1");

            // Make container active
            this.containerEl.classList.add(this.settings.containerActiveClass);

            // Add class to modal
            this.modalEl.classList.add(this.settings.activeClass);

            this.modalEl.focus();
        }

        closeModal() {
            // Update modals state
            this.state = false;

            // Set container to be visible
            this._toggleContainer(false);

            this.modalEl.setAttribute("tabIndex", "0");

            this.containerEl.classList.remove(this.settings.containerActiveClass);

            // Add class to modal
            this.modalEl.classList.remove(this.settings.activeClass);

            // Move focus to trigger element
        }

        // get getModalStatus() {
        getModalStatus() {
            return this.state;
        }
    }

    const modal = new BadgerModal('.js-badger-modal');

    // setTimeout(() => {
    //     modal.openModal();

    //     console.log( modal.getModalStatus() );
    // }, 3000);

}());
