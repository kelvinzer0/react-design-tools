// Restore scroll position after reload
const scrollY = localStorage.getItem('scrollY');
if (scrollY) {
    window.scrollTo(0, parseInt(scrollY));
}
window.addEventListener('scroll', () => {
    localStorage.setItem('scrollY', window.scrollY.toString());
});

document.addEventListener('DOMContentLoaded', function() {
    const sortableOptions = {
        group: 'shared', // Allow dragging between different lists
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function (evt) {
            const itemEl = evt.item; // The dragged element
            const toContainer = evt.to;   // The list the item was dropped into
            
            const blockUuid = itemEl.getAttribute('visual-editor');
            const newIndex = evt.newIndex;

            const parentSection = toContainer.closest('section[visual-editor]');
            const targetParentUuid = parentSection ? parentSection.getAttribute('visual-editor') : null;

            window.top.postMessage({
                event: 'MOVE_BLOCK',
                payload: {
                    blockUuid: blockUuid,
                    targetParentUuid: targetParentUuid,
                    newIndex: newIndex,
                }
            }, '*');
        }
    };

    // Initialize the main container
    const mainContainer = document.querySelector('.sortable');
    Sortable.create(mainContainer, sortableOptions);

    // Initialize all nested content areas
    document.querySelectorAll('.content-area').forEach(area => {
        Sortable.create(area, sortableOptions);
    });

    // Add click listeners to all sections
    document.querySelectorAll('section[visual-editor]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling to parent sortable containers
            window.top.postMessage({
                event: 'click',
                blockId: el.getAttribute('visual-editor')
            }, '*');
        });
    });

    // Prevent default behavior on links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
});
