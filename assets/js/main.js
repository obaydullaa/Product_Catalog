/**
 * Projects Development Primer
 * 
 * 1. Have clear ideas about your projects.
 * 2. Get assets ready ( Design )
 * 3. Follow the flow ( reading story )
    - Putting input
    - Submit content
    - Adding item to the UI
    - Delete item
    - Remove item from the UI
    - Putting input on search box
    - show item based on search input

CRUD (Here of every Application)
---------------------------------------------

C - CREATE  -> ( storing date to remote source)
R - READ    -> ( data source - UI (visual))
U - UPDATE  -> ( modifying the existing resource)
D - DELETE  -> ( removing info )

* Single responsibility Principle

* * যদি কোন আইটেম ডায়নামিকলি এড হয়, এবং সেখানে যদি কোন  Eventlistener add করতে চাই তাহলে সেটা  (event delegation) হলো পুরো প্যারেন্ট কে listen করাবো এবং যদি কেউ ডিলেটে ক্লিক করে তাহলে একশন নিব। 

* * যখন কোন একটা আইটেম কে ইডিট অথবা আপডেট করব তখন একটা সিংগল আইটেম নিয়ে ডিল করতে হবে মানে আইডেনটিফাই করতে হবে। 

*/

(function() {
    const fromElm = document.querySelector('form');
    const nameInputElm = document.querySelector('.product-name');
    const priceInputElm = document.querySelector('.product-price');
    const listGroupElm = document.querySelector('.list-group');
    const filterElm = document.querySelector('#filter');

    // traking item
    let products = [];


    function showAllItemToUI(filterArr) {
        listGroupElm.innerHTML = '';
        filterArr.forEach(item => {
            // Generate id
            // const id = ;
            const listElm = `<li class="list-group-item item-${item.id} collection-item">
        <strong>${item.name}</strong>- <span class="price">$${item.price}</span>
        <i class="fa fa-trash delete-item float-right"></i></li>`;

            listGroupElm.insertAdjacentHTML("afterbegin", listElm);
        });
    }



    function revoveItemFromDataStore(id) {
        const productsAfterDelete = products.filter(product => product.id !== id);
        products = productsAfterDelete;

    }

    function removeItemFormUI(id) {
        document.querySelector(`.item-${id}`).remove();
    }

    function getItemID(elm) {
        const liElm = elm.parentElement;
        return Number(liElm.classList[1].split('-')[1]);
    }

    function resetInput() {
        nameInputElm.value = '';
        priceInputElm.value = '';
    }

    function addItemToUI(id, name, price) {
        // Generate id
        // const id = ;
        const listElm = `<li class="list-group-item item-${id} collection-item">
        <strong>${name}</strong>- <span class="price">$${price}</span>
        <i class="fa fa-trash delete-item float-right"></i></li>`
        listGroupElm.insertAdjacentHTML("afterbegin", listElm)
    }

    function validateInput(name, price) {

        let isError = false;
        if (!name || name.length < 5) {
            isError = true;
            // console.log('Invalid name input');
        };
        if (!price || Number(price) <= 0) {
            isError = true;
            // console.log('Invalid price input');
        }

        return isError;
    };

    function reciveInputs() {
        const nameInput = nameInputElm.value;
        const priceInput = priceInputElm.value;

        return {
            nameInput,
            priceInput,
        }
    }

    function init() {
        fromElm.addEventListener('submit', (evt) => {
            // prevent default action(borwser reloading) 
            evt.preventDefault();

            //receving input
            const { nameInput, priceInput } = reciveInputs();

            //validate input
            const isError = validateInput(nameInput, priceInput);
            if (isError) {
                alert('Please provide valid input');
                return;
            }

            //Add item to data store
            //generate item 
            const id = products.length;

            products.push({
                    id: id,
                    name: nameInput,
                    price: priceInput,
                })
                //Add item to the UI
            addItemToUI(id, nameInput, priceInput);

            console.log(products);
            //rest the input
            resetInput();

        });

        filterElm.addEventListener('keyup', (evt) => {
            //filter depend on this value
            const filterValue = evt.target.value;
            const filterArr = products.filter((product) => product.name.includes(filterValue));

            //show Item to UI
            showAllItemToUI(filterArr);
        });

        //Deletin item (event delegation)
        listGroupElm.addEventListener('click', evt => {
            if (evt.target.classList.contains('delete-item')) {

                const id = getItemID(evt.target);
                //delete item from UI
                removeItemFormUI(id);
                revoveItemFromDataStore(id);
                //delete item
            }
        });

    }

    init();
})()