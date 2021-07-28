
    member=false;

    $(document).ready(function () {
        init_orders();
        user_view();
        
        
    })

    function checkout(){
        
    }
    function submit_form(){
        
        var price=$("#price").val()
        var member_price=$("#price_for_members").val()
        if (isNaN(price) || isNaN(member_price)){
            alert('please enter a valid price.')
            return;
        }
        var new_dish={
            "dish_id":dishesArr.length+1,
            "dish_name":$("#dish_name").val(),
            "dish_description":$("#dish_description").val(),
            "price":price,
            "price_for_members":member_price,
            "image":$("#image").val().replace("C:\\fakepath\\", ""),
            "category":$("#category").val(),
            "tags":$("#tags").val().split(/[ ,]+/) // split by comma or space
        }
        dishesArr.push(new_dish);
        // reload dishes 
        load_dishes_bootstrap();

       

    }

    function manager_view(){
        // manager can add/remove dishes from the menu
        // I'll not change the dishes.js array but only localy 
        
        add_ability_to_remove_from_menu();
        
        update_orders_cards();

    }

    function add_ability_to_remove_from_menu(){
        // this will display a button for all the dishes which removes the dish from the dishesArr
        load_dishes_bootstrap();
        console.log("switching to manager view")
        $(".manager_edit_ability").show();
    }

    function user_view()
    {
        init_cart();
        init_fav();
        load_dishes_bootstrap();

    }

    function load_dishes_bootstrap(){
        $(".main_div").empty();
        for (dish in dishesArr){
            let img_src=dishesArr[dish]["image"]; 
            let dish_name=dishesArr[dish]["dish_name"];
            let dish_description=dishesArr[dish]["dish_description"];
            let price=dishesArr[dish]["price"];
            if (member){
                price=dishesArr[dish]["price_for_members"];
            }
            let category=dishesArr[dish]["category"];
            let tags=dishesArr[dish]["tags"];
            tags_str=""
            for (tag in tags){ // adding tag bullets to the dish card
                tags_str+=`<span class="badge badge-pill badge-primary">${tags[tag]}</span>`
            }

            var fav_button=`
                <button type="button" onclick='fav_append_button(${JSON.stringify(dishesArr[dish])})' class="btn btn-outline-success">
                <i class="far fa-heart"></i>    </br>
                הוספה למועדפים 
                    
                </button>
            `
            for (item in fav){
                if (fav[item]["dish_name"] == dishesArr[dish]["dish_name"]){
                    fav_button=`
                    <button type="button" onclick='fav_prepend_button(${JSON.stringify(dishesArr[dish])})' class="btn btn-success">
                    <i class="fas fa-heart"></i>    </br>
                        הסר ממועדפים
                        
                    </button>
                    `
                }
            }
            // dynamically build dish to menu:
            str=`
            <div class="card mb-3 menu_dish" style="flex-direction: row;">
                <div class="row no-gutters">
                    <div class="col-4 card-buttons">
                        <div class="row no-gutters" style="height:33%">
                                    <button type="button" onclick='cart_append_button(${JSON.stringify(dishesArr[dish])})' class="btn btn-primary btn-lg">
                                    <i class="fas fa-cart-plus"></i>
                                    </button>
                                    <button type="button" onclick='cart_prepend_button(${JSON.stringify(dishesArr[dish])})' class="btn btn-secondary btn-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cart-dash-fill" viewBox="0 0 16 16">
                                                                         <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM6.5 7h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1z"/>
                                                                         </svg>
                                </button>
                        </div>
                        <div class="row no-gutters" style="height:15%; font-size:24px">
                        <div class="form-group">
                        <textarea class="form-control" id="order_comment" placeholder="הערה למנה" rows="1"></textarea>
                        </div>
                        
                        </div>
                        <div class="row no-gutters" style="height:15%; font-size:24px;">
                            ${price}₪
                        </div>
                        <div class="row no-gutters" style="height:33%">
                            ${fav_button}
                        </div>
                    </div>
                    <div class="col-5">
                    <div class="card-body">
                        <h4 class="card-title">${dish_name}</h4>
                        <h5 class="card-title text-secondary">${category}</h5>
                        <p class="card-text">${dish_description}</p>
                            ${tags_str}
                       
                    </div>
                    </div>
                    <div class="col-3">
                    <img src="${img_src}" class="card-img" alt="...">
                    </div>
                </div>
                <div class="row no-gutters manager_edit_ability"> 
                <button type="button" class="btn btn-danger" onclick='remove_from_menu(${JSON.stringify(dishesArr[dish])})' >remove from menu</button>
                </div>
            </div>
            `
            $(".main_div").append(str);
            $(".manager_edit_ability").hide(); // show only for managers...
            
        }
        // new dish form for managers
        str=`
        <div class="card mb-3 manager_edit_ability w-100 " >
                <div class="row no-gutters ">
                    <div class="card-body">
                        <form>
                            <div class="form-group w-100" id="myForm">
                                <input class="form-control" type="text" id="dish_name" placeholder="שם המנה">
                                <input class="form-control" type="text" id="dish_description" placeholder="תיאור המנה">
                                <input class="form-control" type="text" id="price" placeholder="מחיר">
                                <input class="form-control" type="text" id="price_for_members" placeholder="מחיר מועדון">
                                <input class="form-control" type="text" id="category" placeholder="קטגוריה">
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="image">
                                    <label class="custom-file-label text-left" for="customFile">בחר תמונה</label>
                                </div>
                                <input class="form-control" type="text" id="tags" placeholder="תיוגים">
                                <button type="submit" class="btn btn-primary float-right" onclick="submit_form()">הוסף מנה!</button>
                            </div>
                        </form>
                       
                    </div>
                </div>
            </div>
            `
        $(".main_div").append(str);
        $(".manager_edit_ability").hide(); // show only for managers...
        
    }

    

    function init_orders(){
        if (localStorage["orders"] != null) {
            orders = JSON.parse(localStorage["orders"]);
        }
        else // if not, create a new empty array
        orders = [];
    }

    // handling cart
    function init_cart() {
        // LOCAL STORAGE
            // if the localStorage exists, get it
            if (localStorage["cart"] != null) {
                cart = JSON.parse(localStorage["cart"]);
            }
            else // if not, create a new empty array
                cart = [];

            // display existing cart items from LS
        // FILLING UI CART
        // item ex: <a class="dropdown-item" href="#"><item goes here></a>
            $(".cart-num-of-items").append(cart.length)
            total_price=0;
            update_dropdown_cart();
            

        }

    function init_fav() {
        // LOCAL STORAGE
            // if the localStorage exists, get it
            if (localStorage["fav"] != null) {
                fav = JSON.parse(localStorage["fav"]);
            }
            else // if not, create a new empty array
                fav = [];

            // display existing fav items from LS
        // FILLING UI fav
        // item ex: <a class="dropdown-item" href="#"><item goes here></a>
            $(".fav-num-of-items").append(fav.length)
            update_dropdown_fav();
            

        }

    function update_dropdown_fav(){
        $(".fav-num-of-items").empty();
        $(".fav-num-of-items").append(fav.length);
        $(".fav-ui").empty();
        for (item in fav){
            
            item_price=String(fav[item]['price']);
            if (member){
                item_price=String(fav[item]['price_for_members']);
            }
            var dish_id=fav[item]['dish_id'];
            var str=`<a class="dropdown-item fav-dish-id-${dish_id}">
                        <div class="p-3 mb-2 bg-dark text-white">
                        ${fav[item]['dish_name']}
                        <i class="far fa-trash-alt" onclick='fav_prepend_button(${JSON.stringify(fav[item])});'></i>
                        </div>
                    </a>
            `
            $(".fav-ui").append(str);
        }
        load_dishes_bootstrap();
    }

    function update_dropdown_cart(){
        // cart number of items
        $(".cart-num-of-items").empty();
        $(".cart-num-of-items").append(cart.length);
        // empty cart
        $(".cart-ui").empty();
        total_price=0;
        item_price=0;
        
        // add dropdown items to cart
        for (item in cart){
            item_price=String(cart[item]['price']);
            if (member){
                item_price=String(cart[item]['price_for_members']);
            }
            var dish_id=cart[item]['dish_id'];
            var str=`<a class="dropdown-item dish-id-${dish_id}">
                        <div class="p-3 mb-2 bg-dark text-white">
                        ${cart[item]['dish_name']}
                        ${item_price}₪
                        <i class="far fa-trash-alt" onclick='cart_prepend_button(${JSON.stringify(cart[item])});'></i>
                        </div>
                    </a>
            `
            $(".cart-ui").append(str);
            var price= parseInt(item_price);
            total_price=total_price+price;
        }
        // add total price to cart
        

        if (total_price>0){
        str2=`   <div class="p-3 mb-2 bg-info text-white text-center total-price">
                        <span>total:${total_price}₪</span>
                        </div>
                        <div class="p-3 mb-2 bg-success text-white text-center font-weight-bold">
                            <button type="button" class="btn btn-success" id="checkout" data-toggle="modal" data-target="#checkoutModal">Check out</button>
                        </div>
                
                `
        $(".cart-ui").append(str2);}
    }

    function cart_append_button(dish_json){
        dish_json["comments"]=$("#order_comment").val();

        cart.push(dish_json);
        // add to 'cart' on LS
        localStorage["cart"] = JSON.stringify(cart);
        /// Cart dropdown handling
        update_dropdown_cart();

    }
    function fav_append_button(dish_json){
        for (item in fav){
            if (dish_json["dish_name"]==fav[item]["dish_name"]) return; // no need to duplicate favs
        }
        fav.push(dish_json);
        // add to 'fav' on LS
        localStorage["fav"] = JSON.stringify(fav);
        /// fav dropdown handling
        update_dropdown_fav();

    }

    function findAndRemove(array, property, value) {
            for (index in array){
                if (array[index][property]===value)
                {
                    array.splice(index,1);
                    return; // i wanna remove only one of these.
                }
            }

 
            
        }
    function cart_prepend_button(dish_json){
        // find and remove by dish id
        dish_id=dish_json['dish_id']
        findAndRemove(cart,'dish_id',dish_id)
        // update LS
        localStorage["cart"] = JSON.stringify(cart);
        // remove from cart dropdown
        cart_index=`.dish-id-${dish_id}`
        update_dropdown_cart();
        
    }
    function fav_prepend_button(dish_json){
        // find and remove by dish id
        dish_id=dish_json['dish_id']
        findAndRemove(fav,'dish_id',dish_id)
        // update LS
        localStorage["fav"] = JSON.stringify(fav);
        // remove from fav dropdown
        fav_index=`.dish-id-${dish_id}`
        update_dropdown_fav();
        
    }
    function remove_from_menu(dish_json){
        dish_id=dish_json["dish_id"];
        findAndRemove(dishesArr,'dish_id',dish_id);
        add_ability_to_remove_from_menu();
    };
    function isEmpty(str) {
        return !str.trim().length;
    }
    function add_order(customer_info,status='התקבל'){
        // copy cart containings to orders LS 
        new_order={
            "order_id":orders.length+1,
            "arr_of_dishes":cart,
            "customer_info":customer_info,
            "status":status
        }
        // insert order to LS
        orders.push(new_order);
        localStorage["orders"] = JSON.stringify(orders);
        // empty cart
        cart=[];
        localStorage["cart"] = JSON.stringify(cart);
        


        // update cart UI
        update_dropdown_cart();
        update_orders_cards();
        // alert a new order was made
        alert("Thank you! order made successfuly!")
        
    }
    function update_orders_cards(){
        $(".left_column").empty();
        for (order in orders){
            var order_status=orders[order]['status'];
            var order_json_str=JSON.stringify(orders[order]);
            // append all comments of orders
            orders_comments_str=``
            for (dish in orders[order]['arr_of_dishes']){
                var dish_name=orders[order]['arr_of_dishes'][dish]["dish_name"];
                var dish_comment=orders[order]['arr_of_dishes'][dish]["comments"];
                orders_comments_str+=`
                <p class="card-text">${dish_name}  :<b> ${dish_comment}</b> </p>
                `
                
            }
            

            str=`
                <div class="card text-white bg-info mb-3" >
                    <div class="card-header">Order #${orders[order]['order_id']}</div>
                    <div class="card-body">
                        <h4 class="card-title">${orders[order]['customer_info']['first_name']} ${orders[order]['customer_info']['last_name']}</h4>
                        <h5 class="card-title">${orders[order]['customer_info']['address']}</h5>
                        <p class="card-text">${orders[order]['customer_info']['payment_type']}</p>
                        <p class="card-text">מספר מנות: ${orders[order]['arr_of_dishes'].length}</p>
                        ---מנות---
                        ${orders_comments_str}
                        ---     ---
                        <p class="card-text">מצב: <b>${order_status}</b> </p>

                        <div id="dropdown" class="btn-group">
                            <button type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown">
                            שינוי סטטוס
                            <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu text-right" >
                                <li><a href="#" onclick='change_status_to(${order_json_str},"התקבל")'>התקבל</a></li>
                                <li><a href="#" onclick='change_status_to(${order_json_str},"על האש")'>על האש</a></li>
                                <li><a href="#" onclick='change_status_to(${order_json_str},"מוכן")'>מוכן</a></li>
                                <li><a href="#" onclick='change_status_to(${order_json_str},"מחק")'>מחק הזמנה</a></li>

                            </ul>
                        </div>

                </div>
            `
            $(".left_column").append(str);
            
            
        }
    }

    

    function change_status_to(order_json,new_status)
    {
        // var order=JSON.parse(order_json);
        console.log(order_json)
        var order_id=order_json["order_id"];
        findAndRemove(orders,'order_id',order_id);
        if (new_status!="מחק"){
            var new_order=
            {
                "order_id":order_id,
                "arr_of_dishes":order_json['arr_of_dishes'],
                "customer_info":order_json['customer_info'],
                "status":new_status
            }
            orders.push(new_order);
        }
        localStorage["orders"] = JSON.stringify(orders);
        update_orders_cards();

    }

    function go(){
        
        first_name=$("#firstName").val();
        last_name=$("#lastName").val();
        address=$("#address").val();
        payment_type=$("#inputGroupSelect").val();
        // make sure everything is filled
        if (isEmpty(first_name) || isEmpty(last_name) || isEmpty(address) || isEmpty(payment_type)){
            alert("please fill all fields.");
            return;
        }
        costumer_info={
            "first_name":first_name,
            "last_name":last_name,
            "address":address,
            'payment_type':payment_type
        }
        add_order(costumer_info);

    }

    function sign_in(){
        inputEmail=$("#inputEmail").val();
        inputPassword=$("#inputPassword").val();
        if (isEmpty(inputPassword) || isEmpty(inputEmail)){
            alert("please fill all fields.");
            return;
        }
        if (inputEmail=="member@member.com" && inputPassword=="password"){
            alert("login success")
            member=true;
            user_view();

        }
        else{
            alert("login failed. try again");
        }
    }

    function clear_ls(){
        member=false;
        localStorage.clear();
        cart=[];
        orders=[];
        fav=[];
        update_dropdown_fav();
        update_dropdown_cart();
        update_orders_cards();
        user_view();
    }
    
    ;