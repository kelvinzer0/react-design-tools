const scrollY = localStorage.getItem('scrollY');
const bodyHeight = localStorage.getItem('bodyHeight');

if (scrollY) {
    window.scrollTo(0, parseInt(scrollY));
}

if (bodyHeight) {
    window.scroll(0, parseInt(scrollY));
}

window.addEventListener('scroll', () => {
    localStorage.setItem('scrollY', window.scrollY.toString());
});

// Fungsi untuk drag and drop
document.addEventListener('DOMContentLoaded', function() {
    const sortableContainer = document.querySelector('.sortable');
    let draggedItem = null;
    let placeholder = null;

    // Membuat placeholder
    function createPlaceholder() {
        const ph = document.createElement('div');
        ph.className = 'drag-n-drop-placeholder';
        ph.style.height = '50px'; // Sesuaikan dengan kebutuhan
        ph.style.margin = '10px 0';
        return ph;
    }

    // Event listeners untuk drag and drop
    document.querySelectorAll('section[visual-editor]').forEach(item => {
        item.setAttribute('draggable', 'true');
        
        item.addEventListener('dragstart', function(e) {
            draggedItem = this;
            placeholder = createPlaceholder();
            
            setTimeout(() => {
                this.style.opacity = '0.25';
            }, 0);
            
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.getAttribute('visual-editor'));
        });

        item.addEventListener('dragend', function() {
            this.style.opacity = '1';
            
            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
            
            // Kirim event sorted setelah drag selesai
            const newOrder = [];
            document.querySelectorAll('section[visual-editor]').forEach(el => {
                newOrder.push(el.getAttribute('visual-editor'));
            });
            
            window.top.postMessage({
                event: 'sorted',
                newOrder
            }, '*');
        });

        item.addEventListener('dragover', function(e) {
            e.preventDefault();
            return false;
        });

        item.addEventListener('dragenter', function(e) {
            e.preventDefault();
            this.style.border = '2px dashed #ccc';
        });

        item.addEventListener('dragleave', function() {
            this.style.border = '2px solid transparent';
        });

        item.addEventListener('drop', function(e) {
            e.preventDefault();
            
            if (draggedItem !== this) {
                // Cari posisi untuk menempatkan item
                const allItems = Array.from(sortableContainer.querySelectorAll('section[visual-editor]'));
                const thisIndex = allItems.indexOf(this);
                const draggedIndex = allItems.indexOf(draggedItem);
                
                if (draggedIndex < thisIndex) {
                    this.parentNode.insertBefore(draggedItem, this.nextSibling);
                } else {
                    this.parentNode.insertBefore(draggedItem, this);
                }
            }
            
            this.style.border = '2px solid transparent';
            return false;
        });
    });

    // Mencegah default behavior pada link
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });

    // Event click untuk section
    document.querySelectorAll('section[visual-editor]').forEach(el => {
        el.addEventListener('click', () => {
            window.top.postMessage({
                event: 'click',
                blockId: el.getAttribute('visual-editor')
            }, '*');
        });
    });

    // Handle drop pada container
    sortableContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        
        // Cari elemen yang paling dekat dengan pointer
        const afterElement = getDragAfterElement(sortableContainer, e.clientY);
        const draggable = document.querySelector('.dragging');
        
        if (!placeholder) {
            placeholder = createPlaceholder();
        }
        
        if (afterElement == null) {
            sortableContainer.appendChild(placeholder);
        } else {
            sortableContainer.insertBefore(placeholder, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('section[visual-editor]:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
