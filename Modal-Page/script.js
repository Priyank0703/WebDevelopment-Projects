const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const openmodal = () => {
    console.log('modal is open now.')
    modal.classList.add('active');
    overlay.classList.add('overlayActive');
}


const closemodal = () => {
    console.log('modal is closed');
    modal.classList.remove('active');
    overlay.classList.remove('overlayActive');
}


