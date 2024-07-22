document.addEventListener("DOMContentLoaded", function() {
    
        const apiUrl = 'http://localhost:3000/books';
        const userId = 1; 
        let currentBookId = null;
    
        
        const fetchBooks = async () => {
            try {
                const response = await fetch(apiUrl);
                const books = await response.json();
                const list = document.getElementById('list');
                list.innerHTML = ''; 
    
                books.forEach(book => {
                    const li = document.createElement('li');
                    li.textContent = book.title;
                    li.dataset.id = book.id;
                    li.addEventListener('click', () => showBookDetails(book));
                    list.appendChild(li);
                });
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
    
        
        const showBookDetails = (book) => {
            currentBookId = book.id;
            document.getElementById('thumbnail').src = book.img_url;
            document.getElementById('title').textContent = book.title;
            document.getElementById('description').textContent = book.description;
            const likesList = document.getElementById('likes-list');
            likesList.innerHTML = '';
    
            book.users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.username;
                likesList.appendChild(li);
            });
    
            const likeButton = document.getElementById('like-button');
            const isLiked = book.users.some(user => user.id === userId);
            likeButton.textContent = isLiked ? 'UNLIKE' : 'LIKE';
            likeButton.removeEventListener('click', handleLikeClick); 
            likeButton.addEventListener('click', handleLikeClick);
    
            document.getElementById('show-panel').style.display = 'block';
        };
    
        
        const handleLikeClick = async () => {
            try {
                const response = await fetch(`${apiUrl}/${currentBookId}`);
                const book = await response.json();
                const isLiked = book.users.some(user => user.id === userId);
                const updatedUsers = isLiked
                    ? book.users.filter(user => user.id !== userId)
                    : [...book.users, { id: userId, username: 'pouros' }]; 
    
                await fetch(`${apiUrl}/${currentBookId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ users: updatedUsers }),
                });
    
                if (isLiked) {
                    
                    const userLi = [...document.querySelectorAll('#likes-list li')]
                        .find(li => li.textContent === 'pouros'); 
                    if (userLi) userLi.remove();
                    document.getElementById('like-button').textContent = 'LIKE';
                } else {
                    
                    const li = document.createElement('li');
                    li.textContent = 'pouros'; 
                    document.getElementById('likes-list').appendChild(li);
                    document.getElementById('like-button').textContent = 'UNLIKE';
                }
            } catch (error) {
                console.error('Error updating book:', error);
            }
        };
    
        fetchBooks();
    });
    
