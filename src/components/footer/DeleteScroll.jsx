
export const DeleteScroll = (isOpen) => {

    document.body.style.overflow = isOpen ? 'hidden' : 'scroll';
    console.log(document.body.style.overflow, 'styles body', isOpen);

}