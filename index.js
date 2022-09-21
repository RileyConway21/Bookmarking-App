
        const body = document.body;
        const input = document.querySelector('input[type=text');
        const overlay = document.querySelector('.overlay');

        function showFloater() {
            body.classList.add('show-floater');
        }

        function closeFloater() {
            if (body.classList.contains('show-floater')) {
                body.classList.remove('show-floater');
            }
        }

        input.addEventListener('focusin', showFloater);
        // input.addEventListener('focusout', closeFloater);
        overlay.addEventListener('click', closeFloater);

        // =====================================================


        const bookmarksList = document.querySelector('.bookmarks-list');
        const bookmarkForm = document.querySelector('.bookmark-form');
        const bookmarkInput = bookmarkForm.querySelector('input[type=text]');
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        const apiUrl = 'https://opengraph.io/api/1.0/site';
        const appId = 'dd5458dc-bee4-4683-9cbc-0f6ec7ab8469';

        fillBookmarksList(bookmarks);

        function createBookmark(event) {
            event.preventDefault();

            if (!bookmarkInput.value) {
                alert('We need info!')
                return;
            }
            const url = encodeURIComponent(bookmarkInput.value);

            fetch(apiUrl + '/' + url + '?app_id=' + appId)
                .then(response => response.json())
                .then(data => {
                    const title = data.hybridGraph.title;
                    console.log(data)


                    const bookmark = {
                        title: data.hybridGraph.title,
                        image: data.hybridGraph.image,
                        link: data.hybridGraph.url

                    };
                    bookmarks.push(bookmark);
                    fillBookmarksList(bookmarks);
                    storeBookmarks(bookmarks);
                    bookmarkForm.reset();

                    console.table(bookmarks);
                })
                .catch(error => {
                    alert('There was a problem getting info!')
                } 
                )

        }
        
        function removeBookmark(e) {
            if (!e.target.matches('.glyphicon-remove')) return; 
                
                const index = e.target.parentNode.dataset.id;
                bookmarks.splice(index, 1);
                fillBookmarksList(bookmarks);
                storeBookmarks(bookmarks);

                console.dir(index)
            };
            
        
        function fillBookmarksList(bookmarks = []) {
            const bookmarksHtml = bookmarks.map((bookmark, i) => {
                return `
                <a href="${bookmark.link}" class="bookmark" data-id="${i}">
                    <div class="img" style="background-image:url('${bookmark.image}')"></div>
                    <div class="title">${bookmark.title}</div>
                    <span class="glyphicon glyphicon-remove"></span>
                </a>
                    `;
                }).join('');
                
                bookmarksList.innerHTML = bookmarksHtml;
                
            };

        function storeBookmarks(bookmarks = []) {
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
        }

        bookmarkForm.addEventListener('submit', createBookmark);
        bookmarksList.addEventListener('click', removeBookmark);
   