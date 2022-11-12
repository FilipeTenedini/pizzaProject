// cloneNode(true)   => pega não só o item (a div) mas tudo que tiver dentro dele
// append   => vai adicionar um conteúdo, a diferença dele pro innerHTML é que o inner substitui enquanto ele irá acrescentear outro conteúdo.
// eventListener
// preventDefault
// closest('.classeCitada') => ache o ítem mais próximo que tem a classe que eu citei

let cart = []
let modalQt = 1;
let modalKey = '';

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);


// listagem das pizzas

pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index); //Atribuindo ao pizza-item este atributo 'data-key' com o índice do ítem dentro da lista/pizzaJson
        
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault(); // cancela a ação natural do link/botão
        modalQt = 1;
        
        let key = e.target.closest('.pizza-item').getAttribute('data-key');        
        modalKey = key

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;     
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if (sizeIndex == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        }); 
        
        c('.pizzaInfo--qt').innerHTML = modalQt;

        // parte do script para o modal em si abrir
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 5);
    })

    c('.pizza-area').append( pizzaItem );

}); 



// eventos do modal

function closeModal () {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none'
    }, 500)
}

// fechar o modal
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal)
});

// diminui quantidade de pizza
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt; //TO EM 4:40.;
    }

});

// add quantidade de pizza
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

// muda tamanho da pizza selecionado
cs('.pizzaInfo--size').forEach((item)=>{
    item.addEventListener('click', ()=>{
        c('.pizzaInfo--size.selected').classList.remove('selected')
        item.classList.add('selected')
    });
});

// add ao carrinho

c('.pizzaInfo--addButton').addEventListener('click', () => {
    //     Qual a pizza?
        //modalKey
    //     Qual o tamanho?
    let tamanho = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))
    //     Qual a quantidade?
        //modalQt;
    //     Criando identificador
    let identifier = pizzaJson[modalKey].id+'@'+tamanho;

    let position = cart.findIndex((item) => item.identifier == identifier);

    
    if (position > -1){
        cart[position].qt += modalQt
    }else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            tamanho,
            qt: modalQt
        })
    }
    updateCart();
    closeModal();
});


c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = '0px'
    }
});

c('.menu-closer').addEventListener('click', () => {
        c('aside').style.left = '100vw'
});

function updateCart() {

    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            let cartItem = c('.models .cart--item').cloneNode(true);

            subtotal += pizzaItem.price * cart[i].qt;

            let pizzaSizeName = '';            
            switch(cart[i].tamanho){
                case 0:
                    pizzaSizeName = 'P'
                    break
                case 1:
                    pizzaSizeName = 'M'
                    break
                case 2:
                default:
                    pizzaSizeName = 'G'
            }
            let pizzaName = `${pizzaItem.name} ( ${pizzaSizeName} )`
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(cart[i], 1)
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });
            c('.cart').append(cartItem);

        };
        
    desconto = subtotal * 0.1;
    total = subtotal - desconto;
    
    c('.subtotal span:last-child').innerHTML = subtotal.toFixed(2);
    c('.desconto span:last-child').innerHTML = desconto.toFixed(2);
    c('.total span:last-child').innerHTML = total.toFixed(2);
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
};