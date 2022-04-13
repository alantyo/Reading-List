const books= [];
const RENDER_EVENT = "render-event";
const STORAGE_KEY = "storage-key";

document.addEventListener("DOMContentLoaded", function () {
 
    const bookSubmit = document.getElementById("book-form");
 
    bookSubmit.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
        bookSubmit.reset();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
    
    if(books.length != 0){
        const searchBooks = document.getElementById("btn-search");
        searchBooks.addEventListener("click",function(){
            const bookToSearch = document.getElementById("search");
            if (bookToSearch && bookToSearch.value){
                searchBook(bookToSearch.value);
            } else {
                document.dispatchEvent(new Event(RENDER_EVENT));
            }
            
        })
        
        const searchBar = document.getElementById("search");
        searchBar.addEventListener("keyup",function(event){
            if(event.key=="Enter"){
                const bookToSearch = document.getElementById("search");
                if (bookToSearch && bookToSearch.value){
                    searchBook(bookToSearch.value);
                } else {
                    document.dispatchEvent(new Event(RENDER_EVENT));
                }
            }
        })
    }
});

function addBook() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const read = document.getElementById("read").checked;

    const generatedId = generateId();
    const bookObject = generateBook(generatedId, title, author, year, read)
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBook(id, title, author, year, isComplete){
    return {
        id,
        title,
        author,
        year,
        isComplete,
    }
}

document.addEventListener(RENDER_EVENT,function(){
    const bookList = document.getElementById("reading-list");
    bookList.innerHTML = "";

    const completedBook = document.getElementById("complete-list");
    completedBook.innerHTML = "";

    for(bookItem of books){
        const book = bookElement(bookItem);
        if(bookItem.isComplete == false)
            bookList.append(book);
        else
            completedBook.append(book);
    }
})

function bookElement(bookObject){
    const texttitle = document.createElement("h3");
    texttitle.innerText = bookObject.title;

    const textauthor = document.createElement("h4");
    textauthor.innerText = `Author : ${bookObject.author}`;

    const textyear = document.createElement("h4");
    textyear.innerText = `Tahun : ${bookObject.year}`;

    const readStatus = document.createElement("div");
    readStatus.classList.add("status");
    readStatus.innerText = bookObject.isComplete;

    const text = document.createElement("div");
    text.classList.add("book-text")
    text.append(texttitle, textauthor, textyear);


    const list = document.createElement("div");
    list.classList.add("book-item")
    list.setAttribute("id",`book-${bookObject.id}`);
    list.append(text);

    const remove = document.createElement("button");
    remove.classList.add("btn-remove");
    remove.innerText = "Delete";
    remove.addEventListener("click",function(){
        if(confirm("Are you sure want to delete this book?")){
            removeBook(bookObject.id)
        }
    })

    if(bookObject.isComplete == false){
        const done = document.createElement("button");
        done.classList.add("btn-status");
        done.innerText = "Mark as done";
        done.addEventListener("click",function(){
            addCompleted(bookObject.id);
        })

        const button = document.createElement("div");
        button.classList.add("button-collection")
        button.append(done,remove)

        list.append(button);
    } else{
        const undone = document.createElement("button");
        undone.classList.add("btn-status");
        undone.innerText = "Mark as unread";
        undone.addEventListener("click",function(){
            addUnCompleted(bookObject.id);
        })

        const button = document.createElement("div");
        button.classList.add("button-collection")
        button.append(undone,remove)

        list.append(button);
    }

    return list;
}

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert("Browser tidak support storage");
        return false;
    }
    return true;
}

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
   
    let data = JSON.parse(serializedData);
   
    if(data !== null){
        for(item of data){
            books.push(item);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData(){
    if(isStorageExist()){
        const saved = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY,saved)
    }
}

function findBook(bookId){
    for(bookItem of books){
        if(bookItem.id === bookId){
            return bookItem
        }
    }
    return null
}

function findBookIndex(bookId){
    for(index in books){
        if(books[index].id === bookId){
            return index;
        }
    }
    return -1;
}

function addCompleted(bookId){
    const targetBook = findBook(bookId);
    if (targetBook == null) return;
    targetBook.isComplete = true;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addUnCompleted(bookId){
    const targetBook = findBook(bookId);
    if (targetBook == null) return;
    targetBook.isComplete = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId){
    const targetBook = findBookIndex(bookId);
    if (targetBook == -1) return;
    books.splice(targetBook,1)

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function searchBook(book){
    const temp = []
    const targetBook = books.filter(el => el.title.toLowerCase().includes(book.toLowerCase()));
    if (targetBook.length != 0){
        for (let i=0;i<targetBook.length;i++){
            temp.push(targetBook[i]);
        }
    }

    const bookList = document.getElementById("reading-list");
    bookList.innerHTML = "";

    const completedBook = document.getElementById("complete-list");
    completedBook.innerHTML = "";

    for(bookItem of temp){
        const book = bookElement(bookItem);
        if(bookItem.isComplete == false)
            bookList.append(book);
        else
            completedBook.append(book);
    }
}