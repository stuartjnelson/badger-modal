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
                new Error(`Modal element ${modalEl} element cannot be found`)
            );
        }

        const defaults = {
            nameSpace: "badger-modal",
            get modalClass() {
                return `.js-${this.nameSpace}`;
            },
            get activeClass() {
                return `${this.nameSpace}--active`;
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

        this.body = document.body;

        this.triggers = (this.settings.triggerClass !== undefined ? Array.from(document.querySelectorAll(this.settings.triggerClass)) : undefined);

        this.state = this.settings.openOnLoad || false;

        this.currentModalTrigger = null;

        // Seleting all child nodes of body that are not modal
        this.noneModalNodes = document.querySelectorAll(`body > *:not(${this.settings.modalClass})`);

        this.init();
    }

    init() {
        // Sets up ID, aria attrs
        // this.#setupAttributes();
        this._setupAttributes();

        this.addListeners();

        this._moveModalToBodyChild()

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
        // if (this.settings.clickOffModalClose) {
        //     this._closeModalWhenClickOutside();
        // }
    }

    _finishInitialization() {
        this.modalEl.classList.add(this.settings.initializedClass);
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

        // 1. Adding click listener to document
        document.addEventListener('click', (e) => {
            // 1. Getting trigger class without `.`
            const triggerClass = this.removeClassSelectorFromClass(this.settings.triggerClass);

            // 2. Checking if modal is open & click is not on modal trigger 
            if (this.state && !e.target.classList.contains( triggerClass )) {
                const isClickInside = this.modalEl.contains(e.target);

                // 3. If click the element that has been clicked is not the modal & not an alert
                if ( !isClickInside && this.modalEl.getAttribute('role') !== 'alertdialog') {
                    this.closeModal();
                }
            }
        }, false);
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


    _toggleNoneModelElementsInert(action = true) {
        Array.from(this.noneModalNodes).forEach(node => {
            const modalClass = this.removeClassSelectorFromClass(this.settings.modalClass);

            // Check for if not modal...
            if( !node.classList.contains(modalClass) ) {
                if ( node.hasAttribute('aria-hidden') ) {
                    node.setAttribute('data-keep-hidden', node.getAttribute('aria-hidden') );
                }
                node.setAttribute('aria-hidden', 'true');
            }

            if ( node.getAttribute('inert') ) {
                node.setAttribute('data-keep-inert', '');
            }
            else {
                node.setAttribute('inert', 'true');
            }
        });
    }


    // This moves modals to be the first child of `body`
    // This is needed so can make none-modal elements not focusable
    _moveModalToBodyChild() {
		const bodyFirstChild = this.body.firstElementChild || null;

		this.body.insertBefore( this.modalEl, bodyFirstChild );
	};


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

        // Preventing any none-modal elements from being able to receive focus
        this._toggleNoneModelElementsInert();

        // Setting up cycling of focus inside active modal
        this._setupFocusableListener();

        this.modalEl.setAttribute("tabIndex", "-1");

        // Add class to modal & body
        this.modalEl.classList.add(this.settings.activeClass);
        this.body.classList.add(this.settings.activeClass);

        // Adding eventListener to close modal when clicking outside modal
        if (this.settings.clickOffModalClose) {
            this._closeModalWhenClickOutside();
        }

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

        // Removing tabindex from modal
        this.modalEl.setAttribute("tabIndex", "0");

        // Remove class from modal
        this.modalEl.classList.remove(this.settings.activeClass);
        this.body.classList.remove(this.settings.activeClass);

        // Move focus to trigger element
        if(this.currentModalTrigger !== null) {
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

    removeClassSelectorFromClass(str) {
        return str.replace('.', '');
    }
}

// Export
export default BadgerModal;
