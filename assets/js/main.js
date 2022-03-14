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
/**
//memory (temporary)
// database
// localStorage, sessionStorage


 */
;
(function() {
    const fromElm = document.querySelector('form');
    const nameInputElm = document.querySelector('.product-name');
    const priceInputElm = document.querySelector('.product-price');
    const listGroupElm = document.querySelector('.list-group');
    const filterElm = document.querySelector('#filter');
    const addProductElm = document.querySelector('.add-product');

    // traking item
    let products = [];


    function showAllItemsToUI(items) {
        listGroupElm.innerHTML = '';
        items.forEach(item => {
            // Generate id
            // const id = ;
            const listElm = `<li class="list-group-item item-${item.id} collection-item">
        <strong>${item.name}</strong>- <span class="price">$${item.price}</span>
        <i class="fa fa-trash delete-item float-right"></i>
        <i class="fa fa-pencil-alt edit-item float-right"></i>
        </li>`


            listGroupElm.insertAdjacentHTML("afterbegin", listElm);
        });
    }

    function updateAfterRemove(products, id) {
        return products.filter(product => product.id !== id);
    }

    function revoveItemFromDataStore(id) {
        const productsAfterDelete = updateAfterRemove(products, id);
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
        const listElm = `<li class="list-group-item item-${id} collection-item">
        <strong>${name}</strong>- <span class="price">$${price}</span>
        <i class="fa fa-trash delete-item float-right"></i>
        <i class="fa fa-pencil-alt edit-item float-right"></i>
        </li>`
        listGroupElm.insertAdjacentHTML("afterbegin", listElm)
    }

    function validateInput(name, price) {

        let isError = false;
        if (!name || name.length < 5) {
            isError = true;
            // console.log('Invalid name input');
        };
        if (!price || isNaN(price) || Number(price) <= 0) {
            isError = true;
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

    function addItemToStorage(product) {
        let products;
        if (localStorage.getItem('storeProducts')) {
            products = JSON.parse(localStorage.getItem('storeProducts'));

            products.push(product);
            //update to localStorage
            localStorage.setItem('storeProducts', JSON.stringify(products));
        } else {
            products = [];
            products.push(product);
            //update to localStor
            localStorage.setItem('storeProducts', JSON.stringify(products));
        }
    }

    function removeProductFromStorage(id) {
        //pick from localStorage
        const productsAterRemove = JSON.parse(localStorage.getItem('storeProducts'));
        // filter
        const produtsAfterRemove = updateAfterRemove(products, id);
        //save data to local storage
        localStorage.setItem('storeProducts', JSON.stringify(produtsAfterRemove));
    }

    function populateUIInEditState(product) {
        nameInputElm.value = product.name;
        priceInputElm.value = product.price;
    }

    function showUpdatBtn() {
        const elm = `<button type="button" class="btn mt-3 btn-block btn-secondary update-product">Update</button>`
            //hide submit btn
        addProductElm.style.display = 'none';
        fromElm.insertAdjacentHTML('beforeend', elm);
    }

    function updateProductsToStorage() {
        if (localStorage.getItem('storeProducts')) {
            localStorage.setItem('storeProducts', JSON.stringify(products))
        }
    }

    function init() {
        let updatedItemId;
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

            //generate item 
            const id = products.length;
            const product = {
                    id: id,
                    name: nameInput,
                    price: priceInput,
                }
                //Add item to data store
            products.push(product);
            //Add item to the UI
            addItemToUI(id, nameInput, priceInput);
            // Add item to localstorage

            addItemToStorage(product);
            //rest the input
            resetInput();

        });

        filterElm.addEventListener('keyup', (evt) => {
            //filter depend on this value
            const filterValue = evt.target.value;
            const filterArr = products.filter((product) => product.name.includes(filterValue));

            //show Item to UI
            showAllItemsToUI(filterArr);
        });

        //Deletin item (event delegation)
        listGroupElm.addEventListener('click', evt => {
            if (evt.target.classList.contains('delete-item')) {

                const id = getItemID(evt.target);
                //delete item from UI
                removeItemFormUI(id);
                //delete item from data stores
                revoveItemFromDataStore(id);
                // delete item from storage
                removeProductFromStorage(id);
            } else if (evt.target.classList.contains('edit-item')) {
                //Pick the item id
                updatedItemId = getItemID(evt.target);
                //find the item 
                const foundProduct = products.find(product => product.id === updatedItemId);
                console.log(foundProduct);

                //populate the item data to UI
                populateUIInEditState(foundProduct);
                //show updated button
                if (!document.querySelector('.update-product')) {
                    showUpdatBtn()
                }
                //updating the data(from user)
                //updated data should be updated to data store
                //updated data should be updated to UI
                //updated data should be updated to LocalStorage
            }
        });

        fromElm.addEventListener('click', (evt) => {
            if (evt.target.classList.contains('update-product')) {
                //pick the data from the field
                const { nameInput, priceInput } = reciveInputs();
                //validat the input
                const isError = validateInput(nameInput, priceInput);

                if (isError) {
                    alert('Please provide valid input update-product');
                    return;
                }
                //updated data should be updated to data store
                products = products.map((product) => {
                        if (product.id === updatedItemId) {
                            // item should be updated
                            return {
                                id: product.id,
                                name: nameInput,
                                price: priceInput
                            }
                        } else {
                            //No update
                            return product;
                        }
                    })
                    //reset input
                resetInput()
                    //show submit button
                addProductElm.style.display = 'block';
                //hide update button

                //updated data should be updated to UI 
                showAllItemsToUI(products);
                document.querySelector('.update-product').remove();
                //updated data should be updated to LocalStorage
                updateProductsToStorage()
            }
        })

        document.addEventListener('DOMContentLoaded', e => {
            //checking item into localStorage
            if (localStorage.getItem('storeProducts')) {
                products = JSON.parse(localStorage.getItem('storeProducts'))

                //Show items to UI
                showAllItemsToUI(products);
                //populate tmporary data store
            }
        })
    }



    init();

})()

//LocalStorage => All premitive type data store hoi.

// const data = 30;

// localStorage.setItem('Key', data);
// console.log(localStorage.setItem('Key'));


//Complex Data type

// const data = [{
//     name: 'obydul',
// }, {
//     neme: 'islam',
// }]

// localStorage.setItem('valu', JSON.stringify(data));
// console.log(JSON.parse(localStorage.setItem('valu')));
// console.log(JSON.parse(localStorage.setItem('valu')));