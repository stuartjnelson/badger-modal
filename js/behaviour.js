import BadgerModal from './badger-modal';
import '../scss/_badger-modal.scss';


// const modal = new BadgerModal(".js-badger-modal", {
//     // onOpenFocusOnElement: '.js-focus-first'
// });


const modals = document.querySelectorAll(".js-badger-modal");

modals.forEach(modal => {
    new BadgerModal(modal);
});

// setTimeout(() => {
//     modal.openModal();
// }, 1000);

// setTimeout(() => {
//     modal.closeModal();
// }, 2000);

