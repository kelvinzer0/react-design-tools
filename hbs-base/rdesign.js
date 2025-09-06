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
        group: 'shared',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function (evt) {
            const itemEl = evt.item;
            const toContainer = evt.to;
            
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
    if (mainContainer) {
        Sortable.create(mainContainer, sortableOptions);
    }

    // Initialize all nested content areas
    document.querySelectorAll('.rcontent-area').forEach(area => {
        Sortable.create(area, sortableOptions);
    });

    // Add click listeners to all sections
    document.querySelectorAll('section[visual-editor]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
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

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

document.querySelectorAll(".rcontent-area").forEach(el => {
  const currentBg = window.getComputedStyle(el).backgroundColor.trim().toLowerCase();
  if (currentBg === "transparent" || currentBg === "rgba(0, 0, 0, 0)") {
    el.style.backgroundColor = getRandomColor();
  }
});
